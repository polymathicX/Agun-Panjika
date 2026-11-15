// Precache the application and small reference packages; country points cache on demand.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../dist');
const assets=(await fs.readdir(path.join(root,'assets'))).map(p=>`assets/${p}`);
const cases=['bangladesh','nepal','chin','punjab_haryana'].map(p=>`data/global/${p}.json`);
const files=['index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','geo/land.json','earth/2k_earth_daymap.jpg','earth/2k_earth_clouds.jpg','data/manifest.json','data/national.json','data/world/summary.json','data/world/countries.geojson','data/global/catalog.json',...cases,...['modis','noaa20','noaa21'].map(s=>`data/world/overview-${s}.json`),...assets];
const hash=createHash('sha256');let total=0;
for(const file of files) {const content=await fs.readFile(path.join(root,file));hash.update(content);total+=content.length;}
if(total>20*1024*1024)throw new Error('Offline shell exceeds the 20 MiB budget');
const source=await fs.readFile(path.join(root,'sw.js'),'utf8');
hash.update(source);
// Invalidate an older cached movie without adding its download to the offline precache.
hash.update(await fs.readFile(path.join(root,'demo/agun-panjika-29s.mp4')));
hash.update(await fs.readFile(path.join(root,'demo/playback.js')));
const version=hash.digest('hex').slice(0,12);
await fs.writeFile(path.join(root,'sw.js'),source.replace('const PRECACHE = [];',`const PRECACHE = ${JSON.stringify(['./',...files.filter(f=>f!=='index.html')])};`).replace('agun-panjika-global-v3',`agun-panjika-${version}`));
console.log(`PWA: ${files.length} resources, ${(total/1048576).toFixed(2)} MiB, version ${version}`);
