import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is missing in environment variables!");
}

export const llm = new ChatGoogleGenerativeAI({
  modelName: "models/gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "dummy_key",
  maxRetries: 2,
});
