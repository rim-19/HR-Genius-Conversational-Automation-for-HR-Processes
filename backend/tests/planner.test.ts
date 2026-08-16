import { describe, it, expect } from "vitest";
import { planActions } from "../src/actions/planner";
import { ActionType } from "../src/actions/actionTypes";

describe("planActions role guard", () => {
  it("allows an EMPLOYEE to list employees", () => {
    const actions = planActions({ intent: "list_employees", extraData: {} }, "EMPLOYEE");
    expect(actions.some((a) => a.type === ActionType.MULTI_READ_ENTITY)).toBe(true);
  });

  it("blocks an EMPLOYEE from deleting, with a conversational error", () => {
    try {
      planActions({ intent: "delete_employee", employeeName: "X" }, "EMPLOYEE");
      throw new Error("should have thrown");
    } catch (e: any) {
      expect(e.isConversational).toBe(true);
      expect(String(e.message)).toMatch(/doesn't allow/i);
    }
  });

  it("plans a create flow for ADMIN", () => {
    const actions = planActions(
      { intent: "create_employee", employeeName: "Jane", extraData: { position: "Dev" } },
      "ADMIN"
    );
    expect(actions.some((a) => a.type === ActionType.CREATE_ENTITY)).toBe(true);
  });

  it("builds department/status filters for list_employees", () => {
    const actions = planActions(
      { intent: "list_employees", extraData: { department: "Marketing", status: "active" } },
      "HR"
    );
    const read = actions.find((a) => a.type === ActionType.MULTI_READ_ENTITY);
    expect(read?.payload.filters.department).toEqual({ equals: "Marketing", mode: "insensitive" });
    expect(read?.payload.filters.status).toBe("active");
  });

  it("routes a policy_question to a KNOWLEDGE_QUERY (allowed for EMPLOYEE)", () => {
    const actions = planActions({ intent: "policy_question", extraData: {} }, "EMPLOYEE");
    expect(actions.some((a) => a.type === ActionType.KNOWLEDGE_QUERY)).toBe(true);
  });

  it("routes an analytics_query to an AGGREGATE_ENTITY for HR", () => {
    const actions = planActions(
      { intent: "analytics_query", extraData: { metric: "avg_salary", groupBy: "department" } },
      "HR"
    );
    const agg = actions.find((a) => a.type === ActionType.AGGREGATE_ENTITY);
    expect(agg?.payload.groupBy).toBe("department");
  });

  it("blocks an EMPLOYEE from analytics_query", () => {
    expect(() => planActions({ intent: "analytics_query", extraData: {} }, "EMPLOYEE")).toThrow();
  });
});
