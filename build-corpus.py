#!/usr/bin/env python3
# Run once from the project root:  python3 build-corpus.py
# It reads public/books/*.pdf and writes lib/corpus.json (the AI search index).
import glob, json, re, os, sys

BOOKS_DIR = "public/books"
OUT = "lib/corpus.json"
SKIP = {"hadith-fath-albari-vol1-ar.pdf", "hadith-jami-ulum-wal-hikam-en.pdf"}  # scanned (need OCR)

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf is not installed. Run:  pip3 install pypdf --break-system-packages")
    sys.exit(1)

chunks, cid = [], 0
for f in sorted(glob.glob(os.path.join(BOOKS_DIR, "*.pdf"))):
    name = os.path.basename(f)
    if name in SKIP:
        continue
    try:
        r = PdfReader(f)
    except Exception as e:
        print("skip", name, e)
        continue
    for pno, page in enumerate(r.pages, 1):
        t = re.sub(r"\s+", " ", (page.extract_text() or "")).strip()
        if len(t) < 40:
            continue
        i = 0
        while i < len(t):
            chunks.append({"id": cid, "book": name[:-4], "page": pno, "text": t[i:i + 800]})
            cid += 1
            i += 750
    print("done:", name)

os.makedirs("lib", exist_ok=True)
with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(chunks, fh, ensure_ascii=False)
print("OK — wrote", len(chunks), "chunks to", OUT)
