import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const directory=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(directory,'../..');
const require=createRequire(path.join(root,'web/package.json'));
const {chromium}=require('playwright');
const base=(process.argv[2]??'http://127.0.0.1:4173').replace(/\/$/,'');
const pages=[
 ['earth','world','.earth-realistic[data-ready=true]'],
 ['world','world?country=bra','.earth-realistic[data-ready=true]'],
 ['histories','global?area=nepal&testYear=2024&switchWeek=26&reveal=1','#evidence-h'],
 ['season-report','home?r=bgd&y=2024&w=14','[data-help="season-report"]'],
 ['calendar','panjika?r=bgd&y=2024&w=14','[role="grid"]'],
 ['sensors','sensors?r=bgd&s=modis%2Cviirs%2Charm&from=2003&to=2025','#ratio-h'],
 ['bangladesh-map','map?r=bgd&y=2024&w=14','.maplibregl-canvas'],
 ['outlook','outlook?r=bgd','#sk-h'],
 ['borders','borders','#igp-h'],
 ['method','method','#downloads'],
];
const browser=await chromium.launch();
const errors=[],captures=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
 await context.addInitScript(()=>localStorage.setItem('ap-tutorial-v1','dismissed'));
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 for(const [name,route,ready] of pages){
  await page.goto(`${base}/?lang=en&theme=light#/${route}`);
  await page.locator(ready).waitFor({state:'attached'});await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelectorAll('main .request-skeleton').length===0);
  if(name==='world'||name==='earth')await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
  if(name==='season-report')await page.locator('[data-help="season-controls"]').evaluate(element=>scrollTo(0,element.getBoundingClientRect().top+scrollY-105));
  if(name==='histories')await page.locator('#experiment-h').evaluate(element=>scrollTo(0,element.closest('section').getBoundingClientRect().top+scrollY-105));
  if(name==='bangladesh-map'){
   await page.waitForTimeout(3000);
   assert.equal(await page.getByRole('button',{name:'Retry map',exact:true}).count(),0,'Map tiles must load for the gallery');
  }
  if(name==='borders')await page.locator('section[aria-labelledby="igp-h"] select').selectOption('2024');
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name} overflow`);
  assert.equal(await page.locator('main [role="alert"]').count(),0,`${name} error`);
  await page.screenshot({path:path.join(directory,`${name}.jpg`),type:'jpeg',quality:88});
  captures.push({file:`${name}.jpg`,route:`#/${route}`,width:1440,height:1000,language:'en',theme:'light'});
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/?lang=en&theme=light#/world?country=bra`);
 await page.locator('.earth-realistic[data-ready=true]').waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
 await page.screenshot({path:path.join(directory,'phone.jpg'),type:'jpeg',quality:90});
 captures.push({file:'phone.jpg',route:'#/world?country=bra',width:390,height:844,language:'en',theme:'light'});
 await page.goto(`${base}/?lang=bn&theme=dark#/world?country=bgd`);
 await page.locator('.data-reading').waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.getByRole('button',{name:'এই পৃষ্ঠার সাহায্য',exact:true}).click();
 await page.locator('.page-help-panel select').nth(1).selectOption('5');
 await page.locator('.page-help-panel[data-target-ready=true]').waitFor();
 await page.screenshot({path:path.join(directory,'help-bangla.jpg'),type:'jpeg',quality:90});
 captures.push({file:'help-bangla.jpg',route:'#/world?country=bgd',width:390,height:844,language:'bn',theme:'dark',helpTopic:6});
 assert.deepEqual(errors,[]);assert.equal(captures.length,12);
 const snapshot=JSON.parse(await fs.readFile(path.join(root,'web/public/data/world/summary.json'),'utf8'));
 await fs.writeFile(path.join(directory,'captures.json'),JSON.stringify({captured_utc:new Date().toISOString(),source_snapshot_utc:snapshot.built_utc,note:'Actual app captures. Source windows are shown in the interface; screenshot counts are a dated example.',captures,errors},null,2)+'\n');
 console.log('Captured nine pages, a selected country and two phone views; no page errors or horizontal overflow');
}finally{await browser.close();}
