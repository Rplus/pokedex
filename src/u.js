
export function handlePm(pms) {
  // for checking
  let dexMap = pms.map(p => p.dex);
  dexMap.forEach((dex, idx) => {
    let indexOfFirstDex = dexMap.indexOf(dex);
    let form = '';
    if (idx !== indexOfFirstDex) {
      // if (pms[idx].id === pms[indexOfFirstDex].id) {
      //   // TODO: PvPoke might fix that
      //   // remove dup data
      //   pms[idx] = null;
      //   return;
      // }
      form = pms[idx].id.replace(/^.+_/, '_');
    }
    pms[idx].uid = `${dex}${form}`;
  });
  return pms.filter(Boolean);
}


const buffTypes = ['攻', '防'];
const buffTargets = {
  opponent: '敵',
  self: '己',
};

function introEffect(move) {
  let buffs = move.buffs.map((b, index) => {
    if (!b) { return ''}
    return `${b > 0 ? '+' : ''}${b}階${buffTypes[index]}`;
  }).filter(Boolean).join(', ');
  return `[${buffTargets[move.buffTarget]}], ${move.buffApplyChance * 100}%, ${buffs}`;
}

export function handleMove(moves) {
  return moves.map(m => {
    m.isFast = !!m.energyGain;
    if (m.isFast) {
      m.ept = fixNum(m.energyGain / m.turn);
      m.dpt = fixNum(m.power / m.turn);
      m.eptxdpt = fixNum((m.power * m.energyGain) / (m.turn * m.turn));
    } else {
      m.dpe = fixNum(m.power / m.energy);
      m.buffsDes = m.buffs ? introEffect(m) : '';
    }
    return m;
  });
}

export function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function fixNum(num, d = 2, toStr) {
  let op = (+num).toFixed(d);
  return toStr ? op : +op;
}
