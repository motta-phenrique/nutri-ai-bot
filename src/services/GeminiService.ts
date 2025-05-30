import gemini from "../plugins/gemini";
import { Content } from "@google/genai";
import prisma from "../plugins/prisma";
import { defaultPrompt, orientações } from "../utils/GeminiUtils";
import { TelegramService } from "./TelegramService";

const fullPrompt = `${defaultPrompt.trim()}\n\n${orientações.trim()}`;

const telegramService = new TelegramService();

export class GeminiService {
responseChatBot = async (
  userId: string,
  userInput?: string,
  filePath?: string
) => {
  const messages = await this.getMessageByUserId(userId);
  const content = await this.formatMessagesToGeminiContext(messages);

  const promptMessage: Content = {
    role: "user",
    parts: [{ text: fullPrompt }],
  };

  if (!filePath) {
    const currentQuestion: Content = {
      role: "user",
      parts: [{ text: userInput }],
    };

    const contents = [promptMessage, ...content, currentQuestion];

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });

    return response.candidates?.[0].content?.parts?.[0].text;
  }

  const bufferFile = await telegramService.downloadFile(filePath);

  const fileContent: Content = {
    role: "user",
    parts: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: bufferFile?.toString("base64"),
        },
      },
    ],
  };

  const textPromptContent: Content | null = userInput
    ? {
        role: "user",
        parts: [{ text: userInput }],
      }
    : null;

  const contents = [
    promptMessage,
    ...content,
    fileContent,
    ...(textPromptContent ? [textPromptContent] : []),
  ];

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
  });

  return response.candidates?.[0].content?.parts?.[0].text;
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
