function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms % 3600000 / 60000);
    let s = Math.floor(ms % 60000 / 1000);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

import pkg from '@fizzxydev/baileys-pro';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

const handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender);
    let { bank, exp, health } = user;
    
    let wealth = '🪙 *مفلس* 😭';
    if (bank > 3000) wealth = '💼 *فقير 😞*';
    if (bank > 6000) wealth = '🧑‍💼 *موظف حكومي*';
    if (bank > 100000) wealth = '🤴🏼 *رجل أعمال*';
    if (bank > 1000000) wealth = '💸 *غني*';
    if (bank > 10000000) wealth = '🤑 *مليونير*';
    if (bank > 1000000000) wealth = '💰 *ملياردير*';

    let response = `╭━━━══━━❪🏦❫━━══━━━╮
┃ 💎 ˼ الــــبــــنــــك ╿↶ 💎
┃  الاسم: ${name}
┃ 💰 الرصيد: ${bank} دولار
┃ 🎖 الثروة: ${wealth}
┃ ❤️ الصحة: ${health}/1000
┃ ✨ الخبرة: ${exp} XP
╰━━━══━━❪🏦❫━━══━━━╯
┃ 📜 نصائح مالية:
┃ 🏦 اكتب ⟪ .إيداع ⟫ لإيداع المال في البنك!
┃ 💸 اكتب ⟪ .سحب ⟫ لسحب الأموال!
╰━━━══━━❪💳❫━━══━━━╯`;

    const imageUrl = 'https://files.catbox.moe/zacb89.jpg'; 

    await conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: { title: 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻` },
                    body: { text: response, subtitle: " 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊" },
                    header: {
                        hasMediaAttachment: true,
                        ...(await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer }, { quoted: m }))
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"💰 الـبـنـك\",\"id\":\"${usedPrefix}بنك\"}`
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"🏆 الـمـسـتـوى\",\"id\":\"${usedPrefix}لفل\"}`
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"💳 مـحـفـظـتـي\",\"id\":\"${usedPrefix}محفظة\"}`
                            }
                        ]
                    },
                    messageParamsJson: '𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊'
                }
            }
        }
    }, {});
}

handler.help = ['البنك'];
handler.tags = ['economy'];
handler.command = ['البنك', 'بنك'];

export default handler;