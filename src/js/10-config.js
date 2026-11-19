/* ---------- Aplicação principal ---------- */
var CONTENT_KEY = "apostilaDatabricksContent";
var PROGRESS_KEY = "apostilaDatabricksProgress";
var ANSWER_STATS_KEY = "apostilaDatabricksAnswerStats";
var CODE_DRAFTS_KEY = "apostilaDatabricksCodeDrafts";
var THEME_KEY = "apostilaDatabricksTheme";
var SITE_SETTINGS_KEY = "apostilaDatabricksSettings";
var PROFILE_LIBRARY_KEY = "apostilaDatabricksProfiles";
var ACTIVE_PROFILE_KEY = "apostilaDatabricksActiveProfile";
var SAVED_THEMES_KEY = "apostilaDatabricksSavedThemes";
var PROFILE_LIMIT = 20;
var SAVED_THEME_LIMIT = 30;
var SAVED_PROFILES = [];
var SAVED_THEMES = [];
var ACTIVE_PROFILE_ID = "";
var EDITOR_PROFILE_SELECTION = "";
var EDITOR_THEME_SELECTION = "";
var DEFAULT_SITE_SETTINGS = {
    brand: "Databricks Academy",
    logo: "●",
    homeTitle: "Apostila Databricks",
    homeIntro: "Aprenda os fundamentos de dados, engenharia e governança no Databricks.",
    startLabel: "Começar a estudar",
    practiceTitle: "Pratique",
    font: "Inter",
    siteDesign: "classic",
    navigationMode: "pages",
    radius: 18,
    defaultTheme: "dark",
    textScale: 100,
    cardOpacity: 78,
    headerBlur: 24,
    transparentCards: false,
    mouseEffect: "aura",
    mouseStyle: "follower",
    mouseSize: 44,
    mouseEnlarge: true,
    mouseColor: "#ff835f",
    mouseAccent: "#6f8cff",
    mouseEffectColor: "#ff835f",
    mouseEffectAccent: "#6f8cff",
    hideNativeCursor: false,
    cursorDefaultsVersion: 3,
    animateCursor: true,
    backgroundEffect: "aurora",
    backgroundIntensity: 58,
    backgroundSpeed: 30,
    ai: { textScale: 100, font: "inherit", bubbleStyle: "classic" },
    effects: { grid: true, particles: true, orbs: true, mouse: true, aurora: true, lines: true, stars: true },
    colors: {
        primary: "#ff5f3b",
        primaryLight: "#ff835f",
        secondary: "#6f8cff",
        success: "#20d67a",
        danger: "#ff6a6a",
        dark: {
            bg: "#071018",
            surface: "#101822",
            card: "#101822",
            cardHover: "#161f2c",
            border: "#29313a",
            text: "#f8fafc",
            muted: "#94a3b8"
        },
        light: {
            bg: "#f1f5f9",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#ffffff",
            border: "#cbd5e1",
            text: "#0f172a",
            muted: "#475569"
        }
    }
};
var SITE_DESIGN_PRESETS = {
    classic: {
        label: "Databricks clássico", font: "Inter", radius: 18, headerBlur: 24, backgroundEffect: "aurora",
        colors: {
            primary: "#ff5f3b", primaryLight: "#ff835f", secondary: "#6f8cff", success: "#20d67a", danger: "#ff6a6a",
            dark: { bg: "#071018", surface: "#101822", card: "#101822", cardHover: "#161f2c", border: "#29313a", text: "#f8fafc", muted: "#94a3b8" },
            light: { bg: "#f1f5f9", surface: "#ffffff", card: "#ffffff", cardHover: "#ffffff", border: "#cbd5e1", text: "#0f172a", muted: "#475569" }
        }
    },
    paper: {
        label: "Editorial de papel", font: "Georgia", radius: 9, headerBlur: 0, backgroundEffect: "topography",
        colors: {
            primary: "#9a5b32", primaryLight: "#c17a51", secondary: "#517e77", success: "#398b67", danger: "#c65252",
            dark: { bg: "#1a1917", surface: "#25221f", card: "#292521", cardHover: "#332d28", border: "#4b4038", text: "#f5eee5", muted: "#b8aa9a" },
            light: { bg: "#f4efe6", surface: "#fffaf2", card: "#fffaf2", cardHover: "#efe6d8", border: "#d9cebd", text: "#342c24", muted: "#706355" }
        }
    },
    terminal: {
        label: "Terminal verde", font: "JetBrains Mono", radius: 4, headerBlur: 0, backgroundEffect: "off",
        colors: {
            primary: "#34d399", primaryLight: "#86efac", secondary: "#38bdf8", success: "#4ade80", danger: "#fb7185",
            dark: { bg: "#06110e", surface: "#0b1c17", card: "#0b1c17", cardHover: "#122820", border: "#1e4537", text: "#d7ffe8", muted: "#7daf97" },
            light: { bg: "#e9f4ed", surface: "#f6fff8", card: "#f6fff8", cardHover: "#dff0e5", border: "#b6d2c0", text: "#123324", muted: "#486b58" }
        }
    },
    aurora: {
        label: "Aurora violeta", font: "Manrope", radius: 22, headerBlur: 30, backgroundEffect: "galaxy",
        colors: {
            primary: "#a78bfa", primaryLight: "#c4b5fd", secondary: "#22d3ee", success: "#34d399", danger: "#fb7185",
            dark: { bg: "#080c1c", surface: "#10172b", card: "#10172b", cardHover: "#172441", border: "#2b3455", text: "#f5f3ff", muted: "#a5b4d2" },
            light: { bg: "#eef2ff", surface: "#ffffff", card: "#ffffff", cardHover: "#edf3ff", border: "#c7d2fe", text: "#1e1b4b", muted: "#5b6286" }
        }
    },
    clean: {
        label: "Minimalista azul", font: "DM Sans", radius: 12, headerBlur: 0, backgroundEffect: "off",
        colors: {
            primary: "#2563eb", primaryLight: "#60a5fa", secondary: "#06b6d4", success: "#16a34a", danger: "#dc2626",
            dark: { bg: "#0b1220", surface: "#111c2c", card: "#111c2c", cardHover: "#1a2a3f", border: "#29384c", text: "#edf2f7", muted: "#9aabc0" },
            light: { bg: "#f8fafc", surface: "#ffffff", card: "#ffffff", cardHover: "#f1f5f9", border: "#dbe3ec", text: "#172033", muted: "#64748b" }
        }
    }
};
var SITE_COLOR_PRESETS = {
    databricks: { label: "Databricks", primary: "#ff5f3b", primaryLight: "#ff835f", secondary: "#6f8cff", bg: "#071018" },
    ocean: { label: "Oceano", primary: "#0ea5e9", primaryLight: "#38bdf8", secondary: "#8b5cf6", bg: "#071624" },
    forest: { label: "Floresta", primary: "#16a34a", primaryLight: "#4ade80", secondary: "#0ea5a4", bg: "#081811" },
    violet: { label: "Violeta", primary: "#8b5cf6", primaryLight: "#c084fc", secondary: "#ec4899", bg: "#130d20" },
    aurora: { label: "Aurora", primary: "#23c9a8", primaryLight: "#63f5d2", secondary: "#7c7cff", bg: "#071a22" },
    cherry: { label: "Cereja", primary: "#e11d48", primaryLight: "#fb7185", secondary: "#f97316", bg: "#1d0b13" },
    sunset: { label: "Pôr do sol", primary: "#f97316", primaryLight: "#fbbf24", secondary: "#ec4899", bg: "#1b100d" },
    graphite: { label: "Grafite", primary: "#94a3b8", primaryLight: "#cbd5e1", secondary: "#64748b", bg: "#101419" },
    sapphire: { label: "Safira", primary: "#2563eb", primaryLight: "#60a5fa", secondary: "#06b6d4", bg: "#08142b" },
    mint: { label: "Menta", primary: "#10b981", primaryLight: "#6ee7b7", secondary: "#14b8a6", bg: "#071b17" },
    sand: { label: "Areia", primary: "#b77936", primaryLight: "#e2b875", secondary: "#547b72", bg: "#201a12" },
    rose: { label: "Rosa", primary: "#db2777", primaryLight: "#f472b6", secondary: "#a855f7", bg: "#1b0e19" },
    cyber: { label: "Cyberpunk", primary: "#e879f9", primaryLight: "#f0abfc", secondary: "#22d3ee", bg: "#10091c" },
    mono: { label: "Monocromático", primary: "#d1d5db", primaryLight: "#f3f4f6", secondary: "#9ca3af", bg: "#111111" }
};
var AVAILABLE_FONTS = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Nunito", "Raleway", "Merriweather",
    "Playfair Display", "Lora", "Source Sans 3", "JetBrains Mono", "DM Sans", "Space Grotesk", "Manrope", "Georgia", "system-ui"
];
