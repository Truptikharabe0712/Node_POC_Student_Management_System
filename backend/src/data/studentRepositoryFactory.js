import * as jsonStudentRepository from "./jsonStudentRepository.js";
import * as postgresStudentRepository from "./postgresStudentRepository.js";
import { getStorageMode } from "../config/env.js";

function getStudentRepository() {
  const mode = getStorageMode();

  // Keep the data-layer switch in one place so service/controller code stays storage-agnostic.
  if (mode === "postgres") {
    return postgresStudentRepository;
  }
 
  return jsonStudentRepository;
}

async function initializeStorage() {
  const mode = getStorageMode();
  const repository = getStudentRepository();

  // Initialize selected storage (table creation for postgres, file preload for json).
  await repository.initialize();
  return mode;
}

export {
  getStorageMode,
  getStudentRepository,
  initializeStorage,
};
