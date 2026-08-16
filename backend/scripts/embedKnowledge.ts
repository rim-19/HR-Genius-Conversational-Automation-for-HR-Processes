// One-off: embed the HR handbook and write the cache consumed at runtime.
// Usage: npm run kb:embed
//
// Paced to respect the Gemini free-tier rate limit (embeds in small batches).

import "../src/config/loadEnv";
import fs from "fs";
import {
  loadAndChunkKnowledge,
  getEmbedder,
  CACHE_PATH,
  EMBED_MODEL,
} from "../src/ai/rag";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error("❌ GEMINI_API_KEY is required to embed the knowledge base.");
    process.exit(1);
  }

  const chunks = loadAndChunkKnowledge();
  if (chunks.length === 0) {
    console.error("❌ No knowledge chunks found under src/ai/knowledge.");
    process.exit(1);
  }
  console.log(`Embedding ${chunks.length} chunks with ${EMBED_MODEL}...`);

  const embedder = getEmbedder();
  const BATCH = 4;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const slice = chunks.slice(i, i + BATCH);
    const vectors = await embedder.embedDocuments(slice.map((c) => c.text));
    slice.forEach((c, j) => (c.embedding = vectors[j]));
    console.log(`  embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
    if (i + BATCH < chunks.length) await sleep(1500); // stay under rate limits
  }

  fs.writeFileSync(
    CACHE_PATH,
    JSON.stringify({ model: EMBED_MODEL, count: chunks.length, chunks }, null, 2)
  );
  console.log(`✅ Wrote ${chunks.length} embedded chunks to ${CACHE_PATH}`);
}

main().catch((e) => {
  console.error("Embedding failed:", e?.message || e);
  process.exit(1);
});
