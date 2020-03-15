module.exports = function compressJSON(data) {
  let moveProps = data.moves.reduce((all, move) => {
    return all.concat(Object.keys(move));
  }, []);
  moveProps = [...new Set(moveProps)];


  let pmProps = data.pokemon.reduce((all, pm) => {
    ['fastMoves', 'chargedMoves', 'legacyMoves'].forEach(mt => {
      if (!pm[mt]) { return; }
      pm[mt] = pm[mt].map(moveId => queryMid(moveId)).join(',');
    });

    pm.types = pm.types && pm.types.join(',');

    return all.concat(Object.keys(pm));
  }, []);
  pmProps = [...new Set(pmProps)];


  return {
    pmProps,
    moveProps,
    pokemon: data.pokemon.map(pm => {
      return pmProps.map(prop => {
        return pm[prop] || null;
      });
    }),
    moves: data.moves.map(move => {
      return moveProps.map(prop => {
        return move[prop];
      });
    }),
  }

  function queryMid(_moveId) {
    let _m = data.moves.find(m => m.moveId === _moveId);
    if (!_m || !_m.mid) {
      console.error(`no move: ${_moveId}`);
      return 'gg';
    }
    return _m.mid;
  }

};
