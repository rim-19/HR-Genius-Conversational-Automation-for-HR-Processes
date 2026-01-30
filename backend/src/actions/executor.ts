// backend/src/actions/executor.ts

import { Action } from "./action";
import { ActionType } from "./actionTypes";
import { ExecutionContext } from "./context";
import { prisma } from "../prisma/client";
import { generatePDF } from "../utils/fileGenerator";
import { generateDocumentContent } from "../ai/contentGenerator";
import { AppError } from "../utils/AppError";
import axios from "axios";

export async function executeActions(
  actions: Action[],
  ctx: ExecutionContext
) {
  for (const action of actions) {
    try {
      console.log(`➡️ EXECUTING ACTION: ${action.type}`, action.payload);

      switch (action.type) {

     case ActionType.CREATE_ENTITY: {
  const payload = action.payload;

  if (!payload.name || !payload.position || !payload.department || !payload.email) {
    throw AppError.validation("Missing required employee fields", "executor");
  }

  const createdEmployee = await prisma.employee.create({
    data: {
      name: payload.name,
      position: payload.position,
      department: payload.department,
      salary: payload.salary ?? 0,
      email: payload.email,
      createdById: ctx.user.id,
    },
  });

  // ✅ CRITICAL FIX
  ctx.employee = createdEmployee;

  console.log("✅ EMPLOYEE CREATED & CONTEXT UPDATED:", ctx.employee);

  break;
}




case ActionType.DELETE_ENTITY: {
  if (!ctx.employee) {
    throw AppError.validation("Employee must be loaded before deletion", "executor");
  }

  await prisma.employee.delete({
    where: { id: ctx.employee.id },
  });

  ctx.employeeDeleted = true;
  break;
}

case ActionType.MULTI_READ_ENTITY: {
  const filters = action.payload.filters ?? {};

  ctx.employees = await prisma.employee.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
  });

  break;
}

case ActionType.MULTI_READ_DOCUMENT: {
  const filters = action.payload.filters ?? {};

  ctx.documents = await prisma.document.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  break;
}



        // =========================
      // =========================
// READ EMPLOYEE (SAFE)
// =========================
case ActionType.READ_ENTITY: {
  // Guard 1: never overwrite an existing employee (especially after CREATE)
  if (ctx.employee) {
    console.log("ℹ️ READ_ENTITY skipped: ctx.employee already set");
    break;
  }

  const identifier: string | undefined = action.payload?.identifier;

  // Guard 2: identifier is mandatory
  if (!identifier || identifier.trim().length < 3) {
    throw AppError.validation("READ_ENTITY requires a non-empty, specific identifier", "executor");
  }

  // Guard 3: never use findFirst without strict selector
  const employees = await prisma.employee.findMany({
    where: {
      name: {
        contains: identifier.trim(),
        mode: "insensitive",
      },
    },
    take: 2, // detect ambiguity
  });

  if (employees.length === 0) {
    throw AppError.notFound(`Employee not found: ${identifier}`, "executor");
  }
  if (employees.length > 1) {
    throw AppError.validation(`Ambiguous employee identifier: ${identifier}`, "executor");
  }

  ctx.employee = employees[0];
  

  break;
}


        // =========================
        // UPDATE EMPLOYEE
        // =========================
       case ActionType.UPDATE_ENTITY: {
  if (!ctx.employee) {
    throw AppError.validation("Employee must be loaded before update", "executor");
  }

  const rawData = action.payload.data || {};
  const updateData: any = {};

  // ─────────────────────────────
  // 🧠 POSITION / ROLE UPDATE
  // ─────────────────────────────
  if (rawData.newRole || rawData.position) {
    updateData.position = rawData.newRole ?? rawData.position;
  }

  // ─────────────────────────────
  // 🧠 SALARY UPDATE (ABSOLUTE)
  // Example: "set salary to 20000"
  // ─────────────────────────────
  if (rawData.salary !== undefined) {
    const salary = Number(rawData.salary); 

    if (!Number.isFinite(salary)) {
      throw AppError.validation("Invalid salary value", "executor");
    }

    updateData.salary = salary;
  }

  // ─────────────────────────────
  // 🧠 SALARY INCREASE (PERCENTAGE)
  // Example: "+20%"
  // Only if absolute salary NOT provided
  // ─────────────────────────────
  else if (rawData.salaryIncrease) {
    const percent = Number(rawData.salaryIncrease);

    if (!Number.isFinite(percent)) {
      throw AppError.validation("Invalid salaryIncrease value", "executor");
    }

    updateData.salary = Math.round(
      ctx.employee.salary + (ctx.employee.salary * percent) / 100
    );
  }

  // ─────────────────────────────
  // 🛑 NOTHING TO UPDATE
  // ─────────────────────────────
  if (Object.keys(updateData).length === 0) {
    console.log("⚠️ No valid fields to update — skipping UPDATE_ENTITY");
    break;
  }

  console.log("🧠 FINAL UPDATE DATA:", updateData);

  // ─────────────────────────────
  // ✅ DATABASE UPDATE
  // ─────────────────────────────
  ctx.employee = await prisma.employee.update({
    where: { id: ctx.employee.id },
    data: updateData,
  });

  break;
}


        // =========================
        // GENERATE DOCUMENT
        // =========================
       case ActionType.GENERATE_DOCUMENT: {
        if (!ctx.employee) throw AppError.validation("Employee missing", "executor");

        // 🔥 AI WRITES THE LETTER
        const aiContent = await generateDocumentContent({
          documentType: action.payload.documentType,
          employee: ctx.employee,
          extraData: ctx.intent?.extraData,
          system:ctx.system,
        });

        const title = `${action.payload.documentType.toUpperCase()} DOCUMENT`;
        const fileName = `${action.payload.documentType}_${ctx.employee.id}_${Date.now()}`;

        const pdfPath = await generatePDF(title, aiContent, fileName);

        ctx.pdfPath = pdfPath;
        ctx.pdfUrl = `http://127.0.0.1:5000/docs/${fileName}.pdf`;

        await prisma.document.create({
          data: {
            title,
            type: action.payload.documentType,
            fileUrl: ctx.pdfUrl,
            employeeId: ctx.employee.id,
          },
        });

        break;
      }
        // =========================
        // NOTIFY (n8n)
        // =========================
        // =========================
// NOTIFY (n8n) — CANONICAL
// =========================
case ActionType.NOTIFY: {
  if (!ctx.employee || !ctx.employee.email) {
    throw AppError.validation("NOTIFY failed: employee email missing", "executor");
  }

  console.log("📧 NOTIFY PAYLOAD:", {
    employee: ctx.employee,
    pdfUrl: ctx.pdfUrl,
  });

  await axios.post(process.env.N8N_WEBHOOK_URL!, {
    employee: ctx.employee,
    documentType: ctx.intent.documentType,
    pdfUrl: ctx.pdfUrl,
  });

  break; // do NOT return early; let LOG_ACTION run
}



        // =========================
        // LOG ACTION
        // =========================
        case ActionType.LOG_ACTION: {
          await prisma.actionLog.create({
            data: {
              action: ctx.intent?.intent || "unknown",
              description: JSON.stringify(ctx.intent),
              userId: ctx.user.id,
            },
          });
          break;
        }

        default:
          throw AppError.internal(`Unknown action type: ${action.type}`, "executor");
      }

    } catch (err: any) {
      err.stage = err.stage || `executor:${action.type}`;
      throw err;
    }
  }

  return ctx;
}
