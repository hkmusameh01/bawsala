import type { Metadata } from "next";
import CompareClient from "@/components/CompareClient";
import { CHALLENGES, COUNTRIES, FIRMS } from "@/lib/data";

export const metadata: Metadata = { title: "مقارنة التحديات", description: "قارن تحديات شركات التمويل بالسعر وحد التصفية والقواعد، مع فلتر حسب بلدك." };

export default function Compare() {
  return (
    <>
      <div className="wrap pagehead">
        <h1>قارن التحديات بالأرقام</h1>
        <p>اختار بلدك والفلاتر اللي بتهمك. الترتيب الافتراضي حسب سعر كل 1,000$ تمويل.</p>
      </div>
      <div className="wrap"><CompareClient challenges={CHALLENGES} firms={FIRMS} countries={COUNTRIES} /></div>
    </>
  );
}
