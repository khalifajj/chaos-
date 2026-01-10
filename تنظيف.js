import fs from 'fs';
import path from 'path';

async function cleanSessionFiles() {
    const sessionDir = './BotSession';

    // التحقق من وجود المجلد
    if (!fs.existsSync(sessionDir)) {
        return {
            status: 'skip',
            message: '✗ مجلد الجلسة غير موجود',
            filesCount: 0,
            totalSize: 0
        };
    }

    const files = fs.readdirSync(sessionDir);
    if (files.length === 0) {
        return {
            status: 'skip',
            message: '✗ لا توجد ملفات جلسة لحذفها',
            filesCount: 0,
            totalSize: 0
        };
    }

    // حساب المساحة الإجمالية وعدد الملفات
    const { totalSize, deletedCount } = files.reduce((acc, file) => {
        const filePath = path.join(sessionDir, file);
        const stats = fs.statSync(filePath);
        acc.totalSize += stats.size;
        acc.files.push(filePath);
        return acc;
    }, { totalSize: 0, files: [] });

    // تحويل البايت إلى ميجابايت
    const totalSizeMB = totalSize / (1024 * 1024);

    // شروط الحذف
    if (files.length < 100 && totalSizeMB < 50) {
        return {
            status: 'skip',
            message: `✗ لم يتم الحذف (${files.length} ملفات - ${totalSizeMB.toFixed(2)}MB)`,
            filesCount: files.length,
            totalSize: totalSizeMB
        };
    }

    // تنفيذ الحذف
    let deletedFilesCount = 0;
    for (const filePath of files) {
        try {
            fs.unlinkSync(filePath);
            deletedFilesCount++;
        } catch (err) {
            console.error(`خطأ في حذف الملف ${filePath}:`, err);
        }
    }

    return {
        status: 'success',
        message: `✓ تم حذف ${deletedFilesCount}/${files.length} ملفات (${totalSizeMB.toFixed(2)}MB)`,
        filesCount: deletedFilesCount,
        totalSize: totalSizeMB
    };
}

const handler = async (m, { conn }) => {
    try {
        const result = await cleanSessionFiles();
        
        let reportMessage = `*تقرير تنظيف الجلسة*\n\n`;
        reportMessage += `➤ الحالة: ${result.message}\n`;
        reportMessage += `➤ عدد الملفات: ${result.filesCount}\n`;
        reportMessage += `➤ الحجم الإجمالي: ${result.totalSize.toFixed(2)}MB\n\n`;
        
        if (result.status === 'skip') {
            reportMessage += `ℹ️ لم يتم الحذف لأن عدد الملفات أقل من 100 وحجمها أقل من 50MB`;
        } else if (result.status === 'success') {
            reportMessage += `✅ تم تنظيف ملفات الجلسة بنجاح`;
        }

        await conn.sendMessage(m.chat, { 
            text: reportMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { 
            text: '❌ حدث خطأ أثناء تنفيذ الأمر.',
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: m });
    }
};

handler.help = ['clean'];
handler.tags = ['main'];
handler.command = ['تنظيف', 'cleansession'];

export default handler;