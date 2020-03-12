import CPM from '@d/cpm.js';

export function genOptions(v, l = v) {
  return `<option value="${v}" label="${l}"></option>`;
};

export function cdnImgSrc(imgsrc, size = 200) {
  // return imgsrc;
  // return `https://imageproxy.pimg.tw/resize?maxwidth=${size}&maxheigth=${size}&url=${imgsrc}`;
  return `https://images.weserv.nl/?w=${size}&il&url=${imgsrc}`;
}

export const ASSET_FOLDER = 'https://github.com/ZeChrales/PogoAssets/raw/master/';


export function handlePm(pms) {
  // for checking
  let dexMap = pms.map(p => p.dex);
  dexMap.forEach((dex, idx) => {
    let indexOfFirstDex = dexMap.indexOf(dex);
    let form = '';
    if (idx !== indexOfFirstDex) {
      form = pms[idx].id.replace(/^.+_/, '_');
    }
    pms[idx].uid = `${dex}${form}`;

    if (pms[idx].name.indexOf(' ') !== -1) {
      pms[idx].formName = pms[idx].name.split(' ');
    }

    let _cphp = calPmCPHP({
      atk: pms[idx]._atk,
      def: pms[idx]._def,
      sta: pms[idx]._sta,
    }, [15, 15, 15, 40]);

    pms[idx].maxcp = _cphp.cp;
    pms[idx].maxhp = _cphp.hp;
  });
  return pms.filter(Boolean);
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


export function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
  }, []);
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
