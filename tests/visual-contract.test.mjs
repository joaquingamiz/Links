import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");

test("the page retains personal identity and an accessible static structure", () => {
  assert.match(html, /I’m JG\./);
  assert.match(html, /assets\/images\/jg-logo\.png/);
  assert.match(html, /assets\/images\/joaquin-linkedin\.jpeg/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /aria-label="Find me online"/);
  assert.doesNotMatch(html, /<script\s+src=|<iframe|fonts\.googleapis|font-awesome/i);
});
test("the page preserves focus and reduced-motion support", async () => {
  const css = await readFile(new URL("assets/css/main.css", root), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});
test("social icon links have accessible names", () => {
  for (const id of ["linkedin", "github", "youtube", "instagram", "tiktok", "contact"]) {
    assert.match(html, new RegExp('data-link-id="' + id + '" aria-label="[^"]+"'));
  }
});
