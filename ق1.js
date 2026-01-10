let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
*┃ 🌏┊❝ مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم الالعاب ❞┊🌏┃*  
   *┃ 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻┃*  
*┃ 🌏┊❝ قسم الالعاب ❞┊🌏┃*  
*┃ 🌏┊❝ القسـم يـقدم لك أوامر تخص الالعاب ❞┊🌏┃*
*╰───⊰ 🌏❀⊱───╮*  
*✦ ━━━━━ ❀🌏❀ ━━━━━ ✦*  
🌏 *القسم يقدم لك أوامر العاب*🌏  
*✦ ━━━━━ ❀🌏❀ ━━━━━ ✦*  
*╭──⊰ 🎮 قائمة الالعاب 🎮 ⊱──╮*  
🌏 ⩺ ⌟احزر⌜  
🌏 ⩺ ⌟عين⌜  
🌏 ⩺ ⌟علم⌜  
🌏 ⩺ ⌟كت⌜  
🌏 ⩺ ⌟فكك⌜  
🌏 ⩺ ⌟عاصمه⌜  
🌏 ⩺ ⌟لعبه+حجر⌜
🌏 ⩺ ⌟لعبه+مقص⌜
🌏 ⩺ ⌟لعبه+ورقه⌜
🌏 ⩺ ⌟اكس⌜
🌏 ⩺ ⌟ايموجي⌜  
🌏 ⩺ ⌟تاريخ⌜  
🌏 ⩺ ⌟سؤال⌜  
*╰──⊰ 🎮 ⊱──╯*  
*ملاحظه:لعبه اكس لسه تحت الاختبار*
*╭━─━─━─❀🌏❀─━─━─━╮*  
*┃ 🍬┊ البوت:𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻*  
*┃ 🌏┊ توقيع: 𝒀𝑶𝑼𝑺𝑺𝑬𝑭*  
*╰━─━─━─❀🌏❀─━─━─━╯*`;

  const emojiReaction = '🪁';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/zacb89.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق1)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;