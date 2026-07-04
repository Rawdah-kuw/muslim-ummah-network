// Uses the browser's built-in PDF viewer (same engine as Chrome/Safari).
// This renders every PDF faithfully — correct fonts, full text, zoom — and
// streams large files, so it stays reliable where a custom canvas renderer fails.
export default function PdfReader({ url, t }) {
  // Cache-buster: forces browsers to re-fetch (bypasses any old cached copy
  // that still carries the previous, stricter framing headers).
  const src = url + (url.includes("?") ? "&" : "?") + "v=2";
  return (
    <object data={src} type="application/pdf"
      className="w-full border-0 block bg-pearl-100"
      style={{ height: "calc(100vh - 57px)" }}>
      <iframe src={src} title={t?.libTitle || "PDF"} className="w-full border-0 block"
        style={{ height: "calc(100vh - 57px)" }} />
    </object>
  );
}
