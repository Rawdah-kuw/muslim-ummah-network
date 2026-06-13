import { APPROVED_SITES } from "@/lib/data";

/**
 * Guardrailed search — two layers of enforcement:
 * 1. Google Programmable Search Engine configured with "Search only included
 *    sites" → the restriction is enforced on Google's servers.
 * 2. Defense-in-depth: results are re-filtered here against APPROVED_SITES,
 *    so even an engine misconfiguration can never leak external domains.
 *
 * Env vars (set in Vercel → Project → Settings → Environment Variables):
 *   GOOGLE_KEY  — Google Cloud API key with Custom Search API enabled
 *   ENGINE_ID   — the PSE engine id (cx) from cse.google.com
 */
export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q")?.trim().slice(0, 200);
  if (!q) {
    return Response.json({ error: "missing query" }, { status: 400 });
  }

  const scoped = `${q} (${APPROVED_SITES.map((s) => `site:${s}`).join(" OR ")})`;

  // Graceful degradation: without API keys, tell the client to fall back
  // to an external scoped Google search instead of failing.
  if (!process.env.GOOGLE_KEY || !process.env.ENGINE_ID) {
    return Response.json({ fallback: true, scoped });
  }

  const url =
    `https://www.googleapis.com/customsearch/v1` +
    `?key=${process.env.GOOGLE_KEY}` +
    `&cx=${process.env.ENGINE_ID}` +
    `&q=${encodeURIComponent(q)}&num=8&hl=ar`;

  const r = await fetch(url, { next: { revalidate: 0 } });
  if (!r.ok) {
    return Response.json({ fallback: true, scoped });
  }
  const data = await r.json();

  const items = (data.items ?? [])
    .filter((it) => {
      try {
        const host = new URL(it.link).hostname;
        return APPROVED_SITES.some((d) => host === d || host.endsWith(`.${d}`));
      } catch {
        return false;
      }
    })
    .map(({ title, link, snippet, displayLink }) => ({ title, link, snippet, displayLink }));

  return Response.json({ items });
}
