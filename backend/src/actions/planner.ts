import { Action } from "./action";
import { ActionType } from "./actionTypes";
import { AppError } from "../utils/AppError";

// =========================
// ROLE GUARD (HARD ENFORCEMENT)
// =========================
function assertRoleAllowed(
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE",
  intentName: string
) {
  const permissions: Record<typeof role, string[]> = {
    ADMIN: [
      "create_employee",
      "update_employee",
      "delete_employee",
      "generate_document",
      "list_employees",
      "list_documents",
      "analytics_query",
      "policy_question",
      "general_inquiry",
    ],
    HR: [
      "create_employee",
      "update_employee",
      "delete_employee",
      "generate_document",
      "list_employees",
      "list_documents",
      "analytics_query",
      "policy_question",
      "general_inquiry",
    ],
    MANAGER: [
      "update_employee",
      "generate_document",
      "list_employees",
      "list_documents",
      "analytics_query",
      "policy_question",
      "general_inquiry",
    ],
    EMPLOYEE: [
      "list_employees",
      "list_documents",
      "policy_question",
      "general_inquiry",
    ],
  };

  const allowedIntents = permissions[role] ?? [];

  if (!allowedIntents.includes(intentName)) {
    const actionText: Record<string, string> = {
      create_employee: "add employees",
      update_employee: "update employee records",
      delete_employee: "remove employees",
      generate_document: "generate documents",
      list_employees: "view the employee list",
      list_documents: "view documents",
    };
    throw AppError.conversational(
      `Sorry, your ${role} role doesn't allow you to ${actionText[intentName] || "do that"}. Let me know if there's something else I can help with.`,
      "planner"
    );
  }
}

// =========================
// ACTION PLANNER
// =========================
export function planActions(
  intent: any,
  userRole: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE"
): Action[] {

  // 🔐 Enforce role BEFORE planning anything
  assertRoleAllowed(userRole, intent.intent);

  const actions: Action[] = [];

  // 🗣️ GENERAL INQUIRY - No actions needed
  if (intent.intent === "general_inquiry") {
    return actions; // Return empty array - no system actions
  }

  // 📚 POLICY QUESTION - retrieve grounded knowledge from the HR handbook
  if (intent.intent === "policy_question") {
    actions.push({
      type: ActionType.KNOWLEDGE_QUERY,
      payload: {},
    });
    return actions;
  }

  // 📊 ANALYTICS - aggregate over employees (avg salary, headcount, ...)
  if (intent.intent === "analytics_query") {
    actions.push({
      type: ActionType.AGGREGATE_ENTITY,
      payload: {
        metric: intent.extraData?.metric || null,
        groupBy: intent.extraData?.groupBy || "department",
      },
    });
    return actions;
  }

  // 🧠 CREATE EMPLOYEE
  if (intent.intent === "create_employee") {
    actions.push({
      type: ActionType.CREATE_ENTITY,
      payload: {
        name: intent.employeeName,
        position: intent.extraData?.position,
        department: intent.extraData?.department,
        salary: intent.extraData?.salary,
        email: intent.extraData?.email,
      },
    });

    if (intent.documentType) {
      actions.push({
        type: ActionType.GENERATE_DOCUMENT,
        payload: { documentType: intent.documentType },
      });
    }

    actions.push({
      type: ActionType.NOTIFY,
      payload: { channel: "email" },
    });

    actions.push({
      type: ActionType.LOG_ACTION,
      payload: { intent },
    });

    return actions;
  }

  // 🧠 LIST EMPLOYEES
  if (intent.intent === "list_employees") {
    const ed = intent.extraData || {};
    const filters: any = { ...(ed.filters || {}) };

    // Build Prisma filters from natural-language fields the LLM extracted
    if (ed.department) {
      filters.department = { equals: String(ed.department), mode: "insensitive" };
    }
    if (ed.status) {
      filters.status = String(ed.status).toLowerCase();
    }

    actions.push({
      type: ActionType.MULTI_READ_ENTITY,
      payload: { filters }
    });
    return actions;
  }

  // 🧠 LIST DOCUMENTS
  if (intent.intent === "list_documents") {
    actions.push({
      type: ActionType.MULTI_READ_DOCUMENT,
      payload: {
        filters: intent.extraData?.filters || {}
      }
    });
    return actions;
  }

  // 🧠 NON-CREATE FLOWS (update / delete / generate)
  actions.push({
    type: ActionType.READ_ENTITY,
    payload: {
      entity: "employee",
      identifier: intent.employeeName,
    },
  });

  if (intent.intent === "update_employee") {
    actions.push({
      type: ActionType.UPDATE_ENTITY,
      payload: { data: intent.extraData },
    });
  }

  if (intent.intent === "delete_employee") {
    actions.push({
      type: ActionType.DELETE_ENTITY,
      payload: {},
    });
  }

  if (intent.documentType) {
    actions.push({
      type: ActionType.GENERATE_DOCUMENT,
      payload: { documentType: intent.documentType },
    });
  }

  actions.push({
    type: ActionType.NOTIFY,
    payload: { channel: "email" },
  });

  actions.push({
    type: ActionType.LOG_ACTION,
    payload: { intent },
  });

  return actions;
}
