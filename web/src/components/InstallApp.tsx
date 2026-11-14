import { useEffect, useState } from 'react';
import { useFmt } from '../i18n';
import './InstallApp.css';

interface InstallPrompt extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
export function InstallApp() {
  const { lang } = useFmt(); const bn = lang === 'bn';
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(() => matchMedia('(display-mode: standalone)').matches);
  useEffect(() => {
    const before = (e: Event) => {e.preventDefault();setPrompt(e as InstallPrompt);};
    const done = () => {setInstalled(true);setPrompt(null);};
    window.addEventListener('beforeinstallprompt',before);window.addEventListener('appinstalled',done);
    return () => {window.removeEventListener('beforeinstallprompt',before);window.removeEventListener('appinstalled',done);};
  }, []);
  if (installed) return null;
  return <details className="phone-install no-print"><summary>{bn ? 'ফোনে সঙ্গে রাখুন' : 'Keep Earth in your pocket'} <span aria-hidden="true">↗</span></summary><p className="text-sm text-muted">{bn ? 'ফোনের হোম স্ক্রিনে যোগ করে সংরক্ষিত তথ্য অফলাইনে পড়তে পারবেন। নতুন পর্যবেক্ষণের জন্য ইন্টারনেট লাগবে; বাইরের মানচিত্রের টাইল অফলাইনে থাকবে না।' : 'Add to your home screen and read saved observations offline. New data needs internet; external map tiles are not saved.'}</p>{prompt ? <button className="btn btn-primary mt-3" type="button" onClick={async () => {await prompt.prompt();await prompt.userChoice;setPrompt(null);}}>{bn ? 'অ্যাপ ইনস্টল করুন' : 'Install app'}</button> : <p className="text-xs mt-3">{bn ? 'Android: ব্রাউজার মেনু → Install app / Add to Home screen। iPhone: Safari → Share → Add to Home Screen।' : 'Android: browser menu → Install app / Add to Home screen. iPhone: Safari → Share → Add to Home Screen.'}</p>}</details>;
}
