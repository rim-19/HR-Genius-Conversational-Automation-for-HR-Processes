import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { llm } from "./llm";
import { ConversationMemory } from "./memory";
import {
  readEntity,
  updateEntity,
  createDocument,
  notify,
} from "./tools";

export async function createAgent() {
  const tools = [readEntity, updateEntity, createDocument, notify];

  return initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "chat-conversational-react-description",
    memory,
    verbose: true,
  });
}
