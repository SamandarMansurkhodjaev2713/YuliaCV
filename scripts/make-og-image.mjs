/**
 * Renders public/og-image.png — the share card used by Telegram, LinkedIn and
 * search previews. The card mirrors the hero: same copy, same palette, same
 * monochrome portrait treatment, so re-run it whenever the portrait or the
 * hero wording changes.
 *
 *   npm run og
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const OUT = process.argv[2] ?? 'public/og-image.png';
const portrait = `data:image/webp;base64,${readFileSync('src/assets/images/yulia-portrait.webp').toString('base64')}`;

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&family=Prata&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: #f2ede3;
    --ink: #171412;
    --ink-rgb: 23, 20, 18;
    --oxblood: #690b10;
    --muted: #5f5850;
  }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: var(--paper); color: var(--ink);
         font-family: 'Onest', Arial, sans-serif; overflow: hidden; position: relative; }

  .portrait { position: absolute; inset: 0 0 0 786px; overflow: hidden;
               border-left: 1px solid rgba(var(--ink-rgb), 0.2); }
  .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 26%;
                  filter: grayscale(1) sepia(0.52) contrast(1.1) brightness(1.045); display: block; }
  .portrait::after {
    content: ''; position: absolute; inset: 0;
    background:
      linear-gradient(to right, rgba(var(--ink-rgb), 0.38), rgba(var(--ink-rgb), 0) 20%),
      linear-gradient(to top, rgba(var(--ink-rgb), 0.42), rgba(var(--ink-rgb), 0) 34%),
      radial-gradient(74% 54% at 38% 30%, rgba(var(--ink-rgb), 0) 26%, rgba(var(--ink-rgb), 0.72) 100%);
  }

  .copy { position: absolute; left: 80px; top: 0; width: 660px; height: 630px;
          display: flex; flex-direction: column; }
  .rule { height: 1px; background: rgba(var(--ink-rgb), 0.24); }
  .eyebrow { margin-top: 26px; color: var(--oxblood); font-size: 19px; font-weight: 600;
             letter-spacing: 0.15em; text-transform: uppercase; }
  h1 { margin-top: 46px; font-family: 'Prata', 'Times New Roman', serif; font-weight: 400;
       font-size: 96px; line-height: 0.94; letter-spacing: -0.015em; }
  h1 span { color: var(--oxblood); }
  p { margin-top: 34px; max-width: 600px; font-size: 25px; line-height: 1.45;
      color: rgba(var(--ink-rgb), 0.82); }
  .foot { margin-top: auto; margin-bottom: 60px; }
  .footRow { display: flex; justify-content: space-between; align-items: baseline;
             padding-top: 18px; color: var(--muted); font-size: 16px; font-weight: 500;
             letter-spacing: 0.14em; text-transform: uppercase; }
  .handle { text-transform: none; letter-spacing: 0.06em; }
  .dot { display: inline-block; width: 7px; height: 7px; margin-right: 12px;
         border-radius: 50%; background: var(--oxblood); vertical-align: 1px; }
</style></head>
<body>
  <div class="portrait"><img src="${portrait}" alt=""></div>
  <div class="copy">
    <div style="margin-top:74px" class="rule"></div>
    <div class="eyebrow">SMM-специалист · маркетинг с MBA-базой</div>
    <h1>Юлия<br><span>Брынских.</span></h1>
    <p>Позиционирование, Tone of Voice, контент-система и понятный путь к заявке.</p>
    <div class="foot">
      <div class="rule"></div>
      <div class="footRow">
        <span><i class="dot"></i>Ташкент · открыта к проектам и вакансиям</span>
        <span class="handle">@yulleishn</span>
      </div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  await document.fonts.ready;
});
await page.waitForTimeout(400);
await page.screenshot({ path: OUT });
await browser.close();
console.log('wrote', OUT);
