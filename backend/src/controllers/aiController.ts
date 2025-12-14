import { Request, Response } from "express";
import { createAgent } from "../ai/agent";

let agentPromise: ReturnType<typeof createAgent> | null = null;

async function getAgent() {
  if (!agentPromise) agentPromise = createAgent();
  return agentPromise;
}

export const handleHRMessage = async (req: Request, res: Response) => {
  const { message } = req.body;

  const agent = await getAgent();
  const result = await agent.invoke({ input: message });

  res.json({
    reply: result.output,
  });
};
