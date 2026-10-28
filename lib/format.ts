import type { Challenge, DDType } from "./types";

export const fmt = (n: number, digits = 2) => n.toLocaleString("en-US", { maximumFractionDigits: digits });
export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const curSym = (c: Challenge["currency"]) => (c === "EUR" ? "€" : "$");
export const priceText = (c: Challenge) =>
  c.price == null ? null : `${curSym(c.currency)}${fmt(c.price)}${c.monthly ? "/شهر" : ""}`;
export const per1k = (c: Challenge) => (c.price == null ? null : c.price / (c.size / 1000));
export const stepsLabel = (s: Challenge["steps"]) => (s === 0 ? "حساب فوري" : s === 1 ? "مرحلة واحدة" : "مرحلتين");
export const ddLabel = (d: DDType) =>
  d === "static" ? "تصفية ثابتة" : d === "trail_eod" ? "تصفية متحركة (نهاية اليوم)" : "تصفية متحركة (لحظية)";
export const marketLabel = (m: Challenge["market"]) => (m === "futures" ? "عقود آجلة" : "فوركس/CFD");
export const consLabel = (c: Challenge) =>
  c.consistencyPct != null ? `${c.consistencyPct}%` : c.consistencyNote ? "Best Day" : "لا يوجد";
export const challengePath = (c: Challenge) => `/firms/${c.firm}/${c.slug}/`;
