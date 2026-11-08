// Renders public/og-image.png (1200×630), the preview card for links to the
// docs, from an HTML version of the landing page hero. Run it after changing
// the hero's look:
//
//   node packages/docs/scripts/og-image.mjs
//
// It needs the repository's puppeteer and fetches the Geist fonts.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch } from 'puppeteer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mark = await readFile(join(root, 'public/images/user-flow-mark.svg'), 'utf8');
const symbol = mark.replace(/<svg[^>]*>/, '<svg width="0" height="0" style="position:absolute">');

const steps = [
  ['navigation', 'Navigation', 'Page load', '92'],
  ['timespan', 'Timespan', 'Interaction', '9/10'],
  ['snapshot', 'Snapshot', 'Page state', '18/19'],
];

const icon = (mode) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/>${
    mode === 'timespan'
      ? '<path d="M12 7v5l3.5 2"/>'
      : mode === 'snapshot'
        ? '<path d="m14.3 8 5.2 9M9.7 8h10.4M7.4 12l5.2-9M9.7 16 4.5 7M14.3 16H3.9M16.6 12l-5.2 9"/>'
        : ''
  }</svg>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600&family=Geist+Mono:wght@500;600&display=swap">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; width: 1200px; height: 630px; overflow: hidden; font-family: Geist, system-ui, sans-serif; color: #f8fafc; background: #0d121c; position: relative; }
  .grid { position: absolute; inset: 0; background-image: radial-gradient(#364152 1.2px, transparent 1.6px); background-size: 24px 24px; mask-image: radial-gradient(ellipse 70% 80% at 60% 30%, #000 20%, transparent 80%); }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); }
  .blob-1 { width: 620px; height: 420px; left: 560px; top: -140px; background: rgb(105 39 218 / 0.55); }
  .blob-2 { width: 420px; height: 320px; left: -120px; top: 330px; background: rgb(177 3 44 / 0.35); }
  .copy { position: absolute; left: 80px; top: 110px; width: 620px; }
  .pill { display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px 6px 12px; border: 1px solid #5720b7; border-radius: 999px; background: rgb(18 25 38 / 0.7); font-family: 'Geist Mono', monospace; font-size: 15px; color: #ddd6fe; }
  .pill i { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgb(34 197 94 / 0.25); }
  .pill span { padding-left: 10px; border-left: 1px solid #5720b7; color: #9aa4b2; }
  h1 { margin: 26px 0 0; font-size: 72px; line-height: 1.02; font-weight: 600; letter-spacing: -0.035em; }
  h1 b { font-weight: 600; background: linear-gradient(100deg, #c3b5fd, #ff94ad); -webkit-background-clip: text; background-clip: text; color: transparent; }
  p { margin: 24px 0 0; font-size: 24px; line-height: 1.4; color: #9aa4b2; max-width: 560px; }
  .url { position: absolute; left: 80px; bottom: 54px; font-family: 'Geist Mono', monospace; font-size: 20px; color: #cdd5df; }
  .scene { position: absolute; right: 70px; top: 90px; width: 400px; height: 450px; }
  .orbit { position: absolute; left: 50%; top: 110px; border-radius: 50%; border: 1.5px dashed #364152; transform: translate(-50%, -50%); }
  .orbit-1 { width: 260px; height: 260px; }
  .orbit-2 { width: 410px; height: 410px; opacity: .6; }
  .orbit i { position: absolute; top: -4px; left: 50%; width: 8px; height: 8px; border-radius: 50%; background: #875bf7; box-shadow: 0 0 12px 3px rgb(164 138 251 / .6); }
  .ufo { position: absolute; left: 50%; top: 110px; width: 150px; height: 150px; transform: translate(-50%, -50%) rotate(-6deg); color: #202939; stroke: #f8fafc; filter: drop-shadow(0 16px 20px rgb(0 0 0 / .55)); }
  .beam { position: absolute; left: 50%; top: 165px; width: 220px; height: 170px; transform: translateX(-50%); clip-path: polygon(40% 0, 60% 0, 100% 100%, 0 100%); background: linear-gradient(rgb(135 91 247 / .5), rgb(135 91 247 / .1) 70%, transparent); }
  .targets { position: absolute; left: 0; right: 0; bottom: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .target { position: relative; padding: 16px 8px 12px; border: 1px solid #202939; border-radius: 16px; background: rgb(18 25 38 / 0.8); text-align: center; color: #9aa4b2; }
  .target.active { border-color: #5720b7; background: #2e125e; color: #ddd6fe; box-shadow: 0 0 40px -10px rgb(135 91 247 / .8); transform: translateY(-6px); }
  .target svg { width: 34px; height: 34px; color: #875bf7; }
  .target.active svg { color: #c3b5fd; }
  .label { display: block; margin-top: 8px; font-size: 16px; font-weight: 500; }
  .note { display: block; font-size: 12px; color: #697586; }
  .chip { position: absolute; top: -12px; right: 10px; padding: 2px 9px; border-radius: 999px; background: #22c55e; color: #fff; font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 600; box-shadow: 0 2px 10px rgb(34 197 94 / .5); }
</style></head>
<body>
${symbol}
<div class="grid"></div>
<div class="blob blob-1"></div>
<div class="blob blob-2"></div>
<div class="copy">
  <div class="pill"><i></i>@push-based/user-flow<span>CLI · Lighthouse</span></div>
  <h1>Lighthouse user flows, <b>done right.</b></h1>
  <p>Measure page loads, interactions and page states with one CLI. TypeScript flows, zero setup, reports on every pull request.</p>
</div>
<div class="url">push-based.github.io/user-flow</div>
<div class="scene">
  <div class="orbit orbit-2"><i></i></div>
  <div class="orbit orbit-1"><i></i></div>
  <div class="beam"></div>
  <svg class="ufo" viewBox="0 0 1360 1360"><use href="#mark"/></svg>
  <div class="targets">
    ${steps
      .map(
        ([mode, label, note, score], i) =>
          `<div class="target${i === 1 ? ' active' : ''}">${i < 1 ? `<span class="chip">${score}</span>` : ''}${icon(mode)}<span class="label">${label}</span><span class="note">${note}</span></div>`,
      )
      .join('')}
  </div>
</div>
</body></html>`;

const browser = await launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: 'png' });
await browser.close();
await writeFile(join(root, 'public/og-image.png'), png);
console.log('wrote public/og-image.png');
