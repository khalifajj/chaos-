import { getUrlFromDirectPath } from "@fizzxydev/baileys-pro";

function formatDate(t) {
    if (!t) return 'غير معروف';
    try {
        const adjusted = t < 1e12 ? t * 1000 : t;
        return new Date(adjusted).toLocaleString('ar-EG', {
            timeZone: 'Africa/Cairo',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    } catch {
        return 'تاريخ غير صالح';
    }
}

let handler = async (m, { conn, text }) => {
    let code = text?.match(/whatsapp\.com\/(?:channel\/)?([^/?]+)/i)?.[1];
    if (!code) return conn.reply(m.chat, "⚠️ أدخل رابط صحيح مثل:\nwhatsapp.com/channel/123456", m);

    try {
        let data = await conn.newsletterMetadata("invite", code);
        if (!data?.id) return conn.reply(m.chat, "❌ الرابط غير صحيح أو القناة غير موجودة", m);

        let info = [];
        info.push(`📛 الاسم: ${data.name || 'بدون اسم'}`);
        info.push(`⏳ آخر تحديث للاسم: ${formatDate(data.nameTime)}`);
        info.push(`🌀 اليوزر: ${data.handle ? '@' + data.handle : 'غير متاح'}`);
        info.push(`🆔 المعرف: ${data.id}`);
        info.push(`👥 المتابعون: ${(data.subscribers || 0).toLocaleString('ar')}`);
        info.push(`📅 التأسيس: ${formatDate(data.creation_time)}`);
        info.push(`✅ التحقق: ${data.verification === "VERIFIED" ? 'موثقة' : 'لا'}`);
        info.push(`🚦 الحالة: ${data.state ? 'نشطة' : 'مغلقة'}`);
        info.push(`📝 الوصف: ${data.description || 'لا يوجد وصف'}`);
        info.push(`⏳ آخر تحديث للوصف: ${formatDate(data.descriptionTime)}`);

        if (data.viewer_metadata) {
            const vm = data.viewer_metadata;
            info.push(`🔇 الكتم: ${vm.mute ? 'مفعّل' : 'غير مفعّل'}`);
            info.push(`📡 المتابعة: ${vm.follow_state === 'FOLLOWING' ? 'متابع' : 'غير متابع'}`);
        }

        if (data.reactions?.length) info.push(`🎚️ التفاعلات المسموحة: ${data.reactions.join(', ')}`);

        let imgUrl;
        if (data.preview) {
            try {
                imgUrl = getUrlFromDirectPath(data.preview);
            } catch {}
        }

        let admins = [];
        try {
            let res = await conn.newsletterAdminList(data.id);
            admins = res.admins.map(a => `@${a.jid.split('@')[0]}`);
        } catch {}
        if (admins.length) info.push(`\n👑 المشرفون (${admins.length}):\n${admins.join('\n')}`);

        let updates = [];
        try {
            let upRes = await conn.newsletterFetchUpdates(data.id, 3);
            updates = upRes.updates.map(u => `• ${formatDate(u.updateTime)}: ${u.updateType.replace(/_/g, ' ')}`);
        } catch {}
        if (updates.length) info.push(`\n🔄 آخر التحديثات:\n${updates.join('\n')}`);

        const msg = `*📊 تقرير القناة 📊*\n\n${info.join('\n')}`;
        const opts = {
            caption: msg,
            mentions: admins,
            contextInfo: { 
                externalAdReply: {
                    title: data.name || "قناة واتساب",
                    body: 'تفاصيل القناة على واتساب',
                    thumbnailUrl: imgUrl,
                    renderLargerThumbnail: true, // تكبير الصورة المصغرة
                    mediaType: 1,
                    mediaUrl: `https://whatsapp.com/channel/${data.id}`,
                    sourceUrl: `https://whatsapp.com/channel/${data.id}`
                }
            }
        };

        conn.sendMessage(m.chat, { text: msg, ...opts }, { quoted: m });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, "❌ حدث خطأ غير متوقع", m);
    }
};

handler.help = ["قناتو"];
handler.command = /^قناتو$/i;
export default handler;