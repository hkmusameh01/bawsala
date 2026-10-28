import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChallengeCard from "@/components/ChallengeCard";
import CopyButton from "@/components/CopyButton";
import { FIRMS, challengesOf, firmBySlug, offersOf } from "@/lib/data";
import { marketLabel } from "@/lib/format";

export const dynamicParams = false;
export function generateStaticParams() {
  return FIRMS.map((f) => ({ slug: f.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = firmBySlug((await params).slug);
  return f ? { title: `${f.name}: التحديات والقواعد والعروض`, description: `${f.tagline}. قواعد كل تحدي عند ${f.name} بالأرقام، وطرق السحب، والعروض الحالية.` } : {};
}

export default async function FirmPage({ params }: Props) {
  const f = firmBySlug((await params).slug);
  if (!f) notFound();
  const challenges = challengesOf(f.slug);
  const offers = offersOf(f.slug);
  return (
    <>
      <div className="wrap pagehead">
        <nav className="crumbs" aria-label="المسار"><Link href="/firms/">الشركات</Link><span>/</span><span>{f.name}</span></nav>
        <h1>{f.name}</h1>
        <p>{f.tagline}</p>
        <ul className="facts">
          {f.facts.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>

      {offers.length > 0 && (
        <div className="wrap" style={{ marginBottom: 20 }}>
          <div className="panel">
            <h2 style={{ fontSize: 18 }}>العروض الحالية</h2>
            {offers.map((o) => (
              <div key={o.id} className="stack" style={{ gap: 8 }}>
                <div><strong>{o.upTo ? "خصم حتى " : "خصم "}<span className="num">{o.discountPct}%</span>: {o.title}</strong></div>
                <span className="muted" style={{ fontSize: 14 }}>{o.appliesTo}</span>
                <div className="codebox">
                  {o.code ? (<><span className="val">{o.code}</span><CopyButton text={o.code} /></>) : <span className="none">بدون كود، الخصم يُطبَّق تلقائياً</span>}
                </div>
              </div>
            ))}
            <Link href="/" className="note">العدّاد والتفاصيل في صفحة العروض</Link>
          </div>
        </div>
      )}

      <section className="block">
        <div className="wrap">
          <h2>التحديات</h2>
          <p className="lead">كل بطاقة فيها خط القواعد: الأحمر منطقة التصفية، والأخضر الطريق للهدف.</p>
          <div className="grid">
            {challenges.map((c) => <ChallengeCard key={c.slug} c={c} firm={f} showFirm={false} />)}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap two">
          <div className="panel">
            <h2 style={{ fontSize: 18 }}>معلومات عامة</h2>
            <ul className="rules">
              <li><span>الأسواق</span><span>{f.markets.map(marketLabel).join("، ")}</span></li>
              <li><span>المنصات</span><span>{f.platforms}</span></li>
              <li><span>السحب</span><span>{f.payout}</span></li>
              <li><span>الدول الممنوعة</span><span>{f.restrictedNote ?? "ما لقينا قائمة منشورة. اسأل الدعم قبل الشراء، خصوصاً من فلسطين وسوريا والعراق."}</span></li>
            </ul>
          </div>
          <div className="panel">
            <h2 style={{ fontSize: 18 }}>المصادر</h2>
            <div className="srcs">{f.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener">{s.name}</a>)}</div>
            <p className="note">القواعد تتغير كثيراً. راجع صفحة الشركة قبل ما تشتري.</p>
            <a className="btn primary" href={f.link} target="_blank" rel="noopener sponsored">زيارة موقع {f.name}</a>
          </div>
        </div>
      </section>
    </>
  );
}
