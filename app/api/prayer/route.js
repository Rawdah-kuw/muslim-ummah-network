// Today's prayer times + Hijri date for Kuwait City, from the free Aladhan API
// (calculation method 9 = Kuwait) — mirrors the mobile app's PrayerService.
// Cached on the server for the day so we rarely hit Aladhan.

const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const revalidate = 3600; // seconds

export async function GET() {
  try {
    const url =
      "https://api.aladhan.com/v1/timingsByCity?city=Kuwait%20City&country=Kuwait&method=9";
    const r = await fetch(url, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error("aladhan fetch failed");
    const j = await r.json();
    const data = j?.data;
    if (!data?.timings || !data?.date) throw new Error("bad aladhan payload");

    const timings = {};
    for (const k of ORDER) {
      const v = String(data.timings[k] ?? "");
      timings[k] = v.split(" ")[0]; // strip trailing " (+03)"
    }
    const hijri = data.date.hijri;
    const out = {
      timings,
      hijriAr: `${hijri.day} ${hijri.month.ar} ${hijri.year}هـ`,
      hijriEn: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
      gregorian: String(data.date.gregorian?.date ?? ""),
      city: "Kuwait City",
    };
    return Response.json(out, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json({ error: "prayer_unavailable" }, { status: 502 });
  }
}
