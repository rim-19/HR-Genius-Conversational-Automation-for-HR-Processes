import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HRIntentSchema } from "./schema";
import { llm } from "./llm";

const prompt = new PromptTemplate({
  template: `
You are an HR assistant that extracts a structured command from the user's message.

You MUST return ONLY valid JSON.
NO markdown.
NO explanations.

JSON format:

{{
  "intent": "create_employee | update_employee | delete_employee | generate_document | list_employees | list_documents | analytics_query | policy_question | general_inquiry",
  "employeeName": "string | null",
  "documentType": "promotion | salary | leave | employment | null",
  "extraData": {{
    "position": "string | null",
    "salary": "number | null",
    "salaryIncrease": "number | null",
    "department": "string | null",
    "email": "string | null",
    "status": "string | null",
    "metric": "avg_salary | headcount | null",
    "groupBy": "department | status | null"
  }}
}}

Rules:
- If adding a new employee → intent = "create_employee"
- If changing an existing employee's info (salary, position, department, email) → intent = "update_employee"
- If removing/deleting an employee → intent = "delete_employee"
- If creating a certificate, letter, or document → intent = "generate_document"
- If the user wants to see/list employees, staff, or the team → intent = "list_employees"
- If the user wants to see/list documents, certificates, or letters → intent = "list_documents"
- If the user asks about company HR POLICIES or rules (leave/vacation days, remote work, working hours, payroll dates, benefits, code of conduct, probation, notice period, IT/security) → intent = "policy_question"
- If the user asks for an AGGREGATE statistic over employees (e.g. "average salary by department", "headcount per department", "how many people in each department") → intent = "analytics_query"; set extraData.metric ("avg_salary" or "headcount") and extraData.groupBy ("department" or "status")
- If the user greets you, says hi, asks how you are, or asks about the platform/features/how to use the app → intent = "general_inquiry"
- For create_employee: infer email as lowercase firstname.lastname@gmail.com if not given. Do NOT invent a name or a position — leave them null when the user did not provide them.
- For list_employees: if the user names a department (e.g. "in Marketing") put it in extraData.department; if they name a status (active/inactive) put it in extraData.status.
- Absolute salary (e.g. "set salary to 20000") → extraData.salary. A percentage raise (e.g. "+10%") → extraData.salaryIncrease.
- Use null for anything the user did not provide. NEVER guess names, positions, or salaries.

PENDING REQUEST (an earlier request that was waiting for missing details — may be "None"):
{context}
If the new message supplies those missing details, MERGE them into the pending request and return the SAME intent type with all known fields filled. If the new message is clearly a different request, ignore the pending request.

HR request:
{input}
`,
  inputVariables: ["input", "context"],
});


const chain = new LLMChain({
  llm,
  prompt,
});

export async function extractHRIntent(input: string, pending?: any) {
  const renderedPrompt = await prompt.format({
    input,
    context: pending ? JSON.stringify(pending) : "None.",
  });
  const result = await llm.invoke(renderedPrompt);
  const raw = result.content.toString().trim();
  // Robust JSON extraction using regex
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("❌ LLM OUTPUT WITHOUT JSON:", raw);
    // 🛡️ Safe fallback for simple greetings and general queries
    const lower = input.toLowerCase();
    const isGreeting = ["hi", "hello", "hey", "help", "greet", "salut", "bonjour"].some(word => lower.includes(word));

    if (isGreeting) {
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

