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
  "intent": "create_employee | update_employee | delete_employee | generate_document | list_employees | general_inquiry",
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
- If the user asks about the platform, features, or how to use the app → intent = "general_inquiry"
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
  const renderedPrompt = await prompt.format({ input });
  const result = await llm.invoke(renderedPrompt);
  const raw = result.content.toString().trim();
  // Robust JSON extraction using regex
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("❌ LLM OUTPUT WITHOUT JSON:", raw);
    // 🛡️ Safe fallback for simple greetings
    const lower = input.toLowerCase();
    if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
      return {
        intent: "general_inquiry" as const,
        employeeName: null,
        documentType: null,
        extraData: {}
      };
    }
    throw new Error("The AI assistant could not formulate a valid command. Please try again.");
  }

  const jsonString = jsonMatch[0];

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    console.error("INVALID JSON:", jsonString);
    throw new Error("Invalid JSON from LLM");
  }

  // Fallback for missing or generic intent
  if (!parsed.intent || parsed.intent === "unknown") {
    parsed.intent = "general_inquiry";
  }

  // 🔒 Normalize numeric fields safely
  if (parsed.extraData) {
    if (parsed.extraData.salary !== undefined && parsed.extraData.salary !== null) {
      parsed.extraData.salary = Number(parsed.extraData.salary);
    }
    if (parsed.extraData.salaryIncrease !== undefined && parsed.extraData.salaryIncrease !== null) {
      parsed.extraData.salaryIncrease = Number(parsed.extraData.salaryIncrease);
    }
  }

  return HRIntentSchema.parse(parsed);

}

