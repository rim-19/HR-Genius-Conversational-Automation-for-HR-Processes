import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HRIntentSchema } from "./schema";
import { llm } from "./llm";

const prompt = new PromptTemplate({
  template: `
You are an HR assistant.

You MUST return ONLY valid JSON.
NO markdown.
NO backticks.
NO explanations.

The JSON MUST follow this structure exactly:

{
  "intent": "generate_document",
  "documentType": "promotion | salary | leave | employment",
  "employeeName": "string",

  "extraData": {
    "position": "string | null",
    "salary": "number | null",
    "salaryIncrease": "number | null"
  }
}

Rules:
- If a new role/title is mentioned, put it in "position"
- If an absolute salary is mentioned (e.g. 20000), put it in "salary"
- If a percentage is mentioned (e.g. 10%), put it in "salaryIncrease"
- Use numbers only for salary values (NO text, NO currency)
- If a field is not mentioned, set it to null

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

  // 🔒 Normalize numeric fields
if (parsed.extraData) {
  if (parsed.extraData.salary !== null) {
    parsed.extraData.salary = Number(parsed.extraData.salary);
  }

  if (parsed.extraData.salaryIncrease !== null) {
    parsed.extraData.salaryIncrease = Number(parsed.extraData.salaryIncrease);
  }
}


  return HRIntentSchema.parse(parsed);
  
}

