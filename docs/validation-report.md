# Validation report

Validation date: 2026-11-15

## Configuration status

| Area | Status | Evidence |
| --- | --- | --- |
| Repository changes | Implemented and validated in `codex/general-jg-link-cover` | General English link cover, supplied JG logo and portrait, three ordered featured destinations, grouped link directory, related SVG icons, centralized content, tests and documentation are present in the branch. |
| GitHub Pages source | Validated, unchanged | GitHub reports `build_type: legacy`, source `main` at `/`, public status `built`. |
| Public URL | Validated, unchanged | `https://joaquingamiz.github.io/Links/` returns successfully. Canonical and Open Graph URLs preserve `/Links/`. |
| HTTPS | Validated, already enforced | GitHub Pages reports `https_enforced: true`. |
| Custom domain | Intentionally not configured | GitHub reports `cname: null`. No `CNAME` file exists. |
| DNS / Cloudflare | Intentionally out of scope | No DNS record, Cloudflare setting, apex, `www`, MX or subdomain was read or changed. |
| Web-JG | Validated as read-only boundary | Branding and public links were used as reference; the repository was not modified. |
| Production deployment | Authorized, pending merge | Local validation is complete. Production continues serving the previous version until the pull request is merged. |

## Automated checks

- `npm run check`: passed.
- Node test suite: 27 passed, 0 failed.
- Generated-file freshness: passed.
- Internal resources across `index.html`, `privacy.html` and `404.html`: passed.
- All 18 visible HTTPS destinations were checked: 17 returned HTTP 200. LinkedIn returned its automated-client block code 999; the destination itself was checked in a browser.
- Contact uses `mailto:` only. The old Formspree form and all third-party embeds were removed.

## Browser checks

- Firefox, 1440 × 1000: no horizontal overflow.
- Firefox, 390 × 844: no horizontal overflow.
- Keyboard: the first focus target is the visible `Skip to content` link.
- Console: 0 errors and 0 warnings on the redesigned page.
- The supplied square portrait renders without an aggressive crop, and the JG shield is used in the header, favicon and Official Website card.
- The cover, ordered featured links, four directory groups, related SVG icons and social row render without runtime JavaScript.
- Document language and all interface copy are English; Spanish destination slugs and the `Un Podcast Seguro` brand name remain unchanged.
- Full-page responsive captures were reviewed at 1440 px desktop width and the iPhone 13 profile.
- Static assets use relative paths compatible with GitHub Pages under `/Links/`.
- No insecure asset or mixed-content request is present in the generated markup.

## Lighthouse baseline

| Category | Score |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Latest baseline from the preceding production-equivalent static build: FCP 0.8 s, LCP 2.4 s, TBT 0 ms, CLS 0. A fresh public run remains part of the post-merge checks below.

## Visual evidence

- `docs/screenshots/before-desktop.webp`
- `docs/screenshots/before-mobile.webp`
- `docs/screenshots/after-desktop.png`
- `docs/screenshots/after-mobile.png`

## Post-merge checks

These remain pending until the authorized merge completes:

1. Wait for the GitHub Pages build to finish successfully.
2. Open `https://joaquingamiz.github.io/Links/` in a clean browser session.
3. Confirm the canonical URL, Open Graph image, `robots.txt`, `404.html` and all static resources return without 404 or TLS errors.
4. Re-run Lighthouse against the public URL and compare with the local result.
5. If any regression appears, follow `docs/rollback.md`.

There is no old-to-new domain redirect to test because the official URL remains unchanged by request.
