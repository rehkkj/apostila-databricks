/* ---------- Modo leve automático ----------
   Para as animações contínuas do fundo em aparelhos fracos / economia de dados / movimento reduzido.
   Forçar manualmente (no console do navegador):
     localStorage.apostilaLite = "1"  → sempre leve
     localStorage.apostilaLite = "0"  → nunca leve
     localStorage.removeItem("apostilaLite") → automático */
(function () {
    var root = document.documentElement;
    var lite = false;
    try {
        var forced = localStorage.getItem("apostilaLite");
        if (forced === "1") lite = true;
        else if (forced !== "0") {
            var nav = navigator;
            lite = (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
                (nav.deviceMemory && nav.deviceMemory <= 4) ||
                Boolean(nav.connection && nav.connection.saveData) ||
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
    } catch (error) { /* mantém o modo completo */ }
    if (lite) root.classList.add("lite");
    document.addEventListener("visibilitychange", function () {
        root.classList.toggle("tab-hidden", document.hidden);
    });
})();
