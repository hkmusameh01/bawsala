"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("نسخ");
  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.parentElement?.querySelector(".val");
    try {
      await navigator.clipboard.writeText(text);
      setLabel("تم النسخ");
    } catch {
      if (box) {
        const r = document.createRange();
        r.selectNodeContents(box);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
      }
      setLabel("انسخه يدوياً");
    }
    setTimeout(() => setLabel("نسخ"), 1800);
  };
  return <button type="button" className="btn" onClick={onClick}>{label}</button>;
}
