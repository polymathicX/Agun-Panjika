import { useFmt } from "../i18n";
import './RequestStatus.css';

export function RequestStatus({error,loading,retry,variant='content'}:{error?:Error;loading?:boolean;retry?:()=>void;variant?:'content'|'page'|'world'|'globe'|'compact'}) {
 const {t,lang}=useFmt();
 if(error)return <div className="request-status" role="alert"><div><p>{lang==='bn'?'এই তথ্যটি আনা যায়নি। আবার চেষ্টা করুন।':'This data could not be loaded. Please try again.'}</p><details className="text-xs text-muted mt-2"><summary>{lang==='bn'?'সমস্যার বিস্তারিত':'Error details'}</summary><p className="mt-2">{error.message}</p></details></div>{retry&&<button type="button" className="btn" onClick={retry}>{lang==='bn'?'আবার চেষ্টা':'Retry'}</button>}</div>;
 if(loading)return <div className={`request-skeleton skeleton-${variant}`} role="status" aria-label={t('app.loading')}>
  {variant==='world' ? <><div className="skeleton-copy"><i/><i/><i/><b/></div><div className="skeleton-earth"/><div className="skeleton-copy"><i/><b/><i/><b/></div></>
   : variant==='globe' ? <div className="skeleton-earth"/>
   : variant==='page' ? <><i className="skeleton-heading"/><div className="skeleton-panels"><b/><b/></div><b className="skeleton-chart"/></>
   : <><i/><i/><i/></>}
  <span className="sr-only">{t('app.loading')}</span>
 </div>;
 return null;
}
export function ConnectionStatus() {
 const {lang}=useFmt();
 return <p className="offline-status">{lang==='bn'?'অফলাইনে সংরক্ষিত তথ্য দেখানো হচ্ছে; হালনাগাদের তারিখ দেখুন।':'Offline: viewing cached data. Check the publication date.'}</p>;
}
