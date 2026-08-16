// backend/src/server.ts
// Entrypoint: load env, validate required secrets, then start listening.

import "./config/loadEnv";
import app from "./app";
import { logger } from "./config/logger";

// Fail fast if critical secrets are missing.
const REQUIRED_ENV = ["JWT_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  logger.warn("GEMINI_API_KEY is not set — AI features will not work until it is configured.");
}

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
