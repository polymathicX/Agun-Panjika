import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calendarWeeks, experimentRows, hiddenError, evidenceCSV } from '../src/lib/evidence.ts';

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
