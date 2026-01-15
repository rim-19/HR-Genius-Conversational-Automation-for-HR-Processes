import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HRIntentSchema } from "./schema";
import { llm } from "./llm";

const prompt = new PromptTemplate({
  template: `
You are an HR assistant.

You MUST return ONLY valid JSON.
NO markdown.
NO explanations.

JSON format:

{{
  "intent": "create_employee | update_employee | delete_employee | generate_document | list_employees",
  "employeeName": "string | null",
  "documentType": "promotion | salary | leave | employment | null",
  "extraData": {{
    "position": "string | null",
    "salary": "number | null",
    "salaryIncrease": "number | null",
    "department": "string | null",
    "email": "string | null"
  }}
}}

Rules:
- If adding a new employee → intent = "create_employee"
- For CREATE, you MUST infer missing fields if possible:
  - department → "IT" if not mentioned
  - email → lowercase firstname.lastname@gmail.com
- Absolute salary → extraData.salary
- Use null if unknown

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

