import gemini from "../plugins/gemini";
import { Content } from "@google/genai";
import prisma from "../plugins/prisma";
import { defaultPrompt, orientações } from "../utils/GeminiUtils";

const fullPrompt = `${orientações.trim()}\n\n${defaultPrompt.trim()}`;

export class GeminiService {
  responseChatBot = async (userId: string) => {
    const messages = await this.getMessageByUserId(userId);
    const content = await this.formatMessagesToGeminiContext(messages);

    console.dir(content, { depth: null });

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
    });

    console.dir(response, { depth: null });

    return;
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
    const promptMessage: Content = {
      role: "user",
      parts: [{ text: fullPrompt }],
    };

    const history: Content[] = messages.map((msg) => ({
      role: msg.isFromBot ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    return [promptMessage, ...history];
  };
}
