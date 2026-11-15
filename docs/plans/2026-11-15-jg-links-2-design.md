# JG Links 2.0 Design

## Goal

Replace the existing link list with a mobile-first personal hub that feels consistent with Web-JG while remaining a small, static GitHub Pages site at `https://joaquingamiz.github.io/Links/`.

## Fixed constraints

- Keep GitHub Pages, `main`, and the `/Links/` base path.
- Do not create DNS records, a custom domain, or a `CNAME` file.
- Do not modify Web-JG or introduce a CMS, database, analytics, React, or Next.js.
- Work in a feature branch and deliver a pull request without merging it.

## Content and hierarchy

The page is organized by visitor intent: identity, a fast starting point, owned projects, learning resources, social content, and collaboration. The hero copy is:

> I'm JG. 🛡️
>
> Everyone wants to be a hacker. Who's going to stop them?
>
> Welcome to the Blue Team side of cybersecurity. 🔵

The supporting role line is `Cybersecurity Architect · Blue Team · Cloud Security · MVP`.

The featured destinations are limited to verified public pages: CyberQuiz, Cyber Age Wars, the seven-skills guide, the introductory cybersecurity video, the Blue Team ebook, AZ-900, the Web-JG projects and formation hubs, social profiles, Un Podcast Seguro, companies, mentoring, and public contact.

## Visual system

Use Web-JG's visual language as the reference: `#050b1b` background, `#0d1a39` surfaces, `#25d0ff` cyan, `#2e6bff` blue, and `#ecf2ff` text. Build a restrained bento layout with soft borders, controlled gradients, visible focus states, and small motion that is disabled by `prefers-reduced-motion`. Mobile is a single compact flow; wider screens use an asymmetric grid without stretching the content.

## Architecture

A zero-dependency Node generator reads `content/links.json` and renders semantic HTML from `src/index.template.html`. The generated `index.html` remains committed and is served directly by GitHub Pages, so runtime JavaScript is optional and content remains available without it. CSS, local SVG icons, and optimized images live under `assets/` with relative paths compatible with `/Links/`.

## Accessibility, privacy, and SEO

Use landmarks, a skip link, meaningful headings, 44px targets, visible keyboard focus, AA contrast, reduced-motion support, and useful alternative text. Remove Formspree, embeds, tracking, cookies, Google Fonts, and Font Awesome. Add the current GitHub Pages canonical URL, Open Graph metadata, Person/WebPage JSON-LD, and an indexable `robots.txt`. Keep `privacy.html` as a small compatibility page pointing to the official privacy policy.

## Verification and rollback

Validate generated-file freshness, data schema, visible links, internal asset paths, metadata, keyboard navigation, responsive layouts, mixed content, public destinations, and Lighthouse. Capture before/after desktop and mobile screenshots. Before merge, rollback is closing the PR; after an authorized merge, rollback is a Git revert of the PR commit.
