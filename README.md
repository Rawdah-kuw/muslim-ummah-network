# شبكة أمة الإسلام — Muslim Ummah Network

منصة معرفية إسلامية ثنائية اللغة (عربي/إنجليزي) مبنية بـ Next.js 14 و Tailwind CSS.
صدقة جارية عن علي عبد العزيز الصدّيقي رحمه الله.

## التشغيل محليًا

```bash
npm install
npm run dev        # http://localhost:3000 → يحوّل تلقائيًا إلى /ar
```

## رفع المحتوى الفعلي

| المحتوى | المكان | الملاحظة |
|---|---|---|
| كتب PDF | `public/books/` | الأسماء المتوقعة موجودة في `lib/data.js` (حقل `fileAr` / `fileEn`) |
| صوتيات MP3 | `public/audio/` | الأسماء في `lib/data.js` (حقل `src`) — قبل رفعها يعمل المشغّل بوضع محاكاة |
| نصوص وبيانات | `lib/data.js` و `lib/i18n.js` | كل محتوى الموقع في هذين الملفين فقط |

## البحث الذكي المقيّد (محرك علي)

البحث يعمل بطبقتي حماية:

1. **Google Programmable Search Engine** — أنشئ محركًا من
   [programmablesearchengine.google.com](https://programmablesearchengine.google.com)
   واختر **Search only included sites** وأضف المواقع المعتمدة
   (القيد يُفرض في خوادم جوجل نفسها).
2. **فلترة دفاعية في الخادم** — `app/api/search/route.js` يعيد فلترة كل
   نتيجة ضد قائمة `APPROVED_SITES` في `lib/data.js`.

ثم انسخ `.env.example` إلى `.env.local` وضع المفتاحين.
**بدون المفاتيح** الموقع لا يتعطل: يعرض زرًا يفتح البحث المقيّد في جوجل خارجيًا.

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. من [vercel.com](https://vercel.com) → New Project → اختر المستودع (يكتشف Next.js تلقائيًا).
3. أضف `GOOGLE_KEY` و `ENGINE_ID` في Settings → Environment Variables.
4. Deploy.

## البنية

```
app/[lang]/        المسارات (/ar و /en) — RTL/LTR تلقائي
app/api/search/    دالة البحث المقيّد (المفاتيح لا تصل للمتصفح أبدًا)
components/        المكوّنات (الهوية في PearlMark.jsx)
lib/               النصوص (i18n.js) والبيانات (data.js)
tailwind.config.js توكنز الهوية: pearl / pine / sage / ink + ظلال pine
```

## الهوية البصرية

- **اللؤلؤة** (`PearlMark`): قوس المحارة وطريق الغوّاص — إرث الكويت وجذور علي،
  واللؤلؤة في المركز هي العلم المكنون.
- **الألوان**: قماشة لؤلؤية دافئة `#FDFBF7`، صنوبري `#1B3B2B` للعناوين،
  مريمي `#4F7263` للتفاعل (متوافق WCAG AA).
- **الخطوط**: Tajawal للواجهة العربية، Inter للإنجليزية،
  Noto Naskh Arabic للقراءة الطويلة (`font-read`)، وAmiri محجوز للقرآن والحديث (`font-quran`).
