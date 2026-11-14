import { geoMercator, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { area, line } from 'd3-shape';
import { useMemo, useRef } from 'react';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { RequestStatus } from '../components/RequestStatus';
import { ShareButton } from '../components/ShareButton';
import { useFmt } from '../i18n';
import { GLOBAL_AREAS, dataUrl, loadGlobalCase, loadGlobalCatalog, loadLand, useAsync } from '../lib/data';
import { calendarWeeks, downloadEvidence, evidenceCSV, experimentRows, hiddenError } from '../lib/evidence';
import type { GlobalArea, GlobalCase, GlobalWeek } from '../lib/types';
import { useWidth } from '../lib/useWidth';

export function Global({ params, setParams }: { params: URLSearchParams; setParams: (p: Record<string, string | number | undefined>) => void }) {
  const { lang } = useFmt();
  const bn = lang === 'bn';
  const { data: catalog, error, loading, retry } = useAsync(loadGlobalCatalog, []);
  const requested = params.get('area') ?? 'bangladesh';
  const id = GLOBAL_AREAS.includes(requested as typeof GLOBAL_AREAS[number]) ? requested : 'bangladesh';
  const { data: doc, error: caseError, loading: caseLoading, retry: retryCase } = useAsync(() => loadGlobalCase(id), [id]);
  const year = [2022, 2023, 2024].includes(Number(params.get('testYear'))) ? Number(params.get('testYear')) : 2024;
  const switchWeek = Math.max(5, Math.min(49, Math.round(Number(params.get('switchWeek')) || 26)));
  const reveal = params.get('reveal') === '1';
  return <div className="global-workbench flex flex-col gap-5">
    <header className="global-intro global-interactive">
      <div><p className="eyebrow">{bn ? 'সীমানা পেরিয়ে · সেন্সর পেরিয়ে' : 'Across borders · Across sensors'}</p>
        <h1>{bn ? 'এক আগুনের ইতিহাস। ভিন্ন উপগ্রহ।' : 'One fire history. Different satellites.'}</h1>
        <p>{bn ? 'সেন্সর বদলালে আগুনের রেকর্ড বদলে যায়। বাস্তব পর্যবেক্ষণ দিয়ে পরীক্ষা করুন, সমন্বয় কতটা কাজ করে—আর কোথায় করে না।' : 'A new satellite can make the same landscape look different. Test the correction against real observations—and see where it falls short.'}</p>
      </div>
      {catalog && <CaseMap areas={catalog.areas} selected={id} />}
    </header>
    <RequestStatus error={error} loading={loading} retry={retry} />
    {catalog && <div className="global-areas global-interactive" role="group" aria-label={bn ? 'পরীক্ষিত এলাকা' : 'Evaluated areas'}>
      {catalog.areas.map(a => <button type="button" className="card area-choice" key={a.id} aria-pressed={id === a.id} onClick={() => setParams({ area: a.id })}>
        <span className="eyebrow">{a.iso3} / {a.id === 'bangladesh' || a.id === 'nepal' ? (bn ? 'দেশ' : 'Country') : (bn ? 'অঞ্চল' : 'Region')}</span>
        <strong>{bn ? a.name_bn : a.name_en}</strong><span className="text-sm text-muted">{a.setting}</span>
        <span className={`case-status ${a.evaluation.status === 'baseline_preferred' ? 'case-limited' : ''}`}>{a.evaluation.status === 'model_advantage' ? (bn ? 'সাপ্তাহিক ভুল কমেছে' : 'Lower weekly error') : (bn ? 'পুনর্গঠন স্থগিত' : 'Reconstruction withheld')}</span>
      </button>)}
    </div>}
    <RequestStatus error={caseError} loading={caseLoading} retry={retryCase} />
    {doc && catalog && <AreaEvidence key={doc.id} doc={doc} protocol={catalog.protocol} year={year} switchWeek={switchWeek} reveal={reveal} setParams={setParams} />}
    <p className="text-sm text-muted global-interactive">{bn ? 'শুধু তালিকাভুক্ত এলাকা সমর্থিত। অন্য এলাকা বা নিজের আঁকা বহুভুজের নির্ভরযোগ্য পুনর্গঠন এখনো যাচাই করা হয়নি।' : 'Only the listed area packages are supported. Other places and custom polygons do not yet have an evaluated reconstruction.'}</p>
  </div>;
}

function CaseMap({ areas, selected }: { areas: GlobalArea[]; selected: string }) {
  const { lang } = useFmt();
  const { data: land } = useAsync(loadLand, []);
  const projection = geoMercator().center([84, 22.5]).scale(520).translate([210, 100]);
  const path = geoPath(projection);
  return <figure className="case-map" aria-label={lang === 'bn' ? 'দক্ষিণ এশিয়ার চারটি উদাহরণ' : 'Four case extents in South Asia'}>
    <svg viewBox="0 0 420 205" role="img" aria-label="South Asia case locations"><rect width="420" height="205" fill="var(--card)" />
      {land && <path d={path(land) ?? ''} fill="var(--zero)" stroke="var(--muted)" strokeWidth=".7" />}
      {areas.map(a => { const [x, y] = projection([(a.bbox[0] + a.bbox[2]) / 2, (a.bbox[1] + a.bbox[3]) / 2])!;
        return <g key={a.id}><circle cx={x} cy={y} r={selected === a.id ? 12 : 7} fill={selected === a.id ? 'var(--accent)' : 'var(--level-below)'} stroke="var(--card)" strokeWidth="3" /><text x={x + 15} y={y + 4} fill="var(--ink)" fontSize="11">{a.iso3}</text></g>;
      })}
    </svg><figcaption>{lang === 'bn' ? 'দক্ষিণ এশিয়ার উদাহরণ · বিশ্বব্যাপী কভারেজ নয়' : 'Cases in South Asia · coverage is bounded'}</figcaption>
  </figure>;
}

function AreaEvidence({ doc, protocol, year, switchWeek, reveal, setParams }: { doc: GlobalCase; protocol: string; year: number; switchWeek: number; reveal: boolean; setParams: (p: Record<string, string | number | undefined>) => void }) {
  const { lang, num, num1 } = useFmt();
  const bn = lang === 'bn';
  const ref = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => experimentRows(doc, year, switchWeek), [doc, year, switchWeek]);
  const weeks = useMemo(() => calendarWeeks(doc), [doc]);
  const calendar = useMemo(() => ({ weeks, handover: { snpp_end_utc: '2026-11-02T13:00:00Z' } }), [weeks]);
  const ours = hiddenError(rows, switchWeek, 'model');
  const baseline = hiddenError(rows, switchWeek, 'factor');
  const approved = doc.evaluation.status === 'model_advantage';
  const through = doc.data_through.snpp ?? Object.values(doc.data_through).sort().pop();
  const name = bn ? doc.name_bn : doc.name_en;
  const vintage = doc.folds[String(year)];
  const prefix = `agun-panjika-${doc.id}-${year}-w${switchWeek}`;
  const exportJSON = () => downloadEvidence(JSON.stringify({ project: 'Agun Panjika', team: 'KUETaguns', area: doc.id, exported_utc: new Date().toISOString(), view: { year, switchWeek, reveal }, url: location.href, protocol, ...doc, attribution: 'NASA FIRMS / LANCE / ESDIS. Counts are satellite detections, not unique fires or burned area.' }, null, 2), `${prefix}.json`, 'application/json');
  return <>
    <section className="card p-4 sm:p-6 global-interactive" aria-labelledby="experiment-h">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">01 / {name}</p><h2 id="experiment-h" className="text-xl font-bold">{bn ? 'সেন্সর বদলের পরীক্ষা' : 'The sensor-switch experiment'}</h2></div><span className="case-status">{bn ? 'অতীতের তথ্য দিয়ে পরীক্ষা' : 'Retrospective replay'}</span></div>
      <p className="mt-2 max-w-3xl text-sm text-muted">{bn ? 'একটি পরীক্ষার বছরে VIIRS লুকিয়ে MODIS থেকে পুনর্গঠন করুন। সীমার পরে পর্যবেক্ষণ ব্যবহার করা হয়। তারপর আসল তথ্য দেখিয়ে যাচাই করুন।' : 'Hide VIIRS before a chosen week in a test year. Reconstruct it from MODIS, then switch to observations. Reveal the withheld measurements to inspect the error.'}</p>
      <div className="experiment-controls">
        <label>{bn ? 'পরীক্ষার বছর' : 'Test year'}<select className="select" value={year} onChange={e => setParams({ testYear: e.target.value })}>{[2022, 2023, 2024].map(y => <option key={y}>{y}</option>)}</select></label>
        <label className="switch-control">{bn ? 'সেন্সর বদলের সপ্তাহ' : 'Switch at week'} <strong>W{switchWeek}</strong><input aria-label={bn ? 'সেন্সর বদলের সপ্তাহ' : 'Sensor switch week'} type="range" min="5" max="49" value={switchWeek} onChange={e => setParams({ switchWeek: e.target.value })} /></label>
        <button type="button" className="btn btn-primary" aria-pressed={reveal} data-tour="reveal" onClick={() => setParams({ reveal: reveal ? '0' : '1' })}>{reveal ? (bn ? 'পর্যবেক্ষণ লুকান' : 'Hide reference') : (bn ? 'আসল পর্যবেক্ষণ দেখুন' : 'Reveal actual VIIRS')}</button>
      </div>
      <TransitionChart rows={rows} switchWeek={switchWeek} reveal={reveal} />
      <p className="mt-2 text-xs text-muted">{bn ? 'ফাঁকা অংশে NASA-র নথিভুক্ত বিভ্রাটে VIIRS পর্যবেক্ষণ অসম্পূর্ণ। ভুল গণনায় সেই সপ্তাহ বাদ, কিন্তু মূল সংখ্যা সারণি ও ডাউনলোডে আছে।' : 'Gaps mark incomplete VIIRS references during documented NASA outages. Errors exclude those weeks; raw observations remain in the table and download.'}</p>
      <div className="case-metrics"><div><span>{bn ? 'পুনর্গঠনের ভুল' : 'Model error before switch'}</span><strong>{ours === null ? '—' : num1(ours)} <small>{bn ? 'শনাক্তকরণ/সপ্তাহ' : 'detections/week'}</small></strong></div><div><span>{bn ? 'একক গুণকের ভুল' : 'Fitted-factor error'}</span><strong>{baseline === null ? '—' : num1(baseline)} <small>{bn ? 'শনাক্তকরণ/সপ্তাহ' : 'detections/week'}</small></strong></div></div>
      <p className="mt-3 text-xs text-muted">{bn ? 'এই পরীক্ষার ফিট' : 'This vintage fits'} {vintage.fit.join('–')} · {bn ? 'সীমা নির্ধারণ' : 'interval calibration'} {vintage.calibration[0]} ({vintage.calibration_weeks} {bn ? 'সপ্তাহ' : 'weeks'}) · {bn ? 'পরীক্ষা' : 'test'} {year}. {bn ? 'প্রতি বছর শুধু আগের তথ্য দিয়ে নতুন ফিট। এটি ভবিষ্যতের আগুনের পূর্বাভাস নয়।' : 'Each year uses only older labels. This reconstructs history; it does not forecast future fires.'}</p>
      <details className="mt-3"><summary>{bn ? 'সংখ্যার সারণি' : 'Read the chart as a table'}</summary><div className="overflow-x-auto" tabIndex={0}><table className="data-table"><caption>{name} · {year} · {bn ? 'সাপ্তাহিক শনাক্তকরণ' : 'weekly detections'}</caption><thead><tr>{['Week', 'MODIS', 'VIIRS reference', 'Model', 'Factor', '80% interval'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(w => <tr key={w.w}><th scope="row">W{w.w}</th><td>{num(w.modis!)}</td><td>{(reveal || w.w >= switchWeek) && w.reference_ok === false ? `Partial: ${num(w.viirs!)}` : reveal || w.w >= switchWeek ? num(w.viirs!) : '—'}</td><td>{num(w.model!)}</td><td>{num(w.factor!)}</td><td>{num(w.lo!)}–{num(w.hi!)}</td></tr>)}</tbody></table></div></details>
    </section>

    <section className="card p-4 sm:p-6 global-interactive" aria-labelledby="case-calendar-h"><p className="eyebrow">02 / {bn ? 'মৌসুমের ধরন' : 'The seasonal pattern'}</p><h2 id="case-calendar-h" className="text-xl font-bold">{name} · {bn ? 'আগুনের পঞ্জিকা' : 'fire calendar'}</h2>
      <p className="my-3 text-sm text-muted">{approved ? (bn ? '≈ চিহ্নের সারিগুলো MODIS থেকে পুনর্গঠিত; পরের সারিতে সরাসরি VIIRS পর্যবেক্ষণ।' : 'Rows marked ≈ are reconstructed from MODIS. Later rows use observed VIIRS. Hover or use arrow keys to inspect a week.') : (bn ? 'এই এলাকায় মডেল একক গুণকের চেয়ে খারাপ করেছে। তাই পুনর্গঠিত বছর দেখানো হচ্ছে না; শুধু VIIRS পর্যবেক্ষণ দেখুন।' : 'The model lost to a fitted factor here. Reconstructed years are withheld; this calendar shows observed VIIRS only.')}</p>
      <CalendarHeatmap doc={calendar} highlightYear={year} cell={12} />
      <p className="mt-2 text-xs text-muted">{bn ? 'অসম্পূর্ণ রেফারেন্সের সপ্তাহ ক্যালেন্ডারে ফাঁকা। আগের বছরের অনুমান সর্বশেষ ফিট থেকে; পরীক্ষার বছরগুলো নিজ নিজ পুরোনো তথ্যের ফিট ব্যবহার করে।' : 'Incomplete reference weeks are left blank. Earlier reconstructions use the latest historical vintage; each test year uses its own past-only fit.'}</p>
      <p className="mt-3 text-xs text-muted">{bn ? 'প্রতিটি এলাকার রঙের সীমা আলাদা। বিভিন্ন এলাকার রঙ সরাসরি তুলনীয় নয়।' : 'Color scales are fitted separately per area. Compare patterns within an area; colors do not imply equal counts across areas.'}</p>
    </section>

    <section data-tour="evidence" ref={ref} className="card global-evidence p-4 sm:p-6" aria-labelledby="evidence-h"><p className="eyebrow">03 / {bn ? 'প্রমাণ সঙ্গে রাখুন' : 'Keep the evidence attached'}</p><h2 id="evidence-h" className="text-xl font-bold">{name} · {bn ? 'তথ্য ও সীমাবদ্ধতা' : 'evidence brief'}</h2>
      <p className={`case-verdict ${approved ? '' : 'case-limited'}`}>{approved ? (bn ? `সাপ্তাহিক ভুল একক গুণকের চেয়ে ${num1(doc.evaluation.improvement_pct)}% কম।` : `${num1(doc.evaluation.improvement_pct)}% lower weekly error than a fitted factor in the temporal replay.`) : (bn ? 'নির্ভরযোগ্য পুনর্গঠনের যথেষ্ট প্রমাণ নেই। এখানে সাধারণ গুণক ভালো করেছে।' : 'Insufficient evidence for this reconstruction. A fitted factor performed better here.')}</p>
      <div className="case-facts"><div><span>{bn ? 'VIIRS তথ্যের শেষ তারিখ' : 'VIIRS observations through'}</span><strong>{through}</strong></div><div><span>{bn ? 'পরীক্ষার সপ্তাহ' : 'Comparable / raw weeks'}</span><strong>{num(doc.evaluation.models.ensemble.weeks)} / {num(doc.evaluation.all_weeks.ensemble.weeks)}</strong></div><div><span>{bn ? '৮০% সীমার পরীক্ষিত কভারেজ' : 'Measured coverage of 80% intervals'}</span><strong>{num1(doc.evaluation.coverage80 * 100)}%</strong></div><div><span>{bn ? 'পরীক্ষার বছর' : 'Evaluation years'}</span><strong>2022–2024</strong></div></div>
      <p className="mt-3 text-sm">{bn ? 'সীমার কভারেজ মাপা ফল, নিশ্চয়তা নয়। প্রতি বছরের ফিট, সীমা নির্ধারণ ও পরীক্ষা সময়ের ক্রমে আলাদা। এই বছরগুলো তৈরির সময় জানা ছিল; এটি সম্পূর্ণ অদেখা চূড়ান্ত পরীক্ষা নয়।' : 'Coverage is measured, not guaranteed. Each yearly fit, calibration and test is chronological. These were known development years, not an untouched final holdout.'}</p>
      <p className="mt-2 text-sm text-muted">{bn ? 'এগুলো উপগ্রহের শনাক্তকরণ—আলাদা আগুন, পোড়া জমির পরিমাণ বা বিপদের সতর্কবার্তা নয়। মেঘ বা অসম্পূর্ণ পর্যবেক্ষণে আগুন আড়াল হতে পারে। শূন্য শনাক্তকরণ মানে আগুন নেই—এমন নয়।' : 'These are satellite detections, not unique fires, burned area or an emergency warning. Clouds and observation gaps can hide activity. Zero detections do not establish absence of fire.'}</p>
      <p className="mt-2 text-xs text-muted">{doc.filter}</p>
      <ScoreTable scores={doc.evaluation.models} label={bn ? 'একই ১৪২টি তুলনাযোগ্য সপ্তাহে সব পদ্ধতি' : 'Matched comparison: same 142 eligible weeks for every method'} />
      {doc.evaluation.models.monthly.mae_week < doc.evaluation.models.ensemble.mae_week && <p className="case-verdict case-limited">{bn ? 'এখানে মাসভিত্তিক গুণক নতুন মডেলের চেয়েও কম ভুল করেছে।' : 'Monthly factors still have lower error here. The updated model does not beat every baseline.'}</p>}
      <div className="case-release-change"><span>{bn ? 'আগের প্রকাশনা → নতুন মডেল, একই ১৫৬টি মূল সপ্তাহ' : 'Previous release → updated model, all 156 original weeks'}</span><strong>{num1(doc.evaluation.previous_release_mae)} → {num1(doc.evaluation.all_weeks.ensemble.mae_week)}</strong><small>{bn ? 'শনাক্তকরণ/সপ্তাহ; কম হলে ভালো। শুধু সপ্তাহ বাদ দিয়ে পাওয়া উন্নতি নয়।' : 'detections/week; lower is better. These comparisons keep every original test week.'}</small></div>
      <details className="mt-4"><summary>{bn ? 'সব মূল সপ্তাহ, বিভ্রাট ও আগের ফল দেখুন' : 'Inspect all raw weeks, outages and the original benchmark'}</summary>
        <ScoreTable scores={doc.evaluation.all_weeks} label={bn ? 'অসম্পূর্ণ পর্যবেক্ষণসহ সব ১৫৬টি সপ্তাহ' : 'All 156 weeks, including incomplete reference observations'} />
        <p className="text-xs text-muted mt-2">{bn ? 'তুলনাযোগ্য ফল থেকে বাদ পড়া সপ্তাহ' : 'Weeks omitted only from the comparable scores'}: {doc.evaluation.excluded_test_weeks.map(([y,w])=>`${y}-W${w}`).join(', ')}.</p>
        <div className="flex flex-wrap gap-4 text-xs mt-3"><a href={dataUrl('global/reference_quality.json')}>{bn ? 'উৎসসহ বিভ্রাটের নথি' : 'Source-linked acquisition outage flags'}</a><a href={dataUrl(`global/v1/${doc.id}.json`)}>{bn ? 'আগের সম্পূর্ণ বেঞ্চমার্ক' : 'Original frozen benchmark JSON'}</a></div>
      </details>
      <p className="mt-3 text-xs text-muted">NASA FIRMS / LANCE / ESDIS · KUETaguns · {doc.version}<br />{bn ? 'তৈরি' : 'Package built'} {doc.built_utc.slice(0, 10)} · {bn ? 'নির্বাচিত পরীক্ষা' : 'Selected experiment'} {year} / W{switchWeek}<br /><span className="snapshot-hash">SHA-256 {doc.snapshot_sha256}</span></p>
      <p className="mt-2 text-xs text-muted">{bn ? 'উৎস ও পুনরুৎপাদন' : 'Sources and reproduction'}: <a href="https://www.earthdata.nasa.gov/data/tools/firms">NASA FIRMS</a> · <a href="https://github.com/polymathicX/Agun-Panjika/blob/main/docs/GLOBAL_EVALUATION.md">{bn ? 'পদ্ধতি ও সীমা' : 'Protocol and limitations'}</a></p>
    </section>
    <div className="flex flex-wrap gap-2 no-print"><ShareButton target={ref} filename={`${prefix}.png`} title={`${name} evidence brief`} /><button type="button" className="btn" onClick={exportJSON}>{bn ? 'সম্পূর্ণ প্রমাণ JSON' : 'Download evidence JSON'}</button><button type="button" className="btn" onClick={() => downloadEvidence(evidenceCSV(doc, rows), `${prefix}.csv`, 'text/csv')}>{bn ? 'পরীক্ষার তথ্য CSV' : 'Download experiment CSV'}</button><button type="button" className="btn" onClick={() => window.print()}>{bn ? 'প্রতিবেদন প্রিন্ট / PDF' : 'Print brief / PDF'}</button></div>
    <details className="global-interactive"><summary>{bn ? 'অঞ্চলভিত্তিক ভুল ও সম্পূর্ণ পদ্ধতি (ইংরেজি)' : 'Regional failures and full protocol'}</summary><p className="text-sm my-2">{protocol}</p><div className="overflow-x-auto" tabIndex={0}><table className="data-table"><thead><tr><th scope="col">Region</th><th scope="col">Model weekly MAE</th><th scope="col">Factor weekly MAE</th></tr></thead><tbody>{doc.evaluation.per_region.map(r => <tr key={r.id}><th scope="row">{r.id}</th><td>{num1(r.ensemble.mae_week)}</td><td>{num1(r.naive.mae_week)}</td></tr>)}</tbody></table></div></details>
  </>;
}

function ScoreTable({scores,label}:{scores:GlobalArea['evaluation']['models'];label:string}) {
  const {lang,num1}=useFmt();const bn=lang==='bn';
  const names:Record<string,string>={ensemble:bn?'নতুন মডেল':'Updated model',unguarded:bn?'অতিরিক্ত সীমার সংশোধন ছাড়া':'Without extrapolation fix',naive:bn?'একক গুণক':'Fitted single factor',monthly:bn?'মাসভিত্তিক গুণক':'Monthly factors','prd_4.4x':bn?'স্থির ৪.৪× (রেফারেন্স)':'Fixed 4.4× (reference)'};
  return <div className="mt-3 overflow-x-auto" tabIndex={0}><table className="data-table"><caption>{label}</caption><thead><tr><th scope="col">{bn?'পদ্ধতি':'Method'}</th><th scope="col">{bn?'সাপ্তাহিক MAE':'Weekly MAE'}</th><th scope="col">{bn?'মোট সংখ্যার ভুল':'Mean period-total error'}</th></tr></thead><tbody>{Object.entries(scores).map(([method,score])=><tr key={method}><th scope="row">{names[method]??method}</th><td>{num1(score.mae_week)}</td><td>{num1(score.abs_total_pct_err)}%</td></tr>)}</tbody></table><p className="text-xs text-muted mt-1">{bn?'প্রতি বছরের একই অন্তর্ভুক্ত সপ্তাহের মোটের ভুলের গড়; বাদ পড়া সপ্তাহসহ পূর্ণ বছরের মোট নয়।':'Total error compares identical included weeks within each year; eligible-week totals are not complete annual totals.'}</p></div>;
}

function TransitionChart({ rows, switchWeek, reveal }: { rows: ReturnType<typeof experimentRows>; switchWeek: number; reveal: boolean }) {
  const { lang, num } = useFmt();
  const bn = lang === 'bn';
  const [ref, width] = useWidth<HTMLDivElement>();
  const h = 290, left = 52, right = Math.max(left + 1, width - 12);
  const x = scaleLinear().domain([1, 52]).range([left, right]);
  const y = scaleLinear().domain([0, Math.max(1, ...rows.flatMap(w => [w.stitched, w.corrected, w.scaled, w.observed, w.hi ?? 0]).filter((v): v is number => typeof v === 'number' && Number.isFinite(v))) * 1.06]).range([h - 32, 18]).nice();
  const curve = (key: keyof typeof rows[number]) => line<typeof rows[number]>().defined(w => Number.isFinite(w[key])).x(w => x(w.w)).y(w => y(Number(w[key])))(rows) ?? '';
  const band = area<GlobalWeek>().x(w => x(w.w)).y0(w => y(w.lo ?? 0)).y1(w => y(w.hi ?? 0))(rows.filter(w => w.w < switchWeek)) ?? '';
  const legend = [[bn ? 'কাঁচা জোড়া' : 'Uncorrected join', 'var(--naive)'], [bn ? 'একক গুণক' : 'Fitted factor', 'var(--muted)'], [bn ? 'সমন্বিত' : 'Corrected join', 'var(--accent)'], ...(reveal ? [[bn ? 'আসল VIIRS' : 'Actual VIIRS', 'var(--ink)']] : [])];
  return <div ref={ref} className="mt-3"><svg width={width} height={h} role="img" aria-label={bn ? 'কাঁচা ও সমন্বিত শনাক্তকরণের তুলনা' : 'Weekly raw join, fitted factor and corrected join across a simulated sensor switch'}>
    <rect x={left} width={Math.max(0, x(switchWeek) - left)} y="18" height={h - 50} fill="var(--zero)" />
    {y.ticks(5).map(v => <g key={v}><line x1={left} x2={right} y1={y(v)} y2={y(v)} stroke="var(--grid)" /><text x={left - 7} y={y(v) + 4} fill="var(--muted)" textAnchor="end" fontSize="11">{num(v)}</text></g>)}
    <path d={band} fill="var(--accent)" opacity=".13" />
    <path d={curve('stitched')} fill="none" stroke="var(--naive)" strokeWidth="2" />
    <path d={curve('scaled')} fill="none" stroke="var(--muted)" strokeDasharray="5 4" strokeWidth="1.6" />
    <path d={curve('corrected')} fill="none" stroke="var(--accent)" strokeWidth="2.6" />
    {reveal && <path d={curve('observed')} fill="none" stroke="var(--ink)" strokeDasharray="2 4" strokeWidth="2" />}
    <line x1={x(switchWeek)} x2={x(switchWeek)} y1="18" y2={h - 32} stroke="var(--ink)" strokeDasharray="4 4" />
    {[1, 13, 26, 39, 52].map(w => <text key={w} x={x(w)} y={h - 10} textAnchor="middle" fontSize="11" fill="var(--muted)">W{w}</text>)}
    <text x={left + 7} y="31" fontSize="10" fill="var(--muted)">{bn ? 'VIIRS লুকানো' : 'VIIRS withheld'}</text>
  </svg><div className="flex flex-wrap gap-4 text-xs">{legend.map(([label, color]) => <span key={label} className="inline-flex items-center gap-1"><span style={{ background: color }} className="inline-block w-4 h-1" />{label}</span>)}<span className="text-muted">{bn ? 'ছায়া: ৮০% সীমা' : 'Shading: calibrated 80% interval'}</span></div></div>;
}
