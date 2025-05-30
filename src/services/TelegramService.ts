import prisma from "../plugins/prisma";
import supabase from "../plugins/supabase";
import { TelegramUpdate } from "../types/Telegram";
import { UserProfile } from "../types/Supabase";
import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const TELEGRAM_FILE_URL = "https://api.telegram.org/file/bot";

export class TelegramService {
  processStart = async (chatId: number, userId: string) => {
    try {
      const { data } = await supabase
        .from("user_profile")
        .select("*")
        .eq("id", userId)
        .single();

      let user = await prisma.user.findUnique({
        where: {
          supabaseId: data.id,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            supabaseId: data.id,
            telegramChatId: chatId,
          },
        });
      }

      return {
        plan_active: data.plan_active,
      };
    } catch (error) {
      console.error(error);
    }
  };

  sendMessage = async (chatId: number, text: string) => {
    try {
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:");
    }
  };

  createMessage = async (
    userId: string,
    content: string,
    isFromBot: boolean
  ) => {
    const data = prisma.message.create({
      data: {
        userId,
        text: content,
        isFromBot,
      },
    });

    return data;
  };

  verifyUserByChatId = async (chatId: number) => {
    const user = await prisma.user.findUnique({
      where: {
        telegramChatId: chatId,
      },
    });

    return user;
  };

  getFilePath = async (fileId: string) => {
    if (!fileId) return "Erro de Path";
    try {
      const response = await axios.get(`${TELEGRAM_API_URL}/getFile?file_id=${fileId}`)
      console.log(response)
      return response.data.result.file_path;
    } catch (error) {
      console.log(error)
    }
  };

  downloadFile = async (filePath: string) => {
    try {
      const response = await axios.get(`${TELEGRAM_FILE_URL}${TELEGRAM_TOKEN}/${filePath}`, {responseType: "arraybuffer"})
      return Buffer.from(response.data)
    } catch (error) {
      console.log(error)
    }
  };
}
