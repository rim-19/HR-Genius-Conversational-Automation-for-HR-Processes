import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HRIntentSchema } from "./schema";
import { llm } from "./llm";

const prompt = new PromptTemplate({
  template: `
You are an HR assistant.

Analyze the HR request below and return ONLY valid JSON.

JSON format:
{
  "intent": "generate_document",
  "documentType": "promotion | salary | leave | employment",
  "employeeName": "string",
  "extraData": { "any": "optional" }
}

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

  const parsed = JSON.parse(result.text);
  return HRIntentSchema.parse(parsed);
}
