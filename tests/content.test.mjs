import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const links = JSON.parse(
  await readFile(new URL("../content/links.json", import.meta.url), "utf8")
);

const requiredFields = [
  "id",
  "name",
  "description",
  "url",
  "category",
  "order",
  "icon",
  "image",
  "visible",
  "featured",
  "label"
];

test("all link ids are stable and unique", () => {
  const ids = links.map((link) => link.id);
  assert.equal(new Set(ids).size, ids.length);
  ids.forEach((id) => assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/));
});

test("every link has the complete content contract", () => {
  for (const link of links) {
    assert.deepEqual(Object.keys(link).sort(), [...requiredFields].sort(), link.id);
    assert.equal(typeof link.order, "number", link.id);
    assert.equal(typeof link.visible, "boolean", link.id);
    assert.equal(typeof link.featured, "boolean", link.id);
  }
});

test("destinations are secure public URLs or the approved contact address", () => {
  for (const link of links) {
    assert.ok(
      link.url.startsWith("https://") || link.url === "mailto:jgamiz@proton.me",
      `${link.id}: ${link.url}`
    );
  }
});

test("local image paths remain relative and work below /Links/", () => {
  for (const link of links.filter((item) => item.image)) {
    assert.match(link.image, /^assets\/images\/[a-z0-9-]+\.(?:webp|png|jpeg)$/);
    assert.ok(!link.image.startsWith("/"), link.id);
  }
});

test("ordering is deterministic within each category", () => {
  const seen = new Set();
  for (const link of links) {
    const key = `${link.category}:${link.order}`;
    assert.ok(!seen.has(key), `duplicate order ${key}`);
    seen.add(key);
  }
});

test("visible links use the compact cover categories", () => {
  const categories = new Set(["primary", "projects", "social"]);
  for (const link of links.filter((item) => item.visible)) {
    assert.ok(categories.has(link.category), `${link.id}: ${link.category}`);
  }
});

test("the cover has the four approved projects in order", () => {
  assert.deepEqual(
    links.filter((link) => link.visible && link.category === "projects").sort((a, b) => a.order - b.order).map((link) => link.id),
    ["cyber-age-wars", "cyberquiz-start", "jg-labs", "podcast"]
  );
});
