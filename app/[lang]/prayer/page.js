import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Prayer from "@/components/Prayer";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const title = lang === "ar" ? "أوقات الصلاة — مدينة الكويت" : "Prayer Times — Kuwait City";
  const description =
    lang === "ar"
      ? "أوقات الصلاة اليوم لمدينة الكويت مع العدّ التنازلي للصلاة القادمة والتاريخ الهجري."
      : "Today's prayer times for Kuwait City with a live countdown to the next prayer and the Hijri date.";
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default function Page({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return (
    <>
      <Header t={t} lang={lang} />
      <Prayer t={t} lang={lang} />
      <Footer t={t} lang={lang} />
    </>
  );
}
