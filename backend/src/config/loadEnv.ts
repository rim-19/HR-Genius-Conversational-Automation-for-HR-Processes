// Loads environment variables from .env as the VERY FIRST side effect.
// Import this before any module that reads process.env at load time.
import dotenv from "dotenv";

dotenv.config();
