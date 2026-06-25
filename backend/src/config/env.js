function getPort() {
  const parsedPort = Number(process.env.PORT);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    return 5000;
  }

  return parsedPort;
}

function getStorageMode() {
  return (process.env.STORAGE_MODE || "json").trim().toLowerCase();
}

export {
  getPort,
  getStorageMode,
};
