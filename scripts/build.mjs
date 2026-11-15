import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const footerSocialIds = new Set(["linkedin", "github", "instagram", "tiktok"]);

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
  const labels = {
    arrow: "↗",
    book: "B",
    briefcase: "B2B",
    checklist: "07",
    cloud: "☁",
    compass: "◎",
    github: "GH",
    globe: "JG",
    instagram: "IG",
    linkedin: "in",
    mail: "@",
    play: "▶",
    podcast: "UP",
    quiz: "?",
    shield: "◇",
    tiktok: "TT",
    youtube: "YT"
  };
  return `<span class="link-icon icon-${escapeHtml(icon)}" aria-hidden="true">${escapeHtml(labels[icon] ?? "↗")}</span>`;
}

function labelMarkup(label) {
  return label ? `<span class="card-label">${escapeHtml(label)}</span>` : "";
}

function renderFeatured(link) {
  const media = link.image
    ? `<span class="featured-media"><img src="${escapeHtml(link.image)}" alt="${escapeHtml(link.name)} preview" width="1200" height="750" loading="lazy" decoding="async"></span>`
    : `<span class="featured-media featured-media-symbol">${iconMarkup(link.icon)}<span>Blue Team</span></span>`;

  return `<article class="featured-card${link.image ? "" : " featured-card-no-image"}">
    <a href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
      ${media}
      <span class="featured-copy">
        ${labelMarkup(link.label)}
        <strong>${escapeHtml(link.name)}</strong>
        <span>${escapeHtml(link.description)}</span>
        <span class="card-action">Open <span aria-hidden="true">↗</span></span>
      </span>
    </a>
  </article>`;
}

function renderDirectoryLink(link) {
  return `<a class="directory-link" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
    ${iconMarkup(link.icon)}
    <span class="directory-copy"><strong>${escapeHtml(link.name)}</strong><small>${escapeHtml(link.description)}</small></span>
    <span class="link-arrow" aria-hidden="true">↗</span>
  </a>`;
}

function renderSocial(link) {
  return `<a class="social-pill" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
    ${iconMarkup(link.icon)}
    <span>${escapeHtml(link.name)}</span>
  </a>`;
}

function byCategory(links, category) {
  return visibleLinks(links.filter((link) => link.category === category));
}

export function renderPage(template, links) {
  const connectLinks = byCategory(links, "connect");
  const replacements = {
    "{{FEATURED_LINKS}}": byCategory(links, "featured").map(renderFeatured).join("\n"),
    "{{LEARN_LINKS}}": byCategory(links, "learn").map(renderDirectoryLink).join("\n"),
    "{{PROJECT_LINKS}}": byCategory(links, "projects").map(renderDirectoryLink).join("\n"),
    "{{CONTENT_LINKS}}": byCategory(links, "content").map(renderDirectoryLink).join("\n"),
    "{{CONNECT_LINKS}}": connectLinks.filter((link) => !footerSocialIds.has(link.id)).map(renderDirectoryLink).join("\n"),
    "{{SOCIAL_LINKS}}": connectLinks.filter((link) => footerSocialIds.has(link.id)).map(renderSocial).join("\n"),
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
