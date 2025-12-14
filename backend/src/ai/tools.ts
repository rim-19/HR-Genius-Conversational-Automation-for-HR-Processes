import { DynamicTool } from "langchain/tools";
import { prisma } from "../prisma/client";
import { generatePDF } from "../utils/fileGenerator";
import axios from "axios";

// READ: fetch entity by flexible identifier
export const readEntity = new DynamicTool({
  name: "read_entity",
  description:
    "Fetch an entity from the database. Input JSON: { entity: 'employee', where: { name?: string, email?: string, id?: number } }",
  func: async (input: string) => {
    const { entity, where } = JSON.parse(input);
    if (entity !== "employee") throw new Error("Unsupported entity");

    const emp = await prisma.employee.findFirst({
      where: {
        OR: [
          where.id ? { id: where.id } : undefined,
          where.email ? { email: where.email } : undefined,
          where.name
            ? { name: { contains: where.name, mode: "insensitive" } }
            : undefined,
        ].filter(Boolean) as any,
      },
    });
    return JSON.stringify(emp);
  },
});

// WRITE: update any attribute generically
export const updateEntity = new DynamicTool({
  name: "update_entity",
  description:
    "Update an entity attribute. Input JSON: { entity:'employee', id:number, data: Record<string, any> }",
  func: async (input: string) => {
    const { entity, id, data } = JSON.parse(input);
    if (entity !== "employee") throw new Error("Unsupported entity");

    const updated = await prisma.employee.update({
      where: { id },
      data,
    });
    return JSON.stringify(updated);
  },
});

// SIDE EFFECT: generate document
export const createDocument = new DynamicTool({
  name: "create_document",
  description:
    "Generate a document PDF. Input JSON: { title:string, content:string, outputName:string }",
  func: async (input: string) => {
    const { title, content, outputName } = JSON.parse(input);
    const file = await generatePDF(title, content, outputName);
    return JSON.stringify({ file });
  },
});

// SIDE EFFECT: notify via n8n
export const notify = new DynamicTool({
  name: "notify",
  description:
    "Trigger automation workflow. Input JSON: { employee:{id,name,email}, documentType:string, pdfUrl:string }",
  func: async (input: string) => {
    const payload = JSON.parse(input);
    await axios.post("http://127.0.0.1:5678/webhook/send-document-pdf", payload);
    return JSON.stringify({ status: "sent" });
  },
});
