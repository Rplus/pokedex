module.exports = function do_gm_to_family(gm) { // GM v2 file
  let props = [
    'pokemonSettings',
    'moveSettings',
    'combatMove',
    'genderSettings',
    'formSettings',
    'typeEffective',
    'evolutionQuestTemplate',
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
        prev: pmdata.parentPokemonId,
        next: pmdata.evolutionBranch && pmdata.evolutionBranch.map(i => {
          i.name = i.evolution;

          if (i.temporaryEvolution) {
            i.name = pmdata.pokemonId + i.temporaryEvolution.replace('TEMP_EVOLUTION', '');
            i.candyCost = 0;

            // query mega iso
            try {
              i.iso = gm
                .find(i => i.templateId === `TEMPORARY_EVOLUTION_${pm.templateId}`)
                .data
                .temporaryEvolutionSettings
                .temporaryEvolutions
                .find(j => j.temporaryEvolutionId === i.temporaryEvolution)
                .assetBundleValue;
            } catch (e) {
              new Error(e);
            }
          }

          // i.id = ALL.pokemonSettings.find(pm => {
          //   return (pm.data.pokemonSettings.pokemonId === i.name) &&
          //   (!i.form || i.form === pm.data.pokemonSettings.form)
          // });

          // if (i.id) {
          //   i.id = i.id.templateId;
          // } else {
          //   console.log(123, 'gg', i.name);
          // }
          let questRequirement;
          if (i.questDisplay) {
            console.log(1122, i.questDisplay.length);

            questRequirement = i.questDisplay.map(q => {
              const qid = q.questRequirementTemplateId;
              const qData = ALL.evolutionQuestTemplate.find(d => d.templateId === qid);

              if (!qData) { return; }

              const qInfo = qData.data.evolutionQuestTemplate;

              return qInfo.goals.map(goal => {
                const requirementString = goal.condition.map(c => {
                  let r = c.type;
                  for (const _p in c) {
                    if (_p !== 'type') {
                      r = Object.values(c[_p]).join();
                    }
                  }
                  return r;
                });
                return `${requirementString}: ${goal.target}`;
              }).join();
            }).join();
          }


          let requirement = [
            i.evolutionItemRequirement && `item:${i.evolutionItemRequirement}`,
            i.lureItemRequirement && `lure:${i.lureItemRequirement}`,
            i.kmBuddyDistanceRequirement && `km:${i.kmBuddyDistanceRequirement}`,
            i.genderRequirement && `gender:${i.genderRequirement}`,
            i.mustBeBuddy && 'buddy',
            i.onlyNighttime && 'night',
            i.onlyDaytime && 'day',
            i.noCandyCostViaTrade && 'free:Trade',
            i.temporaryEvolutionEnergyCost && `1st:${i.temporaryEvolutionEnergyCost} E`,
            i.temporaryEvolutionEnergyCostSubsequent && `2nd:${i.temporaryEvolutionEnergyCostSubsequent} E`,
            questRequirement,
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
          delete i.noCandyCostViaTrade;
          delete i.temporaryEvolutionEnergyCostSubsequent;
          delete i.temporaryEvolutionEnergyCost;
          delete i.temporaryEvolution;
          delete i.questDisplay;
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
    "V0226_POKEMON_MANTINE", // ????
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

    // remove something
    fff[f] = fff[f].filter(i => {
      return (
        // shadow & purified normal type
        !( hasShadow && /(_NORMAL|_SHADOW|_PURIFIED)$/.test(i.form) ) &&

        // alola's normal type
        !( ( (hasALOLA || hasGALARIAN) && /(_NORMAL)$/.test(i.form) ) )&&

        // 2019 event
        !(i.form && /(_2019)$/.test(i.form)) &&

        // blacklist
        ggIds.indexOf(i.id) === -1
      );
    });

    if (fff[f].some(i => i.form && (!i.form.includes('_ALOLA') && !i.form.includes('_GALARIAN') ))) {
      console.info('xxxx care xxxx', f);
      // console.log(fff[f]);
    }


    { // nested
      let removedIdx = [];
      fff[f].forEach((i, pmindex) => {
        delete i.id;

        if (!i.prev) { return; }

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
        // return 1;
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
              if (_targetForm && _targetForm.assetBundleSuffix) {
                pm.suffix = _targetForm.assetBundleSuffix;
              }
            }
            // pm.name = pm.form;
            // delete pm.form;
          }

          // FIXME
          if ([
            'OBSTAGOON',
            'PERRSERKER',
            'SIRFETCHD',
            'STUNFISK_GALARIAN',
            'RUNERIGUS',
            'MR_RIME',
          ].indexOf(pm.name) !== -1) {
            pm.iso = 31;
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

    // TODO
    if (f === 'F_PIKACHU') {
      fff[f].push(
        {
          "form": "PIKACHU_LIBRE",
          "name": "PIKACHU",
          "iso": 16
        }
      );
    }
  }

  return fff;
}
