// Smart download link (muslimummah.app/app) as a Route Handler — no layout
// needed, so it builds even though it lives outside the [lang] segment.
//  • Android → Google Play (the native app)
//  • iPhone/iPad → the website (iOS app not on the App Store yet)
//  • Desktop / other → a tiny self-contained chooser page
export const dynamic = "force-dynamic";

const PLAY = "https://play.google.com/store/apps/details?id=app.muslimummah.twa";
const WEB = "https://muslimummah.app/ar";

export function GET(request) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  if (ua.includes("android")) {
    return Response.redirect(PLAY, 302);
  }
  if (/iphone|ipad|ipod/.test(ua)) {
    return Response.redirect(WEB, 302);
  }

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>تطبيق أمة الإسلام</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#f4efe6; font-family: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif; padding:24px; }
  .card { width:100%; max-width:420px; text-align:center; }
  h1 { color:#1d3a2e; font-size:1.5rem; margin:0 0 6px; }
  p { color:#5d6b61; margin:0 0 28px; }
  a { display:block; padding:15px 20px; border-radius:14px; font-weight:700; text-decoration:none; margin-top:12px; }
  .play { background:#35654d; color:#f4efe6; }
  .web { background:#fff; color:#4b5563; border:1px solid #d8ccb6; }
  .mark { width:62px; height:62px; margin:0 auto 18px; display:block; }
</style>
</head>
<body>
  <div class="card">
    <svg class="mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 24A18 18 0 1 1 24 6" stroke="#1d3a2e" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="33.7" y="8.3" width="6" height="6" rx="1.2" transform="rotate(45 36.7 11.3)" fill="#4F7263"/>
      <circle cx="24" cy="24" r="7.5" fill="#4F7263"/>
      <circle cx="21.5" cy="21.5" r="2.2" fill="#FDFBF7"/>
    </svg>
    <h1>أمة الإسلام</h1>
    <p>اختر طريقة الفتح على جهازك</p>
    <a class="play" href="${PLAY}">تطبيق أندرويد · Google Play</a>
    <a class="web" href="${WEB}">افتح الموقع · آيفون والكمبيوتر</a>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
