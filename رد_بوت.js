let handler = async (m, { conn }) => {
  let audio = 'https://files.catbox.moe/bq9io7.mp3'
  let thumbnail = await (await fetch('https://files.catbox.moe/zacb89.jpg')).buffer()

  await conn.sendMessage(m.chat, {
    audio: { url: audio },
    mimetype: 'audio/mp4',
    ptt: true,
    fileName: 'forina.mp3',
    contextInfo: {
      externalAdReply: {
        title: "𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻",
        body: "𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻",
        thumbnail: thumbnail,
        mediaType: 1,
        renderLargerThumbnail: true,
        mediaUrl: "https://wa.me/201152609373",
        sourceUrl: "https://wa.me/201152609373"
      }
    }
  }, {
    quoted: m,
    buttons: [
      { buttonId: '.الاوامر', buttonText: { displayText: '🧾 عرض الأوامر' }, type: 1 }
    ],
    headerType: 1
  });
};

handler.customPrefix = /^(بوت|يا بوت)$/i;
handler.command = new RegExp;
export default handler;