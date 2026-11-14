import { useEffect, useRef } from "react";
import { useFmt } from "../i18n";
import type { Route } from "../lib/router";

const PRIMARY: {route: Route; en: string; bn: string; icon: string}[] = [
  {route:"world",en:"World",bn:"পৃথিবী",icon:"M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM2 10h16M10 2c-5 4-5 12 0 16 5-4 5-12 0-16Z"},
  {route:"global",en:"Histories",bn:"ইতিহাস",icon:"M3 16 7 9l3 4 4-8 3 5M3 18h14"},
  {route:"map",en:"Bangladesh map",bn:"বাংলাদেশ",icon:"M3 5l4-2 6 2 4-2v12l-4 2-6-2-4 2zM7 3v12M13 5v12"},
  {route:"sensors",en:"Sensors",bn:"উপগ্রহ",icon:"M4 5h5v5H4zM12 12h5v5h-5zM9 7h7v5M7 10v5h5"},
];
export function Navigation({route,go,mobile=false}:{route:Route;go:(route:Route)=>void;mobile?:boolean}) {
 const {lang}=useFmt();
 return <nav className={mobile ? "primary-mobile" : "primary-desktop"} aria-label={lang==='bn'?'প্রধান মেনু':'Primary navigation'}>{PRIMARY.map(n=><button key={n.route} type="button" onClick={()=>go(n.route)} aria-current={route===n.route || n.route==='map' && ['panjika','borders'].includes(route) ? 'page':undefined}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={n.icon}/></svg><span>{lang==='bn'?n.bn:n.en}</span></button>)}</nav>;
}
export function MoreNavigation({route,go}:{route:Route;go:(route:Route,p?:Record<string,string|undefined>)=>void}) {
 const {lang,t}=useFmt(); const ref=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{if(ref.current)ref.current.open=false},[route]);
 const destinations:{route:Route;label:string;section?:string}[]=[{route:'home',label:'Bangladesh detailed view'},{route:'global',label:t('nav.global')},{route:'panjika',label:t('nav.panjika')},{route:'map',label:t('nav.map')},{route:'borders',label:t('nav.borders')},{route:'outlook',label:t('nav.outlook')},{route:'method',label:t('nav.method')},{route:'method',label:lang==='bn'?'ডাউনলোড':'Downloads',section:'downloads'},{route:'sensors',label:lang==='bn'?'বৈজ্ঞানিক যাচাই':'Scientific validation',section:'validation'}];
 return <details ref={ref} className="more-menu" onKeyDown={e=>{if(e.key==='Escape'&&ref.current){ref.current.open=false;ref.current.querySelector('summary')?.focus()}}}><summary className="btn">{lang==='bn'?'আরও':'More'} <span aria-hidden="true">⌄</span></summary><div className="more-panel">{destinations.map((n,i)=><button type="button" key={i} onClick={()=>{go(n.route,n.section?{section:n.section}:undefined);if(ref.current)ref.current.open=false}}>{n.label}<span aria-hidden="true">↗</span></button>)}</div></details>;
}
