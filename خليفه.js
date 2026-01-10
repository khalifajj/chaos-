import { sticker } from "../lib/sticker.js";

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // قائمة بالروابط المباشرة للصور (WEBP, GIF, PNG, etc.)
        const directImageLinks = [
            "https://files.catbox.moe/m5aw27.webp",
            // أضف المزيد من الروابط هنا...
        ];

        // اختيار رابط عشوائي
        const randomImage = directImageLinks[Math.floor(Math.random() * directImageLinks.length)];

        // إنشاء الملصق
        const stiker = await sticker(null, randomImage, `𝒁𝒂𝒐𝒇𝒂𝒏 🐦‍🔥`, `🦦`);
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
handler.customPrefix = /^(ياه)$/i
handler.command = new RegExp; 
handler.owner = true; 
export default handler;