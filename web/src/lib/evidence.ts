import type { GlobalCase, GlobalWeek, Week } from './types';

export function experimentRows(doc: GlobalCase, year: number, switchWeek: number) {
  return doc.weeks.filter(w => w.y === year && w.viirs !== undefined && w.modis !== undefined && w.model !== undefined).map(w => {
    const observed = w.reference_ok === false ? undefined : w.viirs;
    return {...w, observed, stitched: w.w < switchWeek ? w.modis! : observed,
      corrected: w.w < switchWeek ? w.model! : observed,
      scaled: w.w < switchWeek ? w.factor! : observed};
  });
}

export function hiddenError(rows: GlobalWeek[], switchWeek: number, key: 'model' | 'factor') {
  const hidden = rows.filter(w => w.w < switchWeek && w.reference_ok !== false && w.viirs !== undefined && w[key] !== undefined);
  return hidden.length ? hidden.reduce((s, w) => s + Math.abs(w[key]! - w.viirs!), 0) / hidden.length : null;
}

export function calendarWeeks(doc: GlobalCase): Week[] {
  const approved = doc.evaluation.status === 'model_advantage';
  return doc.weeks.flatMap<Week>(w => {
    if (w.viirs !== undefined && w.reference_ok !== false) return [{ ...w, harm: w.viirs, src: 'observed' as const }];
    if (approved && w.model !== undefined && w.y < 2012) return [{ ...w, harm: w.model, src: 'estimated' as const }];
    return [];
  });
}

export function evidenceCSV(doc: GlobalCase, rows: GlobalWeek[]) {
  const fields = ['area', 'model_version', 'input_sha256', 'iso_year', 'iso_week', 'modis_observed', 'viirs_observed_raw', 'model_estimate', 'factor_estimate', 'lo80', 'hi80', 'reference_quality', 'point_fit_years'];
  return [fields.join(','), ...rows.map(w => [doc.id, doc.version, doc.snapshot_sha256, w.y, w.w, w.modis, w.viirs, w.model, w.factor, w.lo, w.hi,
    w.viirs === undefined ? '' : w.reference_ok === false ? 'incomplete' : 'eligible',
    doc.folds?.[w.y]?.fit.join('-') ?? doc.historical_vintage?.fit.join('-') ?? ''].map(v => v ?? '').join(','))].join('\r\n');
}

export function downloadEvidence(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
