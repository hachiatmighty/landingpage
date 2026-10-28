// Renders reel.html frame by frame in headless Chromium and pipes PNGs into ffmpeg.
// Usage:
//   node render.js stills <outDir> f1 f2 ...      -> PNG stills for review
//   node render.js video <outDir> [workers]       -> segment_*.mp4 (one per worker)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const TL = require('./timeline.js');

const TOTAL = Math.round(TL.DURATION * TL.FPS); // 900

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.goto('file://' + path.join(__dirname, 'reel.html'));
  await page.evaluate(() => window.ready);
  return page;
}
const shot = (page) => page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });

(async () => {
  const [mode, outDir, ...rest] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-color-profile=srgb'] });
  if (mode === 'stills') {
    const page = await openPage(browser);
    for (const f of rest.map(Number)) {
      await page.evaluate((f) => window.renderFrame(f), f);
      fs.writeFileSync(path.join(outDir, `f${String(f).padStart(3, '0')}.png`), await shot(page));
    }
  } else {
    const workers = Number(rest[0] || 4);
    const per = Math.ceil(TOTAL / workers);
    const t0 = Date.now();
    await Promise.all(Array.from({ length: workers }, async (_, w) => {
      const a = w * per, b = Math.min(TOTAL, a + per);
      const page = await openPage(browser);
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'png', '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
        '-r', '60', path.join(outDir, `segment_${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((res) => ff.on('close', res));
      for (let f = a; f < b; f++) {
        await page.evaluate((f) => window.renderFrame(f), f);
        const buf = await shot(page);
        if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
        if ((f - a) % 50 === 0) console.log(`worker ${w}: frame ${f} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
      }
      ff.stdin.end(); await done;
    }));
    fs.writeFileSync(path.join(outDir, 'segments.txt'), Array.from({ length: workers }, (_, w) => `file 'segment_${w}.mp4'`).join('\n') + '\n');
  }
  await browser.close();
})();
