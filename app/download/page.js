"use client";

import { useEffect, useState } from "react";
import PearlMark from "@/components/PearlMark";

// One smart link to share everywhere (muslimummah.app/app):
//  • Android → Google Play (the native app).
//  • iPhone/iPad → the website for now (iOS app not yet on the App Store).
//  • Desktop / anything else → a small page with both options.
// Client-side so it builds and works on any host, with a no-JS fallback below.
const PLAY = "https://play.google.com/store/apps/details?id=app.muslimummah.twa";
const WEB = "https://muslimummah.app/ar";

export default function AppRedirect() {
  const [choice, setChoice] = useState(false);

  useEffect(() => {
    try {
      const ua = (navigator.userAgent || "").toLowerCase();
      if (ua.includes("android")) {
        window.location.replace(PLAY);
        return;
      }
      if (/iphone|ipad|ipod/.test(ua)) {
        window.location.replace(WEB);
        return;
      }
    } catch {
      /* fall through to the chooser */
    }
    setChoice(true);
  }, []);

  return (
    <main className="min-h-screen bg-pearl-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <PearlMark size={64} />
        </div>
        <h1 className="text-2xl font-extrabold text-pine-800 mb-2">أمة الإسلام</h1>

        {choice ? (
          <>
            <p className="text-slate-500 mb-8">اختر طريقة الفتح على جهازك</p>
            <div className="flex flex-col gap-3">
              <a href={PLAY} className="px-6 py-3.5 rounded-xl text-cream font-semibold bg-sage-600 hover:bg-sage-700 transition-colors">
                تطبيق أندرويد · Google Play
              </a>
              <a href={WEB} className="px-6 py-3.5 rounded-xl font-semibold bg-white border border-pearl-300 text-slate-600 hover:border-sage-300 transition-colors">
                افتح الموقع · آيفون والكمبيوتر
              </a>
            </div>
          </>
        ) : (
          <p className="text-slate-500" dir="rtl">… جارٍ التحويل إلى المكان المناسب لجهازك</p>
        )}

        <noscript>
          <div className="flex flex-col gap-3 mt-6">
            <a href={PLAY} className="px-6 py-3.5 rounded-xl text-cream font-semibold bg-sage-600">تطبيق أندرويد · Google Play</a>
            <a href={WEB} className="px-6 py-3.5 rounded-xl font-semibold bg-white border border-pearl-300 text-slate-600">افتح الموقع</a>
          </div>
        </noscript>
      </div>
    </main>
  );
}
