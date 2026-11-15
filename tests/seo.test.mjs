import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the generated page declares its current GitHub Pages identity", async () => {
  const html = await read("index.html");
  assert.match(html, /<link rel="canonical" href="https:\/\/joaquingamiz\.github\.io\/Links\/">/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.doesNotMatch(html, /(?:src|href)="http:\/\//);
  assert.doesNotMatch(html, /formspree|<form|<iframe/i);
});

test("robots allows indexing at the current public URL", async () => {
  const robots = await read("robots.txt");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.doesNotMatch(robots, /Disallow:\s*\//);
});

test("the privacy compatibility page delegates to the official policy", async () => {
  const privacy = await read("privacy.html");
  assert.match(privacy, /https:\/\/joaquingamiz\.com\/politica-privacidad/);
  assert.match(privacy, /rel="canonical" href="https:\/\/joaquingamiz\.com\/politica-privacidad"/);
  assert.doesNotMatch(privacy, /formspree|<form/i);
});

test("the not-found page routes visitors back without root-relative paths", async () => {
  const notFound = await read("404.html");
  assert.match(notFound, /href="\.\/"/);
  assert.match(notFound, /href="assets\/css\/main\.css"/);
  assert.doesNotMatch(notFound, /href="\/(?!\/)/);
});
