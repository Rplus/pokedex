const fs = require('fs');
// const https = require('https');
// const gmUrl = `https://pvpoketw.com/data/gamemaster.json?${+new Date()}`;

const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  fs.writeFileSync(fileName, fileContent);
  console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};

let contents = fs.readFileSync('./tmp/gamemaster-pvpoke.json', 'utf8');
let contents_tw = fs.readFileSync('./tmp/gamemaster-pvpoketw.json', 'utf8');
let contents_FULL = fs.readFileSync('./tmp/gamemaster-full.json', 'utf8');

let fullData = JSON.parse(contents_FULL);
let twData = JSON.parse(contents_tw);

let oPm = fullData.filter(i => i.pokemonSettings);
let oMove = fullData.filter(i => i.moveSettings);

// for checking
outputJSON({
  oPm,
  oMove,
}, './tmp/o.json', 2);

handleJSON(JSON.parse(contents));


function introEffect(move) {
  let buffTypes = ['攻', '防'];
  let buffTargets = {
    opponent: '敵',
    self: '己',
  };
  let buffs = move.buffs.map((b, index) => {
    if (!b) { return ''}
    return `${b > 0 ? '+' : ''}${b}階${buffTypes[index]}`;
  }).filter(Boolean).join(', ');
  return `[${buffTargets[move.buffTarget]}], ${move.buffApplyChance * 100}%, ${buffs}`;
}

function queryMove(mid) {
  return oMove.find(m => m.moveSettings.movementId.replace(/_FAST$/, '') === mid);
}
function queryMove_tw(mid) {
  return twData.moves.find(m => m.moveId === mid);
}
function queryPM_tw(pid) {
  return twData.pokemon.find(pm => pm.speciesId === pid);
}

function handleJSON(json) {
  let { pokemon, moves, shadowPokemon } = json;

  // remove shadow pokemon
  pokemon = pokemon
    .filter(pm => pm.speciesId.indexOf('_shadow') === -1)
    .map(pm => {
      let pm_tw = queryPM_tw(pm.speciesId);
      if (!pm_tw) {
        console.warn(`new pm: ${pm.speciesId}`);
      }

      ['fastMoves', 'legacyMoves'].forEach(movetype => {
        if (pm[movetype] && pm[movetype].indexOf('HIDDEN_POWER_BUG') !== -1) {
          pm[movetype] = pm[movetype].filter(m => m.indexOf('HIDDEN_POWER_') === -1);
          pm[movetype].push('HIDDEN_POWER');
        }
      });

      let {
        dex,
        types,
        fastMoves,
        chargedMoves,
        legacyMoves,
      } = pm;

      if (shadowPokemon.indexOf(pm.id) !== -1) {
        chargedMoves.push('RETURN');
        chargedMoves.push('FRUSTRATION');
      }

      return {
        id: pm.speciesId,
        name: (pm_tw || pm).speciesName,
        _atk: pm.baseStats.atk,
        _def: pm.baseStats.def,
        _sta: pm.baseStats.hp,
        dex,
        types: types.filter(t => t !== 'none'),
        fastMoves,
        chargedMoves,
        legacyMoves,
      }
    });


  {
    let move_hiddenpower_normal = JSON.parse(JSON.stringify({
      ...moves.find(move => move.moveId === 'HIDDEN_POWER_BUG'),
      ...{
        moveId: 'HIDDEN_POWER',
        name: '覺醒力量',
        type: 'normal',
      },
    }));

    // remove some moves
    moves = moves.filter(move => {
      return (
        // (move.moveId !== 'TRANSFORM') &&
        (move.moveId.indexOf('BLASTOISE') === -1) &&
        (move.moveId.indexOf('HIDDEN_POWER_') === -1)
      );
    });

    moves.push(move_hiddenpower_normal);
  }


  moves = moves.map(mmm => {
    let pveData = queryMove(mmm.moveId);
    if (!pveData) {
      pveData = queryMove(mmm.moveId.replace(/\_/g, ''));
    }
    pveData = pveData.moveSettings;

    let mmm_tw = queryMove_tw(mmm.moveId);
    if (!mmm_tw) {
      console.warn(`new Move: ${mmm.moveId}`);
    }

    if (mmm.moveId === 'STRUGGLE') {
      mmm.pve_energyDelta = -33;
    }

    let {
      moveId,
      power,
      type,
      energy,
      energyGain,
    } = mmm;

    return {
      moveId,
      name: (mmm_tw || mmm).name,
      power,
      type,
      energy,
      energyGain,
      effect: mmm.buffs && introEffect(mmm),
      turn: mmm.cooldown / 500,
      isFast: /\_FAST$/.test(pveData.movementId),
      pve_power: pveData.power || 0,
      pve_energyDelta: pveData.energyDelta || 0,
      pve_duration: pveData.durationMs / 1000,
      pve_damageWindowStart: pveData.damageWindowStartMs / 1000,
      pve_damageWindowEnd: pveData.damageWindowEndMs / 1000,
    };
  });


  // output
  {
    outputJSON({
      pokemon,
      moves,
    }, './assets/gm.json', 0);

    outputJSON({
      pokemon,
      moves,
    }, './assets/gm.src.json');
  }
}
