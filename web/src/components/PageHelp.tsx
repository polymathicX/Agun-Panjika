import { useEffect, useRef, useState } from 'react';
import { useFmt } from '../i18n';
import { PAGE_HELP, SHARED_HELP } from '../lib/pageHelp';
import type { Route } from '../lib/router';
import './PageHelp.css';

export function PageHelp({route,go}: {route: Route; go: (route: Route) => void}) {
  const {lang} = useFmt(); const bn = lang === 'bn';
  const [open,setOpen] = useState(false), [index,setIndex] = useState(0), [found,setFound] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null), launch = useRef<HTMLButtonElement>(null);
  const opened = useRef(new Map<HTMLDetailsElement,boolean>());
  const topics = [...PAGE_HELP[route].topics,...SHARED_HELP];
  const active = topics[Math.min(index,topics.length-1)];
  const copy = bn ? active.bn : active.en;
  const close = () => {setOpen(false);launch.current?.focus({preventScroll:true});};
  useEffect(()=>setIndex(0),[route]);
  useEffect(()=>{
    if(!open)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.stopPropagation();close();}};
    document.addEventListener('keydown',onKey);document.body.classList.add('page-help-active');
    return ()=>{
      document.removeEventListener('keydown',onKey);document.body.classList.remove('page-help-active');
      opened.current.forEach((value,details)=>{if(details.isConnected)details.open=value;});opened.current.clear();
    };
  },[open]);
  useEffect(()=>{
    if(!open)return;
    const choosing=document.activeElement instanceof HTMLSelectElement && document.activeElement.closest('.page-help-panel');
    if(!choosing)heading.current?.focus({preventScroll:true});setFound(false);
    let target: HTMLElement | null = null;
    const check=()=>{
      opened.current.forEach((_,details)=>{if(!details.isConnected)opened.current.delete(details);});
      const next=document.querySelector<HTMLElement>(active.target);
      if(!next || next===target)return;
      target?.classList.remove('page-help-target');target=next;
      for(let node:HTMLElement|null=target;node;node=node.parentElement){
        if(node instanceof HTMLDetailsElement){if(!opened.current.has(node))opened.current.set(node,node.open);node.open=true;}
      }
      target.classList.add('page-help-target');setFound(true);
      target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    };
    check();const observer=new MutationObserver(check);
    observer.observe(document.getElementById('main')!,{childList:true,subtree:true});
    return ()=>{observer.disconnect();target?.classList.remove('page-help-target');};
  },[open,route,index,active.target]);
  return <>
    <button ref={launch} type="button" className="btn page-help-launch" aria-expanded={open} onClick={()=>{setIndex(0);setOpen(true);}}>{bn?'এই পৃষ্ঠার সাহায্য':'Explain this page'}</button>
    {open && <aside className="page-help-panel no-print" role="dialog" aria-modal="false" aria-labelledby="page-help-heading" data-target-ready={found}>
      <div className="page-help-top"><span>{bn?'নিজের গতিতে শিখুন':'AT YOUR PACE'}</span><button type="button" className="tutorial-close" aria-label={bn?'পৃষ্ঠার সাহায্য বন্ধ করুন':'Close page help'} onClick={close}>×</button></div>
      <div className="page-help-selects"><label>{bn?'পৃষ্ঠা':'Page'}<select aria-label={bn?'পৃষ্ঠা':'Page'} className="select" value={route} onChange={event=>go(event.target.value as Route)}>{Object.entries(PAGE_HELP).map(([key,page])=><option key={key} value={key}>{bn?page.bn:page.en}</option>)}</select></label>
      <label>{bn?'কী শিখবেন':'What would you like to learn?'}<select aria-label={bn?'কী শিখবেন':'What would you like to learn?'} className="select" value={index} onChange={event=>setIndex(Number(event.target.value))}>{topics.map((topic,i)=><option key={i} value={i}>{i+1}. {(bn?topic.bn:topic.en)[0]}</option>)}</select></label></div>
      <p className="page-help-count">{index+1} / {topics.length}</p><h2 id="page-help-heading" ref={heading} tabIndex={-1}>{copy[0]}</h2><p className="page-help-copy">{copy[1]}</p>
      {!found && <p className="page-help-note" role="status">{bn?'এই অংশটি তথ্য আসার বা একটি এলাকা বাছার পরে দেখা যেতে পারে। অন্য বিষয়ও বেছে নিতে পারেন।':'This part may appear after data loads or an area is selected. You can choose another topic too.'}</p>}
      <div className="page-help-actions"><button type="button" className="btn" disabled={index===0} onClick={()=>setIndex(i=>i-1)}>{bn?'আগের বিষয়':'Previous tip'}</button><button type="button" className="btn btn-primary" onClick={()=>index===topics.length-1?close():setIndex(i=>i+1)}>{index===topics.length-1?(bn?'নিজে দেখুন':'Done'):(bn?'পরের বিষয়':'Next tip')} →</button></div>
      <p className="page-help-note">{bn?'চাইলে পৃষ্ঠার বোতামগুলো ব্যবহার করতে থাকুন। যেকোনো বিষয় সরাসরি বাছতে পারেন।':'Keep using the page while this is open. Jump to any topic whenever you want.'}</p>
    </aside>}
  </>;
}
