
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
	fastMove: "fast",
	chargedMove: "charged",
	turn: "Turn",
	moveHitTimes: "Hit \n Times",
	circleDamage: "circle Damage (+STAB)",
	avgDamage: "average Damage in Turn (+STAB)"
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
//# sourceMappingURL=i18n.en-f937bef8.js.map
