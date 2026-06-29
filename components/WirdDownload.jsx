"use client";

import { useState } from "react";
import { ImageDown } from "lucide-react";

// Draws the day's reminder onto a 1080×1080 canvas (Instagram square) with the
// site identity, then downloads it as a PNG. No server, no library.
export default function WirdDownload({ item, lang, t }) {
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
      const rtl = lang === "ar";

      ctx.fillStyle = "#FDFBF7";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "#D7E4DD";
      ctx.lineWidth = 4;
      ctx.strokeRect(48, 48, S - 96, S - 96);

      ctx.textAlign = "center";
      ctx.direction = rtl ? "rtl" : "ltr";

      ctx.fillStyle = "#4F7263";
      ctx.font = "500 34px Tajawal, sans-serif";
      ctx.fillText(`${t.wirdLabel} · ${t.wirdTypes[item.type]}`, S / 2, 195);

      const text = rtl ? item.ar : item.en;
      const fam = rtl ? "Amiri, serif" : "Inter, serif";
      const maxW = S - 220;
      const wrap = (size) => {
        ctx.font = `700 ${size}px ${fam}`;
        const words = text.split(" ");
        const lines = [];
        let line = "";
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > maxW && line) {
            lines.push(line);
            line = w;
          } else line = test;
        }
        if (line) lines.push(line);
        return lines;
      };

      let size = 64;
      let lines = wrap(size);
      while (lines.length * size * 1.55 > 520 && size > 30) {
        size -= 4;
        lines = wrap(size);
      }
      const lineH = size * 1.55;
      ctx.font = `700 ${size}px ${fam}`;
      ctx.fillStyle = "#1B3B2B";
      let y = 500 - ((lines.length - 1) * lineH) / 2;
      for (const l of lines) {
        ctx.fillText(l, S / 2, y);
        y += lineH;
      }

      ctx.fillStyle = "#4F7263";
      ctx.font = "500 36px Tajawal, sans-serif";
      ctx.fillText(item.source[lang], S / 2, y + 24);

      ctx.fillStyle = "#1B3B2B";
      ctx.font = "700 40px Tajawal, sans-serif";
      ctx.fillText(t.siteName, S / 2, 912);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "400 27px Tajawal, sans-serif";
      ctx.fillText(
        rtl ? "صدقة جارية عن علي عبد العزيز الصدّيقي رحمه الله" : "A sadaqah jariyah for Ali Abdulaziz Alseddiqi",
        S / 2,
        960
      );
      ctx.fillText("muslimummah.app", S / 2, 1002);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "muslim-ummah-wird.png";
      a.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={handle} disabled={busy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors disabled:opacity-60">
      <ImageDown size={15} /> {t.downloadImage}
    </button>
  );
}
