"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Firm, Offer } from "@/lib/types";
import CopyButton from "./CopyButton";

const SOON_MS = 72 * 3600 * 1000;
const dateFmt = new Intl.DateTimeFormat("ar-u-nu-latn", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hebron" });
type Filter = "all" | "exclusive" | "soon";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

function Countdown({ offer, now }: { offer: Offer; now: number | null }) {
  if (!offer.endsAt) {
    return <div className="cd-open">بدون موعد انتهاء معلن · آخر تحقق: {offer.checked}</div>;
  }
  const end = Date.parse(offer.endsAt);
  const start = offer.startsAt ? Date.parse(offer.startsAt) : end - 7 * 86400000;
  const left = now == null ? null : end - now;
  const p = left == null ? null : parts(left);
  const share = left == null ? 1 : Math.min(1, Math.max(0, left / (end - start)));
  const cells: [string, number | undefined][] = [["يوم", p?.d], ["ساعة", p?.h], ["دقيقة", p?.m], ["ثانية", p?.s]];
  return (
    <div className="countdown" aria-live="off">
      <div className="cd-label">
        <span>ينتهي بعد</span>
        <span>{dateFmt.format(end)}{offer.endsAtEstimated ? " (تقديري)" : ""}</span>
      </div>
      <div className="cd-cells">
        {cells.map(([l, v]) => (
          <div className="cd-cell" key={l}><b>{v == null ? "--" : pad(v)}</b><span>{l}</span></div>
        ))}
      </div>
      <div className="timebar" aria-hidden="true"><i style={{ width: `${share * 100}%` }} /></div>
    </div>
  );
}

function OfferCard({ offer, firm, now }: { offer: Offer; firm: Firm; now: number | null }) {
  const end = offer.endsAt ? Date.parse(offer.endsAt) : null;
  const soon = end != null && now != null && end - now < SOON_MS && end > now;
  return (
    <article className={`offer${soon ? " soon" : ""}`}>
      <div className="offer-top">
        <div className="stack" style={{ gap: 4 }}>
          <h3><Link href={`/firms/${firm.slug}/`}>{firm.name}</Link></h3>
          <div className="sub">{offer.title}</div>
          <div className="tags">
            {offer.exclusive && <span className="tag excl">حصري</span>}
            {soon && <span className="tag cons">ينتهي قريباً</span>}
          </div>
        </div>
        <div className="drop">
          <span className="pct">{offer.discountPct}%</span>
          <small>{offer.upTo ? "خصم حتى" : "خصم"}</small>
        </div>
      </div>
      <p className="applies">{offer.appliesTo}</p>
      <div className="codebox">
        {offer.code ? (<><span className="val">{offer.code}</span><CopyButton text={offer.code} /></>) : <span className="none">بدون كود، الخصم يُطبَّق تلقائياً</span>}
      </div>
      <Countdown offer={offer} now={now} />
      <div className="actions">
        <a className="btn primary" href={firm.link} target="_blank" rel="noopener sponsored">استخدم العرض</a>
        <Link className="btn" href={`/firms/${firm.slug}/`}>التحديات</Link>
      </div>
      <div className="src">المصدر: <a href={offer.source.url} target="_blank" rel="noopener">{offer.source.name}</a> · آخر تحقق: {offer.checked}</div>
    </article>
  );
}

export default function OfferBoard({ offers, firms }: { offers: Offer[]; firms: Firm[] }) {
  const [now, setNow] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const firmOf = (slug: string) => firms.find((f) => f.slug === slug)!;

  const { active, expired } = useMemo(() => {
    const isExpired = (o: Offer) => now != null && o.endsAt != null && Date.parse(o.endsAt) <= now;
    const sorted = [...offers].sort((a, b) => {
      if (a.exclusive !== b.exclusive) return a.exclusive ? -1 : 1;
      const ea = a.endsAt ? Date.parse(a.endsAt) : Infinity;
      const eb = b.endsAt ? Date.parse(b.endsAt) : Infinity;
      if (ea !== eb) return ea - eb;
      return b.discountPct - a.discountPct;
    });
    return { active: sorted.filter((o) => !isExpired(o)), expired: sorted.filter(isExpired) };
  }, [offers, now]);

  const shown = active.filter((o) => {
    if (filter === "exclusive") return o.exclusive;
    if (filter === "soon") return o.endsAt != null && now != null && Date.parse(o.endsAt) - now < SOON_MS;
    return true;
  });
  const FILTERS: [Filter, string][] = [["all", "كل العروض"], ["exclusive", "حصري"], ["soon", "ينتهي خلال 72 ساعة"]];

  return (
    <>
      <div className="offerbar">
        <div className="seg" role="group" aria-label="تصفية العروض">
          {FILTERS.map(([v, l]) => (
            <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
        <span className="muted" style={{ fontSize: 14 }}>{shown.length} عروض فعالة</span>
      </div>
      <div className="offers">
        {shown.map((o) => <OfferCard key={o.id} offer={o} firm={firmOf(o.firm)} now={now} />)}
        {shown.length === 0 && (
          <div className="empty">
            {filter === "exclusive"
              ? "ما في عروض حصرية حالياً. أول ما نتفق مع شركة على خصم خاص بيظهر هون."
              : "ما في عروض بهالتصنيف حالياً."}
          </div>
        )}
      </div>
      {expired.length > 0 && (
        <details style={{ marginTop: 18 }}>
          <summary className="muted" style={{ cursor: "pointer" }}>عروض انتهت مؤخراً ({expired.length})</summary>
          <ul className="bullets" style={{ marginTop: 8 }}>
            {expired.map((o) => <li key={o.id}>{firmOf(o.firm).name}: {o.title} ({o.discountPct}%)</li>)}
          </ul>
        </details>
      )}
    </>
  );
}
