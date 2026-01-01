import { llm } from "./llm";

export async function generateDocumentContent(params: {
  documentType: string;
  employee: {
    name: string;
    position: string;
    department: string;
    email?: string;
  };
  extraData?: Record<string, any>;
  system: {
    today: string;
  };
}) {

 const prompt = `
You are the Human Resources Director of a real company named **HR-Genius Technologies**.

Company information (MUST be used explicitly, never replaced by placeholders):
- Company name: HR-Genius Technologies
- Address: 12 Innovation Avenue, Casablanca, Morocco
- Email: hrgeniuscompany@gmail.com
- Department issuing document: Human Resources Department

Your task is to generate a FULL, REALISTIC, and OFFICIAL HR document.
This document is legally valid, archived internally, and sent directly to the employee.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCUMENT CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document type: ${params.documentType}

Employee information:
- Full name: ${params.employee.name}
- Position: ${params.employee.position}
- Department: ${params.employee.department}
- Email: ${params.employee.email ?? "N/A"}

Additional HR data (may affect content):
${JSON.stringify(params.extraData ?? {}, null, 2)}

The official document date is: ${params.system.today}

You MUST use this date exactly.
Do NOT invent or modify dates.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY WRITING RULES (STRICT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Write in **formal corporate HR language**
2. Use **complete paragraphs**, not short sentences
3. The document must be **ready to be signed and sent**
4. NEVER use placeholders like:
   - [Company Name]
   - [Date]
   - [Signature]
   - [Address]
5. ALWAYS write as if issued by HR-Genius Technologies
6. DO NOT mention AI, systems, automation, or generation
7. DO NOT output JSON, Markdown, lists, or formatting tags
8. Output **plain professional text only**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCUMENT STRUCTURE (REQUIRED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Header identifying HR-Genius Technologies and document title
2. Formal introduction paragraph
3. Main HR justification and details
4. Effective date and employment conditions (if applicable)
5. Closing paragraph
6. Signature block written as:
   “Human Resources Department
    HR-Genius Technologies”

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT QUALITY REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 2 well-developed paragraphs 
- all in one page, don't do more than one page 
- Use realistic HR legal and corporate phrasing
- Sound authoritative, official, and human-written
- No generic or template language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY the final document text.
`;

  const response = await llm.invoke(prompt);
  return response.content.toString();
}
