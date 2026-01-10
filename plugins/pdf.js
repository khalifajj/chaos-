import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  // إذا كان هناك نص بعد الأمر
  if (text) {
    // إرسال النص مباشرة إلى الـ API لتحويله إلى PDF
    let pdfUrl = `https://bk9.fun/tools/pdf?q=${encodeURIComponent(text)}`;

    // إرسال PDF الذي يحتوي على النص
    conn.sendFile(m.chat, pdfUrl, 'documento.pdf', '', m, false, { asDocument: true });
  } else {
    // إذا كانت الرسالة تحتوي على صورة مرفقة
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw '*⌬═━━━═⌬┋⊰😼⊱┋⌬═━━━═⌬*\n❍--> اسـتـخـدم (.pdf+الـنـص) لــي تـحـويـل الـنـص لــي مـلـف PDF\n*⌬═━━━═⌬┋⊰😼⊱┋⌬═━━━═⌬*';

    let img = await q.download?.();
    if (!img) throw "*لم أتمكن من تحميل الصورة، حاول مرة أخرى*";

    let url = await uploadImage(img);

    let docname = m.pushName || 'documento';

    // تحويل الصورة إلى PDF باستخدام الـ API
    let pdfUrl = `https://bk9.fun/tools/pdf?q=${encodeURIComponent(url)}`;

    // إرسال ملف PDF الناتج
    conn.sendFile(m.chat, pdfUrl, docname + '.pdf', '', m, false, { asDocument: true });
  }
};

handler.command = /^pdf$/i;  // عند كتابة الأمر .pdf يتم تشغيل الكود
export default handler;