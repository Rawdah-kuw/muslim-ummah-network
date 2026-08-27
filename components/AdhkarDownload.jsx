"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { shareCanvas } from "@/lib/shareCanvas";

// Draws a single dhikr onto a 1080×1080 cream card and shares it as a PNG via
// the native share sheet (download fallback on desktop).
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
      ctx.fillText(ar ? "من الأذكار" : "Daily Adhkar", S / 2, 200);

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
      const src = ar ? d.source : (d.sourceEn || d.source);
      const note = ar ? d.note : (d.noteEn || d.note);
      // Note wraps too, so a long benefit never overflows or hits the footer.
      const wrapNote = (str, size) => wrap(str, size, "Tajawal, sans-serif", 400);

      let arSize = 50, enSize = 32, preSize = 28;
      let preLines = [], arLines = [], enLines = [], noteLines = [];
      const srcH = src ? 44 : 0;
      const measure = () => {
        preLines = prefix ? wrap(prefix, preSize, "Amiri, serif", 600) : [];
        arLines = wrap(d.ar, arSize, "Amiri, serif", 700);
        enLines = showEn ? wrap(enText, enSize, "Inter, serif", 500) : [];
        noteLines = note ? wrapNote(note, 23) : [];
        // Full block = prefix + arabic + english + source + note.
        return preLines.length * preSize * 1.6 + (prefix ? 14 : 0) +
          arLines.length * arSize * 1.7 +
          (showEn ? 20 + enLines.length * enSize * 1.45 : 0) +
          srcH + noteLines.length * 32;
      };
      let full = measure(), guard = 0;
      // Keep the whole block within ~540px so it always clears the footer.
      while (full > 540 && arSize > 22 && guard++ < 26) {
        arSize -= 3;
        enSize = Math.max(22, enSize - 2);
        preSize = Math.max(20, preSize - 2);
        full = measure();
      }

      let y = 465 - full / 2;
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
        y += 20;
        ctx.direction = "ltr";
        ctx.fillStyle = "#44603F";
        ctx.font = `500 ${enSize}px Inter, serif`;
        for (const l of enLines) { y += enSize * 1.45; ctx.fillText(l, S / 2, y - enSize * 0.3); }
      }
      ctx.direction = ar ? "rtl" : "ltr";
      if (src) {
        y += 44;
        ctx.fillStyle = "#4F7263";
        ctx.font = "600 27px Tajawal, sans-serif";
        ctx.fillText(src, S / 2, y - 8);
      }
      if (noteLines.length) {
        ctx.fillStyle = "#94A3B8";
        ctx.font = "400 23px Tajawal, sans-serif";
        for (const l of noteLines) { y += 32; ctx.fillText(l, S / 2, y - 8); }
      }

      // Footer — fixed near the bottom, always below the centred block.
      ctx.direction = ar ? "rtl" : "ltr";
      ctx.fillStyle = "#1B3B2B";
      ctx.font = "700 38px Tajawal, sans-serif";
      ctx.fillText(ar ? "شبكة أمة الإسلام" : "Muslim Ummah Network", S / 2, 858);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "400 26px Tajawal, sans-serif";
      ctx.fillText("muslimummah.app", S / 2, 906);

      const caption = `${prefix ? prefix + "\n" : ""}${d.ar}${enText ? "\n" + enText : ""}${src ? "\n" + src : ""}\n\n${t.shareText}\nmuslimummah.app`;
      await shareCanvas(canvas, "muslim-ummah-dhikr.png", caption);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={handle} disabled={busy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors disabled:opacity-60">
      <Share2 size={14} /> {t.shareImage}
    </button>
  );
}
