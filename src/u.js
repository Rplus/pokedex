import CPM from '@d/cpm.js';

export function genOptions(v, l = v) {
  return `<option value="${v}" label="${l}"></option>`;
};

export function cdnImgSrc(imgsrc, size = 200) {
  // return imgsrc;
  // return `https://imageproxy.pimg.tw/resize?maxwidth=${size}&maxheigth=${size}&url=${imgsrc}`;
  return `https://images.weserv.nl/?w=${size}&il&url=${imgsrc}`;
}

// export const ASSET_FOLDER = 'https://github.com/ZeChrales/PogoAssets/raw/master/';
export const ASSET_FOLDER = 'https://github.com/PokeMiners/pogo_assets/raw/master/';

function queryMoveName(mid, movebase) {
  let _m = movebase.find(m => m.mid === mid);
  if (!_m) {
    console.log('gg', mid);
  }
  return _m && _m.moveId;
}

export function decompressJSON(json) {
  let { pmProps, moveProps } = json;

  json.moves = json.moves.map(moveArr => {
    let moveObj = moveArr.reduce((all, value, index) => {
      all[moveProps[index]] = value;
      return all;
    }, {});
    return moveObj;
  });

  json.pokemon = json.pokemon.map(pmDataArr => {
    let pmObj = pmDataArr.reduce((pm, value, index) => {
      let prop = pmProps[index];
      switch(prop) {
        case 'types':
          value = value.split(',');
          break;

        case 'fastMoves':
        case 'chargedMoves':
        case 'legacyMoves':
          value = value && value.split(',').map((mid) => queryMoveName(mid, json.moves));
          break;

        default:
          break;
      }

      if (value !== null) {
        pm[prop] = value;
      }
      return pm;
    }, {});
    return pmObj;
  });

  return json;
}



export function handlePm(pms) {
  // for checking
  let dexMap = pms.map(p => p.dex);
  dexMap.forEach((dex, idx) => {
    let indexOfFirstDex = dexMap.indexOf(dex);
    let form = '';
    if (idx !== indexOfFirstDex) {
      form = pms[idx].id.replace(/^.+_/, '_');
    }

    let pm = pms[idx];
    pm.uid = `${dex}${form}`;

    if (pm.name.indexOf(' ') !== -1) {
      pm.formName = pm.name.split(' ');
    }

    let _cphp = calPmCPHP({
      atk: pm._atk,
      def: pm._def,
      sta: pm._sta,
    }, [15, 15, 15, 40]);

    pm.maxcp = _cphp.cp;
    pm.maxhp = _cphp.hp;
    pm.tank = pm._def * pm._sta;
    pm.tankStr = fixNum(pm.tank / 100, 0);
    if (!pm.genderMF) {
      pm.genderMF = [0, 0];
    }
  });
  return pms.filter(Boolean).sort((a, b) => a.dex - b.dex);
}




export function calPmCPHP(base, adsl) {
  let [a, d, s, l] = adsl;
  let mFactor = CPM[l];
  let ADS = (base.atk + a) * Math.pow((base.def + d) * (base.sta + s), 0.5);
  let total = ADS * Math.pow(mFactor, 2.0);

  return {
    cp: Math.max(10, Math.floor(total / 10)),
    hp: Math.max(10, Math.floor((base.sta + s) * mFactor)),
  };
};




export function handleMove(moves) {
  return moves.map(m => {
    // m.isFast = !!m.energyGain;
    if (m.isFast) {
      m.ept = fixNum(m.energyGain / m.turn);
      m.dpt = fixNum(m.power / m.turn);
      m.eptxdpt = fixNum((m.power * m.energyGain) / (m.turn * m.turn));
    } else {
      m.dpe = fixNum(m.power / m.energy);
      if (!m.effect) {
        m.effect = '';
      }
    }
    m.pve_dps = fixNum(m.pve_power / m.pve_duration);
    m.pve_eps = fixNum(m.pve_energyDelta / m.pve_duration);
    m.pve_dpe = fixNum(m.pve_power / -m.pve_energyDelta);
    m.pve_dpsxdpe = fixNum(m.pve_power * m.pve_power / (m.pve_duration * -m.pve_energyDelta));
    return m;
  });
}





export function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}


// [].flat polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
export function flatten(arr, depth = 1) {
  if (Array.prototype.flat) {
    return arr.flat(depth);
  }
  const stack = [...arr];
  const res = [];
  while(stack.length) {
    // pop value from stack
    const next = stack.pop();
    if(Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // reverse to restore input order
  return res.reverse();
}




export function fixNum(num, d = 2, toStr) {
  let op = (+num).toFixed(d);
  return toStr ? op : +op;
}





const STORAGE_KEY = 'POKEDEX';
export function saveItem(data) {
  if (!data || !data.key) { return false;}
  let odata = getItem() || {};

  odata[data.key] = data.value;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(odata));
};

export function getItem(key) {
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) { return null; }
  data = JSON.parse(data);

  return key ? data[key] : data;
};
