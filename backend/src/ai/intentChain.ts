import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HRIntentSchema } from "./schema";
import { llm } from "./llm";

const prompt = new PromptTemplate({
  template: `
You are an HR assistant.

You MUST return ONLY raw JSON.
NO markdown.
NO backticks.
NO explanations.

Strict JSON format:
{{
  "intent": "generate_document",
  "documentType": "promotion | salary | leave | employment",
  "employeeName": "string",
  "extraData": {{}}
}}

HR request:
{input}
`,
  inputVariables: ["input"],
});

const chain = new LLMChain({
  llm,
  prompt,
});

export async function extractHRIntent(input: string) {
  const result = await chain.call({ input });

  const raw = result.text.trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    console.error("LLM OUTPUT:", raw);
    throw new Error("LLM did not return JSON");
  }

  const jsonString = raw.slice(start, end + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    console.error("INVALID JSON:", jsonString);
    throw new Error("Invalid JSON from LLM");
  }

  return HRIntentSchema.parse(parsed);
}
