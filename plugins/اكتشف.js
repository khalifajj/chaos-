import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data'; // استيراد FormData

let handler = async (m, { conn, args }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!/audio|video/.test(mime)) return m.reply('🎧︙ارسل مقطع صوتي أو فيديو وأرد عليه ب `.اكتشف`');

  let media = await q.download();
  let fileName = `./tmp_${Date.now()}`;
  fs.writeFileSync(fileName, media);

  let form = new FormData();
  form.append('file', fs.createReadStream(fileName));
  form.append('api_token', 'dea08c7abbc0203c56afcee65273062b');

  try {
    let res = await fetch('https://api.audd.io/', {
      method: 'POST',
      body: form
    });

    let json = await res.json();
    
    if (json.status !== 'success' || !json.result) return m.reply('❌︙ما قدرت أتعرف على الأغنية');

    let result = json.result;
    let msg = `😼 ︙تم التعرف على الأغنية:\n\n` +
              `😼  الاسم: *${result.title}*\n` +
              `👤 الفنان: *${result.artist}*\n` +
              (result.album ? `💿 الألبوم: *${result.album}*\n` : '') +
              (result.release_date ? `🗓️ تاريخ الإصدار: *${result.release_date}*\n` : '') +
              (result.song_link ? `🔗 رابط: ${result.song_link}` : '');

    m.reply(msg);

  } catch (err) {
    console.error(err);
    m.reply('❌︙حدث خطأ أثناء التعرف على الأغنية');
  } finally {
    fs.unlinkSync(fileName); // حذف الملف المؤقت
  }
};

handler.command = /^اكتشف$/i;
export default handler;