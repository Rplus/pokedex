const fs = require('fs');
// const https = require('https');
// const gmUrl = `https://pvpoketw.com/data/gamemaster.json?${+new Date()}`;

const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  fs.writeFileSync(fileName, fileContent);
  console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};

let contents = fs.readFileSync('./tmp/gamemaster.json', 'utf8');

handleJSON(JSON.parse(contents));

function handleJSON(json) {
      let { pokemon, moves, shadowPokemon } = json;

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
        let move_hp_n = JSON.parse(JSON.stringify({
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

        moves.push(move_hp_n);
      }


      moves.forEach(move => {
        if (move.buffApplyChance) {
          move.buffApplyChance = move.buffApplyChance * 1;
        }
        move.turn = move.cooldown / 500;
        delete move.cooldown;
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
