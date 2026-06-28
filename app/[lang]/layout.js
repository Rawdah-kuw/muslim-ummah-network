import "../globals.css";
import { Tajawal, Amiri, Inter, Noto_Naskh_Arabic } from "next/font/google";
import { STR, LANGS } from "@/lib/i18n";

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], variable: "--font-tajawal", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-inter", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-amiri", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-naskh", display: "swap" });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return {
    metadataBase: new URL("https://muslimummah.app"),
    title: { default: t.siteName, template: `%s — ${t.siteName}` },
    description: t.heroDesc,
    alternates: { canonical: `/${lang}` },
    openGraph: {
      title: t.siteName,
      description: t.heroDesc,
      type: "website",
      siteName: t.siteName,
      url: `https://muslimummah.app/${lang}`,
      locale: lang === "ar" ? "ar_AR" : "en_US",
    },
    twitter: { card: "summary_large_image", title: t.siteName, description: t.heroDesc },
  };
}

export default function RootLayout({ children, params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const rtl = lang === "ar";

  return (
    <html lang={lang} dir={rtl ? "rtl" : "ltr"}
      className={`${tajawal.variable} ${inter.variable} ${amiri.variable} ${naskh.variable}`}>
      <body
        className="min-h-screen bg-white text-ink antialiased"
        style={{
          // UI font: Tajawal for Arabic, Inter for English.
          // Reading font (long-form): Noto Naskh — used via font-read.
          "--font-ui": rtl ? "var(--font-tajawal), sans-serif" : "var(--font-inter), var(--font-tajawal), sans-serif",
          "--font-read": "var(--font-naskh), serif",
          fontFamily: "var(--font-ui)",
        }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
