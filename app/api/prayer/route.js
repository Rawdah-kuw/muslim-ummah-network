// Today's prayer times + Hijri date from the free Aladhan API.
//  • With ?lat=&lng= → the user's own location (method 3 = Muslim World League,
//    a sensible global default), so it's correct anywhere in the world.
//  • Without coordinates → Kuwait City (method 9), the default/fallback.

const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const dynamic = "force-dynamic"; // depends on the lat/lng query

async function fetchAladhan(url) {
  const r = await fetch(url, { next: { revalidate: 3600 } });
  if (!r.ok) throw new Error("aladhan fetch failed");
  const j = await r.json();
  const data = j?.data;
  if (!data?.timings || !data?.date) throw new Error("bad aladhan payload");
  return data;
}

function buildOut(data, { byLocation, city }) {
  const timings = {};
  for (const k of ORDER) timings[k] = String(data.timings[k] ?? "").split(" ")[0];
  const hijri = data.date.hijri;
  const tz = data.meta?.timezone || "";
  return {
    timings,
    hijriAr: `${hijri.day} ${hijri.month.ar} ${hijri.year}هـ`,
    hijriEn: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
    gregorian: String(data.date.gregorian?.date ?? ""),
    city: city || (tz ? tz.split("/").pop().replace(/_/g, " ") : ""),
    timezone: tz,
    byLocation: !!byLocation,
  };
}

export async function GET(request) {
  try {
    const sp = new URL(request.url).searchParams;
    const lat = sp.get("lat");
    const lng = sp.get("lng");
    let data, meta;
    if (lat && lng && Number.isFinite(+lat) && Number.isFinite(+lng)) {
      data = await fetchAladhan(
        `https://api.aladhan.com/v1/timings?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&method=3`
      );
      meta = { byLocation: true };
    } else {
      data = await fetchAladhan(
        "https://api.aladhan.com/v1/timingsByCity?city=Kuwait%20City&country=Kuwait&method=9"
      );
      meta = { byLocation: false, city: "Kuwait City" };
    }
    return Response.json(buildOut(data, meta), {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return Response.json({ error: "prayer_unavailable" }, { status: 502 });
  }
}
