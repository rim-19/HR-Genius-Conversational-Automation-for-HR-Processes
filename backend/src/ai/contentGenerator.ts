import { llm } from "./llm";

export async function generateDocumentContent(params: {
  documentType: string;
  employee: any;
  extraData?: any;
}) {
 const prompt = `
You are an expert HR Director writing official company documents.

Your task is to generate a FULL, REALISTIC, and PROFESSIONAL HR document.
This document will be sent directly to an employee and archived officially.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCUMENT CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document type: ${params.documentType}

Employee information:
- Full name: ${params.employee.name}
- Current position: ${params.employee.position}
- Department: ${params.employee.department}
- Email: ${params.employee.email ?? "Not specified"}

Additional HR data (may affect content):
${JSON.stringify(params.extraData ?? {}, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WRITING REQUIREMENTS (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Write in **formal corporate HR language**
2. Use **complete sentences and paragraphs**
3. The document must be **ready to be signed**
4. The tone must match the document type:
   - Promotion → congratulatory + official
   - Salary change → precise + legal
   - Warning → firm + formal
   - Certificate → neutral + factual
5. Do NOT mention AI, automation, or systems
6. Do NOT output JSON, Markdown, or bullet lists
7. Output **plain text only**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRUCTURE (MUST FOLLOW)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Header (company context, document title)
2. Formal introduction
3. Main body with HR justification and details
4. Effective dates and conditions (if applicable)
5. Closing paragraph
6. Signature block (HR Department)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT DEPTH (IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Minimum: 4 well-written paragraphs
- Include realistic HR phrasing
- Make it feel like a real company document
- Avoid generic or placeholder language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY the document text.
`;

  const response = await llm.invoke(prompt);
  return response.content.toString();
}
