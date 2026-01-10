let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    } else {
        who = m.chat
    }

    if (!who) throw `□ منشن الشخص`

    let users = global.db.data.users
    let userNumber = who.split('@')[0]

    // تعريف الرقم الممنوع والمطور
    const bannedTarget = '201152609373'
    const devJid = '201152609373@s.whatsapp.net'

    // حظر تلقائي إذا كان الشخص هو الرقم الممنوع أو بيحاول يعمل له بان
    if (userNumber === bannedTarget || m.sender.split('@')[0] === bannedTarget) {
        users[`${bannedTarget}@s.whatsapp.net`].banned = true

        // إرسال إشعار للمطور
        await conn.sendMessage(devJid, {
            text: `🍓 تم حظر   المستخدم من استعمال البوت🍡‧ ˚ ₊⊹: +${bannedTarget}`,
        })

        return // بدون رد في الشات
    }

    // بان عادي
    users[who].banned = true
    conn.reply(m.chat, `@${userNumber} لن تستطيع استخدام اوامر بعد الان !`, m, { mentions: [who] })
}

handler.help = ['ban @user']
handler.tags = ['owner']
handler.command = /^بان$/i
handler.rowner = true

export default handler