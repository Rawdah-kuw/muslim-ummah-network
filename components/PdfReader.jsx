// Uses the browser's built-in PDF viewer (same engine as Chrome/Safari).
// This renders every PDF faithfully — correct fonts, full text, zoom — and
// streams large files, so it stays reliable where a custom canvas renderer fails.
export default function PdfReader({ url, t }) {
  return (
    <object data={url} type="application/pdf"
      className="w-full border-0 block bg-pearl-100"
      style={{ height: "calc(100vh - 57px)" }}>
      <iframe src={url} title={t?.libTitle || "PDF"} className="w-full border-0 block"
        style={{ height: "calc(100vh - 57px)" }} />
    </object>
  );
}
