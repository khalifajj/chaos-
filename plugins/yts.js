import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@fizzxydev/baileys-pro'
import yts from 'yt-search';
import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    const device = await getDevice(m.key.id);
    
    let faketext = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: m.sender
      },
      message: {
        conversation: '⋄┄┄⟡ 〘 بحــث اليــوتيوب 〙 ⟡┄┄⋄'
      },
      participant: '0@s.whatsapp.net',
    };

    const infotext = `*╭─═[ ⚠️ تنبيه ]═─╮*
*❖ يرجي إدخال نص للبحث في اليوتيوب*
*╰──────────────╯*
مثال :
⟡ ${usedPrefix + command} القرآن الكريم
⟡ ${usedPrefix + command} https://youtu.be/...

`;

    if (!text) return conn.sendMessage(m.chat, {text: infotext, mentions: [m.sender]}, { quoted: faketext });

    if (device !== 'desktop' || device !== 'web') {      
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const results = await yts(text);
        const videos = results.videos.slice(0, 30);
        const randomIndex = Math.floor(Math.random() * videos.length);
        const randomVideo = videos[randomIndex];

        var messa = await prepareWAMessageMedia({ image: {url: randomVideo.thumbnail}}, { upload: conn.waUploadToServer });

        const imagurl = 'https://files.catbox.moe/zacb89.jpg';
        let chname = '𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻';
        let chid = '120363420242552568@newsletter';
        
        const captain = `
╭─═[ ⎙ نتائج البحث ]═─╮
⟡ العنوان: ${randomVideo.title}
⟡ الصانع: ${randomVideo.author.name}
⟡ المشاهدات: ${randomVideo.views}
⟡ الرابط: ${randomVideo.url}
⟡ البوستر: ${randomVideo.thumbnail}
╰────────────────────╯

> 💡 اختر من القائمه بالأسفل.
        `;

        const interactiveMessage = {
          body: { text: captain },
          footer: { text: `${global.wm}`.trim() },  
          header: {
              title: `*⋄┄┄┄┄┄┄┄⟡ بحـث اليـوتيوب ⟡┄┄┄┄┄┄┄⋄*`,
              hasMediaAttachment: true,
              imageMessage: messa.imageMessage,
          },
          contextInfo: {
            mentionedJid: await conn.parseMention(captain), 
            isForwarded: true, 
            forwardingScore: 1, 
            forwardedNewsletterMessageInfo: {
              newsletterJid: chid, 
              newsletterName: chname, 
              serverMessageId: 100
            },
            externalAdReply: {
              showAdAttribution: true,
              title: "⟡ بحـث اليـوتيوب ⟡",
              body: "❲ قسم البحث ❳",
              thumbnailUrl: imagurl,
              mediaUrl: imagurl,
              mediaType: 1,
              sourceUrl: 'https://www.atom.bio/shawaza-2000/',
              renderLargerThumbnail: false
            }
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: '⋄┄┄⟡ قائمة النتائج ⟡┄┄⋄',
                  sections: videos.map((video) => ({
                    title: video.title,
                    rows: [
                      {
                        header: '',
                        title: '',
                        description: '〘 🎧 صــوتي 〙',
                        id: `.ytmp3 ${video.url}`
                      },
                      {
                        header: '',
                        title: '',
                        description: '〘 🎥 فيــديو 〙',
                        id: `. ytmp4 ${video.url}`
                      },
                    ]
                  }))
                })
              }
            ],
            messageParamsJson: ''
          }
        };        
        
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        }, { userJid: conn.user.jid, quoted: faketext });
        
        await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
        conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } else {
        const results = await yts(text);
        const tes = results.all;

        const teks = results.all.map((v) => {
          switch (v.type) {
            case 'video': return `
⟡ *العنوان:* ${v.title}
⟡ *الرابط:* ${v.url}
⟡ *المدة:* ${v.timestamp}
⟡ *منذ:* ${v.ago}
⟡ *المشاهدات:* ${v.views}`;
          }
        }).filter((v) => v).join('\n\n━━━━━━━━━━━━━━━\n\n');

        conn.sendFile(m.chat, tes[0].thumbnail, 'result.jpg', teks.trim(), faketext);      
    }    
};
//╰━━━═⟡〘 فــوريـنـا • نـهاية الكـود 〙⟡═━━━╯

handler.help = ['يوتيوب <النص>'];
handler.tags = ['البحث'];
handler.command = ['يوتيوب'];

export default handler;