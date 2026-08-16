// Slot-filling + clarification helpers for the HR assistant.
//
// These let the pipeline ASK for missing details (instead of guessing or erroring)
// and remember a half-finished request so the user can complete it on the next turn.

type Intent = any;

function humanJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function stripNulls(obj: Record<string, any> = {}): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  }
  return out;
}

/**
 * Merge a pending (incomplete) intent from a previous turn with the freshly
 * extracted intent. Fresh, non-null fields win; the pending one fills the gaps.
 * If the new message is itself a clear, DIFFERENT command, the pending one is dropped
 * (the user changed their mind).
 */
export function mergeIntents(pending: Intent, fresh: Intent): Intent {
  if (!pending) return fresh;

  const freshIsConcreteCommand = fresh?.intent && fresh.intent !== "general_inquiry";
  if (freshIsConcreteCommand && fresh.intent !== pending.intent) {
    return fresh;
  }

  return {
    intent: pending.intent,
    employeeName: fresh?.employeeName ?? pending.employeeName ?? null,
    documentType: fresh?.documentType ?? pending.documentType ?? null,
    extraData: { ...(pending.extraData || {}), ...stripNulls(fresh?.extraData || {}) },
  };
}

/**
 * Return the list of still-missing required details for an intent.
 * An empty array means the request is complete enough to execute.
 */
export function getMissingInfo(intent: Intent): string[] {
  const ed = intent?.extraData || {};

  switch (intent?.intent) {
    case "create_employee": {
      const missing: string[] = [];
      if (!intent.employeeName) missing.push("the employee's full name");
      if (!ed.position) missing.push("their job position");
      return missing;
    }

    case "update_employee": {
      if (!intent.employeeName) return ["which employee you'd like to update"];
      const hasChange = Boolean(
        ed.position ||
        ed.newRole ||
        (ed.salary !== undefined && ed.salary !== null) ||
        (ed.salaryIncrease !== undefined && ed.salaryIncrease !== null) ||
        ed.department ||
        ed.email
      );
      if (!hasChange) return ["what you'd like to change (position, salary, department, or email)"];
      return [];
    }

    case "delete_employee":
      return intent.employeeName ? [] : ["the name of the employee to remove"];

    case "generate_document": {
      const missing: string[] = [];
      if (!intent.employeeName) missing.push("which employee this document is for");
      if (!intent.documentType) missing.push("the document type (promotion, salary, leave, or employment)");
      return missing;
    }

    default:
      return [];
  }
}

const ACTION_LABEL: Record<string, string> = {
  create_employee: "add this employee",
  update_employee: "update this record",
  delete_employee: "remove this employee",
  generate_document: "prepare this document",
};

export function buildClarificationQuestion(intent: Intent, missing: string[]): string {
  const action = ACTION_LABEL[intent?.intent] || "help with that";
  return `Sure — to ${action}, I just need ${humanJoin(missing)}. Could you share that?`;
}

// ── Destructive-action confirmation ─────────────────────────────

export function isAffirmative(msg: string): boolean {
  return /^(y|yes|yea|yeah|yep|yup|ok|okay|sure|confirm|confirmed|do it|go ahead|proceed|absolutely|please do|delete (it|them|him|her))\b/i.test(
    (msg || "").trim()
  );
}

export function isNegative(msg: string): boolean {
  return /^(n|no|nope|nah|cancel|stop|don'?t|do not|abort|never ?mind|forget it)\b/i.test(
    (msg || "").trim()
  );
}

/** Which resolved intents must be confirmed before executing. */
export function requiresConfirmation(intent: Intent): boolean {
  if (intent?.intent === "delete_employee") return true;
  if (intent?.intent === "update_employee") {
    const inc = intent?.extraData?.salaryIncrease;
    if (inc !== undefined && inc !== null && Math.abs(Number(inc)) >= 50) return true;
  }
  return false;
}

export function buildConfirmationQuestion(intent: Intent): string {
  const name = intent?.employeeName || "this employee";
  if (intent?.intent === "delete_employee") {
    return `⚠️ You're about to permanently delete ${name}'s record. This can't be undone. Reply "yes" to confirm, or "no" to cancel.`;
  }
  const inc = intent?.extraData?.salaryIncrease;
  return `That's a large salary change (${inc}%) for ${name}. Reply "yes" to confirm, or "no" to cancel.`;
}
