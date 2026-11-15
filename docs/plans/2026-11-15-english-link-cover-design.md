# English Link Cover Design

## Goal

Replace the long portfolio-style homepage with a compact English link hub that feels like a personal cover for JG and makes every destination easy to find.

## Content hierarchy

The page will use four compact layers:

1. A short identity cover with portrait, `JG Links`, the approved English introduction and role line.
2. Three featured destinations: CyberQuiz, Cyber Age Wars and Blue Team from Zero.
3. A dense link library grouped into Learn, Projects, Content and Connect.
4. A small social and legal footer.

All visitor-facing copy will be English. Long portfolio narratives, oversized section headings, large empty gaps and repeated social destinations will be removed.

## Visual direction

The page preserves the Web-JG-inspired dark navy, cyan and blue palette, portrait, subtle grid, rounded surfaces and restrained glow. The content shell narrows to roughly 960 pixels. Cards become shorter and denser, with a two-column desktop grid and one-column mobile layout. The complete experience should feel like a cover and link directory rather than a multi-section portfolio.

## Content model and rendering

`content/links.json` remains the source of truth. Its categories and English descriptions will drive the featured links and grouped link library. `scripts/build.mjs` continues generating committed static HTML from `src/index.template.html`. No runtime JavaScript or external dependency will be introduced.

## Accessibility and resilience

The page keeps semantic headings, a skip link, visible focus states, reduced-motion support, relative asset paths and descriptive link names. Missing or hidden entries remain excluded by the generator. The 404, privacy compatibility page, canonical URL and GitHub Pages `/Links/` deployment contract remain unchanged.

## Validation

Automated tests will lock the English-only content, featured destinations, grouped link-library structure, generated-file freshness and asset paths. Browser validation will cover desktop and mobile layout, keyboard focus, console errors, image loading, horizontal overflow and the public GitHub Pages deployment. Lighthouse will be run after publication.

## Deployment boundary

Changes will be delivered through a pull request and published only by merging after validation. GitHub Pages remains on `main` at the repository root. No DNS, Cloudflare, custom-domain, `CNAME` or Web-JG change is permitted.
