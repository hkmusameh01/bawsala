import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap pagehead">
      <h1>الصفحة مش موجودة</h1>
      <p>ممكن الرابط قديم أو فيه خطأ.</p>
      <Link className="btn primary" href="/" style={{ width: "fit-content" }}>رجوع للعروض</Link>
    </div>
  );
}
