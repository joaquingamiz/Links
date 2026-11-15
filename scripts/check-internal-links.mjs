import { access, readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = ["index.html", "privacy.html", "404.html"];
const missing = [];

function localPath(value) {
  if (
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("#") ||
    value.startsWith("data:")
  ) return null;
  const clean = value.split("#")[0].split("?")[0];
  if (!clean || clean === "./" || clean === ".") return "index.html";
  return clean.replace(/^\.\//, "");
}

for (const htmlFile of htmlFiles) {
  const html = await readFile(resolve(root, htmlFile), "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const path = localPath(match[1]);
    if (!path) continue;
    const target = extname(path) ? path : `${path}/index.html`;
    try {
      await access(resolve(root, target));
    } catch {
      missing.push(`${htmlFile}: ${match[1]}`);
    }
  }
}

if (missing.length) {
  console.error(`Missing local resources:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files: all local resources exist.`);
}
