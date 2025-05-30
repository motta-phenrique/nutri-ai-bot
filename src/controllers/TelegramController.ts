import { FastifyRequest, FastifyReply } from "fastify";
import { TelegramService } from "../services/TelegramService";
import { TelegramUpdate } from "../types/Telegram";
import {
  firstMessageWelcome,
  messagePlanDeactivate,
  messageWarning,
} from "../utils/TelegramUtils";
import { GeminiService } from "../services/GeminiService";

const service = new TelegramService();
const geminiService = new GeminiService();

export class TelegramController {
  webhook = async (
    req: FastifyRequest<{ Body: TelegramUpdate }>,
    res: FastifyReply
  ) => {
    const update = req.body;
    const message = update.message;
    const chatId = message.chat.id;
    const messageText = message.text ?? "";
    const isStart = messageText.startsWith("/start ");
    const isPhoto = message.photo;
    const fileId = message.photo?.[message.photo?.length - 1].file_id || ""

    console.log(message)

    try {
      if (isStart) {
        const userId = messageText.split(" ")[1];
        const user = await service.processStart(chatId, userId);
        await service.createMessage(userId, messageText, false);
        if (!user?.plan_active) {
          await service.sendMessage(chatId, messagePlanDeactivate);
          await service.createMessage(userId, messagePlanDeactivate, true);
          return;
        }
        await service.sendMessage(chatId, firstMessageWelcome);
        await service.createMessage(userId, firstMessageWelcome, true);
        return;
      }

      if (!isPhoto) {
        const user = await service.verifyUserByChatId(chatId);
        if (!user) {
          await service.sendMessage(chatId, messageWarning);
          return;
        }

        const response = await geminiService.responseChatBot(
          user.supabaseId,
          messageText
        );
        await service.createMessage(user.supabaseId, messageText, false);
        await service.createMessage(user.supabaseId, response!, true);
        await service.sendMessage(chatId, response ? response : "");
        return
      }

      const user = await service.verifyUserByChatId(chatId);
      if (!user) {
        await service.sendMessage(chatId, messageWarning);
        return;
      }

      const filePath = await service.getFilePath(fileId)
      if(!filePath){
        await service.sendMessage(chatId, "Imagem enviada com erro");
        return
      }

      const response = await geminiService.responseChatBot(user.supabaseId, undefined, filePath)

    } catch (error) {
      res.status(500).send({
        error: (error as Error).message,
      });
    }
  };
}
