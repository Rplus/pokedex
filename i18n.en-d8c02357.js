
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var comment = "Comments";
var filter = "Filter";
var pmlist = {
	showAll: "show all?"
};
var pmPage = {
	simulateOpponentTypes: "Simulate Opponent Types",
	typeN: "Type {n}",
	atkBuff: "Atk Buff"
};
var lang = "Language";
var i18n_en = {
	comment: comment,
	filter: filter,
	pmlist: pmlist,
	pmPage: pmPage,
	lang: lang
};

export default i18n_en;
export { comment, filter, lang, pmPage, pmlist };
//# sourceMappingURL=i18n.en-d8c02357.js.map
