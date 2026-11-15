# General JG Link Cover Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the supplied JG logo, current LinkedIn portrait, general categories and approved featured-link order to the compact cover.

**Architecture:** Preserve the current zero-dependency generator and layout. Update managed assets and content data, adapt template branding and category rendering, then verify locally and in production.

**Tech Stack:** HTML, CSS, JSON, Node.js ESM generator, Node test runner, GitHub Pages.

---

### Task 1: Add approved identity assets

**Files:**
- Create: `assets/images/jg-logo.png`
- Replace: `assets/images/joaquin.webp`
- Modify: `tests/assets.test.mjs`

Copy the supplied logo, obtain the current public LinkedIn portrait, add asset-budget tests and verify the files render correctly.

### Task 2: Generalize content and featured order

**Files:**
- Modify: `content/links.json`
- Modify: `scripts/build.mjs`
- Modify: `tests/content.test.mjs`
- Modify: `tests/build.test.mjs`

Write failing tests for `official-web`, `cyber-age-wars`, `cyberquiz-start` as the exact featured order and for Projects, Content, Training and Connect as the general directory. Update the content and generator until focused tests pass.

### Task 3: Apply logo branding and general cover copy

**Files:**
- Modify: `src/index.template.html`
- Modify: `assets/css/main.css`
- Modify: `index.html`
- Modify: `tests/visual-contract.test.mjs`

Replace the text-only mark with the supplied logo, remove exclusive Blue Team framing from the cover, update the featured Website card treatment and regenerate HTML. Run the full check suite.

### Task 4: Validate and publish

**Files:**
- Modify: `README.md`
- Modify: `docs/validation-report.md`
- Update: `docs/screenshots/after-desktop.webp`
- Update: `docs/screenshots/after-mobile.webp`

Validate desktop, mobile, keyboard, assets, console, overflow and Lighthouse. Update documentation, open a PR, merge to `main`, wait for GitHub Pages and repeat production checks.
