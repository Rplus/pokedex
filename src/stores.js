import { writable, readable, derived } from 'svelte/store';
// import { typesEff } from './types-eff.js';
import {
  handlePm, handleMove, handleEff,
  saveItem, getItem
} from '@/u.js';


export const pokemons = writable([]);
export const moves = writable([]);
export const eff = writable([]);

const gmUrl = 'gm.src.json' || 'gm.json';


Promise.all([gmUrl, 'eff.json'].map(i => fetch(i).then(r => r.json())))
.then(d => {
  pokemons.set(handlePm(d[0].pokemon));
  moves.set(handleMove(d[0].moves));
  eff.set(handleEff(d[1]));
  console.log('gm done:', d);
});






const isOsDarktheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const localSettings = getItem('settings') || {};
const defaultSettings = {
  // head: false,
  // types: true,
  // fmove: true,
  // cmove: true,
  // pairs: true,
  // history: true,
};
const _settings = {
  details: localSettings.details || defaultSettings,
  gridview: localSettings.gridview,
  darktheme: localSettings.darktheme === undefined
    ? isOsDarktheme
    : localSettings.darktheme,
};


export const settings = writable(_settings);
settings.subscribe(value => {
  saveItem({
    key: 'settings',
    value,
  });
});


export const typeTarget = writable(null);

