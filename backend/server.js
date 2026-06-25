/**
 * Student Management REST API - Server Entry Point
 * Loads environment variables, initializes storage, and starts the Express server.
 */

import "dotenv/config";
import { fileURLToPath } from "url";

import app from "./src/app.js";
import { getPort } from "./src/config/env.js";
import { initializeStorage } from "./src/data/studentRepositoryFactory.js";

const port = getPort();

/**
 * Initialize storage and start the server.
 * Initializes either JSON or PostgreSQL storage based on STORAGE_MODE environment variable.
 */
async function startServer() {
  const mode = await initializeStorage();

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port} (storage: ${mode})`);
  });

  return server;
}

// Only start server if this file is run directly (not imported as a module)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

export { getStorageMode } from "./src/data/studentRepositoryFactory.js";
export { startServer };
