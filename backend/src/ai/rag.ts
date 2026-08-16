// In-process RAG over the virtual HR handbook.
//
// Embeddings are precomputed offline by `scripts/embedKnowledge.ts`
// (run via `npm run kb:embed`) and cached to knowledgeBase.embeddings.json.
// At runtime we load that cache into memory and do a cosine top-k search;
// only the user's query is embedded live (one Gemini call per question).

import fs from "fs";
import path from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { logger } from "../config/logger";

export const KNOWLEDGE_DIR = path.join(__dirname, "knowledge");
export const CACHE_PATH = path.join(KNOWLEDGE_DIR, "knowledgeBase.embeddings.json");
export const EMBED_MODEL = "gemini-embedding-001";

export interface KnowledgeChunk {
  id: string;
  source: string; // human-readable document title
  text: string;
  embedding?: number[];
}

export interface RetrievedChunk {
  source: string;
  text: string;
  score: number;
}

let INDEX: KnowledgeChunk[] = [];
let loaded = false;

export function getEmbedder() {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    modelName: EMBED_MODEL,
  });
}

/**
 * Split the markdown handbook into retrievable chunks (one per section,
 * prefixed with the document title for context).
 */
export function loadAndChunkKnowledge(): KnowledgeChunk[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith(".md"));
  const chunks: KnowledgeChunk[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    const lines = raw.split(/\r?\n/);
    const docTitle = (lines.find((l) => l.startsWith("# ")) || file).replace(/^#\s*/, "").trim();

    // Split on "## " section headings; keep the heading with its body.
    const sections = raw.split(/\n(?=##\s)/);
    sections.forEach((section, i) => {
      const text = section.replace(/^#\s.*$/m, "").trim();
      if (text.length < 20) return;
      chunks.push({
        id: `${file}#${i}`,
        source: docTitle,
        text: `${docTitle} — ${text}`,
      });
    });
  }
  return chunks;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Load the precomputed embedding cache into memory (idempotent). */
export function loadKnowledgeIndex(): void {
  if (loaded) return;
  loaded = true;
  try {
    if (!fs.existsSync(CACHE_PATH)) {
      logger.warn(
        "RAG knowledge cache not found. Run `npm run kb:embed` to enable policy questions."
      );
      INDEX = [];
      return;
    }
    const parsed = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    INDEX = (parsed.chunks || []).filter((c: KnowledgeChunk) => Array.isArray(c.embedding));
    logger.info(`RAG knowledge index loaded: ${INDEX.length} chunks.`);
  } catch (e) {
    logger.error({ err: e }, "Failed to load RAG knowledge cache");
    INDEX = [];
  }
}

export function isKnowledgeReady(): boolean {
  loadKnowledgeIndex();
  return INDEX.length > 0;
}

/** Retrieve the top-k most relevant handbook chunks for a query. */
export async function retrieveKnowledge(query: string, k = 4): Promise<RetrievedChunk[]> {
  loadKnowledgeIndex();
  if (INDEX.length === 0) return [];

  const [queryVec] = await getEmbedder().embedDocuments([query]);
  return INDEX.map((c) => ({
    source: c.source,
    text: c.text,
    score: cosine(queryVec, c.embedding as number[]),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
