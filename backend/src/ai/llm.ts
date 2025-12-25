import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const llm = new ChatGoogleGenerativeAI({
  modelName: "models/gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY!,
});
