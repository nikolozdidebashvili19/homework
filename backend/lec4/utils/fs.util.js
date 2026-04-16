import fs from "fs/promises";

// Removed the unused 'log' import from "console"

export const writeFile = async (filePath, data) => {
  // Check if data is not a string, and stringify it if so
  data = typeof data !== "string" ? JSON.stringify(data) : data;

  await fs.writeFile(filePath, data);
  console.log("Written successfully");
};

export const readFile = async (filePath, isParse) => {
  const data = await fs.readFile(filePath, "utf-8");

  // Fixed: changed 'readData' to 'data'
  return isParse ? JSON.parse(data) : data;
};

// Removed the duplicate export { readFile, writeFile }; from the bottom
