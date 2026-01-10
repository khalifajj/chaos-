const { generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@fizzxydev/baileys-pro')).default;
import yts from 'yt-search';

let handler = async (m, { conn, usedPrefix, command, text }) => {
   if (!text) return m.reply(`⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰
> ❗ *يرجى كتابة ما تريد تشغيله مع الأمر!*
> 🧚🏻‍♀️ مثال:
> ➤  ${usedPrefix + command} القرآن الكريم
> ➤  ${usedPrefix + command} أغنية هادئة
⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰`);

   try {
      await m.react('🕓');
      let search = await yts(text);
      let video = search.all[0];
      let linkyt = video.url;
      let teksnya = `⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰
📌 *العنوان:* ${video.title}
👀 *عدد المشاهدات:* ${video.views}
⏱️ *المدة:* ${video.timestamp}
📅 *تم التحميل منذ:* ${video.ago}
🔗 *الرابط:* ${linkyt}
⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰`;

      const { imageMessage } = await prepareWAMessageMedia(
            {
                image: { url: video.thumbnail }
            },
            { upload: conn.waUploadToServer }
        );

        const messageContent = {
            buttonsMessage: {
                contentText: teksnya,
                footerText: '🧚🏻‍♀️ 𝙼𝙸𝙺𝙾 𝙱𝙾𝚃 🧚🏻‍♀️',
                buttons: [
                    {
                        buttonId: `.ytmp4 ${linkyt}`,
                        buttonText: { displayText: '📹 الفيديو' },
                        type: 1
                    },
                    {
                        buttonId: `.ytmp3 ${linkyt}`,
                        buttonText: { displayText: '🎧 الصوت' },
                        type: 1
                    }
                ],
                headerType: 4,
                imageMessage: imageMessage,
            }
        };

        const message = generateWAMessageFromContent(
            m.chat,
            {
                ephemeralMessage: {
                    message: messageContent
                }
            },
            { userJid: conn.user.id }
        );

        await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
    } catch (error) {
        console.error("⚠️ حدث خطأ أثناء إرسال الرسالة:", error);
        await conn.sendMessage(m.chat, { text: "⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰\n🚨 عذرًا، حدث خطأ أثناء تنفيذ الطلب.\n⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰" });
    }
}

handler.help = ['تشغيل'].map(v => v + ' <اسم الأغنية/الفيديو>');
handler.tags = ['تحميل'];
handler.command = /^(تشغيل|شغل)$/i;

export default handler;