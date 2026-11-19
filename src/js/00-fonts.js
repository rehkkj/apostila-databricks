/* ---------- Carregamento sob demanda das fontes (Google Fonts) ----------
   Só a fonte ativa é baixada; o catálogo completo só carrega ao abrir o Editor. */
var FONT_QUERY = {
    "DM Sans": "DM+Sans",
    "Inter": "Inter:wght@300;400;500;600;700;800",
    "JetBrains Mono": "JetBrains+Mono:wght@400;700",
    "Lato": "Lato:wght@300;400;700",
    "Lora": "Lora",
    "Manrope": "Manrope",
    "Merriweather": "Merriweather:wght@300;400;700",
    "Montserrat": "Montserrat:wght@300;400;600;800",
    "Nunito": "Nunito:wght@300;400;600;700",
    "Open Sans": "Open+Sans",
    "Playfair Display": "Playfair+Display:wght@400;700",
    "Poppins": "Poppins:wght@300;400;600;700",
    "Raleway": "Raleway",
    "Roboto": "Roboto:wght@300;400;700",
    "Source Sans 3": "Source+Sans+3",
    "Space Grotesk": "Space+Grotesk"
};
var LOADED_FONTS = { "Inter": true };
var ALL_FONTS_LOADED = false;
function addFontStylesheet(href) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}
function loadWebFont(name) {
    if (!FONT_QUERY[name] || LOADED_FONTS[name]) return;
    LOADED_FONTS[name] = true;
    addFontStylesheet("https://fonts.googleapis.com/css2?family=" + FONT_QUERY[name] + "&display=swap");
}
function loadAllWebFonts() {
    if (ALL_FONTS_LOADED) return;
    ALL_FONTS_LOADED = true;
    var pending = Object.keys(FONT_QUERY).filter(function (n) { return !LOADED_FONTS[n]; });
    pending.forEach(function (n) { LOADED_FONTS[n] = true; });
    if (pending.length) addFontStylesheet("https://fonts.googleapis.com/css2?" + pending.map(function (n) { return "family=" + FONT_QUERY[n]; }).join("&") + "&display=swap");
}

document.addEventListener("toggle", function (event) {
    var target = event.target;
    if (target && target.classList && target.classList.contains("font-picker") && target.open) loadAllWebFonts();
}, true);
