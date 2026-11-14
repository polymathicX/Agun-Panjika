import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calendarWeeks, experimentRows, hiddenError, evidenceCSV } from '../src/lib/evidence.ts';
import { historyReading, outlookReading, seasonReading, seriesReading, worldReading } from '../src/lib/readings.ts';

const doc = { id:'chin', version:'v1', snapshot_sha256:'abc', evaluation:{status:'baseline_preferred'}, weeks:[
  {y:2011,w:1,modis:1,model:5,lo:2,hi:9},
  {y:2024,w:1,modis:1,viirs:0,model:2,factor:4},
  {y:2024,w:2,modis:2,viirs:8,model:6,factor:10},
]};
test('the switch uses predictions before it and observations after it', () => {
  const rows=experimentRows(doc,2024,2);
  assert.equal(rows[0].corrected,2);assert.equal(rows[0].stitched,1);
  assert.equal(rows[1].corrected,8);assert.equal(rows[1].stitched,8);
  assert.equal(hiddenError(rows,2,'model'),2);
  assert.equal(hiddenError(rows,1,'model'),null);
});
test('failed transfer abstains from estimated years and retains observed zeros', () => {
  assert.deepEqual(calendarWeeks(doc).map(w=>w.harm),[0,8]);
  assert.equal(calendarWeeks({...doc,evaluation:{status:'model_advantage'}})[0].src,'estimated');
});
test('CSV keeps source/version metadata with each row and missing counts empty', () => {
  const lines=evidenceCSV(doc,doc.weeks).split('\r\n');
  assert.equal(lines.length,4);assert.match(lines[1],/^chin,v1,abc,2011,1,1,,5,/);
  assert.match(lines[2],/,2024,1,1,0,2,4,/);
});

test('incomplete reference observations remain in CSV but not comparable errors or calendars', () => {
  const partial={...doc,weeks:[{y:2024,w:1,modis:10,viirs:1,model:50,factor:40,reference_ok:false},{y:2024,w:2,modis:1,viirs:0,model:2,factor:4,reference_ok:true}]};
  const rows=experimentRows(partial,2024,2);
  assert.equal(rows[0].viirs,1);assert.equal(rows[0].observed,undefined);
  assert.equal(hiddenError(rows,2,'model'),null);
  assert.deepEqual(calendarWeeks(partial).map(w=>w.harm),[0]);
  assert.match(evidenceCSV(partial,rows),/incomplete/);
});

test('world reading follows the selected day, keeps zero honest, and avoids inventing missing counts',()=>{
  const input={place:'Japan',satellite:'VIIRS',total:13,daily:[3,10],dates:['2026-11-13','2026-11-14'],day:-1,through:'2026-11-14T12:00:00Z',stale:false};
  assert.match(worldReading(input).text,/13 hot-spot/);assert.match(worldReading(input).text,/2026-11-14 has the most/);
  assert.match(worldReading({...input,day:0}).text,/3 hot-spot/);assert.doesNotMatch(worldReading({...input,day:0}).text,/most/);
  assert.match(worldReading({...input,total:0,daily:[0,0]}).text,/No retained/);
  assert.match(worldReading({...input,total:0,daily:[0,0]}).note,/do not establish safety/);
  assert.match(worldReading({...input,daily:[],day:0}).text,/not available/);
  assert.match(worldReading({...input,stale:true}).note,/48 hours/);
  assert.doesNotMatch(worldReading({...input,daily:[6,6],total:12}).text,/has the most/);
});

test('season reading uses only available selected weeks, never silently fills gaps, and labels estimates',()=>{
  const weeks=[{y:2024,w:1,harm:0,src:'observed'},{y:2024,w:3,harm:8,src:'estimated'},{y:2024,w:5,harm:99,src:'observed'},{y:2023,w:3,harm:100,src:'observed'}];
  const reading=seasonReading(weeks,'Nepal',2024,3);
  assert.match(reading.text,/8 detections/);assert.match(reading.text,/2 available weeks/);assert.match(reading.text,/Week 3/);
  assert.match(reading.basis,/1 week contains/);assert.doesNotMatch(reading.text,/99|100/);
  assert.match(seasonReading(weeks,'Nepal',2022,3).text,/no available/);
});

test('historical explanation respects reveal state and removes incomplete references from comparison',()=>{
  const rows=[{w:1,viirs:1,model:500,reference_ok:false},{w:2,viirs:0,model:4,reference_ok:true},{w:3,viirs:20,model:30,reference_ok:true}];
  assert.doesNotMatch(historyReading(rows,'Chin',2024,3,false).text,/average|500/);
  assert.match(historyReading(rows,'Chin',2024,3,true).text,/about 4 detections/);
  assert.match(historyReading(rows,'Chin',2024,3,true).text,/1 comparable week before/);
  assert.doesNotMatch(historyReading(rows,'Chin',2024,2,true).text,/average/);
});

test('expired or unavailable outlooks never produce a current prediction, and true zero is retained',()=>{
  const outlook={active:true,p_above:0};
  assert.match(outlookReading(outlook,false,'Bangladesh','2026-11-18').text,/0% chance/);
  assert.match(outlookReading({...outlook,p_above:.8},true,'Bangladesh','2020-01-01').text,/expired/);
  assert.doesNotMatch(outlookReading({...outlook,p_above:.8},true,'Bangladesh','2020-01-01').text,/80%/);
  assert.match(outlookReading(undefined,false,'Bangladesh',undefined).text,/not available/);
  assert.match(outlookReading({...outlook,p_above:2},false,'Bangladesh',undefined).text,/not available/);
});

test('numeric readings handle observed zero, ignore missing values, and provide Bangla copy',()=>{
  assert.match(seriesReading([{label:'2024',value:0}], 'Annual record','Source','Note').text,/about 0 detections/);
  assert.match(seriesReading([{label:'missing',value:NaN}], 'Annual record','Source','Note').text,/no available/);
  assert.match(seriesReading([{label:'২০২৪',value:5}], 'বার্ষিক রেকর্ড','উৎস','নোট',true).text,/৫/);
});
