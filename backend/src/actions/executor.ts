import { Action } from "./action";
import { ActionType } from "./actionTypes";
import { ExecutionContext } from "./context";
import { prisma } from "../prisma/client";
import { generatePDF } from "../utils/fileGenerator";
import { generateDocumentContent } from "../ai/contentGenerator";
import axios from "axios";

export async function executeActions(
  actions: Action[],
  ctx: ExecutionContext
) {
  for (const action of actions) {
    switch (action.type) {
      // =========================
      // READ ENTITY
      // =========================
      case ActionType.READ_ENTITY: {
        const { identifier } = action.payload;

        const employee = await prisma.employee.findFirst({
          where: {
            name: {
              contains: identifier,
              mode: "insensitive",
            },
          },
        });

        if (!employee) {
          throw new Error("Employee not found");
        }

        ctx.employee = employee;
        break;
      }

      // =========================
      // UPDATE ENTITY
      // =========================
      case ActionType.UPDATE_ENTITY: {
  if (!ctx.employee) {
    throw new Error("Employee must be loaded before update");
  }

  const { data } = action.payload;

  // 🔁 Map AI fields → Prisma fields
  const prismaData: any = { ...data };

  if ("newRole" in prismaData) {
    prismaData.position = prismaData.newRole;
    delete prismaData.newRole;
  }

  ctx.employee = await prisma.employee.update({
    where: { id: ctx.employee.id },
    data: prismaData,
  });

  break;
}


      // =========================
      // GENERATE DOCUMENT
      // =========================
      case ActionType.GENERATE_DOCUMENT: {
        if (!ctx.employee) {
          throw new Error("Employee must be loaded before document generation");
        }

        const { documentType } = action.payload;

        const title = `${documentType.toUpperCase()} DOCUMENT`;

        const content = await generateDocumentContent({
  documentType,
  employee: ctx.employee,
  extraData: ctx.intent?.extraData,
});
        const fileName = `${documentType}_${ctx.employee.id}_${Date.now()}.pdf`;

        const pdfPath = await generatePDF(title, content, fileName);

        ctx.pdfPath = pdfPath;
        ctx.pdfUrl = `http://127.0.0.1:5000/docs/${pdfPath}`;

        // Save document record
        await prisma.document.create({
          data: {
            title,
            type: documentType,
            fileUrl: ctx.pdfUrl,
            employeeId: ctx.employee.id,
          },
        });

        break;
      }

      // =========================
      // NOTIFY (n8n)
      // =========================
      case ActionType.NOTIFY: {
        if (!ctx.employee || !ctx.pdfUrl) {
          throw new Error("Missing data for notification");
        }

        await axios.post(
          "http://127.0.0.1:5678/webhook/send-document-pdf",
          {
            employee: ctx.employee,
            pdfUrl: ctx.pdfUrl,
          }
        );

        break;
      }

      // =========================
      // LOG ACTION
      // =========================
      case ActionType.LOG_ACTION: {
       await prisma.actionLog.create({
  data: {
    action: ctx.intent?.documentType ?? "unknown",
    description: JSON.stringify(ctx.intent),
    userId: ctx.user.id, // 🔴 REQUIRED
  },
});

        break;
      }

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  return ctx;
}
