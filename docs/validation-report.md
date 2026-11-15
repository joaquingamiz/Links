# Validation report

Validation date: 2026-11-15

## Configuration status

| Area | Status | Evidence |
| --- | --- | --- |
| Repository changes | Implemented and validated in `codex/jg-links-2` | Generated static page, centralized content, tests, documentation, optimized imagery and error pages are present in the branch. |
| GitHub Pages source | Validated, unchanged | GitHub reports `build_type: legacy`, source `main` at `/`, public status `built`. |
| Public URL | Validated, unchanged | `https://joaquingamiz.github.io/Links/` returns successfully. Canonical and Open Graph URLs preserve `/Links/`. |
| HTTPS | Validated, already enforced | GitHub Pages reports `https_enforced: true`. |
| Custom domain | Intentionally not configured | GitHub reports `cname: null`. No `CNAME` file exists. |
| DNS / Cloudflare | Intentionally out of scope | No DNS record, Cloudflare setting, apex, `www`, MX or subdomain was read or changed. |
| Web-JG | Validated as read-only boundary | Branding and public links were used as reference; the repository was not modified. |
| Production deployment | Pending authorization | The branch is ready for review. Nothing is merged, so production still serves the previous version. |

## Automated checks

- `npm run check`: passed.
- Node test suite: 20 passed, 0 failed.
- Generated-file freshness: passed.
- Internal resources across `index.html`, `privacy.html` and `404.html`: passed.
- All 18 visible HTTPS destinations were checked: 17 returned HTTP 200. LinkedIn returned its automated-client block code 999; the destination itself was checked in a browser.
- Contact uses `mailto:` only. The old Formspree form and all third-party embeds were removed.

## Browser checks

- Firefox, 1440 × 1000: no horizontal overflow.
- Firefox, 390 × 844: no horizontal overflow.
- Keyboard: the first focus target is the visible `Saltar al contenido` link.
- Console: 0 errors and 0 warnings on the redesigned page.
- All six main sections render without runtime JavaScript.
- Static assets use relative paths compatible with GitHub Pages under `/Links/`.
- No insecure asset or mixed-content request is present in the generated markup.

## Lighthouse (local production-equivalent static build)

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Key metrics: FCP 0.9 s, LCP 1.9 s, TBT 70 ms, CLS 0, Speed Index 0.9 s.

## Visual evidence

- `docs/screenshots/before-desktop.webp`
- `docs/screenshots/before-mobile.webp`
- `docs/screenshots/after-desktop.webp`
- `docs/screenshots/after-mobile.webp`

## Post-merge checks

These remain pending because publishing requires an authorized merge:

1. Wait for the GitHub Pages build to finish successfully.
2. Open `https://joaquingamiz.github.io/Links/` in a clean browser session.
3. Confirm the canonical URL, Open Graph image, `robots.txt`, `404.html` and all static resources return without 404 or TLS errors.
4. Re-run Lighthouse against the public URL and compare with the local result.
5. If any regression appears, follow `docs/rollback.md`.

There is no old-to-new domain redirect to test because the official URL remains unchanged by request.
