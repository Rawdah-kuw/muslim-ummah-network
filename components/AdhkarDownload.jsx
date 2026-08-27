"use client";

import { useState } from "react";
import { ImageDown } from "lucide-react";

// Draws a single dhikr onto a 1080×1080 cream card and downloads it as a PNG.
// The English page shows the Arabic with its English translation beneath.
export default function AdhkarDownload({ d, lang, t }) {
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
      const showEn = !ar && !!d.en;

      ctx.fillStyle = "#FDFBF7";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "#D7E4DD";
      ctx.lineWidth = 4;
      ctx.strokeRect(132, 132, S - 264, S - 264);
      ctx.textAlign = "center";

      ctx.direction = ar ? "rtl" : "ltr";
      ctx.fillStyle = "#4F7263";
      ctx.font = "500 32px Tajawal, sans-serif";
      ctx.fillText(ar ? "من الأذكار 🌿" : "Daily Adhkar 🌿", S / 2, 200);

      const maxW = S - 300;
      const wrap = (str, size, fam, weight) => {
        ctx.font = `${weight} ${size}px ${fam}`;
        const words = String(str || "").split(" ");
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

      const prefix = ar ? (d.prefix || "") : (d.prefixEn || d.prefix || "");
      const enText = showEn ? d.en : "";
      let arSize = 52, enSize = 34, preSize = 30;
      let preLines = [], arLines = [], enLines = [];
      const measure = () => {
        preLines = prefix ? wrap(prefix, preSize, "Amiri, serif", 600) : [];
        arLines = wrap(d.ar, arSize, "Amiri, serif", 700);
        enLines = showEn ? wrap(enText, enSize, "Inter, serif", 500) : [];
        return preLines.length * preSize * 1.6 + (prefix ? 14 : 0) +
          arLines.length * arSize * 1.7 +
          (showEn ? 24 + enLines.length * enSize * 1.45 : 0);
      };
      let total = measure(), guard = 0;
      while (total > 500 && arSize > 24 && guard++ < 24) {
        arSize -= 3;
        enSize = Math.max(23, enSize - 2);
        preSize = Math.max(22, preSize - 2);
        total = measure();
      }

      let y = 460 - total / 2;
      if (prefix) {
        ctx.direction = "rtl";
        ctx.fillStyle = "#4F7263";
        ctx.font = `600 ${preSize}px Amiri, serif`;
        for (const l of preLines) { y += preSize * 1.6; ctx.fillText(l, S / 2, y - preSize * 0.3); }
        y += 14;
      }
      ctx.direction = "rtl";
      ctx.fillStyle = "#1B3B2B";
      ctx.font = `700 ${arSize}px Amiri, serif`;
      for (const l of arLines) { y += arSize * 1.7; ctx.fillText(l, S / 2, y - arSize * 0.35); }
      if (showEn) {
        y += 24;
        ctx.direction = "ltr";
        ctx.fillStyle = "#44603F";
        ctx.font = `500 ${enSize}px Inter, serif`;
        for (const l of enLines) { y += enSize * 1.45; ctx.fillText(l, S / 2, y - enSize * 0.3); }
      }

      const src = ar ? d.source : (d.sourceEn || d.source);
      const note = ar ? d.note : (d.noteEn || d.note);
      ctx.direction = ar ? "rtl" : "ltr";
      if (src) {
        ctx.fillStyle = "#4F7263";
        ctx.font = "600 28px Tajawal, sans-serif";
        y += 42;
        ctx.fillText(src, S / 2, y);
      }
      if (note) {
        ctx.fillStyle = "#94A3B8";
        ctx.font = "400 24px Tajawal, sans-serif";
        y += 36;
        ctx.fillText(note, S / 2, y);
      }

      ctx.direction = ar ? "rtl" : "ltr";
      ctx.fillStyle = "#1B3B2B";
      ctx.font = "700 38px Tajawal, sans-serif";
      ctx.fillText(ar ? "شبكة أمة الإسلام" : "Muslim Ummah Network", S / 2, 838);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "400 26px Tajawal, sans-serif";
      ctx.fillText("muslimummah.app", S / 2, 892);

      const triggerDownload = (url, revoke) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "muslim-ummah-dhikr.png";
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors disabled:opacity-60">
      <ImageDown size={14} /> {t.downloadImage}
    </button>
  );
}
