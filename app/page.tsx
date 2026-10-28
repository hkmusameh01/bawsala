import Link from "next/link";
import OfferBoard from "@/components/OfferBoard";
import { FIRMS, OFFERS, challengesOf } from "@/lib/data";

export default function Home() {
  const firmName = (slug: string) => FIRMS.find((f) => f.slug === slug)!.name;
  const tick = OFFERS.map((o) => (
    <span key={o.id}>{firmName(o.firm)} <b>▼{o.discountPct}%</b> {o.code ? `· ${o.code}` : ""}</span>
  ));
  return (
    <>
      <div className="wrap hero">
        <h1>خصومات شركات التمويل، قبل ما تنتهي</h1>
        <p>كل عرض بنسبته الحقيقية، وكوده، والوقت المتبقي عليه. اضغط على الشركة عشان تشوف قواعد تحدياتها بالأرقام قبل ما تشتري.</p>
      </div>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">{tick}{tick}</div>
      </div>
      <div className="wrap">
        <OfferBoard offers={OFFERS} firms={FIRMS} />
      </div>
      <section className="block" style={{ marginTop: 32 }}>
        <div className="wrap">
          <h2>تصفّح حسب الشركة</h2>
          <p className="lead">كل شركة إلها صفحة فيها تحدياتها وقواعدها وحاسبة لكل تحدي.</p>
          <div className="firmtiles">
            {FIRMS.map((f) => (
              <Link key={f.slug} href={`/firms/${f.slug}/`} className="firmtile">
                <strong>{f.name}</strong>
                <span>{f.tagline}</span>
                <span>{challengesOf(f.slug).length} تحديات</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="block">
        <div className="wrap">
          <h2>كم لوت بقدر أدخل؟ وهل بقدر أسحب؟</h2>
          <p className="lead">حاسبة القواعد بتاخذ رصيدك وأرباح أيامك، وبتحكيلك الحجم الآمن للصفقة وشو ناقصك قبل طلب السحب.</p>
          <Link className="btn primary" href="/calculator/">افتح الحاسبة</Link>
        </div>
      </section>
    </>
  );
}
