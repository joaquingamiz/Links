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
  const icons = {
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"/>',
    briefcase: '<path d="M9 7V5h6v2M4 7h16v12H4zM4 12h16M10 12v2h4v-2"/>',
    checklist: '<path d="m4 6 1.5 1.5L8 5M11 6h9M4 12l1.5 1.5L8 11M11 12h9M4 18l1.5 1.5L8 17M11 18h9"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.3 8.4 4.8 4.8 0 0 0 7 18Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7.4a5.8 5.8 0 0 0-1.5-4A5.4 5.4 0 0 0 19.1 1S17.9.6 15 2.5a13.4 13.4 0 0 0-6 0C6.1.6 4.9 1 4.9 1a5.4 5.4 0 0 0-.2 2.1 5.8 5.8 0 0 0-1.5 4c0 5.8 3.5 7 6.8 7.4A4.8 4.8 0 0 0 9 18v4M9 19c-3 .9-3-1.5-4.2-2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    linkedin: '<path d="M5 9v10M5 5.5v.01M10 19V9m0 4.5a4 4 0 0 1 8 0V19"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
    podcast: '<circle cx="12" cy="10" r="2"/><path d="M8.5 14.5a5 5 0 1 1 7 0M6 17a8 8 0 1 1 12 0M10.5 15h3l1 6h-5l1-6Z"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-1 1-1 1.6M12 17h.01"/>',
    shield: '<path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-5"/>',
    tiktok: '<path d="M14 4v10.2a4 4 0 1 1-3-3.8M14 4c.7 2.3 2.3 3.7 5 4"/>',
    youtube: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9 5 3-5 3Z"/>'
  };
  const drawing = icons[icon] ?? icons.arrow;
  return `<span class="link-icon icon-${escapeHtml(icon)}" aria-hidden="true"><svg viewBox="0 0 24 24">${drawing}</svg></span>`;
}

function labelMarkup(label) {
  return label ? `<span class="card-label">${escapeHtml(label)}</span>` : "";
}

function renderFeatured(link) {
  const media = link.image
    ? `<span class="featured-media${link.id === "official-web" ? " featured-media-logo" : ""}"><img src="${escapeHtml(link.image)}" alt="${escapeHtml(link.name)} preview" width="1200" height="750" loading="lazy" decoding="async"></span>`
    : `<span class="featured-media featured-media-symbol">${iconMarkup(link.icon)}<span>JG Links</span></span>`;

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
    "{{PROJECT_LINKS}}": byCategory(links, "projects").map(renderDirectoryLink).join("\n"),
    "{{CONTENT_LINKS}}": byCategory(links, "content").map(renderDirectoryLink).join("\n"),
    "{{TRAINING_LINKS}}": byCategory(links, "training").map(renderDirectoryLink).join("\n"),
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
