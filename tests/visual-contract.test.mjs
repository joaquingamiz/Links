import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");

test("the generated page preserves the approved hero and semantic structure", () => {
  assert.match(html, /I’m JG\./);
  assert.match(html, /Everyone wants to be a hacker/);
  assert.match(html, /Cybersecurity Architect <span>·<\/span> Blue Team <span>·<\/span> Cloud Security <span>·<\/span> MVP/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /id="proyectos"/);
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

test("progressive enhancement does not send analytics or mutate link destinations", async () => {
  const script = await readFile(new URL("assets/js/main.js", root), "utf8");
  assert.match(script, /IntersectionObserver/);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/);
});
