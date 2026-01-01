export interface ConversationMemory {
  lastEmployee?: {
    id: number;
    name: string;
    email?: string;
  };

  lastDocumentType?: string;

  lastIntent?: string;
}
