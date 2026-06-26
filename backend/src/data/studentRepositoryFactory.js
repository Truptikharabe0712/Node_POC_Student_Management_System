/**
 * Repository Factory
 * Selects the active storage implementation based on STORAGE_MODE.
 * This separates the service layer from the underlying persistence mechanism.
 */
import * as jsonStudentRepository from "./jsonStudentRepository.js";
import * as postgresStudentRepository from "./postgresStudentRepository.js";
import { getStorageMode } from "../config/env.js";

/**
 * Return the correct repository implementation for the configured storage mode.
 */
function getStudentRepository() {
  const mode = getStorageMode();

  // Keep the data-layer switch in one place so service/controller code stays storage-agnostic.
  if (mode === "postgres") {
    return postgresStudentRepository;
  }

  return jsonStudentRepository;
}

/**
 * Initialize the selected storage backend.
 * For JSON storage, this preloads the file data into memory.
 * For Postgres storage, this ensures the required table exists.
 */
async function initializeStorage() {
  const mode = getStorageMode();
  const repository = getStudentRepository();

  await repository.initialize();
  return mode;
}

export {
  getStorageMode,
  getStudentRepository,
  initializeStorage,
};
