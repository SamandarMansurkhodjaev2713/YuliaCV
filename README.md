# Yulia Brynskikh — SMM Portfolio

A static editorial portfolio for an SMM specialist. The site is designed for GitHub Pages and contains no backend, CMS, form endpoint, authentication, database, or runtime secrets.

## Stack

- Vite
- React
- TypeScript strict mode
- CSS Modules and CSS custom properties
- Motion for React
- Vitest
- Playwright

## Local development

```bash
npm ci
npm run dev
```

Open the URL printed by Vite.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e -- --project=chromium
npm run test:visual -- --project=chromium
```

The combined static quality gate is:

```bash
npm run check
```

## Content editing

All public copy and contact data live in:

```text
src/content/site.ts
```

The Telegram URL is configured. `contacts.instagram` is intentionally `null` until a real profile URL is confirmed. Once supplied, set it to a valid `https://instagram.com/...` URL; the Contact, mobile menu, and Footer links will appear automatically.

The CV is stored at:

```text
public/downloads/yulia-brynskikh-cv.pdf
```

Replace it with an updated file under the same name to preserve links.

## Photography

Current portrait assets were derived from the supplied CV image and are suitable as a layout-complete fallback. Replace these files with full-resolution originals before the final public launch when available:

```text
src/assets/images/yulia-portrait.webp
src/assets/images/yulia-working-detail.webp
```

Keep the same aspect ratios or re-check all visual snapshots.

## GitHub Pages deployment

1. Push the repository to GitHub with the default branch named `main`.
2. In repository settings, select **GitHub Actions** as the Pages source.
3. Push to `main` or run **Verify and deploy GitHub Pages** manually.

The workflow runs lint, typecheck, unit tests, Chromium E2E tests, and the production build before deployment.

Vite uses relative asset paths, so the site works both at:

```text
https://username.github.io/repository-name/
```

and at a custom domain.

For a custom domain, create a repository Actions variable named `SITE_URL` with the complete canonical URL, for example:

```text
https://portfolio.example.com/
```

Without that variable, the post-build script derives the standard GitHub Pages URL from repository metadata.

## Design and interaction rules

- Editorial composition, warm paper background, ink typography, restrained oxblood accent.
- Prata for display typography and Onest for body/interface text.
- No gradient blobs, glass cards, generic bento grids, custom cursor, scroll hijacking, 3D tilt, fake metrics, or fake testimonials.
- Motion is built from mask reveals, line drawing, media transitions, and small link interactions.
- Reduced motion is fully supported.

## Project structure

```text
src/
├── app/
├── assets/
├── components/
│   ├── layout/
│   ├── motion/
│   ├── primitives/
│   └── sections/
├── content/
├── hooks/
├── lib/
└── styles/
```

See `docs/architecture.md` and `docs/visual-qa.md` for implementation boundaries and review criteria.

## Supported browsers

The target matrix is current Chromium, Firefox, Edge, Safari/WebKit, iPhone Safari, and Android Chrome. Progressive motion is reduced on constrained or reduced-motion environments; all content remains available without animation.
