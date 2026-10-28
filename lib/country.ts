import type { Firm } from "./types";
import { RISE_UNSUPPORTED } from "./data";

export type Level = "no" | "warn" | "unknown";

export function countryStatus(f: Firm, cc: string): { level: Level; text: string } | null {
  if (!cc) return null;
  if (f.restricted.includes(cc)) return { level: "no", text: "بلدك على قائمة المنع المنشورة للشركة" };
  if (f.rails.includes("rise") && RISE_UNSUPPORTED.includes(cc))
    return { level: "warn", text: "السحب عبر Rise غير مدعوم في بلدك؛ اسأل عن طريقة بديلة" };
  if (cc === "PS") return { level: "unknown", text: "بعض الشركات تمنع سكان فلسطين؛ اسأل الدعم قبل الشراء" };
  return { level: "unknown", text: "بلدك غير موجود على قائمة المنع اللي عندنا؛ تأكد عند التسجيل" };
}
