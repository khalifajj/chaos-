let handler = async (m, { conn, text }) => {
  let tagme = `https://wa.me/+${m.sender.replace(`+`)}/?text=BY+𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊`
  let mylink = [m.sender]
  conn.reply(m.chat, tagme, m, { contextInfo: { mylink }})
}
handler.help = ['منشني']
handler.tags = ['group']
handler.command = /^رابطي|لينكي$/i

handler.group = false

export default handler