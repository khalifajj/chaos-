import { generateWAMessageFromContent } from '@fizzxydev/baileys-pro'

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  let fakegif = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: m.chat } : {})
    },
    message: {
      videoMessage: {
        title: ' 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊😼',
        h: 'Hmm',
        seconds: 99999,
        gifPlayback: true,
        caption: '❞ 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻┊😼',
        jpegThumbnail: Buffer.alloc(0)
      }
    }
  }

  try {
    let users = participants.map(u => conn.decodeJid(u.id))
    let q = m.quoted ? m.quoted : m || m.text
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text

    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted
            ? c.message[q.mtype]
            : { text: text || '' }
        },
        { quoted: fakegif, userJid: conn.user.id }
      ),
      text || q.text,
      conn.user.jid,
      { mentions: users }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch (e) {
    console.error('[❌ مخفي]:', e)
    if (e.message && e.message.includes('No sessions')) {
      await m.reply('⚠️ لا يمكن إرسال الرسالة لبعض الأعضاء بسبب عدم وجود جلسة تشفير معهم.\nيرجى المحاولة لاحقًا أو التأكد من تفاعل الأعضاء مع البوت.')
    } else {
      await m.reply('❌ حدث خطأ أثناء تنفيذ الأمر.\n' + e.message)
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notificar|مخفي)$/i
handler.group = true
handler.admin = true

export default handler