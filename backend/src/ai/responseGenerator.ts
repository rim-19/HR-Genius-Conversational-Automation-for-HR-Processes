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
    system: ctx.system
  };

  const prompt = `
You are an HR assistant for HR-Genius Technologies. Your role is to explain what the system did in natural language.

CRITICAL RULES:
- ONLY use the information provided below
- DO NOT invent names, numbers, or actions
- DO NOT make up facts or details
- Explain what actually happened
- Suggest next steps based on available data
- Be helpful but truthful

EXECUTION CONTEXT:
${JSON.stringify(contextSummary, null, 2)}

RESPONSE GUIDELINES:
1. Start with what happened (or what went wrong)
2. Explain the results clearly
3. Suggest next steps if applicable
4. Keep responses concise but complete
5. Use professional but friendly tone
6. Never mention "AI", "system", or "backend"

EXAMPLE RESPONSES:
- "Great! John Doe has been added as a Software Engineer in IT."
- "I found 4 employees in the system. Let me know if you want details about any of them."
- "I can't do that because managers are not allowed to delete employees."
- "I found more than one employee named John. Please specify which one."

Generate a natural response based on the execution results above:`;

  try {
    const response = await llm.invoke(prompt);
    return response.content.toString().trim();
  } catch (error) {
    // Fallback to simple response if AI fails
    console.error('AI Response Generation Failed:', error);
    
    // Generate basic response based on context
    if (ctx.employeeDeleted) {
      return "Employee has been removed from the system.";
    }
    
    if (ctx.employee) {
      return `Found employee: ${ctx.employee.name}.`;
    }
    
    if (ctx.employees && ctx.employees.length > 0) {
      return `Found ${ctx.employees.length} employee${ctx.employees.length > 1 ? 's' : ''} in the system.`;
    }
    
    if (ctx.documents && ctx.documents.length > 0) {
      return `Found ${ctx.documents.length} document${ctx.documents.length > 1 ? 's' : ''} in the system.`;
    }
    
    if (ctx.pdfUrl) {
      return "Document has been generated and is ready.";
    }
    
    return "Request completed successfully.";
  }
}
