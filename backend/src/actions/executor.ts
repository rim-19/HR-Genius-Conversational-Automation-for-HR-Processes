// backend/src/actions/executor.ts

import { Action } from "./action";
import { ActionType } from "./actionTypes";
import { ExecutionContext } from "./context";
import { prisma } from "../prisma/client";
import { generatePDF } from "../utils/fileGenerator";
import { generateDocumentContent } from "../ai/contentGenerator";
import { retrieveKnowledge } from "../ai/rag";
import { createNotification } from "../utils/notify";
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

          // Deterministic safety-net defaults. Name + position are guaranteed by the
          // clarification step in the controller; department/email are auto-derived.
          if (!payload.department) payload.department = "IT";
          if (!payload.email && payload.name) {
            payload.email =
              payload.name.trim().toLowerCase().replace(/\s+/g, ".") + "@gmail.com";
          }

          if (!payload.name || !payload.position) {
            throw AppError.conversational(
              "I still need the new employee's full name and job position before I can add them. Could you provide both?",
              "executor"
            );
          }

          let createdEmployee;
          try {
            createdEmployee = await prisma.employee.create({
              data: {
                name: payload.name,
                position: payload.position,
                department: payload.department,
                salary: payload.salary ?? 0,
                email: payload.email,
                createdById: ctx.user.id,
              },
            });
          } catch (e: any) {
            // Unique-constraint violation on email → correct the user, don't crash
            if (e?.code === "P2002") {
              throw AppError.conversational(
                `There's already an employee registered with the email ${payload.email}. Would you like to use a different email?`,
                "executor"
              );
            }
            throw e;
          }

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
          const where: any = { ...(action.payload.filters ?? {}) };

          // 🔒 Row-level scoping: managers see their reports, employees see only themselves.
          if (ctx.user.role === "MANAGER") where.managerId = ctx.user.id;
          else if (ctx.user.role === "EMPLOYEE") where.userId = ctx.user.id;

          const employees = await prisma.employee.findMany({
            where,
            orderBy: { createdAt: "desc" },
          });

          // 🔒 Privacy: EMPLOYEE role must not see salary figures
          ctx.employees =
            ctx.user.role === "EMPLOYEE"
              ? (employees.map(({ salary, ...rest }) => rest) as any)
              : employees;

          break;
        }

        case ActionType.MULTI_READ_DOCUMENT: {
          const where: any = { ...(action.payload.filters ?? {}) };

          // 🔒 Row-level scoping: managers see their reports' docs, employees see only theirs.
          if (ctx.user.role === "MANAGER") where.employee = { managerId: ctx.user.id };
          else if (ctx.user.role === "EMPLOYEE") where.employee = { userId: ctx.user.id };

          ctx.documents = await prisma.document.findMany({
            where,
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
            throw AppError.conversational(
              "Which employee do you mean? Please tell me their full name.",
              "executor"
            );
          }

          // Guard 3: never use findFirst without strict selector
          const employees = await prisma.employee.findMany({
            where: {
              name: {
                contains: identifier.trim(),
                mode: "insensitive",
              },
            },
            take: 5, // fetch a few to detect ambiguity and list candidates
          });

          // Correction: the person doesn't exist → tell the user, don't crash
          if (employees.length === 0) {
            throw AppError.conversational(
              `I couldn't find an employee named "${identifier}". Could you double-check the spelling? You can also ask me to "list all employees" to see who's on file.`,
              "executor"
            );
          }
          // Correction: ambiguous → ask which one, listing the matches
          if (employees.length > 1) {
            const names = employees.map((e) => e.name).join(", ");
            throw AppError.conversational(
              `I found more than one employee matching "${identifier}": ${names}. Which one did you mean?`,
              "executor"
            );
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
          const newPosition = rawData.newRole ?? rawData.position;
          if (newPosition) {
            if (
              ctx.employee.position &&
              String(newPosition).trim().toLowerCase() === ctx.employee.position.toLowerCase()
            ) {
              throw AppError.conversational(
                `${ctx.employee.name} is already a ${ctx.employee.position}, so there's nothing to change there.`,
                "executor"
              );
            }
            updateData.position = String(newPosition).trim();
          }

          // ─────────────────────────────
          // 🧠 DEPARTMENT UPDATE
          // ─────────────────────────────
          if (rawData.department) {
            if (
              ctx.employee.department &&
              String(rawData.department).trim().toLowerCase() === ctx.employee.department.toLowerCase()
            ) {
              throw AppError.conversational(
                `${ctx.employee.name} is already in the ${ctx.employee.department} department.`,
                "executor"
              );
            }
            updateData.department = String(rawData.department).trim();
          }

          // ─────────────────────────────
          // 🧠 EMAIL UPDATE
          // ─────────────────────────────
          if (rawData.email) {
            const email = String(rawData.email).trim();
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              throw AppError.conversational(
                `"${email}" doesn't look like a valid email address. Could you double-check it?`,
                "executor"
              );
            }
            updateData.email = email.toLowerCase();
          }

          // ─────────────────────────────
          // 🧠 SALARY UPDATE (ABSOLUTE)
          // Example: "set salary to 20000"
          // ─────────────────────────────
          if (rawData.salary !== undefined && rawData.salary !== null) {
            const salary = Number(rawData.salary);

            if (!Number.isFinite(salary)) {
              throw AppError.conversational(
                "That salary amount doesn't look like a valid number. Could you send it again?",
                "executor"
              );
            }
            if (salary < 0) {
              throw AppError.conversational(
                "A salary can't be negative. What amount would you like to set?",
                "executor"
              );
            }
            if (ctx.employee.salary === salary) {
              throw AppError.conversational(
                `${ctx.employee.name}'s salary is already ${salary}, so no change is needed.`,
                "executor"
              );
            }
            updateData.salary = salary;
          }

          // ─────────────────────────────
          // 🧠 SALARY INCREASE (PERCENTAGE)
          // Example: "+20%"
          // Only if absolute salary NOT provided
          // ─────────────────────────────
          else if (rawData.salaryIncrease !== undefined && rawData.salaryIncrease !== null) {
            const percent = Number(rawData.salaryIncrease);

            if (!Number.isFinite(percent)) {
              throw AppError.conversational(
                'I couldn\'t read that percentage. Could you tell me the raise as a number, e.g. "+10%"?',
                "executor"
              );
            }
            if (percent <= -100) {
              throw AppError.conversational(
                "A reduction of 100% or more would leave the salary at zero or below. Could you confirm what you'd like instead?",
                "executor"
              );
            }

            updateData.salary = Math.round(
              ctx.employee.salary + (ctx.employee.salary * percent) / 100
            );
          }

          // ─────────────────────────────
          // 🛑 NOTHING RECOGNISED TO UPDATE → ask, don't silently pretend success
          // ─────────────────────────────
          if (Object.keys(updateData).length === 0) {
            throw AppError.conversational(
              `I wasn't sure what to change for ${ctx.employee.name}. You can update their position, salary, department, or email — what would you like to do?`,
              "executor"
            );
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
            system: ctx.system,
          });

          const title = `${action.payload.documentType.toUpperCase()} DOCUMENT`;
          const fileName = `${action.payload.documentType}_${ctx.employee.id}_${Date.now()}`;

          const pdfPath = await generatePDF(title, aiContent, fileName);

          ctx.pdfPath = pdfPath;
          ctx.pdfUrl = `${process.env.API_BASE_URL || 'http://127.0.0.1:5000'}/docs/${fileName}.pdf`;

          await prisma.document.create({
            data: {
              title,
              type: action.payload.documentType,
              fileUrl: ctx.pdfUrl,
              employeeId: ctx.employee.id,
            },
          });

          // Notify the employee (if they have a linked login account)
          if (ctx.employee.userId) {
            await createNotification(
              ctx.employee.userId,
              "document",
              `A new ${action.payload.documentType} document was generated for you.`
            );
          }

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

          try {
            await axios.post(process.env.N8N_WEBHOOK_URL!, {
              employee: ctx.employee,
              documentType: ctx.intent.documentType,
              pdfUrl: ctx.pdfUrl,
            });
          } catch (e) {
            console.error("❌ Notification failed (is n8n running?):", e);
            // Don't throw, allow the rest of the flow to complete
          }

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

        // =========================
        // KNOWLEDGE QUERY (RAG over the HR handbook)
        // =========================
        case ActionType.KNOWLEDGE_QUERY: {
          const query = ctx.userMessage || "";
          ctx.knowledge = await retrieveKnowledge(query, 4);
          break;
        }

        // =========================
        // AGGREGATE (analytics over employees)
        // =========================
        case ActionType.AGGREGATE_ENTITY: {
          const groupBy = action.payload.groupBy === "status" ? "status" : "department";
          const metric = action.payload.metric === "headcount" ? "headcount" : "avg_salary";

          const grouped = await prisma.employee.groupBy({
            by: [groupBy as any],
            _avg: { salary: true },
            _count: { _all: true },
          });

          const rows = grouped
            .map((g: any) => ({
              group: g[groupBy] ?? "Unspecified",
              value:
                metric === "headcount"
                  ? g._count._all
                  : Math.round(g._avg.salary ?? 0),
              count: g._count._all,
            }))
            .sort((a, b) => b.value - a.value);

          ctx.analytics = { metric, groupBy, rows };
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
