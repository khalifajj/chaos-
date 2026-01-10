import yts from 'yt-search';
import axios from 'axios';
import fs from 'fs';

async function Ytdll(url, type) {
    const headers = {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://id.ytmp3.mobi/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    const randomKarakter = async (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    try {
        const initial = await axios.get(`https://bk9.fun/download/alldownload?url=${Math.random()}`, { headers });
        const init = initial.data;
        const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*\/shorts\/))([^&?/]+)/)?.[1];

        if (!id) throw new Error('لا يمكن استخراج معرّف الفيديو من الرابط');

        let mp4_ = init.convertURL + `&v=${id}&f=mp4&_=${Math.random()}`;
        const mp4__ = await axios.get(mp4_, { headers });

        let info = {};
        for (let i = 0; i < 3; i++) {
            let j = await axios.get(mp4__.data.progressURL, { headers });
            info = j.data;
            if (info.progress == 3) break;
        }

        // التحقق من صحة الرابط
        if (!info.BK9.high || !info.BK9.high.startsWith('https://')) {
            throw new Error('رابط الفيديو عالي الجودة غير صالح');
        }

        let result_url = info.BK9.high;  // تحديد رابط الفيديو عالي الجودة
        const buffer = await axios({ url: result_url, headers, responseType: 'arraybuffer' });
        const file_path = `./lib/${await randomKarakter(5)}.mp4`;
        fs.writeFileSync(file_path, buffer.data);

        return {
            title: info.BK9.title,
            file_path
        };
    } catch (error) {
        console.error('خطأ أثناء تحميل الفيديو:', error);
        throw new Error(`حدث خطأ أثناء تنزيل الفيديو: ${error.message}`);
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`يرجى إدخال رابط الفيديو أو اسم الفيديو
مثال: ${usedPrefix + command} مو`);

    m.reply('جارٍ البحث عن الفيديو، انتظر لحظة...');
    
    try {
        let videoUrl;

        // التحقق ما إذا كان المدخل هو رابط يوتيوب
        const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|shorts\/|.*embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = text.match(youtubeRegex);
        if (match) {
            // إذا كان المدخل رابط يوتيوب
            const videoId = match[1];
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            // إذا كان المدخل مجرد اسم الفيديو، البحث عنه
            const { videos } = await yts(text);
            if (!videos.length) {
                return m.reply('لم يتم العثور على أي فيديو باستخدام هذا العنوان.');
            }
            const firstVideo = videos[0]; // أخذ أول نتيجة من البحث
            videoUrl = firstVideo.url;
        }

        // تنزيل الفيديو باستخدام الرابط النهائي
        const { title, file_path } = await Ytdll(videoUrl, 'mp4');
        
        await conn.sendMessage(
            m.chat, 
            {
                video: fs.readFileSync(file_path),
                mimetype: 'video/mp4',
                caption: `🎬 *${title}*\n📥 تم تحميل الفيديو بنجاح.`
            }
        );
        
        fs.unlinkSync(file_path);
    } catch (error) {
        console.error('خطأ:', error);
        m.reply(`حدث خطأ أثناء التحميل: ${error.message}`);
    }
};

handler.help = ['مو'];
handler.tags = ['search'];
handler.command = ['فيديو', 'فيديو-شغل', 'تت', 'تتت'];

export default handler;