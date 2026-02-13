import { llm } from "./llm";
import { ExecutionContext } from "../actions/context";

export async function generateAIResponse(ctx: ExecutionContext): Promise<string> {
  // Build context summary from verified execution results
  const contextSummary = {
    intent: ctx.intent,
    employee: ctx.employee,
    employees: ctx.employees || [],
    documents: ctx.documents || [],
    pdfUrl: ctx.pdfUrl,
    employeeDeleted: ctx.employeeDeleted,
    system: ctx.system,
    memory: ctx.memory
  };

  const prompt = `
You are HR-Genius, a smart and friendly AI HR Assistant. 

GOAL:
Respond to the USER MESSAGE naturally using the EXECUTION CONTEXT and CONVERSATIONAL MEMORY provided.

USER MESSAGE:
"${ctx.userMessage}"

EXECUTION CONTEXT (What just happened):
${JSON.stringify(contextSummary, null, 2)}

CONVERSATIONAL RULES:
1. Speak like a person, not a database reporter.
2. Acknowledge the user's tone. If they say "hi", say "hi" back!
3. USE MEMORY: If the user uses pronouns (him, her, it, them) or asks "did you do it?", look at the "memory" field in the context to see the last employee or document discussed.
4. If the user asked a question and nothing was found in the context (and nothing is in memory), explain why or ask for more details naturally.
5. DO NOT say "I didn't find anything" in a robotic way.
6. If an action was successful, confirm it smoothly.
7. If a document was generated (pdfUrl exists), tell them it's ready. USE a clean markdown link with descriptive text (e.g., [View Promotion Letter]) and NEVER show the raw technical URL string in the text.

Generate a natural, helpful, and concise response:`;

  try {
    const response = await llm.invoke(prompt);
    return response.content.toString().trim();
  } catch (error) {
    console.error('AI Response Generation Failed:', error);
    // Generic fail-safe that doesn't sound robotic
    return "I've processed your request, but I'm having a bit of trouble articulating the response. Is there anything specific you'd like to check?";
  }
}
