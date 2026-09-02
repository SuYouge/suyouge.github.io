import fs from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist");

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveLocalTarget(pagePath, rawUrl) {
  const url = rawUrl.split("#", 1)[0].split("?", 1)[0];
  if (!url || /^(?:[a-z]+:|\/\/|#)/i.test(url)) return null;

  const decodedUrl = decodeURI(url);
  let target = decodedUrl.startsWith("/")
    ? path.join(outputDirectory, decodedUrl)
    : path.resolve(path.dirname(pagePath), decodedUrl);

  if (decodedUrl.endsWith("/")) target = path.join(target, "index.html");
  return target;
}

const files = await walk(outputDirectory);
const pages = files.filter((filePath) => filePath.endsWith(".html"));
const problems = [];

for (const pagePath of pages) {
  const html = await fs.readFile(pagePath, "utf8");
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${pagePath}: missing title`);
  if (!/<main(?:\s|>)/.test(html)) problems.push(`${pagePath}: missing main landmark`);

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = resolveLocalTarget(pagePath, match[1]);
    if (target && !(await exists(target))) {
      problems.push(`${pagePath}: missing ${match[1]}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} HTML pages and their local assets.`);
}
