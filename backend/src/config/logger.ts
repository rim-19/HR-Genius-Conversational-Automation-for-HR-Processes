import pino from "pino";

// Structured application logger. Level is configurable via LOG_LEVEL;
// silenced during tests to keep output readable.
export const logger = pino({
  level: process.env.NODE_ENV === "test" ? "silent" : process.env.LOG_LEVEL || "info",
});
