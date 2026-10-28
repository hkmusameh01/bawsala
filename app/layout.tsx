import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { LAST_UPDATED } from "@/lib/data";

export const metadata: Metadata = {
  title: { default: "بوصلة التمويل: عروض وقواعد شركات التمويل", template: "%s · بوصلة التمويل" },
  description: "عروض وخصومات شركات التداول الممول، وقواعد كل تحدي بالأرقام، وحاسبة تحكيلك شو مسموحلك قبل الصفقة وقبل السحب.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Readex+Pro:wght@500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
        />
      </head>
      <body>
        <header className="top">
          <div className="wrap">
            <Link className="brand" href="/" aria-label="بوصلة التمويل، الرئيسية">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
                <path d="M16 6 L20 16 L16 26 L12 16 Z" fill="var(--accent)" />
                <circle cx="16" cy="16" r="2.2" fill="var(--surface)" />
              </svg>
              بوصلة التمويل
            </Link>
            <nav className="nav" aria-label="أقسام الموقع">
              <Link href="/">العروض</Link>
              <Link href="/firms/">الشركات</Link>
              <Link href="/compare/">المقارنة</Link>
              <Link href="/calculator/">الحاسبة</Link>
              <Link href="/about/">عن الموقع</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="foot">
          <div className="wrap">
            <span>بوصلة التمويل · آخر تحديث للبيانات: {LAST_UPDATED}</span>
            <span>بعض الروابط روابط أفلييت. المحتوى تعليمي وليس نصيحة مالية.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
