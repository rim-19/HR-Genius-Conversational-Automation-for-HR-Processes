import { BufferMemory } from "langchain/memory";

export const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
});
