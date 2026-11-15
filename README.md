# JG Links

Personal projects, resources, and content hub for Joaquín Gamiz. The site is served by GitHub Pages at [joaquingamiz.github.io/Links](https://joaquingamiz.github.io/Links/).

## Architecture

The site has no runtime framework or external dependency. `content/links.json` is the source of truth for managed destinations. `scripts/build.mjs` combines that content with `src/index.template.html` and commits the resulting `index.html` for GitHub Pages.

## Update a link

1. Edit `content/links.json`.
2. Run `npm run build`.
3. Run `npm run check`.
4. Review and commit both the content change and generated `index.html`.

Each link has a stable ID, name, description, URL, category, order, icon, optional image, visibility state, featured state, and optional label. Set `visible` to `false` to remove a link from generated output without deleting its configuration.

## Local preview

```bash
npm run build
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. Asset paths are relative so the same output works under the production `/Links/` path.

## Verification

```bash
npm test
npm run check
```

The check suite verifies content integrity, generated-file freshness, accessibility/visual contracts, SEO/privacy requirements, image budgets, and internal resource paths.

## Deployment boundary

GitHub Pages continues to deploy from the existing repository and branch configuration. This project does not use a custom domain or `CNAME`, and its workflow must not change DNS, Cloudflare, or `Web-JG`.

See [the validation report](docs/validation-report.md) and [rollback procedure](docs/rollback.md) for release evidence.
