// Best-effort QR-code reading for Rawdah posters. Some posters put the Zoom
// link (or a Telegram/WhatsApp/Instagram link) inside a QR code instead of
// writing it as text — the vision model can't decode that, so we decode it
// server-side from the image pixels. Never throws; returns "" on any failure.

export async function decodeQrUrl(buf) {
  try {
    const Jimp = (await import("jimp")).default;
    const jsQR = (await import("jsqr")).default;
    const img = await Jimp.read(buf);
    // Large posters slow jsQR down with no accuracy gain — cap the width.
    if (img.bitmap.width > 1200) img.resize(1200, Jimp.AUTO);
    const res = jsQR(
      new Uint8ClampedArray(img.bitmap.data),
      img.bitmap.width,
      img.bitmap.height,
    );
    const s = res && res.data ? String(res.data).trim() : "";
    return /^https?:\/\//i.test(s) ? s : "";
  } catch {
    return "";
  }
}

// Fill a lesson's missing join link from a decoded QR URL, classified by host.
// Only fills empty fields — never overwrites what the poster's text already gave.
export function applyQrToLesson(l, url) {
  if (!url || !l) return;
  if (/zoom\.us|zoomgov|meet\.google|\/meet\b/i.test(url)) {
    if (!l.zoom_link) l.zoom_link = url;
  } else if (/t\.me\//i.test(url)) {
    if (!l.telegram_link) l.telegram_link = url;
  } else if (/chat\.whatsapp\.com|wa\.me/i.test(url)) {
    if (!l.channel_link) l.channel_link = url;
  } else if (/instagram\.com/i.test(url)) {
    if (!l.instagram) {
      const m = url.match(/instagram\.com\/([^/?#]+)/i);
      if (m && m[1]) l.instagram = m[1];
    }
  } else if (!l.zoom_link) {
    l.zoom_link = url; // generic link → most posters mean the meeting link
  }
}
