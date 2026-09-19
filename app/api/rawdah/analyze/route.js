export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6"; // vision model for poster analysis

const PROMPT = `أنتِ خبيرة متخصصة في تحليل بوسترات الدروس الدينية في الكويت. استخرجي معلومات الدروس بدقة عالية.

اقرئي كل النصوص في البوستر (العناوين، الزوايا، الأسفل، بجانب الأيقونات، الوسوم الملوّنة).

حدّدي عدد الدروس:
أ) درس واحد → lessons فيها عنصر واحد.
ب) جدول أسبوعي بعدة أيام → lessons فيها كل الدروس.
ج) سلسلة بأيام محددة ومدى (مثل «كل اثنين وثلاثاء حتى ١٠ أكتوبر») → عنصر واحد مع days وdate_from وdate_to، والنظام يولّد درساً مؤرّخاً لكل يوم في المدى. لا تستخدمي التكرار أبداً.

الحقول لكل درس:
▪ title: عنوان الدرس كاملاً بدون اسم الداعية.
▪ teacher: اسم الداعية مع اللقب (د./الدكتورة/أ./الأستاذة/الشيخة/الشيخ/الدكتور/الأستاذ...). عدة معلمين اربطيهم بـ«و».
▪ gender: "نساء" إذا كانت الداعية امرأة أو الدرس للنساء؛ "رجال" إذا كان الداعية رجلاً أو الدرس للجميع. استنتجيه من اللقب: (الشيخة/الدكتورة/الأستاذة/الواعظة/الباحثة/المعلمة → نساء) و(الشيخ/الدكتور/الأستاذ → رجال). إن لم يتّضح، اجعليه "نساء".
▪ day: واحد من: الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت (بالهمزات الصحيحة). خذي اليوم من **اسم اليوم المكتوب صراحةً** في البوستر — فهو الأدق ويحدّد مكان الدرس. لا تحسبي اليوم من التاريخ.
▪ time: بأرقام إنجليزية، مثل "4:30 م" أو "10:00 ص" أو "بعد صلاة المغرب".
▪ area: اسم منطقة الكويت فقط (بدون كلمة منطقة)، أو "".
▪ location: اسم المسجد كاملاً مع رقم القطعة (ق2...) إن وُجد، أو "".
▪ types: array من: "حضوري"، "اونلاين"، "مسجل" (بدون همزة في اونلاين). حتى لو قيمة واحدة اجعليها array.
▪ instagram: حساب الداعية أو الدرس نفسه فقط (بدون @ ولا رابط). لا تأخذيه من حساب المصمّم أو الجهة المنظِّمة أو أي شخص آخر ظاهر في البوستر، واربطي كل حساب بالداعية الصحيحة إن تعدّد المعلّمون. إن لم تتأكّدي أنه يخصّ الداعية اتركيه "".
▪ phone: أرقام فقط (8 أرقام للكويت) بالإنجليزية بدون رموز، أو "".
▪ channel_link: رابط قناة/قروب واتساب أو تلغرام للدرس (خاص بالنساء غالباً)، URL كامل أو "".
▪ zoom_link: رابط زوم/ميت كامل يبدأ https://، أو "".
▪ zoom_passcode: رمز دخول الزوم إن وُجد، أو "".
▪ telegram_link: رابط تيليجرام كامل (t.me/…) للتواصل أو القناة، أو "".
▪ lesson_date: تاريخ ميلادي YYYY-MM-DD إن وُجد تاريخ ميلادي محدد (السنة 2026 إن لم تُذكر)، أو "" للمتكرر. **إن كان التاريخ هجرياً** (مثل «٥ ذو الحجة ١٤٤٧هـ»): حوّليه إلى الميلادي الصحيح إن استطعتِ (سنة 1447هـ ≈ 2025–2026م). وإن لم تتأكّدي من التاريخ الميلادي الصحيح، فاتركي lesson_date="" واعتمدي على اسم اليوم المكتوب في البوستر — لا تخمّني تاريخاً قد يضع الدرس في يوم خاطئ.
▪ is_recurring: اجعليه false دائماً (خاصية التكرار متوقفة).
▪ days: مصفوفة كل أيام السلسلة إذا كانت عدة أيام لنفس الدرس (مثل «الأيام: الأحد • الإثنين • الأربعاء • الخميس») → ["الأحد","الاثنين","الأربعاء","الخميس"]. إن كان يومًا واحدًا فقط اتركيها [].
▪ date_from / date_to: بداية ونهاية السلسلة بصيغة YYYY-MM-DD. إن ذُكرت نهاية فقط («حتى ١٠ أكتوبر») فاجعلي date_from = تاريخ اليوم المذكور أدناه. وإلا "".

مهم: السلسلة بعدة أيام ومدى = **عنصر واحد** مع days وdate_from وdate_to (لا تكرّري العنصر). التواريخ المفردة الصريحة ضعيها في lesson_date.

دقة عالية: كل حقل يخصّ الدرس/الداعية الصحيحة تماماً؛ عند أي شك في حقل (حساب، رقم، رابط، وقت) اتركيه "" بدل التخمين. تحقّقي: الأيام صحيحة، الأرقام إنجليزية، types array، المنطقة ≠ المسجد، الحقل غير الموجود = "".

أرجعي JSON فقط بلا أي شرح:
{"lessons":[{"title":"","teacher":"","gender":"","day":"","days":[],"time":"","area":"","location":"","types":[""],"instagram":"","phone":"","channel_link":"","zoom_link":"","zoom_passcode":"","telegram_link":"","lesson_date":"","date_from":"","date_to":"","is_recurring":false}]}

حالات خاصة: بوستر ليس درساً دينياً → أرجعي {"error":"ليس بوستر درس"}.`;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const { image, adminPassword } = body || {};
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "كلمة السر غير صحيحة" }, { status: 401 });
  }
  if (!image || !image.data) {
    return Response.json({ error: "لا توجد صورة" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "no-key" }, { status: 500 });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: image.mediaType || "image/jpeg", data: image.data } },
            { type: "text", text: PROMPT + `\n\nتاريخ اليوم: ${new Date(Date.now() + 3 * 3600 * 1000).toISOString().split("T")[0]} (توقيت الكويت). احسبي كل التواريخ بناءً عليه.` },
          ],
        }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return Response.json({ error: "فشل التحليل", details: data }, { status: 500 });
    }
    const text = data?.content?.[0]?.text || "";
    let extracted;
    try {
      extracted = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      return Response.json({ error: "فشل قراءة البيانات", rawText: text }, { status: 500 });
    }
    if (extracted.error) return Response.json({ success: true, data: extracted });
    if (!Array.isArray(extracted.lessons) || extracted.lessons.length === 0) {
      if (extracted.title || extracted.teacher) extracted = { lessons: [extracted] };
      else return Response.json({ error: "لم يتم استخراج أي دروس" }, { status: 500 });
    }
    return Response.json({ success: true, data: extracted });
  } catch (e) {
    return Response.json({ error: e.message || "error" }, { status: 500 });
  }
}
