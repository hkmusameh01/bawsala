"use client";
import { useState } from "react";
import type { Challenge, Firm } from "@/lib/types";
import Calculator from "./Calculator";
import RuleLine from "./RuleLine";
import { usd } from "@/lib/format";

export default function CalculatorPicker({ challenges, firms }: { challenges: Challenge[]; firms: Firm[] }) {
  const [id, setId] = useState(`${challenges[0].firm}/${challenges[0].slug}`);
  const c = challenges.find((x) => `${x.firm}/${x.slug}` === id)!;
  const name = (slug: string) => firms.find((f) => f.slug === slug)!.name;
  return (
    <div className="panel">
      <div className="field">
        <label htmlFor="pick">اختار التحدي</label>
        <select id="pick" value={id} onChange={(e) => setId(e.target.value)}>
          {firms.map((f) => (
            <optgroup key={f.slug} label={f.name}>
              {challenges.filter((x) => x.firm === f.slug).map((x) => (
                <option key={x.slug} value={`${x.firm}/${x.slug}`}>{x.name} · {usd(x.size)}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <small>{name(c.firm)} · {c.ddNote}</small>
      </div>
      <RuleLine c={c} />
      <Calculator key={id} c={c} />
    </div>
  );
}
