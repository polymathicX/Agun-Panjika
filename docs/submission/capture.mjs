import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const source=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(source,'../..');
const require=createRequire(path.join(root,'web/package.json'));
const {chromium}=require('playwright');
const base=process.argv[2] ?? 'http://127.0.0.1:4173';
const build=path.join(root,'docs/latex/build/submission');
const shots=path.join(root,'docs/review/screenshots');
await fs.mkdir(build,{recursive:true});await fs.mkdir(shots,{recursive:true});
const browser=await chromium.launch();
try {
 if(process.argv.includes('--storyboard')) {
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(pathToFileURL(path.join(source,'video.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  const scenes=await page.locator('.scene').count();
  for(let i=0;i<scenes;i++) {
   await page.evaluate(n=>document.querySelectorAll('.scene').forEach((e,j)=>e.classList.toggle('active',j===n)),i);
   await page.screenshot({path:path.join(build,`scene-${i+1}.png`)});
  }
 } else {
  const context=await browser.newContext({viewport:{width:1440,height:980},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(`${base}/?lang=en&theme=light#/world`);await page.locator('.earth-realistic[data-ready=true]').waitFor();
  await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
  await page.screenshot({path:path.join(shots,'world-hero.png')});
  await page.goto(`${base}/?lang=en&theme=light#/world?country=bra`);await page.locator('.earth-realistic[data-ready=true]').waitFor();
  await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
  await page.screenshot({path:path.join(shots,'world-country.png')});
  await page.goto(`${base}/?lang=en&theme=light#/global?area=nepal&testYear=2024&switchWeek=26&reveal=1`);
  await page.locator('#evidence-h').waitFor();await page.waitForTimeout(250);
  await page.locator('section[aria-labelledby="experiment-h"]').screenshot({path:path.join(shots,'global-experiment.png')});
  await page.screenshot({path:path.join(shots,'global-cases.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}/?lang=en&theme=light#/world?country=bra`);await page.locator('.earth-realistic[data-ready=true]').waitFor();
  await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
  await page.screenshot({path:path.join(shots,'world-phone.png')});
  await page.getByRole('button',{name:'Watch this country',exact:true}).click();
  await page.locator('.world-highlight').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(shots,'world-phone-report.png')});
  await context.close();

  // Record real interaction, including camera animation, rather than simulating UI frames.
  for(const name of ['world','experiment']) {
   const film=await browser.newContext({viewport:{width:1440,height:980},recordVideo:{dir:build,size:{width:1440,height:980}}});
   const movie=await film.newPage();const created=Date.now();
   if(name==='world') {
    await movie.goto(`${base}/?lang=en&theme=light#/world`);await movie.locator('.earth-realistic[data-ready=true]').waitFor();
    await movie.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
    const box=await movie.locator('.world-globe .earth-scene').boundingBox();
    const start=(Date.now()-created)/1000;
    await movie.mouse.move(box.x+box.width*.47,box.y+box.height*.5);await movie.mouse.down();
    await movie.mouse.move(box.x+box.width*.53,box.y+box.height*.51,{steps:15});await movie.mouse.up();
    await movie.waitForTimeout(600);
    await movie.mouse.click(box.x+box.width/2,box.y+box.height/2);
    await movie.waitForURL(/country=/);
    await movie.waitForTimeout(3900);
    await fs.writeFile(path.join(build,'world-clip.json'),JSON.stringify({start,region:{x:0,y:0,width:1440,height:980}}));
   } else {
    await movie.goto(`${base}/?lang=en&theme=light#/global?area=nepal&testYear=2024&switchWeek=26`);
    await movie.locator('#evidence-h').waitFor();
    const panel=movie.locator('section[aria-labelledby="experiment-h"]');
    await panel.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-90));await movie.waitForTimeout(250);
    const region=await panel.boundingBox(),start=(Date.now()-created)/1000;
    await movie.waitForTimeout(900);await movie.getByRole('button',{name:'Reveal actual VIIRS',exact:true}).click();
    await movie.waitForTimeout(1600);await movie.getByRole('slider').fill('32');await movie.waitForTimeout(3600);
    await fs.writeFile(path.join(build,'experiment-clip.json'),JSON.stringify({start,region}));
   }
   const video=movie.video();await film.close();await video.saveAs(path.join(build,`${name}-motion.webm`));
  }
 }
} finally {await browser.close();}
