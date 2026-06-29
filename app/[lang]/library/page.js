import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Library from "@/components/Library";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return { title: t.libTitle, description: t.libDesc, openGraph: { title: t.libTitle, type: "website" } };
}

export default function LibraryIndexPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];

  return (
    <>
      <Header t={t} lang={lang} />
      <main className="pt-8">
        <Library t={t} lang={lang} />
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
