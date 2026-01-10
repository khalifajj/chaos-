import fs from "fs"

async function handler(m, {usedPrefix}) {
    const user = m.sender.split("@")[0]
    if (fs.existsSync("./serbot/" + user + "/creds.json")) {
        let token = Buffer.from(fs.readFileSync("./serbot/" + user + "/creds.json"), "utf-8").toString("base64")
        await m.reply(`🔮 لا تشارك رمز التوكين الخاص بك مع أي شخص.\n📫 رمز التوكين الخاص بك هو:`)
        await m.reply(token)
    } else {
        await m.reply(`🔮 ليس لديك رمز توكين فعال.`)
    }
}

handler.command = ['رمز']
handler.help = ['token']
handler.tags = ['jadibot']
handler.registrado = true
handler.private = false

export default handler