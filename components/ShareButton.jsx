"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ t, path, title, className = "" }) {
  const handleShare = async () => {
    const url = `${window.location.origin}${path}`;
    const text = `${title} — ${t.shareText}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* user cancelled — fall through to WhatsApp */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener");
  };

  return (
    <button type="button" onClick={handleShare} className={className} aria-label={t.share}>
      <Share2 size={15} /> {t.share}
    </button>
  );
}
