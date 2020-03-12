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
function queryPM(pid) {
  pid = pid2PID(pid);
  let pm = oPm.find(pm => (
    pm.templateId.slice(14) === pid ||
    pm.pokemonSettings.pokemonId === pid
  ));
  if (!pm) {
    console.error(`>> cannot find ${pid} in GM <<`);
  }
  return (pm && pm.pokemonSettings) || null;
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

function handleJSON(json) {
  let { pokemon, moves, shadowPokemon } = json;
  let allF = {};

  // remove shadow pokemon
  pokemon = pokemon
    .filter(pm => pm.speciesId.indexOf('_shadow') === -1)
    .map(pm => {
      let ppp = queryPM(pm.speciesId);
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
      let op = {
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
      };

      if (ppp) {
        op.captureRate = ppp.encounter.baseCaptureRate && +ppp.encounter.baseCaptureRate.toFixed(3);
        op.fleeRate = ppp.encounter.baseFleeRate && +ppp.encounter.baseFleeRate.toFixed(3);
        op.buddyKm = ppp.kmBuddyDistance;
        ppp.familyId = ppp.familyId.replace('FAMILY_', 'F_');
        op.familyId = ppp.familyId;

        if (!allF[ppp.familyId]) {
          allF[ppp.familyId] = [];
        }

        if (ppp.evolutionBranch && ppp.evolutionBranch.length > 1) {
          console.log(ppp.familyId);
        }
        // TODO
        if (pm.speciesId === 'eelektrik') {
          ppp.parentPokemonId = 'TYNAMO';
        }

        allF[ppp.familyId].push({
          pid: pm.speciesId,
          // fid: ppp.familyId,
          next: ppp.evolutionBranch && ppp.evolutionBranch.map(pm => {
            let _pid = PID2pid(pm.evolution);
            let _form = pm.form;
            pm.pid = _pid;

            if (_form) {
              _form = PID2pid(_form);
              pm.form = PID2pid(_form);
              if (shadowPokemon.indexOf(_pid) !== -1) {
              }
              _form = _form.replace('_normal', '');

              let _formType = _form.match(/\_\w+$/);
              if (_formType && _formType[0] === '_alolan') {
                pm.pid = _form;
              }

              if (_form === pm.pid) {
                delete pm.form;
              }

              if (pm.form === pm.pid) {
                delete pm.form;
              }
            }

            if (pm.noCandyCostViaTrade) {
              pm.tradeevolve = true;
              delete pm.noCandyCostViaTrade;
            }

            pm.requirement = [
              pm.evolutionItemRequirement && `item:${pm.evolutionItemRequirement}`,
              pm.lureItemRequirement && `lure:${pm.lureItemRequirement}`,
              pm.kmBuddyDistanceRequirement && `km:${pm.kmBuddyDistanceRequirement}`,
              pm.genderRequirement && `gender:${pm.genderRequirement}`,
              pm.mustBeBuddy && 'buddy',
              pm.onlyNighttime && 'night',
              pm.onlyDaytime && 'day',
            ].filter(Boolean);
            if (!pm.requirement.length) {
              delete pm.requirement;
            }
            delete pm.evolutionItemRequirement;
            delete pm.lureItemRequirement;
            delete pm.kmBuddyDistanceRequirement;
            delete pm.mustBeBuddy;
            delete pm.onlyNighttime;
            delete pm.onlyDaytime;
            delete pm.evolution;
            delete pm.genderRequirement;

            return pm;
          }),
          parentPid: ppp.parentPokemonId && PID2pid(ppp.parentPokemonId),
        });
      }

      return op;
    });

  let data = allF;
  for (let fid in data) {
    if (allF[fid].length === 1) {
      // console.log(`bye~ ${fid}`);
      // delete allF[fid];
    } else {
      let fff = data[fid];
      let removedIdx = [];
      fff
        .forEach((pm, index) => {
          if (!pm.parentPid) { return; }

          let _form = pm.pid.includes('_') ? pm.pid.match(/\_\w+/)[0] : '';

          _parent = fff.find(_p0 => {
            let _ppid = pm.parentPid;
            if (_form && !pm.parentPid.includes('_')) {
              _ppid += _form;
            }
            if (!_p0.next) {
              _ppid += _form;
            }
            return (
              _p0.pid ===  _ppid||
              _p0.pid === (_ppid + _form)
            );
          });

          if (!_parent) {
            console.log(1, '!_parent', fid, pm, _parent);
            // removedIdx.push(index);
            return;
          }
          if (!_parent.next) {
            console.log(2, '!_parent.next', fid, pm, _parent);
            removedIdx.push(index);
            return;
          }

          let nextIdx = _parent.next.findIndex(_p1 => _p1.pid === pm.pid);
          if (nextIdx !== -1) {
            let _o = { ..._parent.next[nextIdx], ...pm};
            delete _o.parentPid;
            _parent.next[nextIdx] = _o;
            removedIdx.push(index);
          }
        });
      data[fid] = fff.filter((item, index) => removedIdx.indexOf(index) === -1 );
    }
  }


  outputJSON(allF, './assets/allF.json', 0);
  outputJSON(allF, './tmp/allF.json', 2);

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
