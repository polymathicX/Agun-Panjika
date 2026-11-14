import { geoEquirectangular, geoPath } from 'd3-geo';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { RequestStatus } from '../components/RequestStatus';
import { useFmt } from '../i18n';
import { loadWorldGeo, loadWorldPoints, loadWorldSummary, useAsync } from '../lib/data';
import { containsPoint, type Hotspot } from '../lib/spatial';
import type { Route } from '../lib/router';
import { InstallApp } from '../components/InstallApp';
import '../components/Globe.css';
import './World.css';
const Earth3D = lazy(() => import('../components/Earth3D'));
const SENSORS = { noaa20: 'VIIRS NOAA-20', noaa21: 'VIIRS NOAA-21', modis: 'MODIS Terra + Aqua' };

function AnimatedNumber({ value }: { value: number }) {
  const { num } = useFmt();
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return; }
    const begin = performance.now(), from = shown; let frame = 0;
    const tick = (now: number) => { const t = Math.min(1, (now - begin) / 650); setShown(Math.round(from + (value - from) * (1 - (1 - t) ** 3))); if (t < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [value]);
  return <><span aria-hidden="true">{num(shown)}</span><span className="sr-only">{num(value)}</span></>;
}

export function World({ params, setParams, go }: { params: URLSearchParams; setParams: (p: Record<string, string | number | undefined>, replace?: boolean) => void; go: (r: Route, p?: Record<string, string | number | undefined>) => void }) {
  const { lang, num } = useFmt(); const bn = lang === 'bn';
  const { data: world, error, loading, retry } = useAsync(loadWorldSummary, []);
  const { data: geo, error: geoError, loading: geoLoading, retry: retryGeo } = useAsync(loadWorldGeo, []);
  const selected = world?.countries.find(c => c.id === params.get('country'));
  const sensor = Object.prototype.hasOwnProperty.call(SENSORS, params.get('sensor') ?? '') ? params.get('sensor') as keyof typeof SENSORS : 'noaa20';
  const id = selected?.id ?? 'overview';
  const { data: observations, error: pointError, loading: pointsLoading, retry: retryPoints } = useAsync(() => loadWorldPoints(id, sensor), [id, sensor]);
  const [flat, setFlat] = useState(false), [playing, setPlaying] = useState(false);
  const [view, setView] = useState<{focus:[number,number];distance:number} | null>(null);
  const [watched, setWatched] = useState<string[]>(() => { try { const saved=JSON.parse(localStorage.getItem('ap-watchlist-v1') ?? '[]'); return Array.isArray(saved) ? saved.filter(x => typeof x === 'string' && /^[a-z0-9]{3}$/.test(x)).slice(0,10) : []; } catch { return []; } });
  const day = Number.isInteger(Number(params.get('day'))) && params.has('day') ? Number(params.get('day')) : -1;
  const days = observations?.dates ?? [];
  const validDay = day >= 0 && day < days.length ? day : -1;
  const points = useMemo<Hotspot[]>(() => {
    const out: Hotspot[] = []; if (!observations) return out;
    for(let i=0;i<observations.points.length;i+=3) { const [lon,lat,index]=observations.points.slice(i,i+3); if(validDay===-1 || index===validDay) out.push({lon,lat,week:index,status:1}); }
    return out;
  }, [observations, validDay]);
  const areas = useMemo(() => geo ? (selected ? geo.features.filter(f => f.properties?.id === selected.id) : geo.features) : [], [geo, selected?.id]);
  const focus = view?.focus ?? selected?.focus ?? [30,15] as [number,number];
  const choose = (country?: string, fly=true) => { const next=world?.countries.find(c=>c.id===country); if(fly)setView({focus:next?.focus ?? [30,15],distance:next ? 1.85 : 3.15}); setParams({country,day:undefined});setPlaying(false); };
  useEffect(()=>{if(world && !view)setView({focus:selected?.focus ?? [30,15],distance:selected ? 1.85 : 3.15});},[!!world]);
  const pick = (lon: number, lat: number) => choose(geo?.features.find(f => containsPoint(f, lon, lat))?.properties?.id);
  useEffect(() => {
    if (!playing || !days.length) return;
    const timer = setInterval(() => setParams({ day: (validDay + 1) % days.length },true), 1200);
    return () => clearInterval(timer);
  }, [playing, validDay, days.length, setParams]);
  const toggleWatch = () => { if (!selected) return; const next = watched.includes(id) ? watched.filter(x => x !== id) : [...watched.slice(-9), id]; setWatched(next); try {localStorage.setItem('ap-watchlist-v1', JSON.stringify(next));} catch {/* browsing works when storage is blocked */} };
  if (!world) return <RequestStatus error={error} loading={loading} retry={retry} />;
  const feed = world.sensors[sensor];
  const stats = selected?.sensors[sensor];
  const daily = stats?.daily ?? feed.dates.map((_, i) => world.countries.reduce((s, c) => s + (c.sensors[sensor].daily[i] ?? 0), 0));
  const title = selected?.name ?? (bn ? 'পৃথিবী' : 'Planet Earth');
  const last24 = stats?.last24h ?? world.countries.reduce((s, c) => s + c.sensors[sensor].last24h, 0);
  const total = stats?.total ?? feed.total;
  const stale = Date.now() - new Date(feed.through_utc).getTime() > 48 * 3600000;
  const caseId = ({ bgd:'bangladesh', npl:'nepal', mmr:'chin', ind:'punjab_haryana' } as Record<string,string>)[selected?.id ?? ''];
  return <div className="world-experience">
    <section className="world-hero">
      <div className="world-story"><p className="eyebrow">NASA FIRMS / {bn ? 'বিশ্বের আগুনের পর্যবেক্ষণ' : 'A shared view of our planet'}</p><h1>{bn ? <>পৃথিবী দেখুন।<br /><span>আগুনের গল্প বুঝুন।</span></> : <>See Earth.<br /><span>Read its fire story.</span></>}</h1><p className="hero-description">{bn ? 'যেকোনো দেশ বেছে নিন। উপগ্রহের সাম্প্রতিক শনাক্তকরণ দেখুন, দিনের পরিবর্তন অনুসরণ করুন, আর যেখানে যাচাই করা আছে সেখানে ইতিহাস বুঝুন।' : 'Choose any country. Explore recent satellite detections, follow the days, and open evaluated histories where they are available.'}</p>
        <div className="world-highlight"><span className="eyebrow">{bn ? 'নির্বাচিত এলাকা' : 'Your place on Earth'}</span><h2 aria-live="polite">{title}</h2><strong className="world-big-number"><AnimatedNumber value={total} /></strong><span className="text-sm text-muted">{bn ? '৭ দিনের ফাইলে শনাক্তকরণ' : 'detections in the seven-day feed'}</span><p className="text-xs text-muted mt-2">{SENSORS[sensor]} · {feed.from_utc.slice(0,10)} – {feed.through_utc.slice(0,10)}</p></div>
        <button type="button" className="btn btn-primary hero-cta mt-4" onClick={() => go('global', { area: caseId ?? 'bangladesh' })}>{bn ? 'ইতিহাসের সমন্বয় পরীক্ষা করুন' : 'Can the history be trusted?'} ↗</button>
      </div>
      <div className="world-globe"><div className="globe-topline"><span>{bn ? 'টেনে ঘোরান · দেশ বেছে নিন' : 'DRAG TO EXPLORE · SELECT A COUNTRY'}</span><button type="button" onClick={() => setFlat(v => !v)}>{flat ? (bn ? 'থ্রিডি পৃথিবী' : '3D globe') : (bn ? 'সমতল মানচিত্র' : 'Flat map')}</button></div>
        <RequestStatus error={geoError} loading={geoLoading} retry={retryGeo} />
        {geo && (flat ? <FlatWorld geo={geo} selected={id} onPick={pick} /> : <Suspense fallback={<p role="status">{bn ? 'পৃথিবী লোড হচ্ছে…' : 'Preparing Earth…'}</p>}><Earth3D areas={areas} points={points} focus={focus} focusDistance={view?.distance ?? (selected ? 1.85 : 3.15)} onViewSettled={(lon,lat,distance)=>{ if(distance<2.5)choose(geo?.features.find(f=>containsPoint(f,lon,lat))?.properties?.id,false); }} animatedFocus onUnavailable={() => setFlat(true)} onGlobeSelect={pick} onSelect={p => pick(p.lon,p.lat)} pointLabel={p => `${observations?.dates[p.week] ?? ''} UTC · ${p.lat.toFixed(3)}°, ${p.lon.toFixed(3)}° · ${SENSORS[sensor]}`} hint={bn ? 'দেশে ক্লিক করুন · চিমটি বা +/− দিয়ে জুম করুন' : 'Select a country on Earth · pinch or use +/− to zoom'} /></Suspense>)}
        <RequestStatus error={pointError} loading={pointsLoading} retry={retryPoints} />
        <p className="globe-note">{observations?.sampled ? (bn ? `সুবিধার জন্য ${num(points.length)}টি নমুনা বিন্দু দেখানো হয়েছে; সংখ্যায় সব শনাক্তকরণ আছে।` : `${num(points.length)} sampled points shown for speed; totals use every retained detection.`) : (bn ? `${num(points.length)}টি বিন্দু দেখানো হচ্ছে।` : `${num(points.length)} points shown.`)}</p>
      </div>
      <aside className="world-controls card p-4"><p className="eyebrow">{bn ? 'পৃথিবী আপনার হাতে' : 'Your Earth. Your perspective.'}</p><p className="text-sm text-muted mt-2">{bn ? 'ঘোরান, জুম করুন, দেশে ট্যাপ করুন।' : 'Spin, zoom, and tap a country. Its observations follow your view.'}</p><details className="mt-3"><summary className="text-xs">{bn ? 'কিবোর্ডে দেশ বেছে নিন' : 'Choose a country with the keyboard'}</summary><label htmlFor="world-country" className="sr-only">Country or territory</label><select id="world-country" className="select mt-2 w-full" value={selected?.id ?? ''} onChange={e => choose(e.target.value || undefined)}><option value="">{bn ? 'সমগ্র পৃথিবী' : 'Entire Earth'}</option>{world.countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></details>
        <label className="block mt-5 text-sm">{bn ? 'উপগ্রহ' : 'Satellite'}<select id="world-sensor" aria-label="Satellite" className="select w-full mt-2" value={sensor} onChange={e => {setParams({sensor:e.target.value,day:undefined});setPlaying(false);}}>{Object.entries(SENSORS).map(([s,n]) => <option key={s} value={s}>{n}</option>)}</select></label>
        <p className="text-xs text-muted mt-2">{bn ? 'ভিন্ন সেন্সরের সংখ্যা যোগ করবেন না; একই আগুন বারবার দেখা যায়।' : 'Keep sensors separate. The same fire can be detected more than once.'}</p>
        <div className="world-time"><label htmlFor="world-day">{bn ? 'দিন অনুসরণ করুন' : 'Follow the days'}</label><strong>{validDay < 0 ? (bn ? 'সব দিন' : 'All days') : days[validDay]}</strong><input id="world-day" type="range" min="-1" max={Math.max(0,days.length - 1)} value={validDay} onChange={e => {setPlaying(false);setParams({day:e.target.value});}} /><button type="button" className="btn" aria-pressed={playing} onClick={() => setPlaying(p => !p)}>{playing ? (bn ? 'বিরতি' : 'Pause timeline') : (bn ? 'দিনগুলো চালান' : 'Play timeline')} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button></div>
        {selected && <button type="button" className="btn mt-4 w-full" aria-pressed={watched.includes(id)} onClick={toggleWatch}><span aria-hidden="true">{watched.includes(id) ? '★' : '☆'}</span> {bn ? 'এই দেশ মনে রাখুন' : 'Watch this country'}</button>}
        <p className="text-xs text-muted mt-3">{bn ? 'সংরক্ষিত দেশ এই যন্ত্রেই থাকবে। নতুন তথ্য দেখতে আবার খুলুন; পুশ সতর্কতা পাঠানো হয় না।' : 'Saved on this device. Reopen to check the latest published snapshot; no push alerts.'}</p>
      </aside>
    </section>
    <div className="world-snapshot-note" role="status"><span className={`snapshot-dot ${stale ? 'snapshot-old' : ''}`} /><strong>{stale ? (bn ? 'পুরোনো তথ্য' : 'Older snapshot') : (bn ? 'সাম্প্রতিক প্রকাশিত তথ্য' : 'Latest published snapshot')}</strong><span>{bn ? 'পর্যবেক্ষণ শেষ' : 'Observations through'} {feed.through_utc.replace('T',' ').slice(0,16)} UTC · {bn ? 'সরাসরি জরুরি সতর্কতা নয়' : 'not a live emergency alert'}</span><button type="button" className="btn" onClick={() => location.reload()}>{bn ? 'নতুন করে দেখুন' : 'Check for update'}</button></div>
    {watched.length > 0 && <section className="world-watchlist"><h2 className="eyebrow">{bn ? 'আপনার সংরক্ষিত দেশ' : 'Your watchlist'}</h2><div className="flex flex-wrap gap-2 mt-2">{watched.map(w => world.countries.find(c => c.id === w)).filter(Boolean).map(c => <button key={c!.id} className="chip" type="button" onClick={() => choose(c!.id)}>{c!.name} <strong>{num(c!.sensors[sensor].total)}</strong></button>)}</div></section>}
    <InstallApp />
    <section className="world-results" key={`${id}-${sensor}`}><div className="card p-5"><p className="eyebrow">{title} / {bn ? 'সাম্প্রতিক পর্যবেক্ষণ' : 'Recent observations'}</p><h2 className="text-xl font-bold mt-2">{bn ? 'কোন দিনে কত শনাক্তকরণ?' : 'How does activity vary by day?'}</h2><DailyBars daily={daily} dates={feed.dates} /><p className="text-xs text-muted">{bn ? 'প্রথম ও শেষ দিন অসম্পূর্ণ হতে পারে। দেশভিত্তিক যোগফলে উপকূলের বাইরের বিন্দু নেই।' : 'First and last dates may be partial. Country-assigned totals exclude unassigned coastal/offshore points.'}</p></div>
      <div className="card p-5"><p className="eyebrow">{bn ? 'সংখ্যার অর্থ' : 'What the numbers mean'}</p><div className="world-small-number"><AnimatedNumber value={last24} /></div><p>{bn ? 'এই ফিডের শেষ পর্যবেক্ষণ পর্যন্ত গত ২৪ ঘণ্টায় দেশে শনাক্তকরণ।' : 'country-assigned detections in the 24 hours ending at this feed’s latest observation.'}</p><p className="text-sm text-muted mt-4">{total === 0 ? (bn ? 'কোনো শনাক্তকরণ রেকর্ড হয়নি। এতে আগুন নেই বা এলাকা নিরাপদ—এমন প্রমাণ হয় না।' : 'No retained detections were recorded. This does not establish absence of fire or safety.') : (bn ? 'এগুলো অনন্য আগুন বা পোড়া জমি নয়। মেঘ, সেন্সর ও উপগ্রহের সময় ফল বদলাতে পারে; শিল্পের তাপও থাকতে পারে।' : 'These are not unique fires or burned area. Clouds, sensor sensitivity and overpass timing affect detection; industrial heat may remain.')}</p><a className="btn mt-4" href="https://firms.modaps.eosdis.nasa.gov/map/" target="_blank" rel="noreferrer">{bn ? 'NASA FIRMS খুলুন' : 'Inspect in NASA FIRMS'} ↗</a></div>
    </section>
    <section className="global-launch"><div><p className="eyebrow">{bn ? 'আজকের বাইরে' : 'Beyond the latest observations'}</p><strong>{caseId ? (bn ? 'এই অঞ্চলের পরীক্ষিত ইতিহাস আছে।' : 'An evaluated historical case is available in this region.') : (bn ? 'এই দেশের সমন্বিত ইতিহাস এখনো যাচাই করা হয়নি।' : 'This country does not yet have an evaluated harmonized history.')}</strong><p className="text-sm text-muted mt-1">{bn ? 'সাম্প্রতিক বিন্দু ইতিহাসের তুলনাযোগ্যতা প্রমাণ করে না। চারটি কেসে পদ্ধতি ও ব্যর্থতা দেখুন।' : 'Recent points do not establish comparable history. Inspect four cases, their uncertainty and their failures.'}</p></div><button className="btn btn-primary" type="button" onClick={() => go('global',{area:caseId ?? 'bangladesh'})}>{bn ? 'ঐতিহাসিক কেস' : 'Explore historical cases'} ↗</button></section>
    <section className="world-impact"><div><span>01</span><h2>{bn ? 'নিজের এলাকা বুঝুন' : 'Understand your place'}</h2><p>{bn ? 'শিক্ষার্থী ও স্থানীয় সংগঠন পর্যবেক্ষণ দেখে প্রশ্ন তুলতে পারে।' : 'Students and local groups can inspect observations and ask better questions about their landscape.'}</p></div><div><span>02</span><h2>{bn ? 'পর্যবেক্ষণের প্রস্তুতি নিন' : 'Plan monitoring'}</h2><p>{bn ? 'পরীক্ষিত মৌসুমি ক্যালেন্ডার গবেষক ও ভূমি ব্যবস্থাপকদের নজরদারির সময় ভাবতে সাহায্য করতে পারে।' : 'Evaluated seasonal calendars can help researchers and land managers identify periods worth monitoring.'}</p></div><div><span>03</span><h2>{bn ? 'প্রমাণসহ শেয়ার করুন' : 'Share with context'}</h2><p>{bn ? 'তারিখ, উৎস ও অনিশ্চয়তা সঙ্গে রেখে তথ্য দিন; মানুষের ওপর প্রভাব এখনো মাঠে যাচাই করা হয়নি।' : 'Share dates, sources and uncertainty together. Benefits to real decisions still need practitioner evaluation.'}</p></div></section>
    <details className="mt-4"><summary>{bn ? 'বিশ্বব্যাপী তথ্যের উৎস ও সীমা' : 'Worldwide sources and coverage limits'}</summary><p className="text-sm text-muted my-2">{world.note}</p><p className="text-xs text-muted">{world.boundary_version} · {num(world.countries.length)} countries/territories · <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth credits</a> · NASA FIRMS / LANCE / ESDIS. {num(feed.unassigned)} unassigned detections.</p><div className="flex flex-wrap gap-3 mt-2 text-sm">{Object.entries(world.sensors).map(([s,f]) => <a key={s} href={f.url}>{SENSORS[s as keyof typeof SENSORS]} CSV ↗</a>)}</div></details>
  </div>;
}

function DailyBars({daily,dates}:{daily:number[];dates:string[]}) {
 const {num}=useFmt();const max=Math.max(1,...daily);
 return <div className="daily-bars" role="img" aria-label={daily.map((n,i)=>`${dates[i]}: ${n} detections`).join('; ')}>{daily.map((n,i)=><div key={dates[i]}><span>{num(n)}</span><i style={{height:`${Math.max(1,n/max*125)}px`,animationDelay:`${i*45}ms`}}/><small>{dates[i]?.slice(5)}</small></div>)}</div>;
}
function FlatWorld({geo,selected,onPick}:{geo:GeoJSON.FeatureCollection;selected:string;onPick:(lon:number,lat:number)=>void}) {
 const projection=geoEquirectangular().fitExtent([[10,10],[690,350]],geo);const path=geoPath(projection);
 return <svg className="flat-world" viewBox="0 0 700 360" role="img" aria-label="World country map; use the country selector for keyboard access" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();const p=projection.invert?.([(e.clientX-r.left)/r.width*700,(e.clientY-r.top)/r.height*360]);if(p)onPick(p[0],p[1]);}}>{geo.features.map(f=><path key={f.properties?.id} d={path(f)??''} fill={f.properties?.id===selected?'var(--accent)':'var(--zero)'} stroke="var(--muted)" strokeWidth=".4" />)}</svg>;
}
