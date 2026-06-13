// Approved domains for the guardrailed search (mirrored server-side in app/api/search/route.js)
export const APPROVED_SITES = ["islamqa.info", "dorar.net", "binbaz.org.sa", "islamweb.net"];

export const CATS = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "ali", ar: "كتب ومقالات علي", en: "Ali's Books & Articles" },
  { key: "tafsir", ar: "تفسير", en: "Tafsir" },
  { key: "hadith", ar: "حديث", en: "Hadith" },
  { key: "aqidah", ar: "عقيدة", en: "Creed" },
  { key: "fiqh", ar: "فقه", en: "Fiqh" },
  { key: "seerah", ar: "سيرة", en: "Seerah" },
  { key: "tazkiyah", ar: "تزكية", en: "Purification" },
  { key: "adhkar", ar: "أذكار", en: "Adhkar" },
];

// Place the actual PDFs in /public/books/ with these filenames.
export const BOOKS = [
  {
    id: 9, cat: "ali", bilingual: true, pages: 41, size: "7.9 MB",
    fileAr: "/books/muqaddimah-fi-ilm-alhadith-ar.pdf",
    fileEn: "/books/introduction-to-hadith-en.pdf",
    title: { ar: "مقدمة في علم الحديث", en: "Introduction to Hadith" },
    author: { ar: "علي عبد العزيز الصدّيقي رحمه الله — بمشاركة محمد الصدّيقي", en: "Ali Abdulaziz Alseddiqi (may Allah have mercy on him), with Mohammad Alseddiqi" },
    desc: { ar: "مدخل ميسّر إلى علم الحديث ومصطلحه. متاح بالعربية والإنجليزية، ويجوز نشره مجانًا للأغراض التعليمية.", en: "An accessible introduction to the science of Hadith and its terminology. Available in Arabic and English, free to share for educational use." },
  },
  {
    id: 10, cat: "ali", bilingual: true, pages: null, size: "4.9 MB",
    fileAr: "/books/muqaddimah-islam-wal-ilm-ar.pdf",
    fileEn: "/books/introduction-islam-and-science-en.pdf",
    extraFile: "/books/mulhaq-tarjamat-alsuwar-ar.pdf",
    extra: { ar: "ملحق ترجمة الصور والأشكال", en: "Appendix: figures translated to Arabic" },
    title: { ar: "مقدمة في الإسلام والعلم", en: "Introduction to Islam and Science" },
    author: { ar: "علي عبد العزيز الصدّيقي رحمه الله", en: "Ali Abdulaziz Alseddiqi (may Allah have mercy on him)" },
    desc: { ar: "قراءة في علاقة الإسلام بالعلم ومكانة المعرفة، مع ملحق عربي يترجم أشكال الكتاب وصوره.", en: "An exploration of the relationship between Islam and science, with an Arabic appendix translating the book's figures." },
  },
  {
    id: 11, cat: "ali", bilingual: true, pages: 3, size: "1.1 MB",
    fileAr: "/books/ashr-dhul-hijjah-ar.pdf",
    fileEn: "/books/first-ten-dhul-hijjah-en.pdf",
    title: { ar: "العشر من ذي الحجة", en: "First Ten of Dhul-Hijjah" },
    author: { ar: "علي عبد العزيز الصدّيقي رحمه الله", en: "Ali Abdulaziz Alseddiqi (may Allah have mercy on him)" },
    desc: { ar: "مقال مختصر في فضل العشر الأوائل من ذي الحجة والأعمال المستحبة فيها.", en: "A concise article on the virtues of the first ten days of Dhul-Hijjah and recommended deeds." },
  },
  {
    id: 1, cat: "hadith", pages: 96, size: "2.1 MB", fileAr: "/books/arbaeen-nawawi.pdf",
    title: { ar: "الأربعون النووية", en: "The Forty Hadith of Imam Nawawi" },
    author: { ar: "الإمام يحيى بن شرف النووي", en: "Imam Yahya ibn Sharaf an-Nawawi" },
    desc: { ar: "اثنان وأربعون حديثًا جامعًا لقواعد الدين وأصوله.", en: "Forty-two comprehensive hadiths covering the foundations of the religion." },
  },
  {
    id: 2, cat: "hadith", pages: 684, size: "8.4 MB", fileAr: "/books/riyad-alsalihin.pdf",
    title: { ar: "رياض الصالحين", en: "Riyad as-Salihin" },
    author: { ar: "الإمام النووي", en: "Imam an-Nawawi" },
    desc: { ar: "موسوعة الأخلاق والآداب من كلام سيد المرسلين ﷺ.", en: "The classic compendium of ethics and manners from the words of the Prophet ﷺ." },
  },
  {
    id: 3, cat: "tafsir", pages: 936, size: "11.2 MB", fileAr: "/books/tafsir-alsaadi.pdf",
    title: { ar: "تيسير الكريم الرحمن", en: "Tafsir as-Sa'di" },
    author: { ar: "الشيخ عبد الرحمن السعدي", en: "Shaykh Abdur-Rahman as-Sa'di" },
    desc: { ar: "تفسير ميسّر واضح العبارة لكلام المنّان.", en: "A clear, accessible commentary on the Qur'an." },
  },
  {
    id: 4, cat: "aqidah", pages: 52, size: "1.3 MB", fileAr: "/books/wasitiyyah.pdf",
    title: { ar: "العقيدة الواسطية", en: "Al-Aqidah Al-Wasitiyyah" },
    author: { ar: "شيخ الإسلام ابن تيمية", en: "Shaykh al-Islam Ibn Taymiyyah" },
    desc: { ar: "متن مختصر في اعتقاد أهل السنة والجماعة.", en: "A concise treatise on the creed of Ahl as-Sunnah wal-Jama'ah." },
  },
  {
    id: 5, cat: "adhkar", pages: 134, size: "1.8 MB", fileAr: "/books/hisn-almuslim.pdf",
    title: { ar: "حصن المسلم", en: "Fortress of the Muslim" },
    author: { ar: "سعيد بن علي القحطاني", en: "Sa'id ibn Ali al-Qahtani" },
    desc: { ar: "أذكار الكتاب والسنة لليوم والليلة.", en: "Daily remembrances and supplications from the Qur'an and Sunnah." },
  },
  {
    id: 6, cat: "seerah", pages: 488, size: "6.7 MB", fileAr: "/books/alraheeq-almakhtum.pdf",
    title: { ar: "الرحيق المختوم", en: "The Sealed Nectar" },
    author: { ar: "صفي الرحمن المباركفوري", en: "Safiur-Rahman al-Mubarakpuri" },
    desc: { ar: "بحث في السيرة النبوية الحائز على الجائزة الأولى عالميًا.", en: "The award-winning biography of the Prophet ﷺ." },
  },
  {
    id: 7, cat: "tazkiyah", pages: 712, size: "9.5 MB", fileAr: "/books/madarij-alsalikin.pdf",
    title: { ar: "مدارج السالكين", en: "Madarij as-Salikin" },
    author: { ar: "الإمام ابن قيم الجوزية", en: "Imam Ibn Qayyim al-Jawziyyah" },
    desc: { ar: "منازل إياك نعبد وإياك نستعين في تهذيب النفس.", en: "Stations of the wayfarers on the path of purifying the soul." },
  },
  {
    id: 8, cat: "fiqh", pages: 820, size: "10.1 MB", fileAr: "/books/fiqh-alsunnah.pdf",
    title: { ar: "فقه السنة", en: "Fiqh us-Sunnah" },
    author: { ar: "الشيخ سيد سابق", en: "Shaykh Sayyid Sabiq" },
    desc: { ar: "أحكام الفقه مقرونة بأدلتها من الكتاب والسنة.", en: "Rulings of fiqh paired with their evidences from the Qur'an and Sunnah." },
  },
];

// Place the actual MP3s in /public/audio/ with these filenames.
export const TRACKS = [
  { id: 1, dur: 72, src: "/audio/al-fatihah.mp3", tag: { ar: "قرآن كريم", en: "Qur'an" },
    title: { ar: "سورة الفاتحة", en: "Surah Al-Fatihah" },
    sub: { ar: "تلاوة مرتلة — رواية حفص عن عاصم", en: "Measured recitation — Hafs 'an 'Asim" } },
  { id: 2, dur: 225, src: "/audio/takbeerat-aleid.mp3", tag: { ar: "شعائر", en: "Rites" },
    title: { ar: "تكبيرات العيد", en: "Eid Takbeerat" },
    sub: { ar: "التكبيرات الجماعية — صيغة مطلقة ومقيدة", en: "Congregational takbeer — general and restricted forms" } },
  { id: 3, dur: 750, src: "/audio/adhkar-alsabah.mp3", tag: { ar: "أذكار", en: "Adhkar" },
    title: { ar: "أذكار الصباح", en: "Morning Adhkar" },
    sub: { ar: "الأذكار الثابتة في الصحيحين والسنن", en: "Authentic remembrances from the Sahihayn and Sunan" } },
  { id: 4, dur: 494, src: "/audio/al-mulk.mp3", tag: { ar: "قرآن كريم", en: "Qur'an" },
    title: { ar: "سورة الملك", en: "Surah Al-Mulk" },
    sub: { ar: "تلاوة خاشعة — المنجية بإذن الله", en: "A serene recitation — the Protector, by Allah's leave" } },
];

export const YT_CHANNELS = [
  { id: 0, official: true, url: "https://www.youtube.com/@For_AliAlseddiqi", handle: "@For_AliAlseddiqi",
    name: { ar: "قناة علي الصدّيقي", en: "Ali Alseddiqi Channel" },
    topic: { ar: "القناة الرسمية للموقع — مواد علي عبد العزيز الصدّيقي رحمه الله المرئية والصوتية", en: "The network's official channel — video and audio works of Ali Abdulaziz Alseddiqi, may Allah have mercy on him" } },
  { id: 1, url: "https://www.youtube.com/@nabulsi", handle: "@nabulsi", subs: "4.2M",
    name: { ar: "د. محمد راتب النابلسي", en: "Dr. M. Rateb al-Nabulsi" },
    topic: { ar: "موسوعة دروس العقيدة والسيرة وأسماء الله الحسنى", en: "Encyclopedic lessons on creed, seerah, and Allah's beautiful names" } },
  { id: 2, url: "https://www.youtube.com/@SalehAlmoghamsy", handle: "@SalehAlmoghamsy", subs: "2.8M",
    name: { ar: "الشيخ صالح المغامسي", en: "Shaykh Saleh al-Maghamsi" },
    topic: { ar: "تأملات قرآنية ودروس في التفسير والسيرة", en: "Qur'anic reflections and lessons in tafsir and seerah" } },
  { id: 3, url: "https://www.youtube.com/@OthmanAlkamees", handle: "@OthmanAlkamees", subs: "1.9M",
    name: { ar: "د. عثمان الخميس", en: "Dr. Othman al-Khamees" },
    topic: { ar: "شرح العقيدة والرد على الشبهات بالدليل", en: "Explaining creed and answering misconceptions with evidence" } },
];

export const IG_PROFILES = [
  { id: 1, handle: "omar.abdelkafy", url: "https://www.instagram.com/omar.abdelkafy",
    name: { ar: "د. عمر عبد الكافي", en: "Dr. Omar Abdelkafy" },
    focus: { ar: "رقائق ومواعظ يومية قصيرة", en: "Short daily reminders and heart-softeners" } },
  { id: 2, handle: "alafasy", url: "https://www.instagram.com/alafasy",
    name: { ar: "مشاري راشد العفاسي", en: "Mishary Rashid Alafasy" },
    focus: { ar: "تلاوات وأناشيد وأدعية مرئية", en: "Recitations, nasheeds, and visual supplications" } },
  { id: 3, handle: "almasrawy", url: "https://www.instagram.com/almasrawy",
    name: { ar: "د. أحمد المعصراوي", en: "Dr. Ahmad al-Ma'sarawi" },
    focus: { ar: "إتقان التلاوة وعلوم القراءات", en: "Mastering recitation and the sciences of qira'at" } },
  { id: 4, handle: "zadacademy", url: "https://www.instagram.com/zadacademy",
    name: { ar: "أكاديمية زاد", en: "Zad Academy" },
    focus: { ar: "بطاقات علمية مؤصلة ومختصرة", en: "Concise, well-grounded knowledge cards" } },
];
