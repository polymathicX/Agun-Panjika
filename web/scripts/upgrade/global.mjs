import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const [base='http://127.0.0.1:4173',out='test-results/global-release']=process.argv.slice(2);
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:1440,height:1080},reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['bangladesh','nepal','chin','punjab_haryana']) {
  await page.goto(`${base}/?lang=en&theme=light#/global?area=${id}&testYear=2024&switchWeek=26`);
  await page.locator('#evidence-h').waitFor();await page.getByRole('grid').waitFor();
  assert.equal(await page.locator('.area-choice[aria-pressed=true]').count(),1);
  assert.match(await page.locator('.case-verdict').first().innerText(),/lower weekly error/);
  assert.match(await page.locator('.case-facts').innerText(),/142 \/ 156/);
  if(id==='chin')assert.match(await page.locator('.case-limited').innerText(),/Monthly factors have lower error/);
  await page.getByRole('button',{name:'Reveal actual VIIRS',exact:true}).click();
  await page.waitForURL(/reveal=1/);
  await page.getByRole('slider').fill('12');await page.waitForURL(/switchWeek=12/);
  await page.screenshot({path:path.join(out,`${id}-desktop.png`),fullPage:true});
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;
  assert.deepEqual(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 }
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download evidence JSON'}).click();
 const file=await download;await file.saveAs(path.join(out,'evidence.json'));
 const evidence=JSON.parse(await fs.readFile(path.join(out,'evidence.json'),'utf8'));
 assert.equal(evidence.area,'punjab_haryana');assert.equal(evidence.folds['2024'].fit[1],2022);assert.equal(evidence.evaluation.models.ensemble.weeks,142);assert.equal(evidence.evaluation.all_weeks.ensemble.weeks,156);assert.equal(evidence.view.switchWeek,12);assert.ok(evidence.snapshot_sha256);
 const csvPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download experiment CSV'}).click();
 await (await csvPromise).saveAs(path.join(out,'experiment.csv'));
 assert.match(await fs.readFile(path.join(out,'experiment.csv'),'utf8'),/model_version,input_sha256/);
 await page.emulateMedia({media:'print'});await page.pdf({path:path.join(out,'evidence-brief.pdf'),format:'A4',printBackground:true});
 await page.emulateMedia({media:'screen'});
 await page.setViewportSize({width:360,height:960});
 await page.goto(`${base}/?lang=bn&theme=dark#/global?area=nepal`);await page.locator('#evidence-h').waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>v.id),[]);
 await page.screenshot({path:path.join(out,'nepal-mobile-bn.png'),fullPage:true});
 await page.goto(`${base}/?lang=en#/global?area=../../bad`);await page.locator('#evidence-h').waitFor();
 assert.match(await page.locator('#evidence-h').innerText(),/Bangladesh/);
 const staleContext=await browser.newContext({serviceWorkers:'block'});
 const stale=await staleContext.newPage();
 await stale.route('**/data/forecast.json',async route=>{
  const response=await route.fetch();const doc=await response.json();
  for(const p of Object.values(doc.products)) for(const o of Object.values(p.outlook)) {o.issue_year=2020;o.issue_week=1;o.active=true;}
  await route.fulfill({json:doc});
 });
 await stale.goto(`${base}/?lang=en#/outlook`);await stale.getByText(/The saved outlook has expired/).waitFor();
 assert.equal(await stale.locator('#ol-h').count(),0);assert.equal(await stale.locator('#al-h').count(),0);
 assert.deepEqual(errors,[]);
 await fs.writeFile(path.join(out,'global.json'),JSON.stringify({areas:4,transitions:true,referenceQuality:true,exports:true,staleOutlooks:true,mobileBangla:true,errors},null,2));
 console.log('PASS: four areas, switch/reveal, source-quality flags, accessible desktop/mobile, evidence exports and expired outlook suppression');
} finally {await browser.close();}
