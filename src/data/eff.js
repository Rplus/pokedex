const TYPE_RATIO = 1.6;

export const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];

export const types_zh = ['普', '鬥', '飛', '毒', '地', '岩', '蟲', '鬼', '鋼', '火', '水', '草', '電', '念', '冰', '龍', '惡', '妖'];

export const effAttckTable = [
  [0, 0, 0, 0, 0, -1, 0, -2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, -1, -1, 0, 1, -1, -2, 1, 0, 0, 0, 0, -1, 1, 0, 1, -1],
  [0, 1, 0, 0, 0, -1, 1, 0, -1, 0, 0, 1, -1, 0, 0, 0, 0, 0],
  [0, 0, 0, -1, -1, -1, 0, -1, -2, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [0, 0, -2, 1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, 0, 0, 0, 0],
  [0, -1, 1, 0, -1, 0, 1, 0, -1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, -1, -1, -1, 0, 0, 0, -1, -1, -1, 0, 1, 0, 1, 0, 0, 1, -1],
  [-2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, -1, -1, -1, 0, -1, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, -1, 1, 0, 1, -1, -1, 1, 0, 0, 1, -1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, -1, -1, 0, 0, 0, -1, 0, 0],
  [0, 0, -1, -1, 1, 1, -1, 0, -1, -1, 1, -1, 0, 0, 0, -1, 0, 0],
  [0, 0, 1, 0, -2, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, -1, 0, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -2, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, -1, -1, -1, 1, 0, 0, -1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, -2],
  [0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, -1],
  [0, 1, 0, -1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 1, 1, 0]
];

let op = types.map(type => ({
  type,
  effs: [[], [], [], []],
}));


effAttckTable.forEach((atk_factors, atk_idx) => {
  atk_factors.forEach((atk_factor, def_idx) => {
    if (atk_factor) {
      op[atk_idx].effs[atk_factor > 0 ? 0 : 1].push({ type: types[def_idx], factor: atk_factor })
      op[def_idx].effs[atk_factor > 0 ? 2 : 3].push({ type: types[atk_idx], factor: atk_factor })
    }
  });
});


export default op;


function typeIndex(type) {
  return types.findIndex(t => t === type);
}

export function queryTypeEffect(atkType, defType1, defType2) {
  if (!defType1 && !defType2) {
    return 1;
  }

  let eff = [
    // uni types
    ...new Set(
      // remove falsy type
      [defType1, defType2].filter(Boolean)
    )
  ]
  .map(typeIndex) // defIndex
  .map(i => effAttckTable[typeIndex(atkType)][i]) // each type effect
  .reduce((all, i) => all + i, 0) // sum

  return Math.pow(TYPE_RATIO, eff);
}
