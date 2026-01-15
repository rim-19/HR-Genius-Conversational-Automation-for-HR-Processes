import { Action } from "./action";
import { ActionType } from "./actionTypes";

export function planActions(intent: any): Action[] {
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
