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

      // On the website the wird card shows BOTH the Arabic original and the
      // English meaning together (the app shows one language; the website both).
      const maxW = S - 240;
      const wrap = (str, size, fam) => {
        ctx.font = `700 ${size}px ${fam}`;
        const words = str.split(" ");
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

      let arSize = 62;
      let arLines = wrap(item.ar, arSize, "Amiri, serif");
      while (arLines.length * arSize * 1.6 > 380 && arSize > 28) {
        arSize -= 4;
        arLines = wrap(item.ar, arSize, "Amiri, serif");
      }
      let enSize = 38;
      let enLines = wrap(item.en, enSize, "Inter, serif");
      while (enLines.length * enSize * 1.5 > 240 && enSize > 22) {
        enSize -= 3;
        enLines = wrap(item.en, enSize, "Inter, serif");
      }
      const arLH = arSize * 1.6, enLH = enSize * 1.5;
      const totalH = arLines.length * arLH + 60 + enLines.length * enLH;
      let y = 470 - totalH / 2 + arSize;

      ctx.direction = "rtl";
      ctx.font = `700 ${arSize}px Amiri, serif`;
      ctx.fillStyle = "#1B3B2B";
      for (const l of arLines) { ctx.fillText(l, S / 2, y); y += arLH; }

      y += 6;
      ctx.strokeStyle = "#D7E4DD";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(S / 2 - 80, y);
      ctx.lineTo(S / 2 + 80, y);
      ctx.stroke();
      y += 46;

      ctx.direction = "ltr";
      ctx.font = `500 ${enSize}px Inter, serif`;
      ctx.fillStyle = "#44603F";
      for (const l of enLines) { ctx.fillText(l, S / 2, y); y += enLH; }

      ctx.direction = "rtl";
      ctx.fillStyle = "#4F7263";
      ctx.font = "500 32px Tajawal, sans-serif";
      ctx.fillText(item.source.ar || item.source[lang] || "", S / 2, y + 16);

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

      // Robust download across browsers (blob URL + in-DOM anchor; iOS fallback).
      const triggerDownload = (url, revoke) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "muslim-ummah-wird.png";
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
          // iOS ignores the download attribute → open the image so it can be saved by long-press.
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
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors disabled:opacity-60">
      <ImageDown size={15} /> {t.downloadImage}
    </button>
  );
}
