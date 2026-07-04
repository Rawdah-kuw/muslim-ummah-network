import { STR, LANGS } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const title = lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy";
  return { title, robots: { index: true } };
}

const T = {
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 2026",
    body: [
      ["مقدمة", "شبكة أمة الإسلام منصّة معرفية غير ربحية، صدقة جارية. نحترم خصوصيتك، ولا نطلب حسابًا ولا نجمع بيانات شخصية تعرّف بك."],
      ["ما لا نجمعه", "لا نطلب تسجيل دخول، ولا اسمًا، ولا بريدًا، ولا موقعًا جغرافيًا. لا نعرض إعلانات، ولا نبيع أو نشارك أي بيانات."],
      ["ما يُحفظ على جهازك فقط", "نحفظ في متصفحك محليًا (localStorage) تفضيلاتك فقط: الوضع الليلي، وتقدّمك في المنهج. هذه لا تغادر جهازك ولا تصلنا."],
      ["البحث الذكي «اسأل المكتبة»", "عند كتابتك سؤالًا وإرساله، يُرسَل نصّ السؤال إلى خدمة Google Gemini لصياغة إجابة من نصوص الكتب. لا نربط السؤال بهويتك. لا ترسلي معلومات شخصية في السؤال."],
      ["البحث في المواقع الموثوقة", "يستخدم أداة بحث Google المخصّصة (Programmable Search)، وتطبّق عليها سياسة خصوصية Google."],
      ["الأطفال", "المحتوى تعليمي عام ومناسب لكل الأعمار."],
      ["التواصل", "لأي استفسار أو طلب متعلق بالخصوصية أو المحتوى، راسلنا على البريد أدناه."],
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: 2026",
    body: [
      ["Introduction", "Muslim Ummah Network is a non-profit knowledge platform (ongoing charity). We respect your privacy. We do not require an account and do not collect personally identifying data."],
      ["What we do NOT collect", "No sign-in, no name, no email, no location. We show no ads and never sell or share any data."],
      ["Stored on your device only", "Only your preferences are stored locally in your browser (localStorage): dark mode and curriculum progress. These never leave your device or reach us."],
      ["“Ask the Library” AI search", "When you type and submit a question, the question text is sent to Google Gemini to compose an answer from the books' text. It is not tied to your identity. Please do not include personal information in questions."],
      ["Trusted-sites search", "Uses Google Programmable Search; Google's privacy policy applies to it."],
      ["Children", "Content is general educational material, suitable for all ages."],
      ["Contact", "For any privacy or content request, email us at the address below."],
    ],
  },
};

export default function PrivacyPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const p = T[lang];
  return (
    <>
      <Header t={t} lang={lang} />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-pine-800 mb-2">{p.title}</h1>
        <p className="text-sm text-slate-400 mb-10">{p.updated}</p>
        <div className="space-y-7">
          {p.body.map(([h, b], i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-pine-800 mb-1.5">{h}</h2>
              <p className="text-slate-600 leading-relaxed">{b}</p>
            </section>
          ))}
          <p className="text-slate-600 leading-relaxed">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sage-600 hover:underline" dir="ltr">{CONTACT_EMAIL}</a>
          </p>
        </div>
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
