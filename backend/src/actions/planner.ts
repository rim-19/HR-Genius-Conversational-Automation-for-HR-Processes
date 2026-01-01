import { Action } from "./action";
import { ActionType } from "./actionTypes";

/**
 * Planner responsibility:
 * - Decide WHAT to do
 * - Decide the ORDER of actions
 * - NEVER touch DB or logic
 */
export function planActions(intent: any): Action[] {
  const actions: Action[] = [];

  /**
   * ======================================================
   * 1️⃣ CREATE EMPLOYEE (NO READ BEFORE CREATE)
   * ======================================================
   */
  if (intent.intent === "add_employee") {
    actions.push({
      type: ActionType.CREATE_ENTITY,
      payload: {
        entity: "employee",
        data: {
          name: intent.employeeName,
          email: intent.email,
          position: intent.position,
          salary: intent.salary,
          department: intent.department,
        },
      },
    });

    // Generate welcome letter if requested
    if (intent.documentType) {
      actions.push({
        type: ActionType.GENERATE_DOCUMENT,
        payload: {
          documentType: intent.documentType,
        },
      });
    }

    // Notify employee
    actions.push({
      type: ActionType.NOTIFY,
      payload: {
        channel: "email",
      },
    });

    // Log action
    actions.push({
      type: ActionType.LOG_ACTION,
      payload: { intent },
    });

    return actions;
  }

  /**
   * ======================================================
   * 2️⃣ DELETE EMPLOYEE (READ → DELETE)
   * ======================================================
   */
  if (intent.intent === "delete_employee") {
    actions.push({
      type: ActionType.READ_ENTITY,
      payload: {
        entity: "employee",
        identifier: intent.employeeName,
      },
    });

    actions.push({
      type: ActionType.DELETE_ENTITY,
      payload: {
        entity: "employee",
      },
    });

    actions.push({
      type: ActionType.LOG_ACTION,
      payload: { intent },
    });

    return actions;
  }

  /**
   * ======================================================
   * 3️⃣ DEFAULT FLOW (READ → UPDATE → DOC → NOTIFY)
   * Used for:
   * - promotions
   * - salary changes
   * - role updates
   * - certificates
   * ======================================================
   */

  // 1. Read target employee
  actions.push({
    type: ActionType.READ_ENTITY,
    payload: {
      entity: "employee",
      identifier: intent.employeeName,
    },
  });

  // 2. Update employee if needed
  if (intent.extraData && Object.keys(intent.extraData).length > 0) {
    actions.push({
      type: ActionType.UPDATE_ENTITY,
      payload: {
        entity: "employee",
        data: intent.extraData,
      },
    });
  }

  // 3. Generate document if requested
  if (intent.documentType) {
    actions.push({
      type: ActionType.GENERATE_DOCUMENT,
      payload: {
        documentType: intent.documentType,
      },
    });
  }

  // 4. Notify (email / automation)
  actions.push({
    type: ActionType.NOTIFY,
    payload: {
      channel: "email",
    },
  });

  // 5. Log everything
  actions.push({
    type: ActionType.LOG_ACTION,
    payload: { intent },
  });

  return actions;
}
