import type { Reading } from '../lib/readings';
import { useFmt } from '../i18n';
import './DataReading.css';

export function DataReading({reading}: {reading: Reading}) {
  const {lang} = useFmt(); const bn = lang === 'bn';
  return <section className="data-reading" data-help="reading" aria-label={bn ? 'তথ্যের সহজ ব্যাখ্যা' : 'What this tells you'}>
    <h2>{bn ? 'তথ্যটি কী বলছে' : 'What this tells you'}</h2>
    <p className="reading-sentence">{reading.text}</p>
    <details><summary>{bn ? 'এই ব্যাখ্যা কীভাবে পড়বেন' : 'How to read this'}</summary><p>{reading.basis}</p><p>{reading.note}</p></details>
  </section>;
}
