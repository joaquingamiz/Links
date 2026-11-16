import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function visibleLinks(links) {
  return links
    .filter((link) => link.visible)
    .toSorted((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

function externalAttributes(url) {
  return url.startsWith("https://")
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";
}

function iconMarkup(icon) {
  const assets = {
    jg: "assets/images/jg-logo.png",
    "cyber-age-wars": "assets/icons/cyber-age-wars.svg",
    "cyberquiz-start": "assets/images/cyberquiz-logo.png",
    "jg-labs": "assets/icons/jg-labs.svg",
    linkedin: "assets/icons/linkedin.svg",
    github: "assets/icons/github.svg",
    youtube: "assets/icons/youtube.svg",
    instagram: "assets/icons/instagram.svg",
    tiktok: "assets/icons/tiktok.svg",
    mail: "assets/icons/protonmail.svg"
  };
  const src = assets[icon];
  if (!src) throw new Error(`No brand artwork configured for ${icon}`);
  return `<span class="link-icon icon-${escapeHtml(icon)}" aria-hidden="true"><img src="${src}" alt="" width="32" height="32" decoding="async"></span>`;
}

function renderProject(link) {
  return `<a class="project-card project-${escapeHtml(link.id)}" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
    <span class="project-top">${iconMarkup(link.id)}<span aria-hidden="true">↗</span></span>
    <strong>${escapeHtml(link.name)}</strong>
    <span class="project-description">${escapeHtml(link.description)}</span>
  </a>`;
}

function renderSocial(link) {
  return `<a class="social-pill" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}" aria-label="${escapeHtml(link.name)}" title="${escapeHtml(link.name)}">
    ${iconMarkup(link.icon)}
    <span>${escapeHtml(link.name)}</span>
  </a>`;
}

function byCategory(links, category) {
  return visibleLinks(links.filter((link) => link.category === category));
}

export function renderPage(template, links) {
  const primary = byCategory(links, "primary")[0];
  const replacements = {
    "{{PRIMARY_LINK}}": primary ? `<a class="primary-link" href="${escapeHtml(primary.url)}"${externalAttributes(primary.url)} data-link-id="${escapeHtml(primary.id)}"><span class="primary-icon">${iconMarkup("jg")}</span><span class="primary-copy"><strong>${escapeHtml(primary.name)}</strong><span>${escapeHtml(primary.description)}</span></span><span class="primary-arrow" aria-hidden="true">↗</span></a>` : "",
    "{{PROJECT_LINKS}}": byCategory(links, "projects").map(renderProject).join("\n"),
    "{{SOCIAL_LINKS}}": byCategory(links, "social").map(renderSocial).join("\n"),
    "{{YEAR}}": String(new Date().getUTCFullYear())
  };
  return Object.entries(replacements).reduce(
    (html, [token, value]) => html.replaceAll(token, value),
    template
  );
}

export async function build({ check = false } = {}) {
  const [template, linksSource] = await Promise.all([
    readFile(resolve(root, "src/index.template.html"), "utf8"),
    readFile(resolve(root, "content/links.json"), "utf8")
  ]);
  const output = `${renderPage(template, JSON.parse(linksSource)).trim()}\n`;
  const outputPath = resolve(root, "index.html");
  if (check) {
    const current = await readFile(outputPath, "utf8").catch(() => "");
    if (current !== output) throw new Error("index.html is stale; run npm run build");
    return output;
  }
  await writeFile(outputPath, output);
  return output;
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invokedDirectly) {
  await build({ check: process.argv.includes("--check") });
}
