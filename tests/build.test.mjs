import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { escapeHtml, renderPage, visibleLinks } from "../scripts/build.mjs";

const links = JSON.parse(
  await readFile(new URL("../content/links.json", import.meta.url), "utf8")
);
const template = await readFile(
  new URL("../src/index.template.html", import.meta.url),
  "utf8"
);

test("escapeHtml protects generated markup", () => {
  assert.equal(
    escapeHtml(`<script>alert("x")</script>`),
    "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
  );
});

test("visibleLinks excludes hidden entries and sorts deterministically", () => {
  const input = [
    { id: "later", category: "test", order: 2, visible: true },
    { id: "hidden", category: "test", order: 0, visible: false },
    { id: "first", category: "test", order: 1, visible: true }
  ];
  assert.deepEqual(visibleLinks(input).map((item) => item.id), ["first", "later"]);
});

test("renderPage produces complete static content", () => {
  const html = renderPage(template, links);
  assert.ok(!html.includes("{{"));
  assert.match(html, /Cyber Age Wars/);
  assert.match(html, /Official Website/);
  assert.match(html, /All Training/);
  assert.doesNotMatch(html, /Blue Team from Zero/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /href="\/assets/);
});

test("renderPage builds a compact cover and grouped link library", () => {
  const html = renderPage(template, links);
  assert.equal((html.match(/class="featured-card/g) ?? []).length, 3);
  for (const group of ["projects", "content", "training", "connect"]) {
    assert.match(html, new RegExp(`data-link-group="${group}"`));
  }
  assert.doesNotMatch(html, /resource-grid|projects-grid|learn-grid|collab-panel/);
});

test("featured links keep the approved order", () => {
  const html = renderPage(template, links);
  const official = html.indexOf('data-link-id="official-web"');
  const ageWars = html.indexOf('data-link-id="cyber-age-wars"');
  const cyberQuiz = html.indexOf('data-link-id="cyberquiz-start"');
  assert.ok(official > -1 && official < ageWars && ageWars < cyberQuiz);
});

test("every generated tracking id is a complete quoted attribute", () => {
  const html = renderPage(template, links);
  assert.doesNotMatch(html, /data-link-id="[^"]+>/);
  for (const link of links.filter((item) => item.visible)) {
    assert.ok(html.includes(`data-link-id="${link.id}"`), link.id);
  }
});
