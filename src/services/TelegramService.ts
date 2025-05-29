import prisma from "../plugins/prisma"

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const TELEGRAM_FILE_URL = "https://api.telegram.org/file/bot"

export class TelegramService {
    verifyMessage = async () => {
        try {
            const data = await prisma.message.findMany()
        } catch (error) {
            
        }
    }

    sendMessage = async () => {

    }

    getFilePath = async () => {

    }

    downloadFile = async () => {

    }
}