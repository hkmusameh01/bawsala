import { test } from "node:test";
import assert from "node:assert/strict";
import { floorLevel, preTrade, payoutCheck, parseDays } from "../lib/rules.ts";
import { CHALLENGES } from "../lib/data.ts";

const get = (firm: string, slug: string) => CHALLENGES.find((c) => c.firm === firm && c.slug === slug)!;
const zero = get("fundingpips", "zero-5k");
const apex = get("apex", "eod-50k");
const ftmo2 = get("ftmo", "2-step-50k");

test("حد التصفية المتحرك يثبت عند مستوى القفل", () => {
  assert.equal(floorLevel(zero, 5000), 4750);
  assert.equal(floorLevel(zero, 5180), 4930);
  assert.equal(floorLevel(zero, 5400), 5000);
  assert.equal(floorLevel(apex, 53000), 50100);
  assert.equal(floorLevel(ftmo2, 60000), 45000);
});

test("حجم الصفقة يلتزم بأضيق قاعدة", () => {
  const r = preTrade(zero, { equity: 5120, dayStart: 5160, peak: 5180, stop: 20, valuePerUnit: 10, step: 0.01, buffer: 0.2 });
  assert.equal(r.roomFloor, 190);
  assert.equal(r.roomDaily, 110);
  assert.equal(r.binding, "floating");
  assert.equal(r.maxSize, 0.25);
  assert.equal(r.safeSize, 0.2);
});

test("حساب مكسور يرجع صفر", () => {
  const r = preTrade(zero, { equity: 4700, dayStart: 4800, peak: 5000, stop: 10, valuePerUnit: 10, step: 0.01, buffer: 0 });
  assert.equal(r.breached, true);
  assert.equal(r.maxSize, 0);
});

test("فحص Consistency يحسب الربح الإضافي المطلوب", () => {
  const r = payoutCheck(zero, "funded", [30, 45, 20, 25]);
  const c = r.checks.find((x) => x.id === "consistency")!;
  assert.equal(c.ok, false);
  assert.match(c.detail, /\$300/);
  assert.match(c.detail, /\$180/);
  assert.equal(r.ready, false);
});

test("هدف المرحلة وأيام التداول", () => {
  const r = payoutCheck(ftmo2, 0, [1500, 1200, 1300, 1100]);
  assert.equal(r.checks.find((c) => c.id === "target")!.ok, true);
  assert.equal(r.checks.find((c) => c.id === "tradingDays")!.ok, true);
  assert.equal(r.ready, true);
});

test("قراءة الأرقام العربية والفواصل", () => {
  assert.deepEqual(parseDays("٣٠، 45\n-20, $25"), [30, 45, -20, 25]);
});
