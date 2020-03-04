const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];

const effMap = {
  '2': '#',
  '1': '+',
  '-1': '-',
  '-2': '=',
};

const ATK_EFF = {
  'normal': {
    rock: -1,
    ghost: -2,
    steel: -1,
  },
  'fighting': {
    normal: 1,
    flying: -1,
    poison: -1,
    rock: 1,
    bug: -1,
    ghost: -2,
    steel: 1,
    psychic: -1,
    ice: 1,
    dark: 1,
    fairy: -1,
  },
  'flying': {
    fighting: 1,
    rock: -1,
    bug: 1,
    steel: -1,
    grass: 1,
    electric: -1,
  },
  'poison': {
    poison: -1,
    ground: -1,
    rock: -1,
    ghost: -1,
    steel: -2,
    grass: 1,
    fairy: 1,
  },
  'ground': {
    flying: -2,
    poison: 1,
    rock: 1,
    bug: -1,
    steel: 1,
    fire: 1,
    grass: -1,
    electric: 1,
  },
  'rock': {
    fighting: -1,
    flying: 1,
    ground: -1,
    bug: 1,
    steel: -1,
    fire: 1,
    ice: 1,
  },
  'bug': {
    fighting: -1,
    flying: -1,
    poison: -1,
    ghost: -1,
    steel: -1,
    fire: -1,
    grass: 1,
    psychic: 1,
    dark: 1,
    fairy: -1,
  },
  'ghost': {
    normal: -2,
    ghost: 1,
    psychic: 1,
    dark: -1,
  },
  'steel': {
    rock: 1,
    steel: -1,
    fire: -1,
    water: -1,
    electric: -1,
    ice: 1,
    fairy: 1,
  },
  'fire': {
    rock: -1,
    bug: 1,
    steel: 1,
    fire: -1,
    water: -1,
    grass: 1,
    ice: 1,
    dragon: -1,
  },
  'water': {
    ground: 1,
    rock: 1,
    fire: 1,
    water: -1,
    grass: -1,
    dragon: -1,
  },
  'grass': {
    flying: -1,
    poison: -1,
    ground: 1,
    rock: 1,
    bug: -1,
    steel: -1,
    fire: -1,
    water: 1,
    grass: -1,
    dragon: -1,
  },
  'electric': {
    flying: 1,
    ground: -2,
    water: 1,
    grass: -1,
    electric: -1,
    dragon: -1,
  },
  'psychic': {
    fighting: 1,
    poison: 1,
    steel: -1,
    psychic: -1,
    dark: -2,
  },
  'ice': {
    flying: 1,
    ground: 1,
    steel: -1,
    fire: -1,
    water: -1,
    grass: 1,
    ice: -1,
    dragon: 1,
  },
  'dragon': {
    steel: -1,
    dragon: 1,
    fairy: -2,
  },
  'dark': {
    fighting: -1,
    ghost: 1,
    psychic: 1,
    dark: -1,
    fairy: -1,
  },
  'fairy': {
    fighting: 1,
    poison: -1,
    steel: -1,
    fire: -1,
    dragon: 1,
    dark: 1,
  },
}

const simpleArr = types.map(() => []);

function ti(type) {
  return types.findIndex(t => t === type);
}

for (let at in ATK_EFF) {
  let ai = ti(at);
  for (let dt in ATK_EFF[at]) {
    let di = ti(dt);
    let af = ATK_EFF[at][dt];

    simpleArr[ai].push(`${effMap[af]}${di}`);
  }
}

const spliter = {
  def: ',',
  atk: ';',
}

console.log(simpleArr.map(i => i.join(spliter.def)).join(spliter.atk));

const op = {
  data: simpleArr.map(i => i.join(spliter.def)).join(spliter.atk),
  types,
  effMap,
  spliter,
}

const fs = require('fs');
const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  let js_prefix = 'export const effData = ';
  fs.writeFileSync(fileName, js_prefix + fileContent);
  console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};
outputJSON(op, './src/data/_eff.js', 2);
