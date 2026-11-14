import type { GlobalWeek, Outlook, Week } from './types';

export interface Reading { text: string; basis: string; note: string }
const number = (value: number, bn: boolean) => new Intl.NumberFormat(bn ? 'bn-BD' : 'en', {maximumFractionDigits: 0}).format(value);

export function worldReading(input: {place: string; satellite: string; total: number; daily: number[]; dates: string[]; day: number; through: string; stale: boolean}, bn = false): Reading {
  const {place, satellite, total, daily, dates, day, through, stale} = input;
  const single = day >= 0 && day < dates.length;
  const count = single ? daily[day] : total;
  if (!dates.length || !Number.isFinite(count)) return {text:bn?'এই নির্বাচনের সংখ্যা এখনো পাওয়া যায়নি।':'A count is not available for this selection yet.',basis:bn?'প্রকাশিত উৎসের তথ্য পরীক্ষা করুন।':'Check the published source data.',note:bn?'অনুপস্থিত তথ্যকে শূন্য হিসেবে দেখানো হয়নি।':'Missing data has not been presented as zero.'};
  const valid = daily.map((value, index) => ({value, date: dates[index]})).filter(row => row.date && Number.isFinite(row.value));
  const peak = Math.max(0, ...valid.map(row => row.value));
  const busiest = valid.filter(row => row.value === peak);
  const period = single ? dates[day] : `${dates[0]} ${bn ? 'থেকে' : 'to'} ${dates[dates.length-1]}`;
  let text = bn ? `${place}: ${period} সময়ে ${satellite} ${number(count ?? 0, bn)}টি তাপের সংকেত নথিভুক্ত করেছে।` : `${satellite} recorded ${number(count ?? 0, bn)} hot-spot detections in ${place} for ${period}.`;
  if (count === 0) text = bn ? `${place}-এর এই নির্বাচনে কোনো তাপের সংকেত নথিভুক্ত হয়নি।` : `No retained hot-spot detections were recorded in ${place} for this selection.`;
  if (!single && busiest.length === 1 && peak > 0) text += bn ? ` দেখানো দিনগুলোর মধ্যে ${busiest[0].date}-এ সবচেয়ে বেশি সংকেত ছিল (${number(peak, bn)}টি)।` : ` Of the dates shown, ${busiest[0].date} has the most recorded detections (${number(peak, bn)}).`;
  return {text, basis: bn ? `এই নির্বাচনের প্রকাশিত সংখ্যা থেকে গণনা। উৎসের শেষ পর্যবেক্ষণ: ${through.slice(0, 16).replace('T', ' ')} UTC।` : `Calculated from this selection's published counts. Source observations end ${through.slice(0, 16).replace('T', ' ')} UTC.`, note: bn ? `${stale ? 'তথ্য ৪৮ ঘণ্টার বেশি পুরোনো। ' : ''}একই আগুন বারবার দেখা যেতে পারে। মেঘ, উপগ্রহের সময় ও শিল্পের তাপ সংখ্যায় প্রভাব ফেলে। প্রথম ও শেষ দিন অসম্পূর্ণ হতে পারে; শূন্য মানে নিরাপদ নয়।` : `${stale ? 'This snapshot is over 48 hours old. ' : ''}A fire may be detected more than once. Clouds, overpass timing and industrial heat affect counts. Boundary dates may be partial; zero detections do not establish safety.`};
}

export function seriesReading(rows: {label: string; value: number}[], context: string, basis: string, note: string, bn = false): Reading {
  const available = rows.filter(row=>Number.isFinite(row.value));
  const peak = available.reduce<{label:string;value:number}|undefined>((best,row)=>!best || row.value>best.value?row:best,undefined);
  return {text:peak ? (bn?`${context}। এই নির্বাচনে সর্বোচ্চ মান ${peak.label}: প্রায় ${number(peak.value,bn)}টি শনাক্তকরণ।`:`${context}. The highest value in this selection is ${peak.label}: about ${number(peak.value,bn)} detections.`):(bn?'এই নির্বাচনে গণনাযোগ্য তথ্য নেই।':'There are no available values for this selection.'),basis,note};
}

export function outlookReading(outlook: Outlook | undefined, expired: boolean, place: string, validUntil: string | undefined, bn = false): Reading {
  let text = bn?'এই নির্বাচনে বর্তমান গবেষণার পূর্বাভাস পাওয়া যাচ্ছে না।':'A current research outlook is not available for this selection.';
  if(expired) text=bn?'সংরক্ষিত গবেষণার পূর্বাভাসের মেয়াদ শেষ। নতুন তথ্য না আসা পর্যন্ত এটিকে বর্তমান পূর্বাভাস হিসেবে পড়বেন না।':'The saved research outlook has expired. A current prediction is withheld until a newer snapshot is published.';
  else if(outlook?.active && typeof outlook.p_above==='number' && Number.isFinite(outlook.p_above) && outlook.p_above>=0 && outlook.p_above<=1) text=bn?`${place}: পরীক্ষামূলক মডেল পরের দুই সপ্তাহে স্বাভাবিকের বেশি কার্যকলাপের সম্ভাবনা প্রায় ${number(outlook.p_above*100,bn)}% বলছে।`:`For ${place}, the experimental model estimates about a ${number(outlook.p_above*100,bn)}% chance of above-normal activity over its next two-week period.`;
  return {text,basis:bn?`প্রকাশিত পূর্বাভাসের সম্ভাবনা থেকেই এই কথা বলা হয়েছে। মেয়াদের শেষ: ${validUntil?.slice(0,10)??'অজানা'}।`:`Read directly from the published forecast probability. Valid through ${validUntil?.slice(0,10)??'an unspecified date'}.`,note:bn?'এটি একটি এলাকার আপেক্ষিক কার্যকলাপের গবেষণা, নির্দিষ্ট জায়গায় আগুন লাগার সম্ভাবনা বা জরুরি নির্দেশনা নয়। আবহাওয়ার সহায়তায় আগাম দক্ষতা এখনো আলাদাভাবে যাচাই করা দরকার।':'This is a research estimate of relative activity across an area, not the probability of a fire at an address or emergency advice. Operational prediction skill still needs prospective evaluation.'};
}

export function seasonReading(weeks: Week[], place: string, year: number, throughWeek: number, bn = false): Reading {
  const rows = weeks.filter(row => row.y === year && row.w <= throughWeek && Number.isFinite(row.harm));
  const total = rows.reduce((sum, row) => sum + row.harm, 0);
  const peak = rows.reduce<Week | undefined>((best, row) => !best || row.harm > best.harm ? row : best, undefined);
  const estimated = rows.filter(row => row.src !== 'observed').length;
  const text = !rows.length ? (bn ? 'এই নির্বাচনের জন্য গণনাযোগ্য সপ্তাহ পাওয়া যায়নি।' : 'There are no available weekly values for this selection.') : bn ? `${place}, ${year}: দেখানো ${number(rows.length, bn)} সপ্তাহে মোট প্রায় ${number(total, bn)}টি সমন্বিত শনাক্তকরণ। এর মধ্যে ${number(peak!.w, bn)} নম্বর সপ্তাহে সবচেয়ে বেশি (${number(peak!.harm, bn)}টি)।` : `${place}, ${year}: about ${number(total, bn)} detections on the harmonized scale across ${number(rows.length, bn)} available ${rows.length===1?'week':'weeks'} through week ${Math.max(...rows.map(row=>row.w))}. Week ${peak!.w} has the highest value in this selection (${number(peak!.harm, bn)}).`;
  return {text, basis: bn ? `নির্বাচিত বছর ও সপ্তাহের দৃশ্যমান রেকর্ড থেকে যোগফল। ${number(estimated, bn)}টি সপ্তাহে অনুমান বা পরের উপগ্রহের সমন্বিত তথ্য আছে।` : `Summed from the selected year and weeks. ${number(estimated, bn)} ${estimated===1?'week contains':'weeks contain'} reconstruction or adjusted successor-satellite values.`, note: bn ? 'এই যোগফল পূর্ণ বছরের দাবি নয়। একই আগুন একাধিকবার ধরা পড়তে পারে। অনুপস্থিত সপ্তাহ শূন্য হিসেবে গণনা করা হয়নি।' : 'This is a total for available selected weeks, not a claim of a complete year or a count of unique fires. Missing weeks are not treated as observed zeros.'};
}

export function historyReading(rows: GlobalWeek[], place: string, year: number, switchWeek: number, reveal: boolean, bn = false): Reading {
  const eligible = rows.filter(row => row.w < switchWeek && row.reference_ok !== false && row.viirs !== undefined && row.model !== undefined);
  const error = eligible.length ? eligible.reduce((sum, row) => sum + Math.abs(row.model! - row.viirs!), 0) / eligible.length : null;
  const text = reveal && error !== null ? (bn ? `${place}, ${year}: বদলের আগের ${number(eligible.length, bn)}টি তুলনাযোগ্য সপ্তাহে পুনর্গঠিত সংখ্যা ও VIIRS পর্যবেক্ষণের পার্থক্য গড়ে প্রায় ${number(error, bn)}টি শনাক্তকরণ। রেখা দুটি যত কাছাকাছি, এই পরীক্ষায় মিল তত বেশি।` : `In ${place}, ${year}, the reconstructed weekly counts differ from VIIRS by about ${number(error, bn)} detections on average across ${eligible.length} comparable ${eligible.length===1?'week':'weeks'} before the switch. Closer lines mean closer agreement in this experiment.`) : (bn ? `${place}, ${year}: ${number(switchWeek, bn)} নম্বর সপ্তাহের আগে MODIS থেকে পুনর্গঠন, পরে VIIRS পর্যবেক্ষণ দেখানো হচ্ছে। আসল VIIRS দেখিয়ে রেখাগুলো তুলনা করুন।` : `In ${place}, ${year}, the chart uses a reconstruction from MODIS before week ${switchWeek} and VIIRS observations afterward. Reveal actual VIIRS to compare the reconstructed part with the satellite record.`);
  return {text, basis: bn ? 'নির্বাচিত বছর ও বদলের সপ্তাহ থেকেই ব্যাখ্যাটি গণনা করা হয়েছে। কেবল সম্পূর্ণ রেফারেন্সের সপ্তাহে পার্থক্য মাপা হয়েছে।' : 'Calculated for the selected year and switch week. The average difference uses only weeks with comparable reference observations.', note: bn ? 'এটি অতীতের রেকর্ডের পরীক্ষা। ছায়া অনুমানের সীমা দেখায়; ভবিষ্যতে কোথায় আগুন লাগবে তা বলে না।' : 'This explains a historical comparison. The shaded band shows uncertainty around estimates; it does not predict where a future fire will occur.'};
}
