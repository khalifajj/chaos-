import axios from 'axios';
import * as cheerio from 'cheerio';
import { Sticker } from 'wa-sticker-formatter';

async function gifsSearch(query) {
    try {
        const url = `https://tenor.com/search/${query}-gifs`;
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $('figure.UniversalGifListItem img').each((i, el) => {
            const imgUrl = $(el).attr('src');
            if (imgUrl && imgUrl.endsWith('.gif')) {
                const staticImg = imgUrl.replace('.gif', '.jpg'); // صورة ثابتة
                results.push(staticImg);
            }
        });

        return results;
    } catch (e) {
        console.error('Error while scraping Tenor:', e);
        return [];
    }
}

const handler = async (m, { conn, text, command }) => {
    if (!text) throw `استعمل الأمر هكا:\n.${command} <الشخصية> <عدد الملصقات>\nمثال:\n.${command} Gojo 4`;

    const [query, countStr] = text.split(/(?<=^\S+)\s/);
    const count = Math.min(Number(countStr) || 1, 30);

    const images = await gifsSearch(query);
    if (!images.length) throw 'ما لقيتش صور للأسف!';

    const used = new Set();
    const selected = [];

    while (selected.length < count && used.size < images.length) {
        const i = Math.floor(Math.random() * images.length);
        if (!used.has(i)) {
            used.add(i);
            selected.push(images[i]);
        }
    }

    for (const img of selected) {
        try {
            const { data } = await axios.get(img, { responseType: 'arraybuffer' });
            const sticker = new Sticker(data, {
                type: 'full',
                pack: ' Sticker By ',
                author: '┊𝑭𝑳𝑶𝑩𝑨⇢😼⇠ 𝑩𝑶𝑻 ❞┊',
                quality: 75
            });

            const buffer = await sticker.toBuffer();
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
        } catch (e) {
            console.error('Error sending sticker:', e);
        }
    }
};

handler.help = ['ستيك-صور'];
handler.tags = ['sticker'];
handler.command = ['ستيك-صور'];
handler.limit = 1;
export default handler;