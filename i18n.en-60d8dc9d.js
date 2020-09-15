
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
	teachable: "Teachable",
	nonTeachable: "non-Teachable",
	turn: "Turn",
	moveHitTimes: "Hit Times",
	circluDamage: "circlu Damage"
};
var lang = "Language";
var i18n_en = {
	comment: comment,
	filter: filter,
	fastMove: fastMove,
	chargedMove: chargedMove,
	pmlist: pmlist,
	pmPage: pmPage,
	lang: lang
};

export default i18n_en;
export { chargedMove, comment, fastMove, filter, lang, pmPage, pmlist };
//# sourceMappingURL=i18n.en-60d8dc9d.js.map
