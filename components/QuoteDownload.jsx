"use client";

import { useState } from "react";
import { ImageDown } from "lucide-react";

// Draws the quote onto a 1080×1080 dark-green card (the app's logo background)
// and downloads it as a PNG. One language per page language.
export default function QuoteDownload({ q, lang, t }) {
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const S = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = S;
      canvas.height = S;
      const ctx = canvas.getContext("2d");
      const ar = lang === "ar";

      ctx.fillStyle = "#16302A";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "rgba(127,160,144,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(132, 132, S - 264, S - 264);

      ctx.textAlign = "center";
      ctx.direction = ar ? "rtl" : "ltr";

      ctx.fillStyle = "rgba(127,160,144,0.55)";
      ctx.font = "700 120px Georgia, serif";
      ctx.fillText("❝", S / 2, 270);

      const text = ar ? q.ar : q.en;
      const fam = ar ? "Amiri, serif" : "Inter, serif";
      const maxW = S - 300;
      const wrap = (size) => {
        ctx.font = `${ar ? 700 : 500} ${size}px ${fam}`;
        const words = text.split(" ");
        const lines = [];
        let line = "";
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
          else line = test;
        }
        if (line) lines.push(line);
        return lines;
      };
      let size = ar ? 84 : 58;
      let lines = wrap(size);
      while (lines.length * size * 1.6 > 470 && size > 26) { size -= 4; lines = wrap(size); }
      const lineH = size * 1.6;
      ctx.font = `${ar ? 700 : 500} ${size}px ${fam}`;
      ctx.fillStyle = "#F2ECDD";
      let y = 460 - ((lines.length - 1) * lineH) / 2;
      for (const l of lines) { ctx.fillText(l, S / 2, y); y += lineH; }

      const cited = q.source.cited === true;
      const author = ar ? q.source.authorAr : q.source.authorEn;
      const book = q.source[lang] || q.source.ar;
      y += 34;
      ctx.direction = ar ? "rtl" : "ltr";
      if (cited) {
        if (author) {
          ctx.fillStyle = "#C8A86B";
          ctx.font = "700 30px Tajawal, sans-serif";
          ctx.fillText(author, S / 2, y);
          y += 42;
        }
        ctx.fillStyle = "#7FA090";
        ctx.font = "500 24px Tajawal, sans-serif";
        ctx.fillText(ar ? `مقتبَس من كتاب «${book}»` : `Quoted from “${book}”`, S / 2, y);
      } else {
        if (book) {
          ctx.fillStyle = "#A8C3B4";
          ctx.font = "600 30px Tajawal, sans-serif";
          ctx.fillText(book, S / 2, y);
          y += 42;
        }
        if (author) {
          ctx.fillStyle = "#C8A86B";
          ctx.font = "700 27px Tajawal, sans-serif";
          ctx.fillText(author, S / 2, y);
        }
      }

      ctx.direction = ar ? "rtl" : "ltr";
      ctx.fillStyle = "#F2ECDD";
      ctx.font = "700 38px Tajawal, sans-serif";
      ctx.fillText(ar ? "أمة الإسلام" : "Muslim Ummah", S / 2, 838);
      ctx.fillStyle = "rgba(127,160,144,0.9)";
      ctx.font = "400 26px Tajawal, sans-serif";
      ctx.fillText("muslimummah.app", S / 2, 892);

      const triggerDownload = (url, revoke) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "muslim-ummah-quote.png";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (revoke) setTimeout(() => URL.revokeObjectURL(url), 5000);
      };
      const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) { triggerDownload(canvas.toDataURL("image/png"), false); return; }
          const url = URL.createObjectURL(blob);
          if (isIOS) { window.open(url, "_blank"); setTimeout(() => URL.revokeObjectURL(url), 10000); }
          else triggerDownload(url, true);
        }, "image/png");
      } else {
        triggerDownload(canvas.toDataURL("image/png"), false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={handle} disabled={busy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-sage-300 text-sage-300 hover:bg-white/10 transition-colors disabled:opacity-60">
      <ImageDown size={15} /> {t.downloadImage}
    </button>
  );
}
