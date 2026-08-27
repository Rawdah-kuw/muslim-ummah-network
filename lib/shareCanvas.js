// Shares a rendered <canvas> as a PNG through the device's native share sheet
// (as an actual image file — so it lands in WhatsApp/Instagram/etc. as a
// picture, not a link). Falls back to downloading the image when the browser
// can't share files (most desktops).
export async function shareCanvas(canvas, filename, text) {
  const blob = await new Promise((resolve) => {
    if (canvas.toBlob) canvas.toBlob(resolve, "image/png");
    else resolve(null);
  });

  const isIOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // 1) Native share sheet with the real image file (phones/tablets).
  if (blob && typeof navigator !== "undefined" && navigator.canShare) {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });
        return "shared";
      } catch (e) {
        if (e && e.name === "AbortError") return "cancelled"; // user closed the sheet
        // any other error → fall through to download
      }
    }
  }

  // 2) Fallback: download the image (or open it on iOS to long-press & save).
  const triggerDownload = (url, revoke) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revoke) setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  if (blob) {
    const url = URL.createObjectURL(blob);
    if (isIOS) {
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      triggerDownload(url, true);
    }
  } else {
    triggerDownload(canvas.toDataURL("image/png"), false);
  }
  return "downloaded";
}
