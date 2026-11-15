# Initial audit

Audit date: 2026-11-15

## Existing deployment

- Repository: `joaquingamiz/Links`
- Default branch: `main`
- Public URL: `https://joaquingamiz.github.io/Links/`
- Public response: HTTPS 200 from GitHub Pages
- Source shape: static files in the repository root
- Custom domain and `CNAME`: absent

## Existing implementation

- One 11 KB HTML page and one 7.6 KB stylesheet.
- Repeated link markup is edited manually.
- Google Fonts and Font Awesome are loaded from third-party CDNs.
- Three eager media embeds add initial page weight and third-party requests.
- The contact modal posts personal data to Formspree.
- `yo.png` is 7,355,761 bytes and is oversized for a small avatar.
- Local images have no responsive variants and several lack intrinsic dimensions.
- The page has a title but no description, canonical, Open Graph metadata, structured data, or favicon declaration.
- `robots.txt` contains `Disallow: /`, preventing normal indexing.
- The footer copyright is fixed to 2025.
- External links do not use a consistent `rel="noopener noreferrer"` policy.

## Content and UX risks

- Paid training appears before free resources.
- The long single-column card list makes discovery slow on mobile.
- Projects, learning, content, and collaboration are not grouped by visitor intent.
- The visual language predates the current Web-JG identity.
- The privacy page describes a local form that will be removed.

## Approved remediation

Rebuild the page as a mobile-first bento hub, remove the form and embeds, centralize link data, generate committed semantic HTML, adopt the Web-JG color system, optimize real imagery, and add accessibility, SEO, privacy, and verification coverage. DNS, custom domains, Pages settings, and Web-JG remain untouched.
