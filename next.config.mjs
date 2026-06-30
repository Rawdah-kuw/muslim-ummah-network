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
  "connect-src 'self' https://cse.google.com https://www.google.com https://clients1.google.com https://*.google.com https://*.gstatic.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/", destination: "/ar", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
