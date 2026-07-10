export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6"; // vision model for poster analysis

const PROMPT = `أنتِ خبيرة متخصصة في تحليل بوسترات الدروس الدينية في الكويت. استخرجي معلومات الدروس بدقة عالية.

اقرئي كل النصوص في البوستر (العناوين، الزوايا، الأسفل، بجانب الأيقونات، الوسوم الملوّنة).

حدّدي عدد الدروس:
أ) درس واحد → lessons فيها عنصر واحد.
ب) جدول أسبوعي بعدة أيام → lessons فيها كل الدروس.
ج) درس متكرر (نفس الدرس عدة أيام) → عنصر واحد باليوم الأول و is_recurring=true.

الحقول لكل درس:
▪ title: عنوان الدرس كاملاً بدون اسم الداعية.
▪ teacher: اسم الداعية مع اللقب (د./الدكتورة/أ./الأستاذة/الشيخة/الشيخ/الدكتور/الأستاذ...). عدة معلمين اربطيهم بـ«و».
▪ gender: "نساء" إذا كانت الداعية امرأة أو الدرس للنساء؛ "رجال" إذا كان الداعية رجلاً أو الدرس للجميع. استنتجيه من اللقب: (الشيخة/الدكتورة/الأستاذة/الواعظة/الباحثة/المعلمة → نساء) و(الشيخ/الدكتور/الأستاذ → رجال). إن لم يتّضح، اجعليه "نساء".
▪ day: واحد من: الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت (بالهمزات الصحيحة).
▪ time: بأرقام إنجليزية، مثل "4:30 م" أو "10:00 ص" أو "بعد صلاة المغرب".
▪ area: اسم منطقة الكويت فقط (بدون كلمة منطقة)، أو "".
▪ location: اسم المسجد كاملاً مع رقم القطعة (ق2...) إن وُجد، أو "".
▪ types: array من: "حضوري"، "اونلاين"، "مسجل" (بدون همزة في اونلاين). حتى لو قيمة واحدة اجعليها array.
▪ instagram: اسم الحساب بدون @ ولا رابط، أو "".
▪ phone: أرقام فقط (8 أرقام للكويت) بالإنجليزية بدون رموز، أو "".
▪ channel_link: رابط قناة/قروب واتساب أو تلغرام للدرس (خاص بالنساء غالباً)، URL كامل أو "".
▪ zoom_link: رابط زوم/ميت كامل يبدأ https://، أو "".
▪ zoom_passcode: رمز دخول الزوم إن وُجد، أو "".
▪ lesson_date: تاريخ ميلادي YYYY-MM-DD إن وُجد تاريخ محدد (السنة 2026 إن لم تُذكر)، أو "" للمتكرر.
▪ is_recurring: true إذا كان أسبوعياً متكرراً («كل سبت»، «أسبوعياً»)، وإلا false.

تحقّقي: الأيام صحيحة، الأرقام إنجليزية، types array، المنطقة ≠ المسجد، is_recurring=true مع تاريخ فارغ للمتكرر، الحقل غير الموجود = "" (لا تخمّني).

أرجعي JSON فقط بلا أي شرح:
{"lessons":[{"title":"","teacher":"","gender":"","day":"","time":"","area":"","location":"","types":[""],"instagram":"","phone":"","channel_link":"","zoom_link":"","zoom_passcode":"","lesson_date":"","is_recurring":false}]}

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
            { type: "text", text: PROMPT },
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
