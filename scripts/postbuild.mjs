import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = new URL('../dist/', import.meta.url);
const indexPath = new URL('index.html', distDir);

function normalizeUrl(value) {
  if (!value) return null;
  const url = new URL(value);
  url.pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  url.search = '';
  url.hash = '';
  return url.toString();
}

function deriveGitHubPagesUrl() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) return null;
  const [owner, repo] = repository.split('/');
  if (!owner || !repo) return null;
  // github.io hosts are always lower-case; the repository path keeps its casing.
  const host = `${owner.toLowerCase()}.github.io`;
  return repo.toLowerCase() === host ? `https://${host}/` : `https://${host}/${repo}/`;
}

/* An unset Actions variable arrives as an empty string, not as undefined, so the
   fallback has to be `||`: with `??` the derived Pages URL was never reached and
   the deployed page shipped a relative og:image with no canonical or sitemap. */
const configuredUrl = process.env.SITE_URL?.trim();
const siteUrl = normalizeUrl(configuredUrl || deriveGitHubPagesUrl());
let html = await readFile(indexPath, 'utf8');

if (siteUrl) {
  const ogImageUrl = new URL('og-image.png', siteUrl).toString();
  html = html.replaceAll('__SITE_URL__', siteUrl).replaceAll('__OG_IMAGE_URL__', ogImageUrl);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;
  await writeFile(new URL('sitemap.xml', distDir), sitemap, 'utf8');
  await writeFile(
    new URL('robots.txt', distDir),
    `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl)}\n`,
    'utf8',
  );
} else {
  html = html
    .replace(/\s*<link rel="canonical" href="__SITE_URL__" \/>/, '')
    .replace(/\s*<meta property="og:url" content="__SITE_URL__" \/>/, '')
    .replace('__OG_IMAGE_URL__', './og-image.png');
  await writeFile(new URL('robots.txt', distDir), 'User-agent: *\nAllow: /\n', 'utf8');
}

await writeFile(indexPath, html, 'utf8');
