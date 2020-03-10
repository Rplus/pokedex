const fs = require('fs');
// const https = require('https');
// const gmUrl = `https://pvpoketw.com/data/gamemaster.json?${+new Date()}`;

const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  fs.writeFileSync(fileName, fileContent);
  console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};

let contents = fs.readFileSync('./tmp/gamemaster.json', 'utf8');
let fullContents = fs.readFileSync('./tmp/gamemaster_full.json', 'utf8');

let fullData = JSON.parse(fullContents);

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

function handleJSON(json) {
      let { pokemon, moves, shadowPokemon } = json;

      // remove shadow pokemon
      pokemon = pokemon.filter(pm => pm.speciesId.indexOf('_shadow') === -1);

      pokemon.forEach(pm => {
        pm._atk = pm.baseStats.atk;
        pm._def = pm.baseStats.def;
        pm._sta = pm.baseStats.hp;

        pm.name = pm.speciesName;
        pm.id = pm.speciesId;
        pm.types = pm.types.filter(t => t !== 'none');

        if (shadowPokemon.indexOf(pm.id) !== -1) {
          pm.chargedMoves.push('RETURN');
          pm.chargedMoves.push('FRUSTRATION');
        }

        delete pm.speciesId;
        delete pm.speciesName;
        delete pm.defaultIVs;
        delete pm.level25CP;
        delete pm.baseStats;
        delete pm.tags;

        ['fastMoves', 'legacyMoves'].forEach(type => {
          if (pm[type] && pm[type].indexOf('HIDDEN_POWER_BUG') !== -1) {
            pm[type] = pm[type].filter(m => m.indexOf('HIDDEN_POWER_') === -1);
            pm[type].push('HIDDEN_POWER');
          }
        });

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


      moves.forEach(move => {
        if (move.buffApplyChance) {
          move.buffApplyChance = move.buffApplyChance * 1;
        }

        if (move.buffs) {
          move.effect = introEffect(move);
          delete move.buffs;
          delete move.buffTarget;
          delete move.buffApplyChance;
        }

        move.turn = move.cooldown / 500;
        delete move.cooldown;

        let pveData = queryMove(move.moveId);
        if (!pveData) {
          pveData = queryMove(move.moveId.replace(/\_/g, ''));
        }
        pveData = pveData.moveSettings;

        move.isFast = /\_FAST$/.test(pveData.movementId);
        move.pve_power = pveData.power || 0;
        move.pve_energyDelta = pveData.energyDelta || 0;
        if (move.moveId === 'STRUGGLE') {
          move.pve_energyDelta = -33;
        }
        move.pve_duration = pveData.durationMs / 1000;
        move.pve_damageWindowStart = pveData.damageWindowStartMs / 1000;
        move.pve_damageWindowEnd = pveData.damageWindowEndMs / 1000;
      });


      outputJSON({
        pokemon,
        moves,
      }, './assets/gm.json', 0);

      outputJSON({
        pokemon,
        moves,
      }, './assets/gm.src.json');
}
