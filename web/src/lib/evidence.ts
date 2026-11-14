import type { GlobalCase, GlobalWeek, Week } from './types';

export function experimentRows(doc: GlobalCase, year: number, switchWeek: number) {
  return doc.weeks.filter(w => w.y === year && w.viirs !== undefined && w.modis !== undefined && w.model !== undefined).map(w => ({
    ...w, stitched: w.w < switchWeek ? w.modis! : w.viirs!,
    corrected: w.w < switchWeek ? w.model! : w.viirs!,
    scaled: w.w < switchWeek ? w.factor! : w.viirs!,
  }));
}

export function hiddenError(rows: GlobalWeek[], switchWeek: number, key: 'model' | 'factor') {
  const hidden = rows.filter(w => w.w < switchWeek && w.viirs !== undefined && w[key] !== undefined);
  return hidden.length ? hidden.reduce((s, w) => s + Math.abs(w[key]! - w.viirs!), 0) / hidden.length : null;
}

export function calendarWeeks(doc: GlobalCase): Week[] {
  const approved = doc.evaluation.status === 'model_advantage';
  return doc.weeks.flatMap<Week>(w => {
    if (w.viirs !== undefined) return [{ ...w, harm: w.viirs, src: 'observed' as const }];
    if (approved && w.model !== undefined && w.y < 2012) return [{ ...w, harm: w.model, src: 'estimated' as const }];
    return [];
  });
}

export function evidenceCSV(doc: GlobalCase, rows: GlobalWeek[]) {
  const fields = ['area', 'model_version', 'input_sha256', 'iso_year', 'iso_week', 'modis_observed', 'viirs_observed', 'model_estimate', 'factor_estimate', 'lo80', 'hi80'];
  return [fields.join(','), ...rows.map(w => [doc.id, doc.version, doc.snapshot_sha256, w.y, w.w, w.modis, w.viirs, w.model, w.factor, w.lo, w.hi].map(v => v ?? '').join(','))].join('\r\n');
}

export function downloadEvidence(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
