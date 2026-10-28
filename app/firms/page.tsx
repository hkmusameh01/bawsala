import type { Metadata } from "next";
import Link from "next/link";
import { FIRMS, challengesOf, offersOf } from "@/lib/data";
import { marketLabel } from "@/lib/format";

export const metadata: Metadata = { title: "الشركات", description: "كل شركات التمويل الموجودة على بوصلة التمويل، مع تحدياتها وعروضها." };

export default function Firms() {
  return (
    <>
      <div className="wrap pagehead">
        <h1>شركات التمويل</h1>
        <p>اختار شركة عشان تشوف تحدياتها، قواعد كل تحدي بالدولار، وطرق السحب.</p>
      </div>
      <div className="wrap firmtiles">
        {FIRMS.map((f) => (
          <Link key={f.slug} href={`/firms/${f.slug}/`} className="firmtile">
            <strong>{f.name}</strong>
            <span>{f.tagline}</span>
            <span>{f.markets.map(marketLabel).join(" · ")} · {challengesOf(f.slug).length} تحديات{offersOf(f.slug).length ? " · فيها عرض" : ""}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
