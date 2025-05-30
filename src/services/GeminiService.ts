import gemini from "../plugins/gemini";
import { Content } from "@google/genai";
import prisma from "../plugins/prisma";
import { defaultPrompt, orientações } from "../utils/GeminiUtils";
import { TelegramService } from "./TelegramService";

const fullPrompt = `${orientações.trim()}\n\n${defaultPrompt.trim()}`;

const telegramService = new TelegramService();

export class GeminiService {
  responseChatBot = async (
    userId: string,
    userInput?: string,
    filePath?: string
  ) => {
    const messages = await this.getMessageByUserId(userId);
    const content = await this.formatMessagesToGeminiContext(messages);

    if (!filePath) {
      const promptMessage: Content = {
        role: "user",
        parts: [{ text: fullPrompt }],
      };

      const currentQuestion: Content = {
        role: "user",
        parts: [{ text: userInput }],
      };

      const contents = [promptMessage, ...content, currentQuestion];

      const response = await gemini.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
      });

      const responseToReturn =
        response.candidates?.[0].content?.parts?.[0].text;

      return responseToReturn;
    }

    const bufferFile = await telegramService.downloadFile(filePath);

    const promptMessage: Content = {
      role: "user",
      parts: [{ text: fullPrompt }],
    };

    const file: Content = {}
  };

  getMessageByUserId = async (userId: string) => {
    const messages = await prisma.message.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  };

  formatMessagesToGeminiContext = async (
    messages: { text: string; isFromBot: boolean }[]
  ): Promise<Content[]> => {
    return messages.map((msg) => ({
      role: msg.isFromBot ? "model" : "user",
      parts: [{ text: msg.text }],
    }));
  };
}
