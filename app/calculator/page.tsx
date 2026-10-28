import type { Metadata } from "next";
import CalculatorPicker from "@/components/CalculatorPicker";
import { CHALLENGES, FIRMS } from "@/lib/data";

export const metadata: Metadata = { title: "حاسبة القواعد", description: "احسب حجم الصفقة الآمن وجاهزية السحب لتحدي شركة التمويل اللي معك." };

export default function CalculatorPage() {
  return (
    <>
      <div className="wrap pagehead">
        <h1>حاسبة القواعد</h1>
        <p>اختار التحدي اللي معك، ودخّل رصيدك أو أرباح أيامك. الحاسبة بتحفظ أرقامك على جهازك فقط.</p>
      </div>
      <div className="wrap"><CalculatorPicker challenges={CHALLENGES} firms={FIRMS} /></div>
    </>
  );
}
