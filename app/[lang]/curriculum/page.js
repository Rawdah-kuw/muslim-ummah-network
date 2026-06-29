import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Curriculum from "@/components/Curriculum";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return { title: t.pathTitle, description: t.pathDesc, openGraph: { title: t.pathTitle, type: "website" } };
}

export default function CurriculumIndexPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const rtl = lang === "ar";

  return (
    <>
      <Header t={t} lang={lang} />
      <main className="pt-8">
        <Curriculum t={t} lang={lang} rtl={rtl} />
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
