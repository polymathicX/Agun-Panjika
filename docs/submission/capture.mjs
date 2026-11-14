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
   const clipped=await page.locator('.scene.active').evaluate(scene=>{
    const footer=scene.querySelector('footer').getBoundingClientRect();
    return [...scene.querySelectorAll('h1,p,.names,.kicker,.pixel-label,.diagram-note')].filter(element=>element.getBoundingClientRect().bottom>footer.top-8).map(element=>element.textContent);
   });
   if(clipped.length)throw new Error(`Scene ${i+1} overlaps footer: ${clipped.join('; ')}`);
   if(i>=3){
    const poster=page.locator('.scene.active img.canvas, .scene.active img.wide, .scene.active img.phone');
    if(await poster.count()!==1)throw new Error(`Scene ${i+1} needs one motion placeholder`);
    await poster.evaluate(element=>element.style.visibility='hidden');
   }
   await page.screenshot({path:path.join(build,`scene-${i+1}.png`)});
  }
 } else {
  const context=await browser.newContext({viewport:{width:1440,height:980},reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('ap-tutorial-v1','dismissed'));
  const page=await context.newPage();
  await page.goto(`${base}/?lang=en&theme=light#/world`);await page.locator('.earth-realistic[data-ready=true]').waitFor();
  await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
  await page.screenshot({path:path.join(shots,'world-hero.png')});
  await page.locator('.world-globe .earth-scene').screenshot({path:path.join(shots,'earth-close.png')});
  await page.goto(`${base}/?lang=en&theme=light#/world?country=bra`);await page.locator('.earth-realistic[data-ready=true]').waitFor();
  await page.waitForFunction(()=>!document.querySelector('.world-globe .request-skeleton'));
  await page.screenshot({path:path.join(shots,'world-country.png')});
  await page.locator('.world-globe .earth-scene').screenshot({path:path.join(shots,'world-country-panel.png')});
  await page.locator('.world-highlight').screenshot({path:path.join(shots,'country-card.png')});
  await page.locator('.data-reading').screenshot({path:path.join(shots,'plain-reading.png')});
  const reading=await page.locator('.reading-sentence').innerText();
  const tex=reading.replace(/[\\{}$&#%_~^]/g,c=>({'\\':'\\textbackslash{}','{':'\\{','}':'\\}','$':'\\$','&':'\\&','#':'\\#','%':'\\%','_':'\\_','~':'\\textasciitilde{}','^':'\\textasciicircum{}'}[c]));
  await fs.writeFile(path.join(source,'reading.tex'),`\\newcommand{\\PlainReading}{${tex}}\n`);
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
  await page.getByRole('button',{name:'Explain this page',exact:true}).click();
  await page.locator('.page-help-panel').getByLabel('What would you like to learn?',{exact:true}).selectOption('5');
  await page.locator('.page-help-panel[data-target-ready=true]').waitFor();
  await page.screenshot({path:path.join(shots,'help-phone.png')});
  await page.keyboard.press('Escape');
  await context.close();

  // Record real interaction, including camera animation, rather than simulating UI frames.
  for(const name of ['world','experiment','phone']) {
   const viewport=name==='phone'?{width:390,height:844}:{width:1440,height:name==='experiment'?1180:980};
   const film=await browser.newContext({viewport,recordVideo:{dir:build,size:viewport}});
   await film.addInitScript(()=>localStorage.setItem('ap-tutorial-v1','dismissed'));
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
   } else if(name==='experiment') {
    await movie.goto(`${base}/?lang=en&theme=light#/global?area=nepal&testYear=2024&switchWeek=26`);
    await movie.locator('#evidence-h').waitFor();
    const panel=movie.locator('section[aria-labelledby="experiment-h"]');
    await panel.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-90));await movie.waitForTimeout(250);
    const region=await panel.boundingBox(),start=(Date.now()-created)/1000;
    await movie.waitForTimeout(900);await movie.getByRole('button',{name:'Reveal actual VIIRS',exact:true}).click();
    await movie.waitForTimeout(1600);await movie.getByRole('slider').fill('32');await movie.waitForTimeout(3600);
    await fs.writeFile(path.join(build,'experiment-clip.json'),JSON.stringify({start,region}));
   } else {
    await movie.goto(`${base}/?lang=en&theme=light#/world?country=bra`);await movie.locator('.earth-realistic[data-ready=true]').waitFor();
    const start=(Date.now()-created)/1000;
    await movie.getByRole('button',{name:'Watch this country',exact:true}).click();await movie.waitForTimeout(1300);
    await movie.locator('.data-reading').scrollIntoViewIfNeeded();await movie.waitForTimeout(1800);
    await movie.getByRole('button',{name:'Explain this page',exact:true}).click();
    await movie.locator('.page-help-panel').getByLabel('What would you like to learn?',{exact:true}).selectOption('5');await movie.waitForTimeout(2600);
    await movie.keyboard.press('Escape');await movie.locator('.data-reading').scrollIntoViewIfNeeded();await movie.waitForTimeout(3500);
    await fs.writeFile(path.join(build,'phone-clip.json'),JSON.stringify({start,region:{x:0,y:0,width:390,height:844}}));
   }
   const video=movie.video();await film.close();await video.saveAs(path.join(build,`${name}-motion.webm`));
  }
 }
} finally {await browser.close();}
