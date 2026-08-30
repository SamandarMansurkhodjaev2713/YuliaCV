# Handoff

Production-ready static Vite/React/TypeScript portfolio landing for GitHub Pages.

## Run locally

```bash
npm ci
npm run dev
```

## Full verification

```bash
npm run check
npm run test:e2e
npm run test:visual -- --project=chromium
```

## Deploy

Push the repository to GitHub, enable **Settings → Pages → Source: GitHub Actions**, and push to `main`. The included workflow validates and deploys the `dist` artifact. The workflow derives the Pages URL from `GITHUB_REPOSITORY`; no backend or runtime secrets are required.

Before public launch, replace the fallback CV portrait with original high-resolution photographs and set Instagram in `src/content/site.ts` after the real URL is confirmed.
