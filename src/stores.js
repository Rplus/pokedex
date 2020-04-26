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
  let [gm, allF] = d;
  if (gm.pmProps) {
    gm = decompressJSON(gm);
  }
  pokemons.set(handlePm(gm.pokemon));
  moves.set(handleMove(gm.moves));
  family.set(allF);
  maxDex.set(gm.pokemon[gm.pokemon.length - 1].dex);
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
const openFirst = [
  'pm_family',
  'types',
  'fmove',
  'cmove',
  'fastmove',
  'chargemove',
  'pvp_buff',
  'cost_calc',
  'type_table',
  'move-pair',
  'types-🛡️',
];
const _settings = {
  details: localSettings.details || openFirst.reduce((all, n) => {
    all[n] = true;
    return all;
  }, {}),
  io: localSettings.io || {},
};


export const settings = writable(_settings);
settings.subscribe(value => {
  saveItem({
    key: 'settings',
    value,
  });
});


export const typeTarget = writable(null);

