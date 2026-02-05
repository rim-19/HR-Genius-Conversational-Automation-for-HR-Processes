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
      "general_inquiry",
    ],
    HR: [
      "create_employee",
      "update_employee",
      "delete_employee",
      "generate_document",
      "list_employees",
      "list_documents",
      "general_inquiry",
    ],
    MANAGER: [
      "update_employee",
      "generate_document",
      "list_employees",
      "list_documents",
      "general_inquiry",
    ],
    EMPLOYEE: [
      "list_employees",
      "list_documents",
      "general_inquiry",
    ],
  };

  const allowedIntents = permissions[role] ?? [];

  if (!allowedIntents.includes(intentName)) {
    throw AppError.forbidden(
      `Forbidden: role '${role}' cannot perform '${intentName}'`,
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
    actions.push({
      type: ActionType.MULTI_READ_ENTITY,
      payload: {
        filters: intent.extraData?.filters || {}
      }
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

  // 🧠 GENERAL INQUIRY (About the app/platform)
  if (intent.intent === "general_inquiry") {
    actions.push({
      type: ActionType.LOG_ACTION,
      payload: { intent },
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
