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

function renderSocial(link, compact = false) {
  return `<a class="social-link${compact ? " social-link-compact" : ""}" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
    ${iconMarkup(link.icon)}
    <span><strong>${escapeHtml(link.name)}</strong>${compact ? "" : `<small>${escapeHtml(link.description)}</small>`}</span>
    <span class="link-arrow" aria-hidden="true">↗</span>
  </a>`;
}

function renderResource(link) {
  return `<article class="resource-card${link.featured ? " is-featured" : ""}">
    <a href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
      <span class="card-topline">${iconMarkup(link.icon)}${labelMarkup(link.label)}</span>
      <span class="card-copy"><strong>${escapeHtml(link.name)}</strong><span>${escapeHtml(link.description)}</span></span>
      <span class="card-action">Abrir <span aria-hidden="true">↗</span></span>
    </a>
  </article>`;
}

function renderProject(link) {
  if (!link.image) {
    return `<a class="section-link" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">${escapeHtml(link.name)} <span aria-hidden="true">→</span></a>`;
  }
  return `<article class="project-card">
    <a href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
      <span class="project-media"><img src="${escapeHtml(link.image)}" alt="Vista previa de ${escapeHtml(link.name)}" width="960" height="600" loading="lazy" decoding="async"></span>
      <span class="project-body">${labelMarkup(link.label)}<strong>${escapeHtml(link.name)}</strong><span>${escapeHtml(link.description)}</span><span class="card-action">Explorar <span aria-hidden="true">↗</span></span></span>
    </a>
  </article>`;
}

function renderLearn(link) {
  return `<article class="learn-card${link.featured ? " is-featured" : ""}">
    <a href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
      <span class="card-topline">${iconMarkup(link.icon)}${labelMarkup(link.label)}</span>
      <strong>${escapeHtml(link.name)}</strong>
      <span>${escapeHtml(link.description)}</span>
      <span class="card-action">Ver recurso <span aria-hidden="true">↗</span></span>
    </a>
  </article>`;
}

function renderCollaboration(link) {
  return `<a class="collab-link${link.featured ? " is-featured" : ""}" href="${escapeHtml(link.url)}"${externalAttributes(link.url)} data-link-id="${escapeHtml(link.id)}">
    ${iconMarkup(link.icon)}
    <span><strong>${escapeHtml(link.name)}</strong><small>${escapeHtml(link.description)}</small></span>
    <span class="link-arrow" aria-hidden="true">↗</span>
  </a>`;
}

function byCategory(links, category) {
  return visibleLinks(links.filter((link) => link.category === category));
}

export function renderPage(template, links) {
  const socials = byCategory(links, "social");
  const replacements = {
    "{{HERO_SOCIALS}}": socials.filter((link) => link.featured).map((link) => renderSocial(link, true)).join("\n"),
    "{{START_LINKS}}": byCategory(links, "start").map(renderResource).join("\n"),
    "{{PROJECT_LINKS}}": byCategory(links, "projects").filter((link) => link.image).map(renderProject).join("\n"),
    "{{PROJECT_MORE}}": byCategory(links, "projects").filter((link) => !link.image).map(renderProject).join("\n"),
    "{{LEARN_LINKS}}": byCategory(links, "learn").map(renderLearn).join("\n"),
    "{{SOCIAL_LINKS}}": socials.map((link) => renderSocial(link)).join("\n"),
    "{{COLLABORATE_LINKS}}": byCategory(links, "collaborate").map(renderCollaboration).join("\n"),
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
