import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const [base='http://127.0.0.1:4173',out='test-results/page-help']=process.argv.slice(2);
await fs.mkdir(out,{recursive:true});const browser=await chromium.launch();
try{
 const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000},serviceWorkers:'block'});
 await context.addInitScript(()=>localStorage.setItem('ap-tutorial-v1','dismissed'));
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const coverage={};
 for(const route of ['world','global','home','panjika','map','sensors','outlook','borders','method']){
  await page.goto(`${base}/?lang=en&theme=light#/${route}?y=2024&w=14&r=bgd`);
  await page.getByRole('button',{name:'Explain this page',exact:true}).click();
  const panel=page.locator('.page-help-panel');await panel.waitFor();
  const topics=panel.getByLabel('What would you like to learn?',{exact:true});
  const count=await topics.locator('option').count();assert.ok(count>=6,`${route}: ${count} topics`);
  for(let i=0;i<count;i++){
   await topics.selectOption(String(i));
   await page.waitForFunction(()=>document.querySelector('.page-help-panel')?.getAttribute('data-target-ready')==='true',null,{timeout:20000});
   assert.ok((await page.locator('.page-help-copy').innerText()).length>40);
  }
  coverage[route]=count;
  if(route==='world'){
   await topics.selectOption('0');await topics.focus();await page.keyboard.press('ArrowDown');
   assert.equal(await topics.evaluate(element=>element===document.activeElement),true);
   assert.equal(await topics.inputValue(),'1');
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.getByRole('button',{name:'Close page help',exact:true}).click();
  assert.equal(await page.locator('.page-help-target').count(),0);
 }
 await page.goto(`${base}/?lang=en&theme=light#/world?country=bra&day=0`);
 await page.locator('.data-reading').waitFor();const first=await page.locator('.reading-sentence').innerText();
 await page.locator('#world-day').fill('1');await page.waitForURL(/day=1/);
 assert.notEqual(await page.locator('.reading-sentence').innerText(),first);
 await page.goto(`${base}/?lang=en&theme=light#/global?area=nepal&testYear=2024&switchWeek=26`);
 await page.locator('.reading-sentence').waitFor();assert.doesNotMatch(await page.locator('.reading-sentence').innerText(),/on average/);
 await page.getByRole('button',{name:'Reveal actual VIIRS',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.reading-sentence')?.textContent.includes('on average'));
 assert.equal(await page.locator('.case-release-change').count(),0);
 await page.getByRole('button',{name:'Explain this page',exact:true}).click();
 await page.locator('.page-help-panel').getByLabel('Page',{exact:true}).selectOption('world');
 await page.waitForURL(/#\/world/);await page.locator('.page-help-panel').waitFor();
 await page.keyboard.press('Escape');assert.equal(await page.locator('.page-help-panel').count(),0);
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/?lang=bn&theme=dark#/world?country=bgd`);
 await page.getByRole('button',{name:'এই পৃষ্ঠার সাহায্য',exact:true}).click();
 await page.locator('.page-help-panel[data-target-ready=true]').waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>v.id),[]);
 await page.screenshot({path:path.join(out,'page-help-phone-bn.png')});await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);
 await fs.writeFile(path.join(out,'help.json'),JSON.stringify({coverage,topics:Object.values(coverage).reduce((a,b)=>a+b,0),readingUpdates:true,historyReveal:true,jumpBetweenPages:true,escape:true,banglaMobile:true,axe:0,errors},null,2));
 console.log('PASS: every help topic on all nine pages, live data readings, reveal, page jumps, exit and Bangla phone accessibility');
}finally{await browser.close();}
