import { canLevelUp, xpRange } from '../lib/levelling.js';

const handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return conn.sendMessage(m.chat, { text: "❌ *حدث خطأ في جلب بياناتك!*" }, { quoted: m });

    let { exp = 0, level = 0, role = "🌱 مبتدئ", money = 0, health = 1000 } = user;
    let { min, xp, max } = xpRange(level, global.multiplier);
    let name = conn.getName(m.sender);

    let remainingXP = Math.max(0, max - exp); // منع القيم السالبة

    let profileMessage = `
*╭━━━══━━❪🌏❫━━══━━━❍*  
*┃ 💠┊مـلـفـك الـشـخـصـي ┊💠┃*  
*┃ 🌏┊❝ @${m.sender.split("@")[0]} ❞┊🌏┃*  
*┃ 🌏┊معلوماتك الشخصية ┊🌏┃*  
*╰━━━══━━❪🌏❫━━══━━━❍*  

> *🎖️ المستوى:* ${level}  
> *👑 الرتبة:* ${role}  
> *💰 الرصيد:* ${money} XP  
> *📈 الخبرة:* ${exp}/${xp}  
> *❤️ الصحة:* ${health}/1000  
> *🔮 المتبقي للمستوى التالي:* ${remainingXP} XP  

*❍━━━══━━❪🌏❫━━══━━━❍*  
🔹 *واصـل الـجـهـد، أنـت مـبـدع!*  
`.trim();

    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        return conn.sendMessage(m.chat, { text: profileMessage }, { quoted: m });
    }

    let before = user.level;
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

    let nextLevelExp = xpRange(user.level + 1, global.multiplier).max;
    let remainingPoints = nextLevelExp - user.exp;

    let levelUpMessage = `
*╭━━━══━━❪🌏❫━━══━━━❍*  
*┃ 🎉┊❝ مـبـروك، تـرقـيـت! ❞┊🎉┃*  
*┃ 🌏┊❝ @${m.sender.split("@")[0]} ❞┊🌏┃*  
*┃ 🌏┊التـرقية تمـت بـنجاح ┊🌏┃*  
*╰━━━══━━❪🌏❫━━══━━━❍*  

> *🎖️ الاسم:* ${name}  
> *📊 المستوى السابق:* ${before}  
> *🌟 المستوى الحالي:* ${user.level}  
> *🎯 XP المتبقي للترقية:* ${remainingPoints}  
> *❤️ الصحة:* ${health}/1000  
> *👑 الرتبة:* ${role}  
> *💰 رصيدك:* ${money} XP  

*❍━━━══━━❪🌏❫━━══━━━❍*  
🔹 *تابع التألق، أنت رائع!*  
`.trim();

    try {
        const img = "https://files.catbox.moe/zacb89.jpg"; // الصورة التي تم طلبها
        await conn.sendMessage(
            m.chat,
            {
                image: { url: img },
                caption: levelUpMessage,
                mentions: conn.parseMention(levelUpMessage)
            },
            { quoted: m }
        );
    } catch (e) {
        m.reply(levelUpMessage);
    }
};

handler.help = ['رانك', 'lvl', 'لفل', 'level'];
handler.tags = ['xp'];
handler.command = ['رانك', 'lvl', 'لفل', 'level'];

export default handler;