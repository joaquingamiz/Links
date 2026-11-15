# Rollback strategy

## Before merge

Close the pull request or leave it unmerged. GitHub Pages continues serving the current `main` branch and no production state changes.

## After an authorized merge

1. Identify the merge commit for the JG Links 2.0 pull request.
2. Create a dedicated rollback branch from the current `main`.
3. Run `git revert <merge-commit>`; do not reset or force-push shared history.
4. Run `npm run check` and preview the reverted site locally.
5. Open a rollback pull request and merge it through the normal reviewed process.
6. Confirm `https://joaquingamiz.github.io/Links/` and its static resources return successfully.

## Boundaries

There is no DNS rollback because the implementation does not create or modify DNS, Cloudflare, a custom domain, a `CNAME` file, hosting settings, or Web-JG.
