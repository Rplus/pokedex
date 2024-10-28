const do_gm_to_family = require('./genFamily.js');
const compressJSON = require('./compress.js');
const fs = require('fs');
// const https = require('https');
// const gmUrl = `https://pvpoketw.com/data/gamemaster.json?${+new Date()}`;

const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  fs.writeFileSync(fileName, fileContent);
  console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};

let contents = fs.readFileSync('./data/gamemaster-pvpoke.json', 'utf8');
let contents_tw = fs.readFileSync('./data/gamemaster-pvpoketw.json', 'utf8');
let contents_FULL = fs.readFileSync('./data/gamemaster-full.json', 'utf8');

let fullData = JSON.parse(contents_FULL);
let twData = JSON.parse(contents_tw);

// update mega pm, clone and replace stats & types
{
  let megaArr = [];
  fullData.forEach(d => {
    let tempEvoOverrides = d.data?.pokemonSettings?.tempEvoOverrides;// === 'TEMP_EVOLUTION_MEGA'
    if (!tempEvoOverrides) {
      return;
    }

    if (!tempEvoOverrides.some(evo => evo.tempEvoId)) {
      console.log(111, d.data.templateId, tempEvoOverrides);
      return;
    }

    if (/_NORMAL/.test(d.data.pokemonSettings.form)) {
      return;
    }

    tempEvoOverrides.filter(evo => evo.tempEvoId).forEach(evo => {
      let tempPm = JSON.parse(JSON.stringify(d));
      delete tempPm.data.pokemonSettings.evolutionBranch;
      delete tempPm.data.pokemonSettings.tempEvoOverrides;
      if (!evo.tempEvoId) {
        console.log(333, d.templateId, tempEvoOverrides);
      }
      let idSuffix = evo.tempEvoId?.replace('TEMP_EVOLUTION', '')
      let id = tempPm.templateId + idSuffix;
      tempPm.templateId = id;
      tempPm.data.templateId = id;
      tempPm.data.pokemonSettings.pokemonId += idSuffix;
      tempPm.data.pokemonSettings.parentPokemonId = tempPm.data.pokemonSettings.pokemonId;
      tempPm.data.pokemonSettings.stats = evo.stats;
      tempPm.data.pokemonSettings.type = evo.typeOverride1;
      tempPm.data.pokemonSettings.type2 = evo.typeOverride2;
      megaArr.push(tempPm)
    });
  })
  fullData = fullData.concat(megaArr);
}

let oPm = fullData.filter(i => i.data.pokemonSettings);
let oMove = fullData.filter(i => i.data.moveSettings);
let oGender = fullData.filter(i => i.data.genderSettings);


outputJSON({
  oPm,
  oMove,
}, './data/o.json', 2);

let allF = do_gm_to_family(fullData);
outputJSON(allF, './assets/allF.json', 0);
outputJSON(allF, './data/allF.json', 2);

handleJSON(JSON.parse(contents));

function handleJSON(json) {
  let { pokemon, moves, shadowPokemon } = json;
  pokemon = doPM(pokemon, shadowPokemon);
  moves = doMove(moves);

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

    outputJSON(
      compressJSON({
        pokemon,
        moves,
      }),
      './assets/gm.min.json', 0
    );
  }
}


function doPM(pokemon, shadowPokemon) {
  // remove shadow pokemon
  pokemon = pokemon
    .filter(pm => pm.speciesId.indexOf('_shadow') === -1 && pm.speciesId.indexOf('_xl') === -1)
    .map(pm => {
      let ppp = queryPM(pm.speciesId);
      let pm_tw = queryPM_tw(pm.speciesId);
      if (!pm_tw) {
        console.warn(`new pm: ${pm.speciesId}`);
      }

      ['fastMoves', 'legacyMoves', 'eliteMoves'].forEach(movetype => {
        if (pm[movetype] && pm[movetype].indexOf('HIDDEN_POWER_BUG') !== -1) {
          pm[movetype] = pm[movetype].filter(m => !m.startsWith('HIDDEN_POWER_'));
          pm[movetype].push('HIDDEN_POWER');
        }
      });

      if (shadowPokemon.indexOf(pm.speciesId) !== -1) {
        pm.chargedMoves.push('RETURN');
        pm.chargedMoves.push('FRUSTRATION');
      }

      let {
        dex,
        types,
        fastMoves,
        chargedMoves,
        legacyMoves,
        eliteMoves,
      } = pm;

      let mergedLegacyMoves = [].concat(legacyMoves, eliteMoves).filter(Boolean);

      let oppm = {
        dex,
        types,
        fastMoves,
        chargedMoves,
        legacyMoves: mergedLegacyMoves.length ? mergedLegacyMoves : undefined,
        eliteMoves,
        _atk: pm.baseStats.atk,
        _def: pm.baseStats.def,
        _sta: pm.baseStats.hp,
        id: pid2PID(pm.speciesId),
        types: types.filter(t => t !== 'none'),
        name: (pm_tw || pm).speciesName,
      };

      // TODO
      if (oppm.id === 'PIKACHU_LIBRE') {
        oppm.familyId = 'F_PIKACHU';
      }

      // mega family id
      if (oppm.id.indexOf('_MEGA') !== -1) {
        ppp = queryPM(oppm.id.split('_MEGA')[0]);
      }

      if (ppp) {
        oppm.captureRate = ppp.encounter.baseCaptureRate && +ppp.encounter.baseCaptureRate.toFixed(2);
        oppm.fleeRate = ppp.encounter.baseFleeRate && +ppp.encounter.baseFleeRate.toFixed(2);
        oppm.buddyKm = ppp.kmBuddyDistance;
        oppm.familyId = ppp.familyId.replace('FAMILY_', 'F_');
        oppm.genderMF = queryTID(oGender, `SPAWN_${ppp.oid}`);
        if (oppm.genderMF) {
          let genderPercent = oppm.genderMF.data.genderSettings.gender;
          oppm.genderMF = [genderPercent.malePercent || 0, genderPercent.femalePercent || 0].map(i => i* 100);
        }
      }
      return oppm;
    });

  return pokemon;
}


function doMove(moves) {
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
        // (move.moveId.indexOf('_UPDATED') === -1) &&
        (move.moveId.indexOf('BLASTOISE') === -1) &&
        (move.moveId.indexOf('HIDDEN_POWER_') === -1)
      );
    });

    moves.push(move_hiddenpower_normal);
  }

  {
    moves = moves.map(mmm => {
      let pveData = queryMove(mmm.moveId);

      if (mmm.moveId === 'TECHNO_BLAST_DOUSE') {
        pveData = queryMove('TECHNO_BLAST_WATER');
      }

      if (!pveData) {
        pveData = queryMove(mmm.moveId.replace(/\_/g, ''));
        if (!pveData) {
          return;
        }
      }
      pveData.data.moveSettings.mid = pveData.templateId.slice(2, 5);
      pveData = pveData.data.moveSettings;

      let mmm_tw = queryMove_tw(mmm.moveId);
      if (!mmm_tw) {
        console.warn(`new Move: ${mmm.moveId}`);
      }

      if (mmm.moveId === 'STRUGGLE') {
        // mmm.pve_energyDelta = -33;
        pveData.energyDelta = -33;
      }

      let {
        mid,
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
        mid: pveData.mid,
        isFast: /\_FAST$/.test(pveData.movementId),
        pve_power: pveData.power || 0,
        pve_energyDelta: pveData.energyDelta || 0,
        pve_duration: pveData.durationMs / 1000,
        pve_damageWindowStart: pveData.damageWindowStartMs / 1000,
        pve_damageWindowEnd: pveData.damageWindowEndMs / 1000,
      };
    });
    return moves.filter(Boolean);
  }
}




////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function queryTID(database, tid) {
  return database.find(i => i.templateId === tid);
}
function queryMove(mid) {
  return oMove.find(m => {
    if (!m.data.moveSettings.movementId.replace) {
      return;
    }
    return m.data.moveSettings.movementId.replace(/_FAST$/, '') === mid
  });
}
function queryMove_tw(mid) {
  return twData.moves.find(m => m.moveId === mid);
}
function queryPM(pid) {
  pid = pid2PID(pid);
  let pm = oPm.find(pm => (
    pm.templateId.slice(14) === pid ||
    pm.data.pokemonSettings.pokemonId === pid
  ));
  if (!pm) {
    console.error(`>> cannot find ${pid} in GM <<`);
  }
  if ((pm && pm.data.pokemonSettings)) {
    pm.data.pokemonSettings.oid = pm.templateId;
  }
  return (pm && pm.data.pokemonSettings) || null;
}
function queryPM_tw(pid) {
  return twData.pokemon.find(pm => pm.speciesId === pid);
}
function pid2PID(pid) {
  return (
    pid
    .replace('_alolan', '_alola')
    .replace('mewtwo_armored', 'mewtwo_a')
    .toUpperCase()
  )
}
function PID2pid(PID) {
  return (
    PID
    .toLowerCase()
    .replace(/\_alola$/, '_alolan')
    .replace(/mewtwo\_a$/, 'mewtwo_armored')
  );
}
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
