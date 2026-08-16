import { describe, it, expect } from "vitest";
import {
  getMissingInfo,
  buildClarificationQuestion,
  mergeIntents,
  requiresConfirmation,
  isAffirmative,
  isNegative,
} from "../src/ai/clarify";

describe("getMissingInfo", () => {
  it("asks for name + position on a bare create", () => {
    const missing = getMissingInfo({ intent: "create_employee", employeeName: null, extraData: {} });
    expect(missing).toHaveLength(2);
  });

  it("asks only for position when the name is present", () => {
    const missing = getMissingInfo({ intent: "create_employee", employeeName: "John Carter", extraData: {} });
    expect(missing).toEqual(["their job position"]);
  });

  it("is satisfied by a complete create", () => {
    const missing = getMissingInfo({ intent: "create_employee", employeeName: "John", extraData: { position: "Dev" } });
    expect(missing).toHaveLength(0);
  });

  it("asks what to change on an empty update", () => {
    expect(getMissingInfo({ intent: "update_employee", employeeName: "Sara", extraData: {} })).toHaveLength(1);
  });

  it("asks for the document type when missing", () => {
    const missing = getMissingInfo({ intent: "generate_document", employeeName: "Sara", documentType: null, extraData: {} });
    expect(missing[0]).toContain("document type");
  });

  it("never clarifies a general inquiry", () => {
    expect(getMissingInfo({ intent: "general_inquiry", extraData: {} })).toHaveLength(0);
  });
});

describe("mergeIntents (slot-filling)", () => {
  const pending = { intent: "create_employee", employeeName: "John Carter", documentType: null, extraData: {} };

  it("merges a follow-up answer into the pending request", () => {
    const fresh = { intent: "general_inquiry", employeeName: null, documentType: null, extraData: { position: "Backend Developer" } };
    const merged = mergeIntents(pending, fresh);
    expect(merged.intent).toBe("create_employee");
    expect(merged.employeeName).toBe("John Carter");
    expect(merged.extraData.position).toBe("Backend Developer");
    expect(getMissingInfo(merged)).toHaveLength(0);
  });

  it("drops the pending request when the user issues a different command", () => {
    const merged = mergeIntents(pending, { intent: "list_employees", employeeName: null, extraData: {} });
    expect(merged.intent).toBe("list_employees");
  });
});

describe("buildClarificationQuestion", () => {
  it("produces a natural, non-empty question", () => {
    const q = buildClarificationQuestion({ intent: "create_employee" }, ["the employee's full name"]);
    expect(q).toContain("the employee's full name");
    expect(q.length).toBeGreaterThan(10);
  });
});

describe("destructive-action confirmation", () => {
  it("requires confirmation to delete an employee", () => {
    expect(requiresConfirmation({ intent: "delete_employee", employeeName: "Sara" })).toBe(true);
  });

  it("requires confirmation for a large (>=50%) raise", () => {
    expect(requiresConfirmation({ intent: "update_employee", extraData: { salaryIncrease: 60 } })).toBe(true);
  });

  it("does not require confirmation for a small raise", () => {
    expect(requiresConfirmation({ intent: "update_employee", extraData: { salaryIncrease: 10 } })).toBe(false);
  });

  it("recognises affirmative and negative replies", () => {
    expect(isAffirmative("yes")).toBe(true);
    expect(isAffirmative("yes, delete him")).toBe(true);
    expect(isNegative("no")).toBe(true);
    expect(isNegative("cancel")).toBe(true);
    expect(isAffirmative("what do you mean?")).toBe(false);
  });
});
