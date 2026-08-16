import { prisma } from "../prisma/client";

/**
 * Pure backend conversational memory
 * (NOT LangChain memory)
 */
export interface ConversationMemory {
  lastEmployee?: {
    id: number;
    name: string;
    email?: string;
  };
  lastDocumentType?: "promotion" | "salary" | "leave" | "employment" | "custom";
  lastIntent?: string;
  // A previous incomplete request that is waiting for the user to supply missing details.
  pendingIntent?: any;
  // A destructive request awaiting a yes/no confirmation from the user.
  pendingConfirmation?: { intent: any };
  [key: string]: any;
}

/**
 * Load memory for a user
 */
export async function loadMemory(
  userId: number
): Promise<ConversationMemory> {
  const record = await prisma.conversationMemory.findUnique({
    where: { userId },
  });

  return (record?.memory as ConversationMemory) ?? {};
}

/**
 * Save / update memory for a user
 */
export async function saveMemory(
  userId: number,
  memory: ConversationMemory
): Promise<void> {
  await prisma.conversationMemory.upsert({
    where: { userId },
    update: { memory },
    create: { userId, memory },
  });
}
