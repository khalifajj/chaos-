import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('🚨 *يرجى إدخال رابط فيديو فيسبوك لتحميله.*\n\n📌 *مثال:*\n`.فيس https://www.facebook.com/video...`');

    let url = args[0];

    if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
        return m.reply('❌ *الرابط المدخل ليس رابط فيديو فيسبوك صالح.*');
    }

    try {
        await m.react('⏳');

        // 🛠 جلب بيانات الفيديو من API
        const apiUrl = `https://bk9.fun/download/fb?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`❌ فشل في الاتصال بالـ API. الحالة: ${response.status}`);
        }

        const result = await response.json();
        console.log('🔍 استجابة API:', JSON.stringify(result, null, 2));

        // ✅ التحقق من صحة الاستجابة
        if (!result || !result.status || !result.BK9) {
            throw new Error(`❌ لم يتم العثور على رابط تحميل.\n🔍 استجابة API: ${JSON.stringify(result, null, 2)}`);
        }

        const videoSD = result.BK9.sd;
        const videoHD = result.BK9.hd;
        const thumb = result.BK9.thumb;
        const title = result.BK9.title && result.BK9.title !== "No video title" ? result.BK9.title : '🎬 فيديو من فيسبوك';
        const description = result.BK9.desc && result.BK9.desc !== "No video description..." ? result.BK9.desc : '📌 لا يوجد وصف متاح.';

        // 📩 إرسال رسالة الأزرار
        const buttons = [
            { buttonId: `.تحميل ${videoHD}`, buttonText: { displayText: '📹 تحميل بجودة HD' }, type: 1 },
            { buttonId: `.تحميل ${videoSD}`, buttonText: { displayText: '📹 تحميل بجودة SD' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: thumb },
            caption: `🎬 *العنوان:* ${title}\n📝 *الوصف:* ${description}\n\n📌 *اختر الجودة المطلوبة:*`,
            footer: '🧚🏻‍♀️ 𝙼𝙸𝙺𝙾 𝙱𝙾𝚃 🧚🏻‍♀️',
            buttons: buttons,
            headerType: 4
        };

        await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
        await m.react('✅');

    } catch (error) {
        console.error("❌ خطأ أثناء التحميل:", error);
        await m.react('❌');
        await conn.reply(m.chat, `⚠️ *حدث خطأ أثناء التحميل:*\n\n${error.message}\n\n📌 *سيتم إرسال الفيديو مباشرة...*`);

        // 🚀 إرسال الفيديو مباشرة إذا فشلت الأزرار
        try {
            const videoUrl = result.BK9.hd || result.BK9.sd;
            if (videoUrl) {
                await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: '🎬 *تم التحميل بنجاح!*' }, { quoted: m });
            } else {
                await conn.reply(m.chat, '❌ *لم يتم العثور على رابط فيديو صالح.*');
            }
        } catch (err) {
            console.error("❌ خطأ أثناء إرسال الفيديو:", err);
        }
    }
};

handler.command = ['فيس']; // الأمر المستخدم
export default handler;