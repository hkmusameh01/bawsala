"use client";
import { useEffect, useMemo, useState } from "react";
import type { Challenge, Firm } from "@/lib/types";
import ChallengeCard from "./ChallengeCard";
import { countryStatus } from "@/lib/country";
import { per1k } from "@/lib/format";

interface State { market: string; steps: string; dd: string; noCons: boolean; hideBlocked: boolean; cc: string; sort: string }
const INITIAL: State = { market: "all", steps: "all", dd: "all", noCons: false, hideBlocked: false, cc: "", sort: "per1k" };
const SEGS: Record<"market" | "steps" | "dd", [string, string][]> = {
  market: [["all", "الكل"], ["cfd", "فوركس/CFD"], ["futures", "عقود آجلة"]],
  steps: [["all", "الكل"], ["0", "فوري"], ["1", "مرحلة"], ["2", "مرحلتين"]],
  dd: [["all", "الكل"], ["static", "ثابت"], ["trail", "متحرك"]],
};
const SEG_LABEL = { market: "السوق", steps: "نوع الحساب", dd: "نوع حد التصفية" };

export default function CompareClient({ challenges, firms, countries }: { challenges: Challenge[]; firms: Firm[]; countries: [string, string][] }) {
  const [st, setSt] = useState<State>(INITIAL);
  useEffect(() => { try { const r = localStorage.getItem("bawsala:compare"); if (r) setSt({ ...INITIAL, ...JSON.parse(r) }); } catch {} }, []);
  const set = (p: Partial<State>) => setSt((prev) => { const n = { ...prev, ...p }; try { localStorage.setItem("bawsala:compare", JSON.stringify(n)); } catch {} return n; });
  const firm = (slug: string) => firms.find((f) => f.slug === slug)!;

  const list = useMemo(() => {
    const out = challenges.filter((c) => {
      if (st.market !== "all" && c.market !== st.market) return false;
      if (st.steps !== "all" && String(c.steps) !== st.steps) return false;
      if (st.dd !== "all" && (st.dd === "static") !== (c.ddType === "static")) return false;
      if (st.noCons && (c.consistencyPct != null || c.consistencyNote)) return false;
      if (st.hideBlocked && countryStatus(firm(c.firm), st.cc)?.level === "no") return false;
      return true;
    });
    const key: Record<string, (c: Challenge) => number> = {
      per1k: (c) => per1k(c) ?? 1e9, price: (c) => c.price ?? 1e9, maxloss: (c) => -c.maxLossPct, split: (c) => -c.splitPct,
    };
    return out.sort((a, b) => key[st.sort](a) - key[st.sort](b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenges, st]);

  return (
    <>
      <div className="country">
        <label htmlFor="cc">بلدي</label>
        <select id="cc" value={st.cc} onChange={(e) => set({ cc: e.target.value, hideBlocked: e.target.value ? st.hideBlocked : false })}>
          <option value="">— اختر —</option>
          {countries.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <small>بيانات قبول الدول جزئية؛ نعرض فقط ما هو منشور. تأكد دائماً مع دعم الشركة قبل الشراء.</small>
      </div>
      <div className="filters" role="group" aria-label="فلاتر">
        {(Object.keys(SEGS) as (keyof typeof SEGS)[]).map((f) => (
          <div className="fgroup" key={f}>
            <span>{SEG_LABEL[f]}</span>
            <div className="seg">
              {SEGS[f].map(([v, l]) => (
                <button key={v} type="button" aria-pressed={st[f] === v} onClick={() => set({ [f]: v } as Partial<State>)}>{l}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="fgroup">
          <span>خيارات</span>
          <label className="toggle"><input id="noCons" type="checkbox" checked={st.noCons} onChange={(e) => set({ noCons: e.target.checked })} /> بدون قاعدة Consistency</label>
          <label className="toggle"><input id="hideBlocked" type="checkbox" disabled={!st.cc} checked={st.hideBlocked} onChange={(e) => set({ hideBlocked: e.target.checked })} /> إخفاء الممنوعة في بلدي</label>
        </div>
      </div>
      <div className="resultbar">
        <span>{list.length} من {challenges.length} تحديات</span>
        <label>ترتيب حسب{" "}
          <select id="sort" value={st.sort} onChange={(e) => set({ sort: e.target.value })}>
            <option value="per1k">سعر كل 1,000$ تمويل</option>
            <option value="price">السعر</option>
            <option value="maxloss">أوسع حد تصفية</option>
            <option value="split">نسبة الربح</option>
          </select>
        </label>
      </div>
      <div className="grid">
        {list.map((c) => <ChallengeCard key={c.firm + c.slug} c={c} firm={firm(c.firm)} status={countryStatus(firm(c.firm), st.cc)} />)}
        {list.length === 0 && <div className="empty">ما في تحدي يطابق الفلاتر. جرّب تخفف واحد منها.</div>}
      </div>
    </>
  );
}
