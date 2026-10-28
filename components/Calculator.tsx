"use client";
import { useEffect, useMemo, useState } from "react";
import type { Challenge } from "@/lib/types";
import { INSTRUMENTS, dailyAmount, maxLossAmount, parseDays, payoutCheck, preTrade, type Binding } from "@/lib/rules";
import { usd } from "@/lib/format";

type Tab = "pre" | "payout";
type Phase = number | "funded";

interface Saved {
  equity: string; dayStart: string; peak: string; inst: string; custom: string; stop: string; buffer: number;
  phase: Phase; days: string;
}

const BINDING_TEXT: Record<Binding, string> = {
  floor: "حد التصفية الكلي",
  daily: "الحد اليومي",
  floating: "حد الخسارة المفتوحة",
};

function sampleDays(size: number) {
  return [0.006, 0.009, -0.004, 0.005].map((r) => Math.round(size * r)).join("\n");
}

const num = (s: string) => {
  const n = Number(String(s).replace(/[,\s$]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function Meter({ label, value, of, color, sub }: { label: string; value: number; of: number; color: string; sub: string }) {
  const pct = of > 0 ? Math.min(1, Math.max(0, value / of)) : 0;
  return (
    <div className="meter">
      <div className="meter-top"><span>{label}</span><span className="num">{usd(value)}</span></div>
      <div className="meter-bar" aria-hidden="true"><i style={{ width: `${pct * 100}%`, background: color }} /></div>
      <span className="note">{sub}</span>
    </div>
  );
}

export default function Calculator({ c }: { c: Challenge }) {
  const key = `bawsala:calc:${c.firm}/${c.slug}`;
  const defaults: Saved = {
    equity: String(c.size), dayStart: String(c.size), peak: String(c.size),
    inst: c.market === "futures" ? "mnq" : "eurusd", custom: "10", stop: c.market === "futures" ? "20" : "15", buffer: 0.2,
    phase: c.targets.length ? 0 : "funded", days: sampleDays(c.size),
  };
  const [tab, setTab] = useState<Tab>("pre");
  const [s, setS] = useState<Saved>(defaults);
  const [usingSample, setUsingSample] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) { setS({ ...defaults, ...JSON.parse(raw) }); setUsingSample(false); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = (patch: Partial<Saved>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
    if ("days" in patch) setUsingSample(false);
  };

  const instruments = INSTRUMENTS.filter((i) => (c.market === "futures" ? i.sizeUnit === "contract" : i.sizeUnit === "lot"));
  const inst = instruments.find((i) => i.id === s.inst) ?? null;
  const sizeUnit = c.market === "futures" ? "عقد" : "لوت";
  const valuePerUnit = inst ? inst.valuePerUnit : num(s.custom);
  const trailing = c.ddType !== "static";

  const pre = useMemo(() => preTrade(c, {
    equity: num(s.equity), dayStart: num(s.dayStart), peak: trailing ? num(s.peak) : c.size,
    stop: num(s.stop), valuePerUnit, step: c.market === "futures" ? 1 : 0.01, buffer: s.buffer,
  }), [c, s, valuePerUnit, trailing]);

  const days = useMemo(() => parseDays(s.days), [s.days]);
  const pay = useMemo(() => payoutCheck(c, s.phase, days), [c, s.phase, days]);
  const maxAmt = maxLossAmount(c);
  const dayAmt = dailyAmount(c);
  const sizeFmt = (n: number) => (c.market === "futures" ? String(n) : n.toFixed(2));

  return (
    <div className="calc">
      <div className="tabs" role="tablist" aria-label="نوع الحاسبة">
        <button type="button" role="tab" aria-selected={tab === "pre"} onClick={() => setTab("pre")}>قبل الصفقة</button>
        <button type="button" role="tab" aria-selected={tab === "payout"} onClick={() => setTab("payout")}>جاهزية السحب</button>
      </div>

      {tab === "pre" ? (
        <>
          <div className="fields">
            <div className="field">
              <label htmlFor="eq">الـ equity الحالية ($)</label>
              <input id="eq" inputMode="decimal" value={s.equity} onChange={(e) => update({ equity: e.target.value })} />
            </div>
            {dayAmt != null && (
              <div className="field">
                <label htmlFor="ds">رصيد بداية اليوم ($)</label>
                <input id="ds" inputMode="decimal" value={s.dayStart} onChange={(e) => update({ dayStart: e.target.value })} />
              </div>
            )}
            {trailing && (
              <div className="field">
                <label htmlFor="pk">{c.ddType === "trail_eod" ? "أعلى رصيد بنهاية يوم ($)" : "أعلى equity وصلتها ($)"}</label>
                <input id="pk" inputMode="decimal" value={s.peak} onChange={(e) => update({ peak: e.target.value })} />
              </div>
            )}
            <div className="field">
              <label htmlFor="in">الأداة</label>
              <select id="in" value={s.inst} onChange={(e) => update({ inst: e.target.value })}>
                {instruments.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
                <option value="custom">قيمة مخصصة</option>
              </select>
              <small>{inst ? `${inst.unit} = $${inst.valuePerUnit} لكل ${sizeUnit}` : "اكتب قيمة الوحدة لكل " + sizeUnit}</small>
            </div>
            {!inst && (
              <div className="field">
                <label htmlFor="cv">قيمة الوحدة لكل {sizeUnit} ($)</label>
                <input id="cv" inputMode="decimal" value={s.custom} onChange={(e) => update({ custom: e.target.value })} />
              </div>
            )}
            <div className="field">
              <label htmlFor="st">مسافة الستوب ({inst ? inst.unit : "وحدة"})</label>
              <input id="st" inputMode="decimal" value={s.stop} onChange={(e) => update({ stop: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="bf">هامش أمان: {Math.round(s.buffer * 100)}%</label>
              <input id="bf" type="range" min={0} max={0.5} step={0.05} value={s.buffer} onChange={(e) => update({ buffer: Number(e.target.value) })} style={{ direction: "ltr" }} />
            </div>
          </div>

          <div className="result">
            {pre.breached ? (
              <div className="verdict bad">الأرقام اللي دخلتها معناها إن الحساب كاسر قاعدة. راجع الأرقام أو حالة الحساب.</div>
            ) : (
              <div className="bigres">
                <div className="hl"><span>الحجم المقترح</span><b>{sizeFmt(pre.safeSize)}</b> <span style={{ display: "inline" }}>{sizeUnit}</span></div>
                <div><span>أقصى حجم مسموح</span><b>{sizeFmt(pre.maxSize)}</b> <span style={{ display: "inline" }}>{sizeUnit}</span></div>
                <div><span>خسارتك لو ضرب الستوب</span><b>{usd(pre.safeSize * pre.riskPerUnit)}</b></div>
              </div>
            )}
            <p className="note">
              القاعدة اللي بتحدد حجمك: <span className="binding">{BINDING_TEXT[pre.binding]}</span> ({usd(pre.room)} متاحة).
              {inst && c.market === "cfd" && inst.id !== "eurusd" ? " قيمة النقطة على CFD تختلف حسب الوسيط، فتأكد منها بمنصتك." : ""}
            </p>
            <div className="meters">
              <Meter label="المسافة عن التصفية" value={Math.max(0, pre.roomFloor)} of={maxAmt} color="var(--loss)"
                sub={`التصفية عند ${usd(pre.floor)}${trailing ? (c.trailLockAt != null && pre.floor >= c.trailLockAt ? " (ثابت الآن)" : " (متحرك)") : ""}`} />
              {pre.roomDaily != null && dayAmt != null && (
                <Meter label="المتبقي من الحد اليومي" value={Math.max(0, pre.roomDaily)} of={dayAmt} color="var(--warn)"
                  sub={`حد اليوم عند ${usd(pre.dailyFloor ?? 0)}`} />
              )}
              {pre.floatingCap != null && (
                <Meter label="حد الخسارة المفتوحة" value={pre.floatingCap} of={pre.floatingCap} color="var(--accent)"
                  sub={`كل صفقاتك المفتوحة مع بعض ما تخسر أكثر من ${usd(pre.floatingCap)}`} />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="fields">
            {c.targets.length > 0 && (
              <div className="field">
                <label htmlFor="ph">وين حسابك؟</label>
                <select id="ph" value={String(s.phase)} onChange={(e) => update({ phase: e.target.value === "funded" ? "funded" : Number(e.target.value) })}>
                  {c.targets.map((t, i) => <option key={i} value={i}>المرحلة {i + 1} (هدف {t}%)</option>)}
                  <option value="funded">الحساب الممول</option>
                </select>
              </div>
            )}
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="dy">ربح أو خسارة كل يوم ($)، كل يوم بسطر</label>
              <textarea id="dy" value={s.days} onChange={(e) => update({ days: e.target.value })} />
              <small>{usingSample ? "أرقام مثال، بدّلها بأرقامك. " : ""}من بداية الدورة الحالية أو من آخر سحب.</small>
            </div>
          </div>

          <div className="result">
            <div className="bigres">
              <div><span>مجموع الربح</span><b>{usd(pay.total)}</b></div>
              <div><span>أكبر يوم</span><b>{usd(pay.best)}</b></div>
              <div><span>أيام التداول</span><b>{pay.tradingDays}</b></div>
            </div>
            <ul className="checks">
              {pay.checks.map((ch) => (
                <li key={ch.id} className={ch.ok ? "ok" : "bad"}>
                  <span className="mark" aria-label={ch.ok ? "متحقق" : "غير متحقق"}>{ch.ok ? "✓" : "✕"}</span>
                  <div><strong>{ch.label}</strong><span>{ch.detail}</span></div>
                </li>
              ))}
            </ul>
            {days.length === 0 ? (
              <div className="verdict bad">اكتب أرقام أيامك عشان نفحصها.</div>
            ) : pay.ready ? (
              <div className="verdict ok">
                {pay.payout != null ? `جاهز للسحب. حصتك تقريباً ${usd(pay.payout)} (${c.splitPct}%).` : "حققت شروط هذه المرحلة."}
              </div>
            ) : (
              <div className="verdict bad">لسا مش جاهز. الشروط الحمراء فوق بتحكيلك شو ناقص بالضبط.</div>
            )}
            {c.consistencyNote && <p className="note">{c.consistencyNote}</p>}
            {c.profitDays && <p className="note">{c.profitDays.note}</p>}
          </div>
        </>
      )}
      <p className="note">الحاسبة تقريبية ومبنية على القواعد المنشورة بتاريخ {c.checked}. لوحة حسابك عند الشركة هي المرجع النهائي.</p>
    </div>
  );
}

