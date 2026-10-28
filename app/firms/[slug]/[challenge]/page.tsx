import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import RuleLine from "@/components/RuleLine";
import { CHALLENGES, firmBySlug } from "@/lib/data";
import { consLabel, ddLabel, marketLabel, priceText, stepsLabel, usd } from "@/lib/format";

export const dynamicParams = false;
export function generateStaticParams() {
  return CHALLENGES.map((c) => ({ slug: c.firm, challenge: c.slug }));
}

type Props = { params: Promise<{ slug: string; challenge: string }> };
const find = async (p: Props["params"]) => {
  const { slug, challenge } = await p;
  return CHALLENGES.find((c) => c.firm === slug && c.slug === challenge);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await find(params);
  const f = c && firmBySlug(c.firm);
  return c && f ? { title: `${f.name} ${c.name}: القواعد والحاسبة`, description: `قواعد ${f.name} ${c.name} بالدولار: الحد اليومي، حد التصفية، الهدف والسحب، مع حاسبة لحجم الصفقة وجاهزية السحب.` } : {};
}

export default async function ChallengePage({ params }: Props) {
  const c = await find(params);
  if (!c) notFound();
  const f = firmBySlug(c.firm)!;
  const amt = (pct: number | null) => (pct ? <><span className="num">{usd((c.size * pct) / 100)}</span> ({pct}%)</> : "لا يوجد");
  const p = priceText(c);
  return (
    <>
      <div className="wrap pagehead">
        <nav className="crumbs" aria-label="المسار">
          <Link href="/firms/">الشركات</Link><span>/</span><Link href={`/firms/${f.slug}/`}>{f.name}</Link><span>/</span><span>{c.name}</span>
        </nav>
        <h1>{f.name} · {c.name}</h1>
        <p>حساب <span className="num">{usd(c.size)}</span> · {stepsLabel(c.steps)} · {marketLabel(c.market)} · {c.platform}</p>
      </div>

      <div className="wrap two">
        <div className="panel">
          <RuleLine c={c} />
          <ul className="rules">
            <li><span>السعر</span><span>{p ? <span className="num">{p}</span> : "تحقق من الموقع"} · {c.priceNote}</span></li>
            <li><span>الهدف</span><span>{c.targets.length ? c.targets.map((t) => `${t}% (${usd((c.size * t) / 100)})`).join(" ثم ") : "لا يوجد، تبدأ ممول مباشرة"}</span></li>
            <li><span>الحد اليومي</span><span>{amt(c.dailyPct)}{c.dailyNote ? <div className="note">{c.dailyNote}</div> : null}</span></li>
            <li><span>حد التصفية</span><span>{amt(c.maxLossPct)} · {ddLabel(c.ddType)}<div className="note">{c.ddNote}</div></span></li>
            <li><span>Consistency</span><span>{consLabel(c)}{c.consistencyNote ? <div className="note">{c.consistencyNote}</div> : null}</span></li>
            {c.profitDays && <li><span>الأيام الرابحة</span><span>{c.profitDays.note}</span></li>}
            {c.minTradingDays && <li><span>أقل أيام تداول</span><span>{c.minTradingDays} أيام بكل مرحلة</span></li>}
            <li><span>نسبتك من الربح</span><span>{c.splitText}</span></li>
            <li><span>السحب</span><span>{f.payout}</span></li>
          </ul>
        </div>
        <div className="panel">
          <h2 style={{ fontSize: 18 }}>قواعد ما بتظهر بصفحة الشراء</h2>
          <ul className="bullets">{c.hidden.map((h) => <li key={h}>{h}</li>)}</ul>
          <h2 style={{ fontSize: 18 }}>المصادر</h2>
          <div className="srcs">{c.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener">{s.name}</a>)}</div>
          <p className="note">آخر مراجعة: {c.checked}. القواعد تتغير، راجع صفحة الشركة قبل الشراء.</p>
          <a className="btn primary" href={f.link} target="_blank" rel="noopener sponsored">زيارة موقع {f.name}</a>
        </div>
      </div>

      <section className="block" style={{ marginTop: 28 }}>
        <div className="wrap">
          <h2>حاسبة القواعد</h2>
          <p className="lead">قبل الصفقة: كم لوت أو عقد بتقدر تدخل بدون ما تكسر قاعدة. جاهزية السحب: هل بتقدر تسحب، وإذا لا شو ناقصك.</p>
          <div className="panel"><Calculator c={c} /></div>
        </div>
      </section>
    </>
  );
}
