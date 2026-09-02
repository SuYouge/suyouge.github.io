import fs from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist");
const projectDirectory = path.resolve(".");

if (path.dirname(outputDirectory) !== projectDirectory || path.basename(outputDirectory) !== "dist") {
  throw new Error(`Refusing to clean unexpected output path: ${outputDirectory}`);
}

await fs.rm(outputDirectory, { force: true, recursive: true });
