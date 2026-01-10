import fetch from 'node-fetch';
let handler = async (m, {
    conn,
    usedPrefix,
    command,
    author
}) => {
    await conn.sendMessage(m.chat, {
        react: {
            text: '',
            key: m.key,
        }
    });
    
    let res = await fetch('https://api.waifu.pics/sfw/waifu');
    if (!res.ok) throw await res.text();
    
    let json = await res.json();
    if (!json.url) throw 'Error!';
    
    await conn.sendFile(m.chat, json.url, 'waifu.jpg', "𝑩𝒂 𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊ | 🐼❤️*", m);
    
    // إرسال الزر بعد الصورة
    await conn.sendMessage(m.chat, {
        text: 'اضغط علي الزر لي اعاده الامر',
        footer: author,
        buttons: [
            {buttonId: '.بنت', buttonText: {displayText: '🔄 التالي 🔄'}, type: 1}
        ],
        headerType: 1
    }, { quoted: m });
};

handler.help = ['waifu']
handler.tags = ['anime']
handler.command = /^(بنت)$/i
export default handler;