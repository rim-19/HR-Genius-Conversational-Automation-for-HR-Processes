import { ActionType } from "./actionTypes";

export interface Action<TPayload = any> {
  type: ActionType;
  payload: TPayload;
}
