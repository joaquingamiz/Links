import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

const assets = [
  ["joaquin.webp", 120_000],
  ["cyberquiz.webp", 200_000],
  ["cyber-age-wars.webp", 220_000],
  ["og-jg.webp", 250_000]
];

for (const [filename, maximumBytes] of assets) {
  test(`${filename} is present and stays within its image budget`, async () => {
    const info = await stat(new URL(`../assets/images/${filename}`, import.meta.url));
    assert.ok(info.size > 0, filename);
    assert.ok(info.size <= maximumBytes, `${filename}: ${info.size} > ${maximumBytes}`);
  });
}
