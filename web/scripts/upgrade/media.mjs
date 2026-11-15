import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// A full cached response must never replace the byte ranges used by native media controls.
const [base, output = 'test-results/upgrade'] = process.argv.slice(2);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  const cold = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, serviceWorkers: 'block' });
  try {
    const page = await cold.newPage();
    const network = await cold.newCDPSession(page);
    await network.send('Network.enable');
    await network.send('Network.emulateNetworkConditions', { offline: false, latency: 100, downloadThroughput: 225000, uploadThroughput: 100000 });
    await page.goto(`${base}/demo/`);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 1);
    const seeks = [];
    for (const second of [18.4, 3.2, 22.3, 0.4, 12.6]) {
      const start = Date.now();
      await page.locator('video').evaluate((el, time) => { el.pause(); el.currentTime = time; }, second);
      await page.waitForFunction(time => {
        const el = document.querySelector('video');
        return !el.seeking && el.readyState >= 2 && Math.abs(el.currentTime - time) < 0.2;
      }, second, { timeout: 10000 });
      seeks.push({ second, milliseconds: Date.now() - start });
    }
    assert.equal(await page.locator('video').evaluate(el => el.error), null);
    results.push({ firstVisit: true, serviceWorker: false, downloadMbps: 1.8, latencyMs: 100, seeks });
  } finally {
    await cold.close();
  }
  // Local fixture reproduces a visitor upgrading while the old worker is streaming a cached video.
  if (['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) {
    const fixture = path.resolve(import.meta.dirname, '../../dist', `_media-upgrade-${process.pid}.js`);
    const fixed = await fs.readFile(path.resolve(import.meta.dirname, '../../dist/sw.js'), 'utf8');
    const legacy = `self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(!e.request.url.endsWith('.mp4'))return;
 e.respondWith((async()=>{
  const hit=await caches.match(e.request);
  if(!hit)return fetch(e.request);
  const bytes=new Uint8Array(await hit.arrayBuffer());let timer;
  return new Response(new ReadableStream({start(c){c.enqueue(bytes.subarray(0,65536));timer=setTimeout(()=>{c.enqueue(bytes.subarray(65536));c.close();},10000);},cancel(){clearTimeout(timer);} }),{headers:{'Content-Type':'video/mp4'}});
 })());
});`;
    const context = await browser.newContext();
    try {
      await fs.writeFile(fixture, legacy);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/demo/`);
      await page.evaluate(async url => {
        await navigator.serviceWorker.register(url, { scope: '../', updateViaCache: 'none' });
        await navigator.serviceWorker.ready;
      }, `${base}/${path.basename(fixture)}`);
      await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
      await page.evaluate(async url => {
        const cache = await caches.open('agun-panjika-legacy-playback');
        await cache.put(url, await fetch(url));
      }, `${base}/demo/agun-panjika-29s.mp4`);
      await page.goto(`${base}/demo/`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelector('video').readyState >= 1);
      assert.equal(await page.locator('video').evaluate(el => el.seekable.length ? el.seekable.end(el.seekable.length - 1) : 0), 0);
      await page.evaluate(() => {
        window.playerReloads = 0;
        document.querySelector('video').addEventListener('emptied', () => window.playerReloads++);
      });
      await fs.writeFile(fixture, fixed);
      await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
      await page.waitForFunction(() => {
        const el = document.querySelector('video');
        return window.playerReloads > 0 && el.readyState >= 2 && el.seekable.length && el.seekable.end(el.seekable.length - 1) > 24;
      }, null, { timeout: 20000 });
      await page.locator('video').evaluate(el => { el.currentTime = 18; });
      await page.waitForFunction(() => {
        const el = document.querySelector('video');
        return !el.seeking && Math.abs(el.currentTime - 18) < 0.2;
      });
      assert.deepEqual(errors, []);
      results.push({ upgradeFromBrokenCache: true, automaticPlayerRepair: true, seekAfterUpgrade: 18, errors });
    } finally {
      await context.close();
      await fs.unlink(fixture);
    }
  }
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width === 390 });
    const page = await context.newPage();
    const errors = [];
    const responses = [];
    page.on('response', async response => {
      if (response.url().endsWith('.mp4')) {
        const headers = await response.allHeaders();
        responses.push({ status: response.status(), requested: response.request().headers().range, range: headers['content-range'], etag: headers.etag, worker: response.fromServiceWorker() });
      }
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const videoUrl = `${base}/demo/agun-panjika-29s.mp4`;
    await page.evaluate(async url => {
      const name = (await caches.keys()).find(key => key.startsWith('agun-panjika-'));
      const response = await fetch(url);
      const cache = await caches.open(name);
      await cache.put(url, response);
    }, videoUrl);
    const range = await page.evaluate(async url => {
      // Probe the worker without introducing an artificial fragment into the browser's media cache.
      const response = await fetch(url, { headers: { Range: 'bytes=3000000-3001023' }, cache: 'no-store' });
      return { status: response.status, range: response.headers.get('content-range'), bytes: (await response.arrayBuffer()).byteLength };
    }, videoUrl);
    assert.equal(range.status, 206, 'Seeking needs a partial response, even with a full video in the PWA cache');
    assert.equal(range.bytes, 1024);
    assert.match(range.range, /^bytes 3000000-3001023\/\d+$/);
    await page.goto(`${base}/demo/`);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 1);
    const video = page.locator('video');
    const seeks = [];
    for (const second of [18, 3, 22, 0, 12]) {
      const start = Date.now();
      await video.evaluate((el, t) => { el.pause(); el.currentTime = t; }, second);
      try {
        await page.waitForFunction(t => {
          const el = document.querySelector('video');
          return !el.seeking && el.readyState >= 2 && Math.abs(el.currentTime - t) < 0.2;
        }, second, { timeout: 10000 });
      } catch (error) {
        const state = await video.evaluate(el => ({ time: el.currentTime, ready: el.readyState, seeking: el.seeking, error: el.error?.message, buffered: Array.from({ length: el.buffered.length }, (_, i) => [el.buffered.start(i), el.buffered.end(i)]) }));
        await fs.writeFile(path.join(output, 'media-failure.json'), JSON.stringify({ width, second, state, responses, errors }, null, 2));
        throw error;
      }
      seeks.push({ second, milliseconds: Date.now() - start });
    }
    for (let replay = 0; replay < 2; replay++) {
      await video.evaluate(el => { el.muted = true; el.currentTime = el.duration - 0.2; });
      await page.waitForFunction(() => !document.querySelector('video').seeking);
      await video.evaluate(el => el.play());
      await page.waitForFunction(() => document.querySelector('video').ended);
      await video.focus();
      await video.press('Space');
      await page.waitForFunction(() => {
        const el = document.querySelector('video');
        return !el.paused && !el.ended && el.currentTime > 0.1 && el.currentTime < 3;
      });
    }
    await video.evaluate(el => { el.pause(); el.playbackRate = 1.5; el.volume = 0.4; el.muted = false; });
    assert.deepEqual(await video.evaluate(el => [el.playbackRate, el.volume, el.muted]), [1.5, 0.4, false]);
    await video.evaluate(el => { el.playbackRate = 1; el.currentTime = 5; });
    await page.waitForFunction(() => !document.querySelector('video').seeking);
    await video.evaluate(el => { el.blur(); el.focus(); });
    await video.press('ArrowRight');
    await page.waitForFunction(() => !document.querySelector('video').seeking);
    const keyboardSeek = await video.evaluate(el => el.currentTime);
    assert(keyboardSeek > 5.1, `Native ArrowRight should advance the timeline from 5 seconds; received ${keyboardSeek}`);
    await video.press('Space');
    await page.waitForFunction(() => !document.querySelector('video').paused);
    await video.press('Space');
    assert.equal(await video.evaluate(el => el.paused), true);
    await video.evaluate(el => el.requestFullscreen());
    assert.equal(await page.evaluate(() => document.fullscreenElement?.tagName), 'VIDEO');
    await page.evaluate(() => document.exitFullscreen());
    assert.equal(await video.evaluate(el => el.error), null);
    const size = Number(range.range.split('/')[1]);
    await context.setOffline(true);
    const boundaries = await page.evaluate(async ({ url, size }) => {
      const cases = ['bytes=0-31', 'bytes=-32', `bytes=${size - 32}-`, `bytes=${size - 4}-${size + 32}`, `bytes=${size}-`, 'bytes=100-50', 'bytes=-0'];
      const rows = [];
      for (const value of cases) {
        const response = await fetch(url, { headers: { Range: value }, cache: 'no-store' });
        rows.push({ value, status: response.status, range: response.headers.get('content-range'), bytes: (await response.arrayBuffer()).byteLength });
      }
      return rows;
    }, { url: videoUrl, size });
    assert.deepEqual(boundaries.map(row => [row.status, row.bytes]), [[206, 32], [206, 32], [206, 32], [206, 4], [416, 0], [416, 0], [416, 0]]);
    assert.equal(boundaries[1].range, `bytes ${size - 32}-${size - 1}/${size}`);
    assert.equal(boundaries[4].range, `bytes */${size}`);
    await context.setOffline(false);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: path.join(output, `media-${width}.png`) });
    results.push({ width, range, boundaries, cachedRangesOffline: true, seeks, nativeReplays: 2, playPause: true, keyboardSeek: true, speedVolumeMute: true, fullscreen: true, errors });
    await context.close();
  }
  await fs.writeFile(path.join(output, 'media.json'), JSON.stringify(results, null, 2));
  console.log('PASS: installed PWA with cached video; byte ranges, seeking, native replay twice, play/pause, keyboard skip, speed, volume and mute at two viewport sizes');
} finally {
  await browser.close();
}
