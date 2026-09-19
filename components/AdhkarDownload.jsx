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

      // Use the exact fonts the page loaded via next/font (their real family
      // names live in these CSS variables). The literal "Amiri" is NOT that
      // font, so the Quran end-of-ayah mark (۝) never enclosed its number —
      // pulling the real Amiri fixes the ayah numbers in the image too.
      const rs = getComputedStyle(document.documentElement);
      const AMIRI = (rs.getPropertyValue("--font-amiri") || "").trim() || "Amiri, serif";
      const INTER = (rs.getPropertyValue("--font-inter") || "").trim() || "Inter, sans-serif";
      const TAJAWAL = (rs.getPropertyValue("--font-tajawal") || "").trim() || "Tajawal, sans-serif";

      ctx.fillStyle = "#FDFBF7";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "#D7E4DD";
      ctx.lineWidth = 4;
      ctx.strokeRect(132, 132, S - 264, S - 264);
      ctx.textAlign = "center";

      ctx.direction = ar ? "rtl" : "ltr";
      ctx.fillStyle = "#4F7263";
      ctx.font = `500 32px ${TAJAWAL}`;
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

      // Fit the WHOLE block (prefix + arabic + english + source + note) into a
      // fixed vertical band, then centre it in that band. Every line advances by
      // the same line-height, so spacing inside one dhikr is always even, and the
      // block can never reach the footer — even for long ones like Ayat al-Kursi.
      const BAND_TOP = 250, BAND_BOTTOM = 812, BAND = BAND_BOTTOM - BAND_TOP;
      const AR_LH = 1.75, PRE_LH = 1.7, EN_LH = 1.5, NOTE_LH = 32;
      const GAP_PRE = 14, GAP_EN = 24, GAP_SRC = 52, GAP_NOTE = 12;

      let arSize = 52, enSize = 32, preSize = 28;
      let preLines = [], arLines = [], enLines = [], noteLines = [];
      const measure = () => {
        preLines = prefix ? wrap(prefix, preSize, AMIRI, 600) : [];
        arLines = wrap(d.ar, arSize, AMIRI, 700);
        enLines = showEn ? wrap(enText, enSize, INTER, 500) : [];
        noteLines = note ? wrap(note, 23, TAJAWAL, 400) : [];
        return (preLines.length ? preLines.length * preSize * PRE_LH + GAP_PRE : 0) +
          arLines.length * arSize * AR_LH +
          (showEn ? GAP_EN + enLines.length * enSize * EN_LH : 0) +
          (src ? GAP_SRC : 0) +
          (noteLines.length ? GAP_NOTE + noteLines.length * NOTE_LH : 0);
      };
      let full = measure(), guard = 0;
      while (full > BAND && arSize > 20 && guard++ < 48) {
        arSize -= 2;
        enSize = Math.max(20, enSize - 1);
        preSize = Math.max(20, preSize - 1);
        full = measure();
      }

      let y = BAND_TOP + Math.max(0, (BAND - full) / 2);
      if (prefix) {
        ctx.direction = "rtl";
        ctx.fillStyle = "#4F7263";
        ctx.font = `600 ${preSize}px ${AMIRI}`;
        for (const l of preLines) { y += preSize * PRE_LH; ctx.fillText(l, S / 2, y - preSize * 0.35); }
        y += GAP_PRE;
      }
      ctx.direction = "rtl";
      ctx.fillStyle = "#1B3B2B";
      ctx.font = `700 ${arSize}px ${AMIRI}`;
      for (const l of arLines) { y += arSize * AR_LH; ctx.fillText(l, S / 2, y - arSize * 0.35); }
      if (showEn) {
        y += GAP_EN;
        ctx.direction = "ltr";
        ctx.fillStyle = "#44603F";
        ctx.font = `500 ${enSize}px ${INTER}`;
        for (const l of enLines) { y += enSize * EN_LH; ctx.fillText(l, S / 2, y - enSize * 0.30); }
      }
      ctx.direction = ar ? "rtl" : "ltr";
      if (src) {
        y += GAP_SRC;
        ctx.fillStyle = "#4F7263";
        ctx.font = `600 27px ${TAJAWAL}`;
        ctx.fillText(src, S / 2, y - 16);
      }
      if (noteLines.length) {
        y += GAP_NOTE;
        ctx.fillStyle = "#94A3B8";
        ctx.font = `400 23px ${TAJAWAL}`;
        for (const l of noteLines) { y += NOTE_LH; ctx.fillText(l, S / 2, y - 10); }
      }

      // Footer — fixed near the bottom, always clear of the centred band.
      ctx.direction = ar ? "rtl" : "ltr";
      ctx.fillStyle = "#1B3B2B";
      ctx.font = `700 38px ${TAJAWAL}`;
      ctx.fillText(ar ? "شبكة أمة الإسلام" : "Muslim Ummah Network", S / 2, 868);
      ctx.fillStyle = "#94A3B8";
      ctx.font = `400 26px ${TAJAWAL}`;
      ctx.fillText("muslimummah.app", S / 2, 914);

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
