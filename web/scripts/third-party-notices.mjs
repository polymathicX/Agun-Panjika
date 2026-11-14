import fs from 'node:fs/promises';
import path from 'node:path';
const web=path.resolve(import.meta.dirname,'..');
const packages=new Map();
async function collect(modules) {
 let entries;try {entries=await fs.readdir(modules,{withFileTypes:true});}catch{return;}
 for(const entry of entries) {
  if(!entry.isDirectory() || entry.name.startsWith('.'))continue;
  const folder=path.join(modules,entry.name);
  if(entry.name.startsWith('@')) {await collect(folder);continue;}
  let pkg;try {pkg=JSON.parse(await fs.readFile(path.join(folder,'package.json'),'utf8'));}catch{continue;}
  const key=`${pkg.name}@${pkg.version}`;
  if(!packages.has(key)) {
   const licenses=(await fs.readdir(folder)).filter(n=>/^(licen[cs]e|notice|copyright)([.\-]|$)/i.test(n)).sort();
   const texts=[];
   for(const filename of licenses) {if((await fs.stat(path.join(folder,filename))).isFile())texts.push(`${filename}\n${await fs.readFile(path.join(folder,filename),'utf8')}`);}
   packages.set(key,`${key}\nLicense: ${typeof pkg.license==='string'?pkg.license:'See package license'}\nhttps://www.npmjs.com/package/${pkg.name}/v/${pkg.version}\n\n${texts.join('\n\n') || 'Consult the versioned package source for its license terms.'}`);
  }
  await collect(path.join(folder,'node_modules'));
 }
}
await collect(path.join(web,'node_modules'));
if(packages.size<10)throw new Error('Dependency license inventory is incomplete');
await fs.writeFile(path.join(web,'public/THIRD_PARTY_NOTICES.txt'),'Agun Panjika: dependency license notices\nIncludes runtime and development tooling; each retains its own terms.\n\n'+[...packages].sort(([a],[b])=>a.localeCompare(b)).map(([,v])=>v).join('\n\n'+'='.repeat(72)+'\n\n'));
await fs.copyFile(path.join(web,'../LICENSE'),path.join(web,'public/LICENSE.txt'));
console.log(`License notices: ${packages.size} dependency versions`);
