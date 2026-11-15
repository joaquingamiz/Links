# English Link Cover Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn JG Links into a compact, English-only personal cover with three featured destinations and a grouped link library.

**Architecture:** Keep the zero-dependency static generator. Translate and recategorize `content/links.json`, simplify the HTML template to a cover/featured/library/footer structure, and replace the long-form CSS with a compact responsive system. Preserve committed generated HTML and the existing GitHub Pages deployment contract.

**Tech Stack:** HTML, CSS, JSON, Node.js ESM generator, Node test runner, GitHub Pages.

---

### Task 1: Lock the English content contract

**Files:**
- Modify: `tests/content.test.mjs`
- Modify: `tests/visual-contract.test.mjs`
- Modify: `content/links.json`

**Step 1: Write failing tests**

Add assertions that every visible link uses one of `featured`, `learn`, `projects`, `content`, or `connect`; that the featured IDs are `cyberquiz-start`, `cyber-age-wars`, and `blue-team-ebook`; and that generated visitor copy contains the English cover labels without the former Spanish section headings.

**Step 2: Run the focused tests**

Run: `node --test tests/content.test.mjs tests/visual-contract.test.mjs`

Expected: FAIL because the existing categories and long Spanish page remain.

**Step 3: Translate and recategorize content**

Update all visible names, descriptions and labels in `content/links.json`. Keep URLs, IDs, image paths, visibility and tracking identity stable. Remove duplicate destination entries where the same link would otherwise appear in featured and library areas.

**Step 4: Run the content tests**

Run: `node --test tests/content.test.mjs`

Expected: content contract assertions pass; visual assertions may still fail until Task 2.

**Step 5: Commit**

```bash
git add content/links.json tests/content.test.mjs tests/visual-contract.test.mjs
git commit -m "content: refocus links as an English directory"
```

### Task 2: Replace the portfolio template with a link cover

**Files:**
- Modify: `src/index.template.html`
- Modify: `scripts/build.mjs`
- Modify: `index.html`
- Modify: `tests/build.test.mjs`
- Modify: `tests/visual-contract.test.mjs`

**Step 1: Add failing structure tests**

Require one compact cover, one featured grid with exactly three generated cards, four grouped link sections, and one footer. Assert that former portfolio section IDs and oversized narrative headings are absent.

**Step 2: Run the focused tests**

Run: `node --test tests/build.test.mjs tests/visual-contract.test.mjs`

Expected: FAIL against the current long template.

**Step 3: Implement the generator and template**

Render featured cards from the `featured` category and grouped compact links from the four library categories. Use the approved English cover copy, preserve semantic headings and skip navigation, and keep relative asset paths plus existing metadata.

**Step 4: Generate and test**

Run: `npm run build && node --test tests/build.test.mjs tests/visual-contract.test.mjs`

Expected: focused tests pass.

**Step 5: Commit**

```bash
git add src/index.template.html scripts/build.mjs index.html tests/build.test.mjs tests/visual-contract.test.mjs
git commit -m "feat: build compact English link cover"
```

### Task 3: Apply the compact responsive visual system

**Files:**
- Modify: `assets/css/main.css`
- Modify: `tests/visual-contract.test.mjs`

**Step 1: Add failing compact-layout assertions**

Require a shell no wider than 960px, a two-column desktop library, a one-column mobile fallback, visible focus styles and reduced-motion support.

**Step 2: Run the visual contract test**

Run: `node --test tests/visual-contract.test.mjs`

Expected: FAIL until the new compact CSS replaces the portfolio layout.

**Step 3: Implement the styles**

Retain the JG palette and visual motifs while reducing vertical spacing, card height and headline scale. Keep the portrait compact, featured cards visual, library links dense and footer minimal.

**Step 4: Run the test suite**

Run: `npm run check`

Expected: all tests, generated-file checks and internal-resource checks pass.

**Step 5: Commit**

```bash
git add assets/css/main.css tests/visual-contract.test.mjs
git commit -m "style: condense JG Links into a cover layout"
```

### Task 4: Browser validation and documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/validation-report.md`
- Update: `docs/screenshots/after-desktop.webp`
- Update: `docs/screenshots/after-mobile.webp`

**Step 1: Preview the static site**

Run: `python3 -m http.server 4173 --bind 127.0.0.1`

Expected: the generated page loads at `http://127.0.0.1:4173/`.

**Step 2: Validate with Playwright**

Check 1440px desktop and 390px mobile views, keyboard focus, console output, lazy images, horizontal overflow, link count and full-page screenshots.

Expected: no console errors, missing images or horizontal overflow; the first Tab focuses the skip link.

**Step 3: Run Lighthouse locally**

Expected: strong performance and 100 accessibility, best-practices and SEO scores, with no label/content-name mismatch.

**Step 4: Update documentation**

Describe the compact English information architecture and record the new validation results. Keep the DNS and deployment boundaries explicit.

**Step 5: Verify and commit**

Run: `npm run check && git diff --check`

```bash
git add README.md docs/validation-report.md docs/screenshots/after-desktop.webp docs/screenshots/after-mobile.webp
git commit -m "docs: validate compact English link cover"
```

### Task 5: Review, publish and validate production

**Files:**
- No source file changes expected.

**Step 1: Push and open a pull request**

Push `codex/english-link-cover`, open a PR against `main`, and include tests, Lighthouse results and the deployment boundary.

**Step 2: Merge after local verification**

Merge only the validated PR without changing DNS or GitHub Pages settings.

**Step 3: Monitor GitHub Pages**

Wait for `pages-build-deployment` to complete successfully.

**Step 4: Validate production**

Check `https://joaquingamiz.github.io/Links/`, essential assets, 404 behavior, console, responsive layout, keyboard focus, mixed content and Lighthouse.

Expected: production matches the approved compact English design and passes all checks.
