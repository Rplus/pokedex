
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var comment = "Comments";
var filter = "Filter";
var fastMove = "Fast Move";
var chargedMove = "Charged Move";
var pmlist = {
	showAll: "show all?"
};
var pmPage = {
	simulateOpponentTypes: "Simulate Opponent Types",
	typeN: "Type {n}",
	atkBuff: "Atk Buff",
	movePair: "Move Pair",
	eliteTeachable: "Teachable by Elite TM",
	nonEliteTeachable: "non-Teachable by Elite TM"
};
var ttfa = {
	fastMove: "Fast",
	chargedMove: "Charged",
	turn: "Turn",
	moveHitTimes: "Hit\nTimes",
	circleDamage: "Circle\nDamage\n(+STAB)",
	avgDamage: "average\nDamage\nin\nTurn\n(+STAB)"
};
var lang = "Language";
var i18n_en = {
	comment: comment,
	filter: filter,
	fastMove: fastMove,
	chargedMove: chargedMove,
	pmlist: pmlist,
	pmPage: pmPage,
	ttfa: ttfa,
	lang: lang
};

export default i18n_en;
export { chargedMove, comment, fastMove, filter, lang, pmPage, pmlist, ttfa };
//# sourceMappingURL=i18n.en-89ba2eda.js.map
