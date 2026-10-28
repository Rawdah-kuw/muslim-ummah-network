import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PearlMark from "@/components/PearlMark";

// One smart link to share everywhere (muslimummah.app/app):
//  • Android → Google Play (the native app).
//  • iPhone/iPad → the website for now (iOS app not yet on the App Store).
//  • Desktop / anything else → a small page with both options.
const PLAY = "https://play.google.com/store/apps/details?id=app.muslimummah.twa";
const WEB = "https://muslimummah.app/ar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تطبيق أمة الإسلام — Get the app",
  description: "حمّل تطبيق أمة الإسلام على أندرويد، أو افتح الموقع على آيفون.",
};

export default function AppRedirect() {
  const ua = (headers().get("user-agent") || "").toLowerCase();
  const isAndroid = ua.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(ua) || (ua.includes("mac") && ua.includes("mobile"));

  if (isAndroid) redirect(PLAY);
  if (isIOS) redirect(WEB); // App Store listing not live yet → website

  // Desktop / other: let the person choose.
  return (
    <main className="min-h-screen bg-pearl-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <PearlMark size={64} />
        </div>
        <h1 className="text-2xl font-extrabold text-pine-800 mb-2">أمة الإسلام</h1>
        <p className="text-slate-500 mb-8">اختر طريقة الفتح على جهازك</p>

        <div className="flex flex-col gap-3">
          <a
            href={PLAY}
            className="px-6 py-3.5 rounded-xl text-cream font-semibold bg-sage-600 hover:bg-sage-700 transition-colors"
          >
            تطبيق أندرويد · Google Play
          </a>
          <a
            href={WEB}
            className="px-6 py-3.5 rounded-xl font-semibold bg-white border border-pearl-300 text-slate-600 hover:border-sage-300 transition-colors"
          >
            افتح الموقع · آيفون والكمبيوتر
          </a>
        </div>

        <p className="text-xs text-slate-400 mt-8" dir="rtl">
          يُفتح الرابط تلقائياً على المكان المناسب لجهازك.
        </p>
      </div>
    </main>
  );
}
