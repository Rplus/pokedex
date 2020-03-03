import { writable, readable, derived } from 'svelte/store';
import {
  handlePm, handleMove, handleEff,
  saveItem, getItem
} from '@/u.js';


export const pokemons = writable([]);
export const moves = writable([]);
export const eff = writable([]);
export const maxDex = writable(0);

const gmUrl = 'gm.src.json' || 'gm.json';


Promise.all(
  [gmUrl, 'eff.json']
  .map(i =>
    fetch(i, {headers: {'content-type': 'application/json'}}).then(r => r.json())))
.then(d => {
  pokemons.set(handlePm(d[0].pokemon));
  moves.set(handleMove(d[0].moves));
  eff.set(handleEff(d[1]));
  maxDex.set(d[0].pokemon[d[0].pokemon.length - 1].dex);
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

