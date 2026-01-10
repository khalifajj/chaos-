import fetch from 'node-fetch';
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@fizzxydev/baileys-pro';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let appName = args.join(' ').trim();
    
    if (!appName) return m.reply(`⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰
> ❗ *يرجى كتابة اسم التطبيق الذي تريد البحث عنه!*
>  مثال:
> ➤  ${usedPrefix + command} Free Fire
> ➤  ${usedPrefix + command} WhatsApp
⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰`);

    try {
        await m.react('🔍');
        
        const apiUrl = `https://api-streamline.vercel.app/dlapk?search=${encodeURIComponent(appName)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data || !data.id) return m.reply('⊱⊹•🚫 لم يتم العثور على التطبيق 😔•⊹⊰');

        let { name, file, icon } = data;
        let teksnya = `⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰
📱 *اسم التطبيق:* ${name}
💾 *حجم الملف:* ${file.size || "غير متوفر"}
⊱⊹•─๋︩︪╾─•┈⧽ 🀄 ⧼┈•─╼─๋︩︪•⊹⊰`;

        const { imageMessage } = await prepareWAMessageMedia(
            { image: { url: icon } },
            { upload: conn.waUploadToServer }
        );

        const messageContent = {
            buttonsMessage: {
                contentText: teksnya,
                footerText: ' 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻',
                buttons: [
                    {
                        buttonId: `.تحميل_هنا ${file.path}`,
                        buttonText: { displayText: '📥 تحميل هنا' },
                        type: 1
                    },
                    {
                        buttonId: `.تحميل_خاص ${file.path}`,
                        buttonText: { displayText: '📩 تحميل خاص' },
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
                ephemeralMessage: { message: messageContent }
            },
            { userJid: conn.user.id }
        );

        await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });

    } catch (error) {
        console.error("⚠️ حدث خطأ أثناء البحث:", error);
        await conn.sendMessage(m.chat, { text: "🚨 عذرًا، حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى لاحقًا." });
    }
}

handler.command = ['تطبيق', 'apk', 'بحث_تطبيق'];

export default handler;