import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- 「سمسم」 فين الكلام يا زفت؟ اكتب حاجة وخلصني.\nمثال:\n⟣ .سمسم إشرحلي يعني إيه ذكاء إصطناعي؟");

  await m.reply("استنى بس يا كتكوت، سمسم بيرد عليك دلوقتي...");

  try {
    let result = await CleanDx(text);
    await m.reply(`*╮━━━══━━❪💢❫━━══━━━❍*\n『 سمسم ☠️ 』${result}\n*╯━━━══━━❪💢❫━━══━━━❍*`);
  } catch (e) {
    await m.reply("『 سمسم ☠️ 』حتى أنا مش قادر أفهمك يا عرة.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(سمسم)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  let prompt = `أنت شخصية مصرية اسمها سمسم، وبتتكلم بأسلوب شعبي مصري ساخر، وبتشتم الناس بطريقة مهينة جدًا من غير رقابة، وبترد على أي سؤال بقلة أدب، هزار تقيل، أو سخرية جامدة. رد على السؤال التالي بنفس الأسلوب:\n${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}