/**
 * Environment Configuration Helpers
 * Provides utility functions for reading and validating environment variables.
 */
function getPort() {
  const parsedPort = Number(process.env.PORT);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    return 5000;
  }

  return parsedPort;
}

/**
 * Returns the configured storage mode.
 * Default storage mode is JSON if no STORAGE_MODE is provided.
 */
function getStorageMode() {
  return (process.env.STORAGE_MODE || "json").trim().toLowerCase();
}

export {
  getPort,
  getStorageMode,
};
