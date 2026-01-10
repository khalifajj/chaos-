import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, '> *\`『 هات رابط الفديو الي هجبلك كلماتو من اليتيوب 🧚🏻‍♂️ 』\`*', m)

    try {

        let app = await fetch(`https://apis-starlights-team.koyeb.app/starlight/transcribir-youtube?url=${text}`, { headers: { 'Content-Type': 'application/json' }})

        let res = await app.json()

        if (!res.result) throw m.reply('> *\`『 الرابط مش يتيوب 』\`*')

        await conn.reply(m.chat, res.result, m)

    } catch (error) {

        // يمكنك إضافة كود للتعامل مع الأخطاء هنا إذا كنت بحاجة

    }

}

handler.help = ['كليمات *<url>*']

handler.tags = ['ادوات']

handler.command = /^(كلمات_فيديو|كتاب)$/i

export default handler