/** @type {import('next').NextConfig} */

// Content Security Policy — kept compatible with:
//  • Google Programmable Search (cse.google.com / www.google.com / gstatic)
//  • the in-browser PDF reader (<object>/<iframe> from our own origin)
//  • self-hosted fonts + Google Fonts
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cse.google.com https://www.google.com https://www.gstatic.com https://*.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://www.google.com https://fonts.googleapis.com https://*.gstatic.com",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "object-src 'self'",
  "frame-src 'self' https://cse.google.com https://www.google.com",
  "connect-src 'self' https://cse.google.com https://www.google.com https://clients1.google.com https://*.google.com https://*.gstatic.com https://*.supabase.co",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    const PLAY = "https://play.google.com/store/apps/details?id=app.muslimummah.twa";
    const WEB = "https://muslimummah.app/ar";
    return [
      { source: "/", destination: "/ar", permanent: false },
      // /app smart link — device-aware, handled at the config/routing level
      // (no route file, so no root-layout requirement to trip the build).
      {
        source: "/app",
        has: [{ type: "header", key: "user-agent", value: ".*[Aa]ndroid.*" }],
        destination: PLAY,
        permanent: false,
      },
      {
        source: "/app",
        has: [{ type: "header", key: "user-agent", value: ".*(iPhone|iPad|iPod).*" }],
        destination: WEB,
        permanent: false,
      },
      // Desktop / anything else → the website.
      { source: "/app", destination: WEB, permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
