import { Action } from "./action";
import { ActionType } from "./actionTypes";

export function planActions(intent: any): Action[] {
  const actions: Action[] = [];

  // 1️⃣ Always read the target entity first
  actions.push({
    type: ActionType.READ_ENTITY,
    payload: {
      entity: "employee",
      identifier: intent.employeeName,
    },
  });

  // 2️⃣ Decide if we need to update data
  if (intent.extraData && Object.keys(intent.extraData).length > 0) {
    actions.push({
      type: ActionType.UPDATE_ENTITY,
      payload: {
        entity: "employee",
        data: intent.extraData,
      },
    });
  }

  // 3️⃣ Decide if a document must be generated
  if (intent.documentType) {
    actions.push({
      type: ActionType.GENERATE_DOCUMENT,
      payload: {
        documentType: intent.documentType,
      },
    });
  }

  // 4️⃣ Notify (automation)
  actions.push({
    type: ActionType.NOTIFY,
    payload: {
      channel: "email",
    },
  });

  // 5️⃣ Log everything
  actions.push({
    type: ActionType.LOG_ACTION,
    payload: {
      intent,
    },
  });

  return actions;
}
