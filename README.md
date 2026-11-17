# JG Links

A compact English link landing for Joaquín Gamiz, hosted at [joaquingamiz.github.io/Links](https://joaquingamiz.github.io/Links/).

The page contains a short personal introduction, a primary Official Website link, four projects (Cyber Age Wars, CyberQuiz, JG Labs and Un Podcast Seguro), and social/contact icons. Charcoal surfaces, white typography and distinct project accents keep each destination easy to identify.

## Updating destinations

Edit `content/links.json`, run `npm run build`, then `npm run check`. Commit the generated `index.html` with its source changes. Visible entries use `primary`, `projects` or `social`; other destinations remain hidden for future reuse.

## Local preview

Run `python3 -m http.server 4173` and open `http://127.0.0.1:4173/`.

## Deployment

GitHub Pages serves `main` at `/`. Assets are relative for the existing `/Links/` URL. DNS, Cloudflare, custom domains and Web-JG remain outside this change.

See [validation](docs/validation-report.md) and [rollback](docs/rollback.md).
