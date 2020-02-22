import { writable, readable, derived } from 'svelte/store';
import { handlePm, handleMove } from './u.js';

export const pokemon = writable([]);
export const moves = writable([]);

const gmUrl = 'gm.src.json' || 'gm.json';

fetch(gmUrl)
.then(r => r.json())
.then(d => {
  console.log('gm done:', d);
  pokemon.set(handlePm(d.pokemon));
  moves.set(handleMove(d.moves));
});
