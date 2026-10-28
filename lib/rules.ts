import type { Challenge } from "./types";

/* منطق حاسبة القواعد. دوال صافية بدون واجهة، ومختبرة في tests/rules.test.ts */

const round2 = (n: number) => Math.round(n * 100) / 100;

export const maxLossAmount = (ch: Challenge) => (ch.size * ch.maxLossPct) / 100;
export const dailyAmount = (ch: Challenge) => (ch.dailyPct == null ? null : (ch.size * ch.dailyPct) / 100);

/** مستوى التصفية الحالي. peak = أعلى equity (لحظي) أو أعلى رصيد نهاية يوم (EOD) */
export function floorLevel(ch: Challenge, peak: number): number {
  const max = maxLossAmount(ch);
  if (ch.ddType === "static") return ch.size - max;
  let floor = Math.max(peak, ch.size) - max;
  if (ch.trailLockAt != null) floor = Math.min(floor, ch.trailLockAt);
  return floor;
}

export interface PreTradeInput {
  equity: number;
  dayStart: number;
  peak: number;
  /** مسافة الستوب بوحدات الأداة (نقاط/بيبس) */
  stop: number;
  /** قيمة الوحدة الواحدة لكل لوت أو عقد بالدولار */
  valuePerUnit: number;
  /** أصغر حجم: 0.01 للوت أو 1 للعقد */
  step: number;
  /** هامش أمان بين 0 و 0.9 */
  buffer: number;
}

export type Binding = "floor" | "daily" | "floating";

export interface PreTradeResult {
  floor: number;
  roomFloor: number;
  dailyFloor: number | null;
  roomDaily: number | null;
  floatingCap: number | null;
  room: number;
  binding: Binding;
  riskPerUnit: number;
  maxSize: number;
  safeSize: number;
  breached: boolean;
}

const snap = (value: number, step: number) => {
  if (!(value > 0) || !(step > 0)) return 0;
  const n = Math.floor(value / step + 1e-9);
  return round2(n * step);
};

export function preTrade(ch: Challenge, i: PreTradeInput): PreTradeResult {
  const floor = floorLevel(ch, i.peak);
  const roomFloor = i.equity - floor;
  const daily = dailyAmount(ch);
  const dailyFloor = daily == null ? null : i.dayStart - daily;
  const roomDaily = dailyFloor == null ? null : i.equity - dailyFloor;
  const floatingCap = ch.floatingRiskPct == null ? null : (ch.size * ch.floatingRiskPct) / 100;

  const options: [Binding, number][] = [["floor", roomFloor]];
  if (roomDaily != null) options.push(["daily", roomDaily]);
  if (floatingCap != null) options.push(["floating", floatingCap]);
  options.sort((a, b) => a[1] - b[1]);
  const [binding, room] = options[0];

  const riskPerUnit = i.stop * i.valuePerUnit;
  const breached = roomFloor <= 0 || (roomDaily != null && roomDaily <= 0);
  const maxSize = breached || riskPerUnit <= 0 ? 0 : snap(room / riskPerUnit, i.step);
  const safeSize = snap(maxSize * (1 - Math.min(Math.max(i.buffer, 0), 0.9)), i.step);

  return {
    floor: round2(floor), roomFloor: round2(roomFloor),
    dailyFloor: dailyFloor == null ? null : round2(dailyFloor),
    roomDaily: roomDaily == null ? null : round2(roomDaily),
    floatingCap, room: round2(room), binding, riskPerUnit: round2(riskPerUnit),
    maxSize, safeSize, breached,
  };
}

/** يقرأ أرباح الأيام من نص: سطر أو فاصلة أو فاصلة عربية بين كل رقم */
export function parseDays(text: string): number[] {
  return text
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .split(/[\n,،;\s]+/)
    .map((s) => s.replace(/[$‏‎]/g, "").trim())
    .filter((s) => s !== "" && s !== "+" && s !== "-")
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export interface Check {
  id: "target" | "consistency" | "profitDays" | "tradingDays" | "lossVsWin" | "positive";
  label: string;
  ok: boolean;
  detail: string;
}

export interface PayoutResult {
  total: number;
  best: number;
  worst: number;
  profitDays: number;
  tradingDays: number;
  checks: Check[];
  ready: boolean;
  payout: number | null;
}

const usd = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });

/** phase: رقم المرحلة (0 = الأولى) أو "funded" للحساب الممول */
export function payoutCheck(ch: Challenge, phase: number | "funded", days: number[]): PayoutResult {
  const total = round2(days.reduce((a, b) => a + b, 0));
  const best = days.length ? Math.max(0, ...days) : 0;
  const worst = days.length ? Math.min(0, ...days) : 0;
  const minProfit = ch.profitDays ? Math.max(ch.profitDays.minAmount, 0.01) : 0.01;
  const profitDays = days.filter((d) => d >= minProfit).length;
  const checks: Check[] = [];
  const isFunded = phase === "funded" || ch.targets.length === 0;
  const applies = (stage?: "eval" | "funded") => !stage || (stage === "funded" ? isFunded : !isFunded);

  if (phase !== "funded" && ch.targets[phase] != null) {
    const target = (ch.size * ch.targets[phase]) / 100;
    const left = target - total;
    checks.push({
      id: "target", label: `هدف المرحلة ${phase + 1} (${ch.targets[phase]}%)`, ok: left <= 0,
      detail: left <= 0 ? `حققت ${usd(total)} من ${usd(target)}` : `باقيلك ${usd(left)} من أصل ${usd(target)}`,
    });
  }

  if (isFunded) {
    checks.push({
      id: "positive", label: "في ربح تسحبه", ok: total > 0,
      detail: total > 0 ? `مجموع الربح ${usd(total)}` : "مجموع الأيام مش رابح",
    });
  }

  if (ch.consistencyPct != null && applies(ch.consistencyStage) && total > 0 && best > 0) {
    const cap = ch.consistencyPct / 100;
    const ratio = best / total;
    const needTotal = best / cap;
    const ok = ratio <= cap + 1e-9;
    checks.push({
      id: "consistency", label: `قاعدة Consistency (${ch.consistencyPct}%)`, ok,
      detail: ok
        ? `أكبر يوم ${usd(best)} = ${(ratio * 100).toFixed(1)}% من الربح`
        : `أكبر يوم ${usd(best)} = ${(ratio * 100).toFixed(1)}%. لازم يصير مجموع الربح ${usd(needTotal)}، يعني ${usd(needTotal - total)} إضافية بدون يوم أكبر من ${usd(best)}`,
    });
  }

  if (ch.profitDays && applies(ch.profitDays.stage)) {
    const need = ch.profitDays.count;
    checks.push({
      id: "profitDays", label: `الأيام الرابحة (${need})`, ok: profitDays >= need,
      detail: `${profitDays} من ${need}` + (ch.profitDays.minAmount > 0 ? `، كل يوم ربحه ${usd(ch.profitDays.minAmount)} أو أكثر` : ""),
    });
  }

  if (ch.minTradingDays && !isFunded) {
    checks.push({
      id: "tradingDays", label: `أيام التداول (${ch.minTradingDays})`, ok: days.length >= ch.minTradingDays,
      detail: `${days.length} من ${ch.minTradingDays}`,
    });
  }

  if (ch.lossNotAboveWin && days.length) {
    const ok = Math.abs(worst) <= best;
    checks.push({
      id: "lossVsWin", label: "أكبر خسارة ≤ أكبر ربح", ok,
      detail: `أكبر خسارة ${usd(Math.abs(worst))}، أكبر ربح ${usd(best)}`,
    });
  }

  const ready = days.length > 0 && checks.every((c) => c.ok);
  const payout = isFunded ? (ready ? round2((total * ch.splitPct) / 100) : null) : null;
  return { total, best, worst, profitDays, tradingDays: days.length, checks, ready, payout };
}

export interface Instrument {
  id: string;
  label: string;
  unit: string;
  valuePerUnit: number;
  sizeUnit: "lot" | "contract";
}

/** قيم تقريبية: قيمة النقطة على CFD تختلف حسب الوسيط، فراجعها بمنصتك */
export const INSTRUMENTS: Instrument[] = [
  { id: "eurusd", label: "EURUSD", unit: "pip", valuePerUnit: 10, sizeUnit: "lot" },
  { id: "xauusd", label: "XAUUSD (ذهب)", unit: "دولار حركة", valuePerUnit: 100, sizeUnit: "lot" },
  { id: "nas100", label: "NAS100 (CFD)", unit: "نقطة", valuePerUnit: 1, sizeUnit: "lot" },
  { id: "us30", label: "US30 (CFD)", unit: "نقطة", valuePerUnit: 1, sizeUnit: "lot" },
  { id: "nq", label: "NQ ناسداك", unit: "نقطة", valuePerUnit: 20, sizeUnit: "contract" },
  { id: "mnq", label: "MNQ ناسداك مايكرو", unit: "نقطة", valuePerUnit: 2, sizeUnit: "contract" },
  { id: "es", label: "ES", unit: "نقطة", valuePerUnit: 50, sizeUnit: "contract" },
  { id: "mes", label: "MES مايكرو", unit: "نقطة", valuePerUnit: 5, sizeUnit: "contract" },
  { id: "gc", label: "GC ذهب", unit: "دولار حركة", valuePerUnit: 100, sizeUnit: "contract" },
  { id: "mgc", label: "MGC ذهب مايكرو", unit: "دولار حركة", valuePerUnit: 10, sizeUnit: "contract" },
];
