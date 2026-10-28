import Link from "next/link";
import type { Challenge, Firm } from "@/lib/types";
import RuleLine from "./RuleLine";
import { challengePath, consLabel, curSym, marketLabel, per1k, priceText, stepsLabel, usd } from "@/lib/format";

export default function ChallengeCard({ c, firm, status, showFirm = true }: {
  c: Challenge; firm: Firm; status?: { level: string; text: string } | null; showFirm?: boolean;
}) {
  const k = per1k(c);
  const p = priceText(c);
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <h3>{showFirm ? firm.name : c.name}</h3>
          <div className="sub">{showFirm ? `${c.name} · ` : ""}<span className="num">{usd(c.size)}</span></div>
        </div>
        <div className="price">
          {p ? (
            <>
              <b className="num">{p}</b>
              {k != null && <small><span className="num">{curSym(c.currency)}{k.toFixed(2)}</span> لكل 1k</small>}
            </>
          ) : (<><b>—</b><small>تحقق من الموقع</small></>)}
        </div>
      </div>
      <div className="tags">
        <span className="tag">{marketLabel(c.market)}</span>
        <span className="tag">{stepsLabel(c.steps)}</span>
        <span className={`tag ${c.ddType !== "static" ? "trail" : ""}`}>{c.ddType === "static" ? "تصفية ثابتة" : "تصفية متحركة"}</span>
        {c.consistencyPct != null || c.consistencyNote ? <span className="tag cons">Consistency {consLabel(c)}</span> : null}
      </div>
      <RuleLine c={c} />
      <dl className="kv">
        <div><dt>حد يومي</dt><dd className="num">{c.dailyPct ? usd((c.size * c.dailyPct) / 100) : "—"}</dd></div>
        <div><dt>حد التصفية</dt><dd className="num">{usd((c.size * c.maxLossPct) / 100)}</dd></div>
        <div><dt>نسبتك</dt><dd>{c.splitPct}%</dd></div>
      </dl>
      {status && <div className={`status ${status.level}`}>{status.text}</div>}
      <div className="actions">
        <Link className="btn" href={challengePath(c)}>القواعد والحاسبة</Link>
        <a className="btn primary" href={firm.link} target="_blank" rel="noopener sponsored">زيارة الموقع</a>
      </div>
    </article>
  );
}
