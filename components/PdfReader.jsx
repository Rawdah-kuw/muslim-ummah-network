"use client";

import { useEffect, useRef, useState } from "react";

// PDF.js loaded from a CDN (no build dependency). Pages render lazily as they
// scroll into view, so even very large books stay light on phones.
const ASSET = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379";
const BASE = `${ASSET}/build`;

export default function PdfReader({ url, t }) {
  const wrapRef = useRef(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    let observer;

    (async () => {
      try {
        const pdfjs = await import(/* webpackIgnore: true */ `${BASE}/pdf.min.mjs`);
        pdfjs.GlobalWorkerOptions.workerSrc = `${BASE}/pdf.worker.min.mjs`;

        const pdf = await pdfjs.getDocument({
          url,
          cMapUrl: `${ASSET}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `${ASSET}/standard_fonts/`,
        }).promise;
        if (cancelled) return;

        const wrap = wrapRef.current;
        wrap.innerHTML = "";
        const width = Math.min(wrap.clientWidth - 8, 900);

        const first = await pdf.getPage(1);
        const v1 = first.getViewport({ scale: 1 });
        const ratio = v1.height / v1.width;

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(async (entry) => {
              if (!entry.isIntersecting) return;
              const slot = entry.target;
              observer.unobserve(slot);
              if (slot.dataset.done) return;
              slot.dataset.done = "1";
              try {
                const page = await pdf.getPage(Number(slot.dataset.page));
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const scale = (width / page.getViewport({ scale: 1 }).width) * dpr;
                const vp = page.getViewport({ scale });
                const canvas = document.createElement("canvas");
                canvas.width = vp.width;
                canvas.height = vp.height;
                canvas.className = "block w-full";
                slot.innerHTML = "";
                slot.appendChild(canvas);
                await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
              } catch {
                /* skip a page that fails to render */
              }
            });
          },
          { rootMargin: "800px 0px" }
        );

        for (let n = 1; n <= pdf.numPages; n++) {
          const slot = document.createElement("div");
          slot.dataset.page = String(n);
          slot.style.height = `${Math.round(width * ratio)}px`;
          slot.style.maxWidth = `${width}px`;
          slot.className = "mx-auto mb-3 bg-pearl-100 rounded shadow-pine overflow-hidden";
          wrap.appendChild(slot);
          observer.observe(slot);
        }

        if (!cancelled) setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
    };
  }, [url]);

  return (
    <div className="bg-pearl-100 min-h-[70vh] py-4">
      {state === "loading" && <p className="text-center text-slate-500 py-12">{t.loadingReader}</p>}
      {state === "error" && (
        <p className="text-center text-slate-500 py-12 px-6 max-w-md mx-auto leading-relaxed">{t.readerError}</p>
      )}
      <div ref={wrapRef} className="px-2" />
    </div>
  );
}
