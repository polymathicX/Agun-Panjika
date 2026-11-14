import { useEffect, useRef, useState } from 'react';
import { useFmt } from '../i18n';
import type { Route } from '../lib/router';
import './DemoTour.css';
import { PageHelp } from './PageHelp';

const KEY = 'ap-tutorial-v1';
const STEPS = [
  { target: '.world-globe .earth-scene, .world-globe .flat-world', en: ['Pick a place', 'Drag the Earth to turn it, then tap a country. You can also use the keyboard selector.'], bn: ['একটি দেশ বেছে নিন', 'পৃথিবী টেনে ঘোরান, তারপর একটি দেশে ট্যাপ করুন। কিবোর্ডের তালিকাও ব্যবহার করতে পারেন।'], task: true },
  { target: '.world-highlight', en: ['Read the sightings', 'This is how often the selected satellite spotted heat. One fire can be seen several times. The dates tell you how recent the observations are.'], bn: ['শনাক্তকরণ বুঝুন', 'নির্বাচিত উপগ্রহ কতবার তাপ শনাক্ত করেছে তা এখানে আছে। একই আগুন একাধিকবার দেখা যেতে পারে। তারিখে তথ্যের সময় দেখুন।'] },
  { target: '[data-tour="satellite"]', en: ['Try another satellite', 'Choose MODIS or NOAA-21. Each instrument has its own observations. MODIS has larger pixels, so it can miss smaller hot spots. Keep the counts separate.'], bn: ['অন্য উপগ্রহ দেখুন', 'MODIS বা NOAA-21 বেছে নিন। প্রতিটি যন্ত্রের নিজস্ব পর্যবেক্ষণ আছে। MODIS-এর পিক্সেল বড়, তাই ছোট তাপের উৎস বাদ পড়তে পারে। সংখ্যাগুলো যোগ করবেন না।'], task: true },
  { target: '.world-time', en: ['Try a single day', 'Move the day slider, or press Play. The points and count change together. First and last days may be incomplete.'], bn: ['একটি দিন দেখুন', 'দিনের স্লাইডার সরান বা চালু করুন। বিন্দু ও সংখ্যা একসঙ্গে বদলায়। প্রথম ও শেষ দিনের তথ্য অসম্পূর্ণ হতে পারে।'], task: true },
  { target: '[data-tour="watch"]', en: ['Keep your country handy', 'Press Watch this country. It stays on this device, so you can return without finding it again. This does not send alerts.'], bn: ['দেশটি মনে রাখুন', 'এই দেশ মনে রাখুন বোতাম চাপুন। দেশটি এই যন্ত্রে সংরক্ষিত থাকবে। এতে কোনো সতর্কবার্তা পাঠানো হয় না।'], task: true },
  { target: '.experiment-controls', en: ['Why compare satellites?', 'Here is a Nepal example. MODIS and VIIRS see fires differently. The switch slider joins an earlier estimate to later observations, so you can inspect the correction.'], bn: ['উপগ্রহের তুলনা কেন?', 'এটি নেপালের উদাহরণ। MODIS ও VIIRS ভিন্নভাবে আগুন দেখে। স্লাইডার দিয়ে আগের অনুমান ও পরের পর্যবেক্ষণের যোগ দেখুন।'] },
  { target: '[data-tour="reveal"]', en: ['Reveal the answer', 'Press Reveal actual VIIRS. The measured line appears beside the estimates. A closer match means less reconstruction error; the shaded band shows uncertainty.'], bn: ['আসল তথ্য দেখুন', 'আসল VIIRS দেখুন বোতাম চাপুন। অনুমানের পাশে পর্যবেক্ষণ দেখা যাবে। রেখা কাছাকাছি হলে ভুল কম; ছায়া অনিশ্চয়তা দেখায়।'], task: true },
  { target: '[data-tour="evidence"]', en: ['Take the context with you', 'The evidence brief keeps dates, error and limits together. Download it or share a card when you need it. For help with any other view, open Explain this page whenever you like.'], bn: ['প্রমাণ সঙ্গে রাখুন', 'এই প্রতিবেদনে তারিখ, ভুল ও সীমা একসঙ্গে আছে। প্রয়োজন হলে ডাউনলোড বা শেয়ার করুন। অন্য যেকোনো দৃশ্য বুঝতে চাইলে এই পৃষ্ঠার সাহায্য খুলুন।'] },
];

export function DemoTour({ go, route, params }: { route: Route; params: URLSearchParams; go: (r: Route, p?: Record<string, string | number | undefined>) => void }) {
  const { lang } = useFmt(); const bn = lang === 'bn';
  const [phase, setPhase] = useState<number | 'welcome' | 'idle'>(() => {
    try { return route === 'world' && !params.has('country') && !localStorage.getItem(KEY) ? 'welcome' : 'idle'; }
    catch { return 'idle'; }
  });
  const [ready, setReady] = useState(false), [done, setDone] = useState(false), [keyboard, setKeyboard] = useState(false);
  const saved = useRef<{ hash: string; scroll: number; filters: string | null } | null>(null);
  const country = useRef<string | undefined>(undefined), heading = useRef<HTMLHeadingElement>(null), launch = useRef<HTMLButtonElement>(null);
  const lastTarget = useRef<HTMLElement | null>(null);
  const step = typeof phase === 'number' ? phase : null;
  const mark = (value: string) => { try { localStorage.setItem(KEY, value); } catch { /* learning works without storage */ } };
  const move = (n: number) => {
    setReady(false); setDone(false); setKeyboard(false); setPhase(n);
    if (n < 5) go('world', { country: n === 0 ? undefined : country.current, ...(n === 0 ? { day: undefined, sensor: 'noaa20' } : {}) });
    else go('global', { area: 'nepal', testYear: 2024, switchWeek: 26, reveal: n === 7 ? '1' : undefined });
  };
  const start = () => {
    let filters = null; try { filters = localStorage.getItem('ap-filters-v1'); } catch { /* optional persistence */ }
    saved.current = { hash: location.hash, scroll: scrollY, filters }; country.current = undefined; move(0);
  };
  const exit = (completed = false) => {
    mark(completed ? 'done' : 'dismissed'); setPhase('idle');
    const previous = saved.current; saved.current = null;
    if (previous) {
      location.hash = previous.hash;
      window.setTimeout(() => {
        window.scrollTo(0, previous.scroll); launch.current?.focus({ preventScroll: true });
        try { if (previous.filters === null) localStorage.removeItem('ap-filters-v1'); else localStorage.setItem('ap-filters-v1', previous.filters); } catch { /* optional persistence */ }
      }, 100);
    }
  };
  useEffect(() => { if (route === 'world' && params.get('country')) country.current = params.get('country')!; }, [route, params]);
  useEffect(() => {
    if (step === null) return;
    heading.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') exit(); };
    document.addEventListener('keydown', onKey); document.body.classList.add('tutorial-active');
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('tutorial-active'); };
  }, [step]);
  useEffect(() => {
    if (step === null) return;
    setReady(false);
    const selector = step === 0 && keyboard ? '.world-controls details' : STEPS[step].target;
    let target: HTMLElement | null = null;
    const check = () => {
      const next = document.querySelector<HTMLElement>(selector);
      if (next && next !== target) {
        target?.classList.remove('tutorial-target'); target = next; target.classList.add('tutorial-target'); setReady(true);
        if (lastTarget.current !== target) target.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        lastTarget.current = target;
      }
      const completed = step === 0 ? route === 'world' && !!params.get('country')
        : step === 2 ? route === 'world' && !!params.get('sensor') && params.get('sensor') !== 'noaa20'
        : step === 3 ? route === 'world' && params.has('day') && Number(params.get('day')) >= 0
        : step === 4 ? target?.getAttribute('aria-pressed') === 'true'
        : step === 6 ? params.get('reveal') === '1' : !!target;
      setDone(completed);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.getElementById('main')!, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
    return () => { observer.disconnect(); target?.classList.remove('tutorial-target'); };
  }, [step, route, params.toString(), keyboard]);

  if (step === null) return <div className={`demo-launch no-print ${phase === 'welcome' ? 'tutorial-welcome' : ''}`}>
    <div><span className="tutorial-spark" aria-hidden="true">?</span><span>{phase === 'welcome' ? (bn ? 'নতুন এসেছেন? করে করে শিখুন।' : 'New here? Let’s try it together.') : (bn ? 'একটু সাহায্য দরকার?' : 'Need a hand?')}</span></div>
    <button ref={launch} type="button" className={phase === 'welcome' ? 'btn btn-primary' : 'btn'} onClick={start}>{bn ? 'ঘুরে দেখান' : 'Show me around'}</button>
    <PageHelp route={route} go={go}/>
    {phase === 'welcome' && <button type="button" className="tutorial-text-button" onClick={() => { mark('dismissed'); setPhase('idle'); }}>{bn ? 'নিজে দেখব' : 'I’ll explore'}</button>}
  </div>;
  const copy = bn ? STEPS[step].bn : STEPS[step].en;
  const onPage = route === (step < 5 ? 'world' : 'global');
  return <aside className={`demo-tour tutorial-coach no-print ${step >= 2 && step <= 4 ? 'coach-left' : ''}`} role="dialog" aria-modal="false" aria-labelledby="tutorial-heading" aria-describedby="tutorial-copy">
    <div className="demo-caption"><span>{bn ? 'করে শিখুন' : 'LEARN BY DOING'} · {step + 1} / {STEPS.length}</span><button type="button" className="tutorial-close" onClick={() => exit()} aria-label={bn ? 'নির্দেশনা বন্ধ করুন' : 'Exit tutorial'}>×</button></div>
    <div className="tutorial-progress" aria-hidden="true">{STEPS.map((_, i) => <i key={i} className={i <= step ? 'is-done' : ''}/>)}</div>
    <h2 id="tutorial-heading" ref={heading} tabIndex={-1}>{copy[0]}</h2><p id="tutorial-copy">{copy[1]}</p>
    {onPage && step === 0 && <button type="button" className="tutorial-text-button" onClick={() => {
      setKeyboard(true); const details = document.querySelector<HTMLDetailsElement>('.world-controls details'); if (details) details.open = true;
      requestAnimationFrame(() => document.getElementById('world-country')?.focus());
    }}>{bn ? 'কিবোর্ড ব্যবহার করুন' : 'Use the keyboard instead'}</button>}
    <p className="tutorial-feedback" aria-live="polite">{!onPage ? (bn ? 'অন্য দৃশ্যে গেছেন। এই ধাপে ফিরে এসে শিখতে পারেন।' : 'You opened another view. Return to this step when you’re ready.') : !ready ? (bn ? 'দৃশ্য প্রস্তুত হচ্ছে…' : 'Getting this view ready…') : STEPS[step].task ? (done ? (bn ? '✓ হয়েছে! এবার এগোন।' : '✓ Got it. You can continue.') : (bn ? 'উপরের কাজটি করে দেখুন।' : 'Try the action above to continue.')) : ''}</p>
    {!onPage && <button type="button" className="btn mt-2" onClick={()=>move(step)}>{bn?'এই ধাপে ফিরে যান':'Return to this step'}</button>}
    <div className="demo-actions"><button type="button" className="btn" disabled={step === 0} onClick={() => move(step - 1)}>{bn ? 'পেছনে' : 'Back'}</button><button type="button" className="btn btn-primary" disabled={!onPage || !ready || !done} onClick={() => step === STEPS.length - 1 ? exit(true) : move(step + 1)}>{step === STEPS.length - 1 ? (bn ? 'নিজে দেখুন' : 'Explore on my own') : (bn ? 'এগিয়ে যান' : 'Continue')} <span aria-hidden="true">→</span></button></div>
    <button type="button" className="tutorial-skip" onClick={() => step === STEPS.length - 1 ? exit() : move(step + 1)}>{bn ? 'এই ধাপ বাদ দিন' : 'Skip this step'}</button>
  </aside>;
}
