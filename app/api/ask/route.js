import corpus from "@/lib/corpus.json";
import { BOOKS, bookSlug } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 30;

// --- Basic in-memory rate limit (per IP, per serverless instance) ---
// Blunt but effective at curbing abuse and runaway cost on the Gemini key.
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX = 15; // max requests per IP per window
const hits = new Map(); // ip -> number[] (timestamps)

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS);
  if (arr.length >= RL_MAX) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // guard against unbounded growth
  return false;
}

function clientIp(req) {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

function titleOf(slug, lang) {
  const b = BOOKS.find((x) => bookSlug(x) === slug);
  return b ? b.title[lang] || b.title.ar : slug;
}

function score(words, text) {
  const t = text.toLowerCase();
  let s = 0;
  for (const w of words) if (t.includes(w)) s++;
  return s;
}

export async function POST(req) {
  if (rateLimited(clientIp(req))) {
    return Response.json({ error: "rate-limited" }, { status: 429 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  if (typeof body.q !== "string") {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const q = body.q.trim().slice(0, 300);
  const lang = body.lang === "en" ? "en" : "ar";
  if (!q) return Response.json({ error: "empty" }, { status: 400 });
  if (!process.env.GEMINI_KEY) return Response.json({ error: "no-key" }, { status: 500 });

  const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const top = corpus
    .map((c) => ({ c, s: score(words, c.text) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6);

  if (!top.length) return Response.json({ answer: "", sources: [], notFound: true });

  const passages = top
    .map((x, i) => `[${i + 1}] (${titleOf(x.c.book, lang)} — ص ${x.c.page})\n${x.c.text}`)
    .join("\n\n");

  const instruction =
    lang === "ar"
      ? "أجب فقط من المقاطع التالية المأخوذة من كتب إسلامية معتمدة. إن لم تجد الجواب فيها فقل بوضوح: «لم أجد إجابة في الكتب المعتمدة، راجع أهل العلم». اذكر اسم الكتاب والصفحة لكل معلومة. لا تخترع ولا تُفتِ من عندك."
      : "Answer ONLY from the following passages taken from approved Islamic books. If the answer is not in them, say clearly: \"I could not find an answer in the approved books; please consult scholars.\" Cite the book name and page for each point. Do not invent or issue your own ruling.";

  const prompt = `${instruction}\n\n${lang === "ar" ? "المقاطع" : "Passages"}:\n${passages}\n\n${lang === "ar" ? "السؤال" : "Question"}: ${q}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await r.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const sources = top.map((x) => ({ title: titleOf(x.c.book, lang), page: x.c.page, slug: x.c.book }));
    return Response.json({ answer, sources });
  } catch {
    return Response.json({ error: "ai" }, { status: 500 });
  }
}
