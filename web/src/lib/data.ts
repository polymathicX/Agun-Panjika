import { useCallback, useEffect, useRef, useState } from "react";
import type { BridgeDoc, DistrictYear, Manifest, PointsYear, RegionDoc, ValidationDoc } from "./types";

const BASE = `${import.meta.env.BASE_URL}data/`;
const cache = new Map<string, Promise<unknown>>();

function invalidData(path: string, message: string): never {
  cache.delete(path);
  throw new Error(message);
}

function validateJson(path:string,value:unknown) {
  if(!value||typeof value!=='object')throw new Error(`${path}: invalid data contract`);
  const doc=value as Record<string,unknown>;
  const required=path==='manifest.json'?['country','regions','districts','data_through','years']:path==='national.json'||path.startsWith('region/')?['region','weeks','seasons','normals','season']:path.startsWith('points/')?['year','stride','pts']:path.startsWith('districts/')?['year','districts']:[];
  if(required.some(k=>doc[k]===undefined))throw new Error(`${path}: missing required scientific metadata`);
  if((path==='national.json'||path.startsWith('region/'))&&!Array.isArray(doc.weeks))throw new Error(`${path}: invalid weekly series`);
  if(path.startsWith('points/')&&(!Array.isArray(doc.pts)||typeof doc.stride!=='number'||doc.stride<4))throw new Error(`${path}: invalid coordinate data`);
  return value;
}

export function fetchJson<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    const p = fetch(BASE + path, { signal: controller.signal }).then(async (r) => {
      if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
      let value:unknown;
      try { value=await r.json(); } catch { throw new Error(`${path}: invalid JSON`); }
      return validateJson(path,value);
    }).finally(() => window.clearTimeout(timeout));
    p.catch(() => {if(cache.get(path)===p)cache.delete(path)});
    cache.set(path, p);
    if(cache.size>48)cache.delete(cache.keys().next().value!);
  }
  return cache.get(path) as Promise<T>;
}

export const dataUrl = (path: string) => BASE + path;
export const loadLand = async () => {
  const r = await fetch(`${import.meta.env.BASE_URL}geo/land.json`);
  if (!r.ok) throw new Error(`Basemap: HTTP ${r.status}`);
  return r.json() as Promise<GeoJSON.FeatureCollection>;
};

export const loadManifest = () => fetchJson<Manifest>("manifest.json");
export const loadRegion = (id: string) => fetchJson<RegionDoc>(id === "bgd" ? "national.json" : `region/${id}.json`);
export const loadValidation = () => fetchJson<ValidationDoc>("validation.json");
export const loadBridge = () => fetchJson<BridgeDoc>("bridge.json");
export const loadDistrictYear = (y: number) => fetchJson<DistrictYear>(`districts/${y}.json`);
export const loadPoints = (y: number) => fetchJson<PointsYear>(`points/${y}.json`);
export const loadGeo = () => fetchJson<GeoJSON.FeatureCollection>("districts.geojson");
export const loadStaticCells = () =>
  fetchJson<{ lat: number; lon: number; n: number; months: number; years: number; peak_share: number }[]>("static_cells.json");

/** Small hook: run an async loader whenever deps change; returns {data, error}. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): { data: T | undefined; error: Error | undefined; loading: boolean; retry: () => void } {
  const key=JSON.stringify(deps);
  const loader=useRef(fn);loader.current=fn;
  const [attempt,setAttempt]=useState(0);
  const [state, setState] = useState<{ key:string; attempt:number; data: T | undefined; error: Error | undefined; loading:boolean }>({ key,attempt,data: undefined, error: undefined,loading:true });
  const retry=useCallback(()=>setAttempt(n=>n+1),[]);
  useEffect(() => {
    let live = true;
    setState({ key,attempt,data:undefined,error:undefined,loading:true });
    const run=loader.current;
    Promise.resolve().then(run).then(
      (data) => live && setState({ key,attempt,data, error: undefined,loading:false }),
      (error: unknown) => live && setState({ key,attempt,data: undefined, error:error instanceof Error?error:new Error(String(error)),loading:false }),
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key,attempt]);
  // Hide the previous selection in the render BEFORE the new effect executes.
  return state.key===key&&state.attempt===attempt ? {...state,retry} : {data:undefined,error:undefined,loading:true,retry};
}

export const loadForecast = async () => {
  const doc = await fetchJson<import("./types").ForecastDoc>("forecast.json");
  const { isoWeekStart } = await import("./series");
  // A cached outlook must expire at the end of its target fortnight, even offline.
  const products = Object.fromEntries(Object.entries(doc.products).map(([key, product]) => [key, {
    ...product, outlook: Object.fromEntries(Object.entries(product.outlook).map(([id, o]) => [id, {
      ...o, active: o.active && !!o.issue_year && Date.now() < isoWeekStart(o.issue_year, o.issue_week).getTime() + 21 * 86400000,
    }])),
  }])) as typeof doc.products;
  const validUntil = Math.max(...Object.values(doc.products.next2.outlook).filter(o => o.issue_year).map(o => isoWeekStart(o.issue_year!, o.issue_week).getTime() + 21 * 86400000));
  return { ...doc, products, expired: !Number.isFinite(validUntil) || Date.now() >= validUntil, valid_until_utc: Number.isFinite(validUntil) ? new Date(validUntil).toISOString() : undefined };
};
export const loadFireWeather = () => fetchJson<import("./types").FireWeatherDoc>("fireweather.json");
export const loadPartner = () => fetchJson<import("./types").PartnerDoc>("partner.json");
export const loadNeighbours = () => fetchJson<import("./types").NeighboursDoc>("neighbours.json");
export const loadLocal = (district: string) => fetchJson<import("./types").LocalDoc>(`local/${district}.json`);

export const GLOBAL_AREAS = ['bangladesh', 'nepal', 'chin', 'punjab_haryana'] as const;
export const loadGlobalCatalog = async () => {
  const doc = await fetchJson<import("./types").GlobalCatalog>('global/catalog.json');
  if (!Array.isArray(doc.areas) || !doc.areas.length || !doc.areas.every(a => GLOBAL_AREAS.includes(a.id as typeof GLOBAL_AREAS[number]))) invalidData('global/catalog.json','Invalid area catalog');
  return doc;
};
export const loadGlobalCase = async (id: string) => {
  if (!GLOBAL_AREAS.includes(id as typeof GLOBAL_AREAS[number])) throw new Error('Unsupported area');
  const doc = await fetchJson<import("./types").GlobalCase>(`global/${id}.json`);
  if (doc.id !== id || !doc.splits || !doc.evaluation || !Array.isArray(doc.weeks) || !doc.weeks.every(w => Number.isInteger(w.y) && Number.isInteger(w.w) && w.w >= 1 && w.w <= 53 && [w.modis, w.viirs, w.model, w.factor, w.lo, w.hi].every(n => n === undefined || Number.isFinite(n) && n >= 0))) invalidData(`global/${id}.json`,'Invalid area evidence package');
  return doc;
};
export const loadWorldSummary = async () => {
  const doc = await fetchJson<import('./types').WorldSummary>('world/summary.json');
  if (!Array.isArray(doc.countries) || !doc.countries.every(c => /^[a-z0-9]{3}$/.test(c.id)) || !doc.sensors?.noaa20) invalidData('world/summary.json','Invalid world snapshot');
  return doc;
};
export const loadWorldGeo = () => fetchJson<GeoJSON.FeatureCollection>('world/countries.geojson');
export const loadWorldPoints = async (country: string, sensor: string) => {
  if (!(country === 'overview' || /^[a-z0-9]{3}$/.test(country)) || !['modis', 'noaa20', 'noaa21'].includes(sensor)) throw new Error('Invalid world selection');
  const doc = await fetchJson<import('./types').WorldPoints>(`world/${country}-${sensor}.json`);
  if (doc.stride !== 3 || !Array.isArray(doc.points) || doc.points.length % 3 !== 0 || !doc.points.every(Number.isFinite)) invalidData(`world/${country}-${sensor}.json`,'Invalid worldwide observation points');
  return doc;
};
