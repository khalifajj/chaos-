import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const handler = async (m, { conn }) => {
  const pluginDir = './plugins';
  const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));

  if (files.length === 0)
    return m.reply('*•╮ لا يوجد أي بلوجنات في المجلد ▸╯*');

  let report = `*•╮ تم العثور على ${files.length} بلوجن ▸╯*\n\n`;

  for (const file of files) {
    const fullPath = path.join(pluginDir, file);
    try {
      const plugin = await import(path.resolve(fullPath));
      const p = plugin.default || {};
      const fileName = path.basename(file);
      
      report += `╭───────────────\n`;
      report += `│ 📦 *الملف:* ${fileName}\n`;
      report += `│ ⚙️ *Handler:* ${p.handler ? 'نعم' : '❌ لا'}\n`;
      report += `│ 📝 *Help:* ${Array.isArray(p.help) ? p.help.join(', ') : '❌ لا يوجد'}\n`;
      report += `│ ⌨️ *أوامر:* ${Array.isArray(p.command) ? p.command.join(', ') : '❌ لا يوجد'}\n`;
      report += `│ 🏷️ *Tags:* ${Array.isArray(p.tags) ? p.tags.join(', ') : '❌ لا يوجد'}\n`;
      report += `│ ✅ *مفعل:* ${p.disabled ? '❌ معطل' : '✅ شغال'}\n`;
      report += `╰───────────────\n\n`;
    } catch (e) {
      report += `❌ *خطأ في قراءة البلوجن:* ${file}\n↳ ${e.message}\n\n`;
    }
  }

  m.reply(report.trim());
};

handler.help = ['تشغيل_الكل'];
handler.command = ['تشغيل_الكل'];
handler.tags = ['tools'];

export default handler;