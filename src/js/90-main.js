/* ---------- Mostra nível/tipo de cada questão no cartão ---------- */
var _lessonOriginal = lesson;
lesson = function (x, i) {
    var k = 0;
    return _lessonOriginal(x, i).replace(/<span class="lv">Teste Prático Databricks<\/span>/g, function () {
        var q = x.q && x.q[k++];
        return '<span class="lv">' + ((q && q.lv) || "Teste Prático Databricks") + '</span>';
    });
};
TUTOR_HISTORY = loadTutorHistory();
initializeAiTutorWidget();
initializeAiToolsMenu();
initializeMobileNavigation();
renderMenu();
renderApp();
