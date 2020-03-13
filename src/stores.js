import { writable, readable, derived } from 'svelte/store';
import {
  decompressJSON,
  genOptions,
  handlePm, handleMove,
  saveItem, getItem
} from '@/u.js';


export const pokemons = writable([]);
export const moves = writable([]);
export const family = writable({ waiting: true });
export const maxDex = writable(0);
export const router = writable(null);

Promise.all(
  ['gm.min.json', 'allF.json']
    .map(i =>
      fetch(i).then(r => r.json())
    )
)
.then(d => {
  if (d[0].pmProps) {
    d[0] = decompressJSON(d[0]);
  }
  pokemons.set(handlePm(d[0].pokemon));
  moves.set(handleMove(d[0].moves));
  family.set(d[1]);
  maxDex.set(d[0].pokemon[d[0].pokemon.length - 1].dex);
  console.log('gm done:', d);
});

export const datalist = derived(
  pokemons,
  $pokemons =>
    $pokemons.map(pm =>
      genOptions(pm.uid, `${pm.name}, ${pm.id.slice(0, 1).toUpperCase()}${pm.id.slice(1)}`)).join('')
);







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
  showAllTable: localSettings.showAllTable,
  // darktheme: localSettings.darktheme === undefined
  //   ? isOsDarktheme
  //   : localSettings.darktheme,
};


export const settings = writable(_settings);
settings.subscribe(value => {
  saveItem({
    key: 'settings',
    value,
  });
});


export const typeTarget = writable(null);

