module.exports = function do_gm_to_family(gm) { // GM v2 file
  let props = [
    'pokemonSettings',
    'moveSettings',
    'combatMove',
    'genderSettings',
    'formSettings',
    'typeEffective',
  ];

  let ALL = props.reduce((all, prop) => {
    all[prop] = gm.filter(i => i.data[prop]);
    return all;
  }, {});

  // ALL.pokemonSettings = ALL.pokemonSettings.filter(pm => pm.templateId)
  let fff = ALL.pokemonSettings.reduce((all, pm) => {
    let pmdata = pm.data.pokemonSettings;
    let f = pmdata.familyId.replace('FAMILY_', 'F_');
    if (!all[f]) { all[f] = []; }

    all[f].push(
      {
        id: pm.templateId,
        form: pmdata.form,
        name: pmdata.pokemonId,
        parent: pmdata.parentPokemonId,
        next: pmdata.evolutionBranch && pmdata.evolutionBranch.map(i => {
          i.name = i.evolution;

          let requirement = [
            i.evolutionItemRequirement && `item:${i.evolutionItemRequirement}`,
            i.lureItemRequirement && `lure:${i.lureItemRequirement}`,
            i.kmBuddyDistanceRequirement && `km:${i.kmBuddyDistanceRequirement}`,
            i.genderRequirement && `gender:${i.genderRequirement}`,
            i.mustBeBuddy && 'buddy',
            i.onlyNighttime && 'night',
            i.onlyDaytime && 'day',
          ].filter(Boolean);
          if (requirement.length) {
            i.requirement = requirement;
          }

          delete i.evolution;
          delete i.evolutionItemRequirement;
          delete i.lureItemRequirement;
          delete i.kmBuddyDistanceRequirement;
          delete i.genderRequirement;
          delete i.mustBeBuddy;
          delete i.onlyNighttime;
          delete i.onlyDaytime;
          return i;
        }),
      }
    );
    return all;
  }, {});

  let multiForm = [351, 386, 412, ]
  let multiFamily = ['FAMILY_CASTFORM', 'FAMILY_DEOXYS', 'FAMILY_BURMY', ]
  let ggIds = [
    "V0150_POKEMON_MEWTWO_NORMAL",
    "V0351_POKEMON_CASTFORM",
    "V0386_POKEMON_DEOXYS",
    "V0412_POKEMON_BURMY",
    "V0413_POKEMON_WORMADAM",
    "V0421_POKEMON_CHERRIM",
    "V0422_POKEMON_SHELLOS",
    "V0423_POKEMON_GASTRODON",
    "V0479_POKEMON_ROTOM",
    "V0487_POKEMON_GIRATINA",
    "V0492_POKEMON_SHAYMIN",
    "V0493_POKEMON_ARCEUS",
    "V0550_POKEMON_BASCULIN",
    "V0555_POKEMON_DARMANITAN",
    "V0585_POKEMON_DEERLING",
    "V0586_POKEMON_SAWSBUCK",
    "V0592_POKEMON_FRILLISH_NORMAL",
    "V0593_POKEMON_JELLICENT_NORMAL",
    "V0641_POKEMON_TORNADUS",
    "V0642_POKEMON_THUNDURUS",
    "V0645_POKEMON_LANDORUS",
    "V0646_POKEMON_KYUREM",
    "V0647_POKEMON_KELDEO",
    "V0648_POKEMON_MELOETTA",
    "V0649_POKEMON_GENESECT",
  ];

  for (let f in fff) {
    let hasShadow = fff[f].some(i => !i.form ? false : i.form.includes('_SHADOW') );
    let hasALOLA = fff[f].some(i => !i.form ? false : i.form.includes('_ALOLA') );
    let hasGALARIAN = fff[f].some(i => !i.form ? false : i.form.includes('_GALARIAN') );

    {
      fff[f].forEach(i => {
        if (!i.next) { return; }

        i.next.forEach(ii => {
          if (hasShadow) {
            if (ii.form) {
              ii.form = ii.form.replace('_NORMAL', '');
            }
            if (ii.form === ii.name) {
              delete ii.form;
            }
          }
        });
      });
    }

    fff[f] = fff[f].filter(i => {
      return (
        (hasShadow && !i.form || !/(_NORMAL|_SHADOW|_PURIFIED)$/.test(i.form) ) &&
        ((hasALOLA || hasGALARIAN) && !i.form || !/(_NORMAL)$/.test(i.form) ) &&
        (!i.form || !/(_2019)$/.test(i.form)) &&
        !ggIds.includes(i.id)
      );
    });

    if (fff[f].some(i => i.form && (!i.form.includes('_ALOLA') && !i.form.includes('_GALARIAN') ))) {
      console.info('====', f);
      // console.log(fff[f]);
    }


    { // nested
      let removedIdx = [];
      fff[f].forEach((i, pmindex) => {
        let _parent;
        let parentName = i.parent;
        if (!parentName) { return; }

        { // find inject path
          fff[f]
          .filter(i2 => i2.next)
          .some(i2 => {
            i2.name === i.parent
            i.form === i.form

            return i2.next.some(i3 => {
              let ooo = (i3.name === i.name) &&
              (!i3.form || i3.form === i.form);
              if (ooo) {
                i3.id = i.id;
                i3.next = i.next;
                removedIdx.push(pmindex);
              }
              return ooo;
            })
          });
        }
      });

      fff[f] = fff[f].filter((i, idx) => {
        return !removedIdx.includes(idx);
      });
    }

  }

  return fff;
}
