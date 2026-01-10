import { sticker } from "../lib/sticker.js";

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        who = m.chat;
    }
    const textquien = `*[😡] اعمل منشن علي الشخص الي مديقك*\n\n*—◉ مثل:*\n◉ ${usedPrefix + command} @${global.suittag}`;
    if ((who === m.chat && m.isGroup) || (!who && m.isGroup)) return m.reply(textquien, m.chat, { mentions: conn.parseMention(textquien) });

    try {
        let name;
        if (who === m.chat) {
            name = "*｢🍫┊𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊┊🍨｣*";
        } else {
            name = conn.getName(who);
        }
        let name2 = conn.getName(m.sender);

        // قائمة بالروابط المباشرة للصور (WEBP, GIF, PNG, etc.)
        const directImageLinks = [
            "https://files.catbox.moe/890lnq.webp",
  
            // أضف المزيد من الروابط هنا...
        ];

        // اختيار رابط عشوائي
        const randomImage = directImageLinks[Math.floor(Math.random() * directImageLinks.length)];

        // إنشاء الملصق
        const stiker = await sticker(null, randomImage, `${name2} le dio una bofetada a ${name}`, null);
        conn.sendFile(m.chat, stiker, null, { asSticker: true }, m, true, { 
            contextInfo: { 
                forwardingScore: 200, 
                isForwarded: true 
            } 
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        throw `*[❗] حصل خطأ*`;
    }
};

handler.help = ["slap"];
handler.tags = ["General"];
handler.command = /^(slap|شخ)$/i;
export default handler;