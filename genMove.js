module.exports = function do_gm_to_move(gm) {
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


}
