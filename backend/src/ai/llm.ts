import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey: process.env.GEMINI_API_KEY!,
});
