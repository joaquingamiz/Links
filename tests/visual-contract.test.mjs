import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");

test("the generated page preserves the approved hero and semantic structure", () => {
  assert.match(html, /I’m JG\./);
  assert.match(html, /Projects, resources and places where you can find me\./);
  assert.match(html, /Cybersecurity Architect <span>·<\/span> Cloud Security <span>·<\/span> AI <span>·<\/span> MVP/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /id="featured"/);
  assert.match(html, /id="all-links"/);
  assert.match(html, /assets\/images\/jg-logo\.png/);
  assert.match(html, /assets\/images\/joaquin-linkedin\.jpeg/);
  assert.match(html, /Personal link hub/);
  assert.match(html, /Featured links/);
  assert.match(html, /All links/);
  assert.doesNotMatch(html, /Blue Team from Zero|Welcome to the Blue Team side/);
  assert.doesNotMatch(html, /Tres buenos primeros pasos|Ideas que acabaron funcionando|Formación con los pies en la tierra|Nos vemos por internet|Construyamos algo útil/);
  assert.doesNotMatch(html, /formspree|<iframe|fonts\.googleapis|font-awesome/i);
});

test("the visual system uses the Web-JG palette and accessibility contracts", async () => {
  const css = await readFile(new URL("assets/css/main.css", root), "utf8");
  for (const color of ["#050b1b", "#0d1a39", "#25d0ff", "#2e6bff", "#ecf2ff"]) {
    assert.ok(css.includes(color), color);
  }
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/);
});

test("the visual system stays compact and responsive", async () => {
  const css = await readFile(new URL("assets/css/main.css", root), "utf8");
  assert.match(css, /--shell:\s*60rem/);
  assert.match(css, /\.library-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media\s*\(min-width:\s*48rem\)[\s\S]*\.library-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});

test("the brand link keeps its visible text in the accessible name", () => {
  assert.doesNotMatch(html, /class="brand"[^>]*aria-label=/);
});

test("the page renders all content without runtime JavaScript", async () => {
  const css = await readFile(new URL("assets/css/main.css", root), "utf8");
  assert.doesNotMatch(html, /<script\s+src=/);
  assert.doesNotMatch(css, /\[data-reveal\][^{]*\{[^}]*opacity:\s*0/s);
});
