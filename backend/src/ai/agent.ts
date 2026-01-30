// backend/src/ai/agent.ts

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { llm } from "./llm";
import {
  readEntity,
  updateEntity,
  createDocument,
  notify,
} from "./tools";

export async function createAgent() {
  const tools = [readEntity, updateEntity, createDocument, notify];

  // ✅ LangChain runtime memory (NOT backend memory)
  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });

  return initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "chat-conversational-react-description",
    memory,
    verbose: true,
  });
}
