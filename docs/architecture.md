# Architecture

## Scope

The project is a static, single-page portfolio. It has no backend, database, CMS, authentication, form submission, runtime API, or secret configuration.

## Boundaries

- `src/content` is the typed source of truth for copy and contact links, one file per locale (`ru.ts`, `en.ts`) sharing `SiteContent`.
- `src/i18n` owns the active locale: provider, persistence, `<html lang>` and document title.
- `src/components/sections` owns page-level compositions.
- `src/components/layout` owns global navigation and footer.
- `src/components/motion` contains reusable motion primitives only.
- `src/hooks` contains lifecycle-aware browser integrations with explicit cleanup.
- `scripts/postbuild.mjs` is the only build-time SEO transformation.

## Rendering

React renders one route. Internal navigation uses document anchors, so GitHub Pages does not need an SPA fallback.

## Deployment

Vite uses `base: './'`, making generated assets relative to the deployed document. The post-build script derives a GitHub Pages URL from `GITHUB_REPOSITORY`, or accepts an explicit `SITE_URL` repository variable for a custom domain.

## Motion

Motion is progressive enhancement. All narrative content remains visible with `prefers-reduced-motion: reduce`. Scroll-linked effects use Motion values or `IntersectionObserver`; event listeners and observers are cleaned up.
