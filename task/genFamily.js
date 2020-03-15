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
          // i.id = ALL.pokemonSettings.find(pm => {
          //   return (pm.data.pokemonSettings.pokemonId === i.name) &&
          //   (!i.form || i.form === pm.data.pokemonSettings.form)
          // });

          // if (i.id) {
          //   i.id = i.id.templateId;
          // } else {
          //   console.log(123, 'gg', i.name);
          // }

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
        delete i.id;

        if (!i.parent) { return; }

        { // find inject path
          fff[f]
          .some(i2 => {
            delete i2.id;
            if (!i2.next) {
              return false;
            }

            // check i2.next contain i.name & i.form
            return i2.next.some(i3 => {
              let isSame = i.form ?
                (i.form === i3.form && i.name === i3.name) :
                (i.name === i3.name);

              if (isSame) {
                i3.next = i.next;
                removedIdx.push(pmindex);
              }

              return isSame;
            });
          });
        }
      });

      fff[f] = fff[f].filter((i, idx) => {
        return !removedIdx.includes(idx);
      });
    }

    { // remove form & id
      let loopNext = (pms) => {
        pms.forEach(pm => {
          if (pm.form) {
            let _formData = ALL.formSettings.find(form => form.data.formSettings.pokemon === pm.name)

            if (_formData) {
              let _targetForm = _formData.data.formSettings.forms.find(_f => _f.form === pm.form);
              if (_targetForm && _targetForm.assetBundleValue) {
                pm.iso = _targetForm.assetBundleValue;
              }
            }
            pm.name = pm.form;
            delete pm.form;
          }
          if (pm.next) {
            loopNext(pm.next);
          }
        })
      };
      loopNext(fff[f]);
    }

    fff[f].sort((a, b) => {
      return (a.iso || 0) - (b.iso || 0);
    })
  }

  return fff;
}
