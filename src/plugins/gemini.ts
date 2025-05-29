import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_APIKEY,
});

export default gemini