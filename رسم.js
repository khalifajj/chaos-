import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) throw `🚀 *أدخل وصفًا للصورة التي تريد تخيلها.*`;

  await m.react('🎨'); // تصحيح وضع await
  await conn.sendMessage(m.chat, { text: '🎨 *يتم معالجة طلبك... لا تطلب الأمر مرة أخرى حتى يكتمل التنفيذ!*' });

  try {
    const response = await fetch(`https://image-generator-xvi.vercel.app/api/generate-image?text=${encodeURIComponent(text)}`);

    if (!response.ok) throw new Error(`⚠️ *حدث خطأ أثناء جلب الصورة (${response.status})*`);
    if (!response.headers.get("content-type")?.startsWith("image")) throw new Error("⚠️ *الاستجابة ليست صورة!*");

    const buffer = await response.buffer();
    await m.react('✅');
    await conn.sendMessage(m.chat, { image: buffer, caption: `✨ *تم إنشاء الصورة بنجاح!*` });
  } catch (error) {
    console.error(error);
    await m.react('❌');
    throw `❌ *حدث خطأ أثناء تنفيذ الطلب: ${error.message}*`;
  }
};

handler.tags = ['X V I I T A C H I'];
handler.help = ['تخيل'];
handler.command = ['تخيل', 'imagine', 'رسم'];

export default handler;