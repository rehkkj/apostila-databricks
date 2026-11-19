var GEN_KEY = "apostilaGenCfg";
var AI_USAGE_KEY = "apostilaAiUsage";
var AI_WIDGET_POSITION_KEY = "apostilaAiWidgetPosition";
var AI_PROVIDERS = {
    gemini: {
        label: "Google Gemini",
        defaultModel: "gemini-3.1-flash-lite",
        models: ["gemini-3.1-flash-lite", "gemini-3.8-flash"],
        keyUrl: "https://aistudio.google.com/apikey"
    },
    openrouter: {
        label: "OpenRouter Free",
        defaultModel: "openrouter/free",
        models: ["openrouter/free"],
        keyUrl: "https://openrouter.ai/keys"
    },
    cloudflare: {
        label: "Cloudflare Workers AI",
        defaultModel: "@cf/meta/llama-3.1-8b-instruct",
        models: ["@cf/meta/llama-3.1-8b-instruct"],
        keyUrl: "https://dash.cloudflare.com/profile/api-tokens"
    },
    groq: {
        label: "Groq",
        defaultModel: "openai/gpt-oss-20b",
        models: ["openai/gpt-oss-20b"],
        keyUrl: "https://console.groq.com/keys"
    },
    cohere: {
        label: "Cohere Trial",
        defaultModel: "command-r7b-12-2024",
        models: ["command-r7b-12-2024"],
        keyUrl: "https://dashboard.cohere.com/api-keys"
    }
};
var GEN_CFG = {
    provider: "groq",
    apiKey: "",
    model: "openai/gpt-oss-20b",
    keys: { gemini: "", openrouter: "", cloudflare: "", groq: "", cohere: "" },
    savedKeys: { gemini: "", openrouter: "", cloudflare: "", groq: "", cohere: "" },
    accountIds: { cloudflare: "" },
    fallbackEnabled: true
};
var AI_PROVIDER_COOLDOWNS = {};
function aiProviderForModel(model) {
    return Object.keys(AI_PROVIDERS).find(function (provider) {
        return AI_PROVIDERS[provider].models.indexOf(model) !== -1;
    }) || "gemini";
}
function aiProviderLabel(provider) {
    return AI_PROVIDERS[provider] ? AI_PROVIDERS[provider].label : AI_PROVIDERS.gemini.label;
}
function validAiModel(provider, model) {
    return Boolean(AI_PROVIDERS[provider] && AI_PROVIDERS[provider].models.indexOf(model) !== -1);
}
function validOpenRouterKey(key) {
    return /^sk-or-v1-[0-9a-f]{64}$/.test(key);
}
function persistGenConfig() {
    var stored = {
        provider: GEN_CFG.provider,
        model: GEN_CFG.model,
        apiKey: GEN_CFG.savedKeys[GEN_CFG.provider] || "",
        keys: GEN_CFG.savedKeys,
        accountIds: GEN_CFG.accountIds,
        fallbackEnabled: GEN_CFG.fallbackEnabled
    };
    localStorage.setItem(GEN_KEY, JSON.stringify(stored));
}
function saveGenConfig(rememberCurrentKey) {
    GEN_CFG.savedKeys[GEN_CFG.provider] = rememberCurrentKey ? GEN_CFG.apiKey : "";
    persistGenConfig();
}
try {
    var savedGenCfg = JSON.parse(localStorage.getItem(GEN_KEY) || "null");
    if (savedGenCfg && typeof savedGenCfg === "object") {
        var savedModelProvider = typeof savedGenCfg.model === "string" ? aiProviderForModel(savedGenCfg.model) : "gemini";
        var provider = AI_PROVIDERS[savedGenCfg.provider] ? savedGenCfg.provider : savedModelProvider;
        var model = validAiModel(provider, savedGenCfg.model) ? savedGenCfg.model : AI_PROVIDERS[provider].defaultModel;
        GEN_CFG.provider = provider;
        GEN_CFG.model = model;
        GEN_CFG.fallbackEnabled = savedGenCfg.fallbackEnabled !== false;
        if (savedGenCfg.keys && typeof savedGenCfg.keys === "object") {
            Object.keys(AI_PROVIDERS).forEach(function (keyProvider) {
                if (typeof savedGenCfg.keys[keyProvider] === "string") {
                    GEN_CFG.savedKeys[keyProvider] = savedGenCfg.keys[keyProvider];
                }
            });
        }
        if (savedGenCfg.accountIds && typeof savedGenCfg.accountIds.cloudflare === "string") {
            GEN_CFG.accountIds.cloudflare = savedGenCfg.accountIds.cloudflare;
        }
        if (typeof savedGenCfg.apiKey === "string" && !savedGenCfg.keys) {
            GEN_CFG.savedKeys[provider] = savedGenCfg.apiKey;
        }
        GEN_CFG.keys = Object.assign({}, GEN_CFG.savedKeys);
        GEN_CFG.apiKey = GEN_CFG.keys[provider] || "";
    }
} catch (error) {
    appNotice("A configuração salva da IA está inválida. Configure novamente a chave do provedor escolhido.", true);
}
var AI_USAGE = loadAiUsage();
var TEMAS = ["Delta Lake", "Unity Catalog", "PySpark DataFrames", "Spark SQL", "Workflows e Jobs", "Delta Live Tables", "Auto Loader", "SQL Warehouse e Dashboards", "MLflow", "Arquitetura Medallion", "OPTIMIZE e Z-ORDER", "Qualidade de dados"];

function localDateKey() {
    var now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
}

function loadAiUsage() {
    var today = localDateKey();
    var empty = { date: today, today: 0, total: 0, requests: 0, estimatedRequests: 0, budget: 10000, lastProvider: "", lastModel: "" };
    try {
        var saved = JSON.parse(localStorage.getItem(AI_USAGE_KEY) || "null");
        if (!saved || typeof saved !== "object" || Array.isArray(saved)) return empty;
        empty.total = Number.isFinite(saved.total) && saved.total >= 0 ? Math.floor(saved.total) : 0;
        empty.requests = Number.isFinite(saved.requests) && saved.requests >= 0 ? Math.floor(saved.requests) : 0;
        empty.budget = Number.isFinite(saved.budget) && saved.budget >= 1 ? Math.min(1000000000, Math.floor(saved.budget)) : 10000;
        if (typeof saved.lastProvider === "string" && AI_PROVIDERS[saved.lastProvider]) empty.lastProvider = saved.lastProvider;
        if (typeof saved.lastModel === "string") empty.lastModel = saved.lastModel.slice(0, 120);
        if (saved.date === today) {
            if (Number.isFinite(saved.today) && saved.today >= 0) empty.today = Math.floor(saved.today);
            if (Number.isFinite(saved.estimatedRequests) && saved.estimatedRequests >= 0) empty.estimatedRequests = Math.floor(saved.estimatedRequests);
        }
        return empty;
    } catch (error) {
        appNotice("Não foi possível carregar o histórico local de uso de tokens da IA.", true);
        return empty;
    }
}

function saveAiUsage() {
    AI_USAGE.date = localDateKey();
    try {
        localStorage.setItem(AI_USAGE_KEY, JSON.stringify(AI_USAGE));
        return true;
    } catch (error) {
        appNotice("Não foi possível salvar o uso de tokens da IA neste navegador.", true);
        return false;
    }
}

function formatTokenCount(value) {
    return Math.max(0, Math.floor(value || 0)).toLocaleString("pt-BR");
}

function renderAiUsage() {
    var today = localDateKey();
    if (AI_USAGE.date !== today) {
        AI_USAGE.date = today;
        AI_USAGE.today = 0;
        AI_USAGE.estimatedRequests = 0;
        saveAiUsage();
    }
    var budgetInput = document.getElementById("aiDailyBudget");
    if (budgetInput && document.activeElement !== budgetInput) budgetInput.value = String(AI_USAGE.budget);
    var modelSelect = document.getElementById("aiWidgetModel");
    if (modelSelect && modelSelect.value !== GEN_CFG.model) {
        modelSelect.value = GEN_CFG.model;
        if (modelSelect.selectedIndex < 0) modelSelect.value = modelSelect.options[0].value;
    }
    var used = AI_USAGE.today;
    var budget = AI_USAGE.budget;
    var percent = budget ? Math.round((used / budget) * 100) : 0;
    var remaining = Math.max(0, budget - used);
    var detail = document.getElementById("aiUsageSummary");
    if (detail) detail.textContent = (AI_USAGE.estimatedRequests ? "≈ " : "") + formatTokenCount(used) + " tokens hoje (provedores deste navegador) · " + formatTokenCount(remaining) +
        " restantes da sua meta · " + percent + "% da meta";
    var total = document.getElementById("aiUsageTotal");
    var lastProvider = AI_USAGE.lastProvider || GEN_CFG.provider;
    var lastModel = AI_USAGE.lastModel || GEN_CFG.model;
    if (total) total.textContent = formatTokenCount(AI_USAGE.total) + " tokens acumulados · " + AI_USAGE.requests +
        " chamadas · última: " + aiProviderLabel(lastProvider) + " · " + lastModel;
    var bar = document.getElementById("aiUsageBar");
    if (bar) bar.style.width = Math.min(100, percent) + "%";
    var barTrack = document.getElementById("aiUsageProgress");
    if (barTrack) barTrack.setAttribute("aria-valuenow", String(Math.min(100, percent)));
    var estimate = document.getElementById("aiUsageEstimate");
    if (estimate) estimate.textContent = AI_USAGE.estimatedRequests ?
        AI_USAGE.estimatedRequests + " chamada(s) de hoje foram estimadas; as demais usam a contagem informada pelo provedor quando disponível." :
        "Contagem informada pelo provedor quando disponível; o saldo oficial da sua cota não é exposto à apostila.";
    var providerLink = document.getElementById("aiProviderUsageLink");
    if (providerLink) {
        var usageLinks = {
            openrouter: ["https://openrouter.ai/activity", "Atividade OpenRouter"],
            cloudflare: ["https://dash.cloudflare.com/?to=/:account/ai/workers-ai", "Uso do Cloudflare"],
            groq: ["https://console.groq.com/settings/limits", "Limites da Groq"],
            cohere: ["https://dashboard.cohere.com/usage", "Uso da Cohere"],
            gemini: ["https://ai.google.dev/gemini-api/docs/pricing", "Cotas do Gemini"]
        };
        providerLink.href = usageLinks[GEN_CFG.provider][0];
        providerLink.textContent = usageLinks[GEN_CFG.provider][1];
    }
}

function recordAiUsage(metadata, cfg, body) {
    var inputTokens = metadata && Number.isFinite(metadata.promptTokenCount) ? metadata.promptTokenCount : 0;
    var outputTokens = metadata && Number.isFinite(metadata.candidatesTokenCount) ? metadata.candidatesTokenCount : 0;
    var totalTokens = metadata && Number.isFinite(metadata.totalTokenCount) ? metadata.totalTokenCount : 0;
    var estimated = !(totalTokens > 0);
    if (estimated) {
        var inputText = (cfg.system || "") + cfg.messages.map(function (message) { return message.content || ""; }).join("");
        var outputText = body && Array.isArray(body.candidates) && body.candidates[0] &&
            body.candidates[0].content && Array.isArray(body.candidates[0].content.parts) ?
            body.candidates[0].content.parts.map(function (part) { return part.text || ""; }).join("") : "";
        inputTokens = Math.ceil(inputText.length / 4);
        outputTokens = Math.ceil(outputText.length / 4);
        totalTokens = inputTokens + outputTokens;
        AI_USAGE.estimatedRequests++;
    }
    AI_USAGE.today += totalTokens;
    AI_USAGE.total += totalTokens;
    AI_USAGE.requests++;
    AI_USAGE.lastProvider = cfg.provider || "gemini";
    AI_USAGE.lastModel = body && typeof body.model === "string" ? body.model.slice(0, 120) : cfg.model;
    saveAiUsage();
    renderAiUsage();
}

function saveAiWidgetSettings() {
    var budgetField = document.getElementById("aiDailyBudget");
    var budget = Number(budgetField && budgetField.value);
    if (!Number.isFinite(budget) || budget < 1 || budget > 1000000000) {
        var status = document.getElementById("aiWidgetStatus");
        if (status) status.textContent = "Informe uma meta diária entre 1 e 1.000.000.000 de tokens.";
        return;
    }
    AI_USAGE.budget = Math.floor(budget);
    var modelSelect = document.getElementById("aiWidgetModel");
    var model = modelSelect && modelSelect.value;
    if (model && AI_PROVIDERS[aiProviderForModel(model)]) {
        GEN_CFG.keys[GEN_CFG.provider] = GEN_CFG.apiKey;
        GEN_CFG.model = model;
        GEN_CFG.provider = aiProviderForModel(model);
        GEN_CFG.apiKey = GEN_CFG.keys[GEN_CFG.provider] || "";
    }
    try {
        persistGenConfig();
        saveAiUsage();
        renderAiUsage();
        var statusMessage = document.getElementById("aiWidgetStatus");
        if (statusMessage) statusMessage.textContent = "Meta e provedor atualizados. A meta é pessoal e não representa o limite oficial da conta.";
    } catch (error) {
        appNotice("Não foi possível salvar a meta ou o modelo da IA. A preferência permanece apenas até fechar esta página.", true);
    }
}

function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function gv(id) { return document.getElementById(id).value; }
function gStatus(msg, err) { var s = document.getElementById("gStatus"); s.textContent = msg; s.className = err ? "err" : ""; }
function gSel(id, arr, def) { return '<select id="' + id + '">' + arr.map(function (o) { return '<option' + (o === def ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'; }
function renderGeneratorProviderControls() {
    var provider = GEN_CFG.provider;
    var config = AI_PROVIDERS[provider];
    var model = document.getElementById("gModel");
    var apiLabel = document.getElementById("gApiProviderLabel");
    var keyLink = document.getElementById("gProviderKeyLink");
    var modelHelp = document.getElementById("gModelHelp");
    var accountField = document.getElementById("gAccountIdField");
    var accountInput = document.getElementById("gAccountId");
    if (model) {
        model.innerHTML = config.models.map(function (id) {
            var label = id === "openrouter/free" ? "Roteador de modelos gratuitos (automático)" :
                id === "@cf/meta/llama-3.1-8b-instruct" ? "Llama 3.1 8B · Workers AI" :
                id === "gemini-3.1-flash-lite" ? id + " · econômico" :
                provider === "groq" ? "GPT-OSS 20B · Groq" :
                provider === "cohere" ? "Command R7B · avaliação" : id + " · mais capacidade";
            return '<option value="' + id + '">' + label + '</option>';
        }).join("");
        model.value = GEN_CFG.model;
    }
    if (accountField) accountField.hidden = provider !== "cloudflare";
    if (accountInput && provider === "cloudflare") accountInput.value = GEN_CFG.accountIds.cloudflare || "";
    if (apiLabel) apiLabel.textContent = "Chave da API de " + config.label;
    if (keyLink) {
        keyLink.href = config.keyUrl;
        keyLink.textContent = provider === "openrouter" ? "Criar chave no OpenRouter" :
            provider === "cloudflare" ? "Criar token Workers AI" :
            provider === "groq" ? "Criar chave na Groq" :
            provider === "cohere" ? "Criar chave de avaliação Cohere" : "Criar chave no Google AI Studio";
    }
    if (modelHelp) {
        modelHelp.textContent = provider === "openrouter" ?
            "O roteador escolhe entre modelos que estejam gratuitos e disponíveis. Este site solicita somente openrouter/free; não há troca automática para modelos pagos. Limites e disponibilidade podem mudar." :
            provider === "cloudflare" ?
                "Workers AI inclui 10.000 Neurons grátis por dia no plano Workers Free (reinicia às 00:00 UTC). No plano pago, o uso acima da franquia pode ser cobrado; não habilite o plano pago se não quiser cobrança." :
            provider === "groq" ?
                "A Groq oferece acesso gratuito com limites de requisições/tokens por modelo; confira sua página Limits. A disponibilidade e os modelos do plano gratuito podem mudar." :
            provider === "cohere" ?
                "Chaves Trial da Cohere são gratuitas para avaliação e limitadas a 1.000 chamadas por mês e 20 por minuto para Chat; não são ilimitadas." :
            "A disponibilidade da cota gratuita depende da conta. Flash-Lite tende a ser econômico; confira os modelos, preços e limites atuais do Google.";
    }
}
function renderConnectedAiProviders() {
    var status = document.getElementById("gConnectedProviders");
    if (!status) return;
    var connected = Object.keys(AI_PROVIDERS).filter(function (provider) {
        return Boolean(GEN_CFG.keys[provider]) &&
            (provider !== "cloudflare" || /^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare));
    });
    status.textContent = connected.length ?
        "Provedores conectados: " + connected.map(aiProviderLabel).join(", ") + ". Principal: " + aiProviderLabel(GEN_CFG.provider) + "." :
        "Nenhum provedor configurado ainda.";
}
function notifyAiFallback(fromProvider, toProvider) {
    var message = aiProviderLabel(fromProvider) + " atingiu um limite ou está indisponível; tentando " + aiProviderLabel(toProvider) + ".";
    appNotice(message);
    ["gStatus", "aiWidgetStatus", "aiChatStatus"].forEach(function (id) {
        var status = document.getElementById(id);
        if (status && (id !== "gStatus" || document.getElementById("genModal").classList.contains("open"))) {
            status.textContent = message;
        }
    });
}

function closeTutorWidget() {
    var panel = document.getElementById("aiTutorPanel");
    if (panel) {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
    }
    var launcher = document.getElementById("aiTutorLauncher");
    if (launcher) launcher.setAttribute("aria-expanded", "false");
}

function initializeAiToolsMenu() {
    var button = document.getElementById("aiToolsMenuBtn");
    var menu = document.getElementById("aiToolsMenu");
    var mobileButton = document.getElementById("mobileAiButton");
    if (!button || !menu) return;
    function setOpen(open) {
        menu.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        if (mobileButton) mobileButton.setAttribute("aria-expanded", String(open));
    }
    button.addEventListener("click", function () { setOpen(menu.hidden); });
    if (mobileButton) mobileButton.addEventListener("click", function () { button.click(); });
    menu.addEventListener("click", function (event) {
        var action = event.target.closest("[data-ai-menu-action]");
        if (!action) return;
        setOpen(false);
        if (action.getAttribute("data-ai-menu-action") === "tutor") openTutor();
        else openGen();
    });
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".ai-tools-container, #mobileAiButton")) setOpen(false);
    });
    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !menu.hidden) {
            setOpen(false);
            button.focus();
        }
    });
}

function initializeMobileNavigation() {
    var lessonsButton = document.getElementById("mobileLessonsButton");
    if (lessonsButton) {
        lessonsButton.addEventListener("click", function () {
            var aiButton = document.getElementById("aiToolsMenuBtn");
            if (aiButton && aiButton.getAttribute("aria-expanded") === "true") aiButton.click();
            setMenu(!document.getElementById("dropdownPanel").classList.contains("open"));
        });
    }

    var mobileStyle = document.createElement("style");
    mobileStyle.textContent = `
        .mobile-navigation, .mobile-home-card { display: none; }
        @media (max-width: 700px) {
            html, body { overflow-x: clip; }
            header {
                height: 60px;
                min-height: 60px;
                flex-wrap: nowrap;
                gap: 8px;
                padding: 8px 14px;
                backdrop-filter: none;
            }
            .header-left { flex: 1 1 auto; min-width: 0; }
            .logo { min-width: 0; gap: 8px; font-size: 15px; }
            #headerBrandName { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .menu-container { position: static; }
            #menuDropdownBtn, #aiToolsMenuBtn, .header-right > a { display: none; }
            .header-right { flex: 0 0 auto; gap: 0; flex-wrap: nowrap; }
            .ai-tools-container { position: static; }
            #th { min-width: 44px; min-height: 44px; padding: 8px; font-size: 18px; }
            .mobile-navigation {
                position: fixed;
                inset: auto 0 0;
                z-index: 400;
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                min-height: 62px;
                padding: 5px 8px calc(5px + env(safe-area-inset-bottom));
                border-top: 1px solid var(--border);
                background: color-mix(in srgb, var(--surface) 96%, transparent);
                backdrop-filter: blur(18px);
            }
            .mobile-navigation a, .mobile-navigation button {
                display: flex;
                min-width: 0;
                min-height: 48px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
                border: 0;
                border-radius: 12px;
                background: transparent;
                color: var(--muted);
                font: 600 11px/1.2 var(--font-family);
                text-decoration: none;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
            .mobile-navigation a:active, .mobile-navigation button:active,
            .mobile-navigation a:focus-visible, .mobile-navigation button:focus-visible {
                background: color-mix(in srgb, var(--primary) 12%, transparent);
                color: var(--primary);
                outline: none;
            }
            .mobile-navigation button[aria-expanded="true"] { background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); }
            .mobile-navigation a span:first-child, .mobile-navigation button span:first-child {
                font-size: 19px;
                line-height: 1;
            }
            .wrap { padding: 8px 12px calc(78px + env(safe-area-inset-bottom)); }
            main { min-width: 0; padding: 20px 2px 24px; }
            main h1 { font-size: clamp(28px, 7vw, 36px); line-height: 1.15; overflow-wrap: anywhere; }
            main h2 { font-size: 21px; line-height: 1.25; }
            main h3 { font-size: 17px; }
            main p, main li { overflow-wrap: anywhere; }
            .meta { margin-bottom: 16px; }
            .cell, .q { margin: 14px 0; padding: 16px; border-radius: 16px; }
            .cell:hover, .q:hover { transform: none; }
            .mobile-home-card {
                display: grid;
                gap: 10px;
                margin: 16px 0 22px;
                padding: 16px;
                border: 1px solid var(--border);
                border-radius: 16px;
                background: var(--card);
                box-shadow: var(--shadow);
            }
            .mobile-home-card strong { font-size: 16px; }
            .mobile-home-card small, .mobile-home-card p { margin: 0; color: var(--muted); font-size: 13px; }
            .mobile-progress-bar { height: 9px; overflow: hidden; border-radius: 999px; background: var(--border); }
            .mobile-progress-bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--primary), var(--primary-light)); }
            .mobile-home-card .start-btn { min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; }
            .home-stats, .activity-dashboard, .home-ai-promo, .desktop-home-actions { display: none !important; }
            .home-grid { grid-template-columns: minmax(0, 1fr); gap: 12px; }
            .home-grid > .cell { margin: 0; padding: 15px; }
            .lesson-link { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 4px; }
            .o { min-height: 48px; padding: 13px; touch-action: manipulation; }
            .cf, .ib, .btn-header, .tab-btn, .reset-btn { min-height: 44px; }
            .pn { gap: 10px; margin-top: 26px; }
            .pn a { min-width: 0; flex: 1 1 0; padding: 11px 8px; text-align: center; overflow-wrap: anywhere; }
            .admin-tabs { flex-wrap: nowrap; overflow-x: auto; overscroll-behavior-x: contain; padding: 0 0 8px; scroll-snap-type: x proximity; }
            .tab-btn { flex: 0 0 auto; padding: 10px 14px; scroll-snap-align: start; }
            .ggrid { grid-template-columns: minmax(0, 1fr); }
            .res { align-items: stretch; }
            .res > select { flex: 1 1 100%; }
            .dropdown-panel {
                position: fixed;
                top: auto;
                right: 10px;
                bottom: calc(70px + env(safe-area-inset-bottom));
                left: 10px;
                width: auto;
                max-width: none;
                max-height: min(65dvh, 520px);
                padding: 14px;
                transform: translateY(12px);
            }
            .dropdown-panel.open { transform: translateY(0); }
            .dropdown-grid { grid-template-columns: minmax(0, 1fr); gap: 8px; }
            .dropdown-section h4 { margin-top: 6px; }
            .dropdown-section a { min-height: 42px; display: flex; align-items: center; }
            .ai-tools-menu {
                position: fixed;
                top: auto;
                right: 12px;
                bottom: calc(70px + env(safe-area-inset-bottom));
                z-index: 450;
                min-width: 190px;
                box-shadow: 0 12px 32px rgba(0,0,0,.32);
            }
            #aiTutorLauncher { display: none; }
            #aiTutorPanel {
                left: 8px !important;
                right: 8px !important;
                width: auto !important;
                height: auto !important;
                min-width: 0 !important;
                min-height: 0 !important;
                top: calc(var(--header-h) + 8px);
                bottom: calc(70px + env(safe-area-inset-bottom));
                max-height: calc(100dvh - var(--header-h) - 88px);
                resize: none !important;
            }
            #aiTutorDragHandle { cursor: default; touch-action: auto; }
            .ai-widget-compose .ai-chat-form { flex-direction: row; align-items: stretch; }
            .ai-widget-compose .ai-chat-form textarea { flex: 1 1 auto; min-width: 0; min-height: 54px; resize: none; }
            .ai-widget-compose .ai-chat-form button { flex: 0 0 auto; min-width: 64px; align-self: stretch; }
            #layoutModeToggle { display: none !important; }
            body::before, .mouse-fx, .mouse-follower { display: none !important; }
            input, textarea, select { font-size: 16px; }
            #genModal { padding: 10px 8px calc(12px + env(safe-area-inset-bottom)); }
            #genModal .gbox { width: 100%; padding: 16px; }
            .settings-group-body { padding-right: 12px; padding-left: 12px; }
        }
    `;
    document.head.appendChild(mobileStyle);
}

var AI_PROFILE_KEY = "databricksAcademyUserProfile";
var AI_USER_PROFILE = (function () {
    try { return JSON.parse(localStorage.getItem(AI_PROFILE_KEY) || '{"name":"","photo":""}'); }
    catch (error) { return { name: "", photo: "" }; }
})();
function renderHeaderAiProfile() {
    var button = document.getElementById("siteProfileButton");
    var avatar = document.getElementById("siteProfileAvatar");
    var label = document.getElementById("siteProfileName");
    var name = (AI_USER_PROFILE.name || "Meu perfil").trim();
    if (button) button.setAttribute("aria-label", "Perfil: " + name + ". Abrir configurações do perfil");
    if (label) label.textContent = name;
    if (avatar) {
        if (AI_USER_PROFILE.photo) {
            avatar.src = AI_USER_PROFILE.photo;
            avatar.hidden = false;
            avatar.textContent = "";
        } else {
            avatar.removeAttribute("src");
            avatar.hidden = true;
            var fallback = document.getElementById("siteProfileInitial");
            if (fallback) fallback.textContent = name && name !== "Meu perfil" ? name.charAt(0).toLocaleUpperCase("pt-BR") : "👤";
        }
    }
}
function initializeAiProfile() {
    var name = document.getElementById("aiProfileName");
    var preview = document.getElementById("aiProfilePreview");
    if (name) name.value = AI_USER_PROFILE.name || "";
    if (preview && AI_USER_PROFILE.photo) { preview.src = AI_USER_PROFILE.photo; preview.hidden = false; }
    renderHeaderAiProfile();
}
function previewAiProfilePhoto(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type) || file.size > 2 * 1024 * 1024) {
        appNotice("Escolha uma imagem de até 2 MB.", true); event.target.value = ""; return;
    }
    var reader = new FileReader();
    reader.onload = function () {
        var preview = document.getElementById("aiProfilePreview");
        preview.src = reader.result; preview.hidden = false;
        AI_USER_PROFILE.photo = reader.result;
    };
    reader.readAsDataURL(file);
}
function saveAiProfile() {
    AI_USER_PROFILE.name = (document.getElementById("aiProfileName").value || "").trim().slice(0, 40);
    try {
        localStorage.setItem(AI_PROFILE_KEY, JSON.stringify(AI_USER_PROFILE));
        renderHeaderAiProfile();
        var menu = document.getElementById("siteProfileMenu");
        if (menu) menu.hidden = true;
        var button = document.getElementById("siteProfileButton");
        if (button) button.setAttribute("aria-expanded", "false");
        appNotice(AI_USER_PROFILE.name ? "Perfil salvo. O Datrics usará seu nome nas próximas respostas." : "Perfil salvo.");
    } catch (error) { appNotice("Não foi possível salvar a foto. Use uma imagem menor.", true); }
}
function initializeHeaderProfile() {
    var headerRight = document.querySelector("header .header-right");
    if (!headerRight || document.getElementById("siteProfileControl")) return;
    var control = document.createElement("div");
    control.id = "siteProfileControl";
    control.className = "site-profile-control";
    control.innerHTML = '<button type="button" id="siteProfileButton" class="site-profile-button" aria-controls="siteProfileMenu" aria-expanded="false"><span class="site-profile-avatar-wrap"><img id="siteProfileAvatar" alt="" hidden><span id="siteProfileInitial">👤</span></span><span id="siteProfileName">Meu perfil</span><span class="site-profile-chevron" aria-hidden="true">▾</span></button>' +
        '<div id="siteProfileMenu" class="site-profile-menu" hidden><strong>Seu perfil</strong><label for="aiProfileName">Como devemos chamar você?</label><input id="aiProfileName" type="text" maxlength="40" placeholder="Seu nome"><label for="aiProfilePhoto">Foto de perfil</label><input id="aiProfilePhoto" type="file" accept="image/*"><img id="aiProfilePreview" alt="Prévia da foto" hidden><div class="site-profile-actions"><button type="button" class="btn-header" id="aiProfileSave">Salvar perfil</button></div><p class="meta">Salvo somente neste navegador.</p></div>';
    var themeButton = document.getElementById("th");
    headerRight.insertBefore(control, themeButton || null);
    document.getElementById("siteProfileButton").addEventListener("click", function () {
        var menu = document.getElementById("siteProfileMenu");
        var opening = menu.hidden;
        menu.hidden = !opening;
        this.setAttribute("aria-expanded", String(opening));
        if (opening) document.getElementById("aiProfileName").focus();
    });
    document.addEventListener("click", function (event) {
        if (!event.target.closest("#siteProfileControl")) {
            var menu = document.getElementById("siteProfileMenu");
            var button = document.getElementById("siteProfileButton");
            if (menu) menu.hidden = true;
            if (button) button.setAttribute("aria-expanded", "false");
        }
    });
    document.getElementById("aiProfileSave").addEventListener("click", saveAiProfile);
    document.getElementById("aiProfilePhoto").addEventListener("change", previewAiProfilePhoto);
}
function initializeAiTutorWidget() {
    var launcher = document.createElement("button");
    launcher.type = "button";
    launcher.id = "aiTutorLauncher";
    launcher.textContent = "💬 Datrics";
    launcher.setAttribute("aria-controls", "aiTutorPanel");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Abrir Datrics");
    launcher.addEventListener("click", openTutor);

    var panel = document.createElement("section");
    panel.id = "aiTutorPanel";
    panel.setAttribute("aria-label", "Datrics");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
        '<div class="ai-widget-head"><div class="ai-widget-drag-handle" id="aiTutorDragHandle" title="Arraste para mudar a posição">🤖 Datrics</div>' +
        '<button type="button" id="aiTutorMinimize" aria-label="Minimizar Datrics" title="Minimizar">−</button><button type="button" id="aiTutorClose" aria-label="Fechar Datrics" title="Fechar">✕</button></div>' +
        '<div class="ai-widget-body"><p id="aiTutorContextLabel" class="meta"></p><div id="aiWidgetMessages" class="ai-messages" role="log" aria-live="polite"></div><div id="aiWidgetPendingActions" class="ai-pending-actions" hidden></div><p id="aiWidgetStatus" class="meta" data-tutor-status role="status"></p>' +
        '<div class="ai-widget-compose"><form id="aiWidgetChatForm" class="ai-chat-form"><label class="sr-only" for="aiWidgetChatInput">Sua dúvida para o Datrics</label><textarea id="aiWidgetChatInput" maxlength="1200" placeholder="Escreva sua dúvida sobre a apostila..." required></textarea><button type="submit" class="cf btn-ai" data-tutor-send aria-label="Enviar pergunta">Enviar</button></form>' +
        '<div class="ai-chat-actions"><button type="button" class="btn-header" data-tutor-clear>Limpar conversa</button><button type="button" class="btn-header" id="aiWidgetConfigure">Configurar IA</button><a class="btn-header" href="#ia-study">Tutorial</a></div></div></div>';
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    document.getElementById("aiWidgetChatForm").addEventListener("submit", sendTutorMessage);
    initializeHeaderProfile();
    initializeAiProfile();
    document.getElementById("aiWidgetConfigure").addEventListener("click", function () {
        closeTutorWidget();
        openGen();
    });
    document.getElementById("aiTutorClose").addEventListener("click", closeTutorWidget);
    document.getElementById("aiTutorMinimize").addEventListener("click", closeTutorWidget);
    Array.prototype.forEach.call(document.querySelectorAll("[data-tutor-clear]"), function (button) {
        button.addEventListener("click", clearTutorHistory);
    });
    panel.querySelector('a[href="#ia-study"]').addEventListener("click", closeTutorWidget);

    var savedPosition;
    try { savedPosition = JSON.parse(localStorage.getItem(AI_WIDGET_POSITION_KEY) || "null"); }
    catch (error) { appNotice("A posição salva do Datrics está inválida; será usada a posição padrão.", true); }
    function minimumWidgetTop() {
        return document.querySelector("header").getBoundingClientRect().bottom + 8;
    }
    if (savedPosition && Number.isFinite(savedPosition.left) && Number.isFinite(savedPosition.top)) {
        var savedPanelWidth = Math.min(440, window.innerWidth - 24);
        panel.style.left = Math.max(8, Math.min(window.innerWidth - savedPanelWidth - 8, savedPosition.left)) + "px";
        panel.style.top = Math.max(minimumWidgetTop(), Math.min(window.innerHeight - 20, savedPosition.top)) + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
    } else {
        panel.style.top = minimumWidgetTop() + "px";
    }
    var dragHandle = document.getElementById("aiTutorDragHandle");
    var dragState = null;
    dragHandle.addEventListener("pointerdown", function (event) {
        if (window.matchMedia("(max-width: 700px)").matches) return;
        if (event.button !== 0) return;
        var rect = panel.getBoundingClientRect();
        panel.style.left = rect.left + "px";
        panel.style.top = rect.top + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
        dragState = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
        dragHandle.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    dragHandle.addEventListener("pointermove", function (event) {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        var rect = panel.getBoundingClientRect();
        panel.style.left = Math.max(8, Math.min(window.innerWidth - rect.width - 8, event.clientX - dragState.offsetX)) + "px";
        var minTop = minimumWidgetTop();
        var mobileNav = document.getElementById("mobileNavigation");
        var navHeight = mobileNav && window.getComputedStyle(mobileNav).display !== "none" ? mobileNav.getBoundingClientRect().height : 0;
        panel.style.top = Math.max(minTop, Math.min(window.innerHeight - rect.height - navHeight - 8, event.clientY - dragState.offsetY)) + "px";
    });
    dragHandle.addEventListener("pointerup", function (event) {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        dragState = null;
        var rect = panel.getBoundingClientRect();
        try { localStorage.setItem(AI_WIDGET_POSITION_KEY, JSON.stringify({ left: Math.round(rect.left), top: Math.round(rect.top) })); }
        catch (error) { appNotice("Não foi possível salvar a posição do Datrics; ela permanecerá nesta posição até fechar a página.", true); }
    });
    dragHandle.addEventListener("pointercancel", function () { dragState = null; });
    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && panel.classList.contains("open")) closeTutorWidget();
    });
    window.addEventListener("resize", function () {
        if (!panel.style.left) {
            panel.style.top = minimumWidgetTop() + "px";
        }
        fitTutorWidget();
    });
    renderTutorMessages();
    renderTutorContextLabel();
    renderAiUsage();
}

/* ---------- Painel do gerador ---------- */
function closeGenModal() {
    var modal = document.getElementById("genModal");
    if (modal) modal.classList.remove("open");
    var launcher = document.getElementById("aiTutorLauncher");
    if (launcher) launcher.hidden = false;
}

function openGen() {
    var m = document.getElementById("genModal");
    if (!m) {
        m = document.createElement("div");
        m.id = "genModal";
        m.innerHTML =
            '<div class="gbox"><div class="ghead"><h2 style="margin:0">🤖 Gerador de Questões com IA</h2><button type="button" class="btn-header" id="gClose" aria-label="Fechar gerador">✕</button></div>' +
            '<p class="meta" style="margin:8px 0 0">Escolha um provedor para estudar os assuntos desta apostila. Cada opção usa sua própria chave e seus limites; não existe cota grátis ilimitada.</p>' +
            '<div class="ggrid">' +
            '<div class="gfull"><label class="field-label" for="gProvider">Provedor principal / chave em edição</label><select id="gProvider"><option value="groq">Groq · padrão recomendado</option><option value="gemini">Google Gemini</option><option value="cloudflare">Cloudflare Workers AI · cota diária grátis</option><option value="openrouter">OpenRouter Free · roteador gratuito</option><option value="cohere">Cohere Trial · até 1.000 chamadas/mês</option></select><p class="meta">Conecte um por vez: escolha o provedor, informe a chave e salve. Depois, selecione qual será o principal.</p></div>' +
            '<div class="gfull"><label class="field-label" for="gTema">Tema</label><input id="gTema" placeholder="Ex.: MERGE em Delta Lake, Auto Loader, permissões no Unity Catalog..."><details class="g-suggestions"><summary>Ver sugestões de temas</summary><div class="chips" id="gChips"></div></details></div>' +
            '<div class="gfull"><label class="field-label" for="gQtd">Quantidade de questões (1–25)</label><input id="gQtd" type="number" min="1" max="25" value="5"><p class="meta">Limite de 25 por solicitação. Tipos mistos alternam questões conceituais e desafios de código. A geração pode demorar ou parar se o provedor atingir o limite. As questões concluídas são preservadas.</p></div>' +
            '<details class="gfull generator-options"><summary>Opções avançadas (dificuldade, tipo e linguagem)</summary><div class="ggrid">' +
            '<div><label class="field-label">Dificuldade</label>' + gSel("gDif", ["Fácil", "Médio", "Difícil", "Misto"], "Médio") + '</div>' +
            '<div><label class="field-label">Tipo de questão</label>' + gSel("gTipo", ["Conceitual", "Código (SQL/PySpark)", "Prática de código (IDE)", "Cenário prático", "Misto"], "Misto") + '</div>' +
            '<div><label class="field-label">Linguagem do código</label>' + gSel("gLing", ["SQL", "PySpark", "Python", "Misto"], "Misto") + '</div>' +
            '<div class="gfull"><label class="meta"><input id="gStudyCards" type="checkbox" checked> Criar cards explicativos para estudar antes das questões</label><p class="meta">A IA prepara pequenos cards com conceitos, explicações e exemplos antes dos exercícios.</p></div>' +
            '<div class="gfull"><label class="field-label">Instruções extras (opcional)</label><textarea id="gExtra" rows="2" placeholder="Ex.: use dados de vendas; foque em erros comuns..."></textarea></div></div></details>' +
            '<div class="gfull api-key-panel"><span class="lv">CONFIGURAR PROVEDOR</span><label class="field-label" id="gApiProviderLabel" for="gApi">Chave da API</label><input id="gApi" type="password" autocomplete="off" placeholder="Cole sua chave/token aqui"><div id="gAccountIdField" hidden><label class="field-label" for="gAccountId">Cloudflare Account ID</label><input id="gAccountId" type="text" autocomplete="off" placeholder="32 caracteres (copiados do painel Cloudflare)"></div><p class="meta api-key-help"><label><input id="gRememberKey" type="checkbox"> Lembrar a chave neste navegador</label></p><p class="meta api-key-help">A chave/token fica disponível neste dispositivo. Não a compartilhe nem use em computadores públicos. <a id="gProviderKeyLink" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Criar chave</a> · <a href="#ia-study">Tutorial e privacidade</a>.</p></div>' +
            '<div class="gfull api-key-panel"><label class="field-label"><input id="gFallbackEnabled" type="checkbox" checked> Usar automaticamente outro provedor conectado se este falhar</label><p class="meta api-key-help">Tenta outro provedor configurado em limite, indisponibilidade temporária ou resposta truncada. A mesma pergunta e o histórico podem ser enviados ao próximo serviço. Desmarque para manter tudo no provedor principal.</p><p class="meta api-key-help" id="gConnectedProviders"></p></div>' +
            '<details class="gfull model-details"><summary>Modelo e informações de uso</summary><div class="settings-group-body"><label class="field-label" for="gModel">Modelo</label><select id="gModel"></select><p class="meta" id="gModelHelp" style="margin:6px 0"></p></div></details>' +
            '</div><div class="home-actions"><button type="button" id="gGo" class="cf btn-ai">✨ Gerar questões</button><button type="button" id="gSave" class="cf btn-secundario">Salvar configuração</button></div><div id="gStatus" role="status" aria-live="polite"></div></div>';
        document.body.appendChild(m);
        var ch = document.getElementById("gChips");
        TEMAS.forEach(function (t) {
            var c = document.createElement("span"); c.className = "chip"; c.textContent = t;
            c.onclick = function () { document.getElementById("gTema").value = t; };
            ch.appendChild(c);
        });
        document.getElementById("gClose").onclick = closeGenModal;
        m.querySelector('a[href="#ia-study"]').addEventListener("click", closeGenModal);
        m.addEventListener("mousedown", function (e) { if (e.target === m) closeGenModal(); });
        document.getElementById("gGo").onclick = runGen;
        document.getElementById("gProvider").addEventListener("change", function () {
            GEN_CFG.keys[GEN_CFG.provider] = document.getElementById("gApi").value.trim();
            if (GEN_CFG.provider === "cloudflare") GEN_CFG.accountIds.cloudflare = document.getElementById("gAccountId").value.trim();
            GEN_CFG.provider = this.value;
            GEN_CFG.model = AI_PROVIDERS[GEN_CFG.provider].defaultModel;
            GEN_CFG.apiKey = GEN_CFG.keys[GEN_CFG.provider] || "";
            renderGeneratorProviderControls();
            document.getElementById("gApi").value = GEN_CFG.apiKey;
            document.getElementById("gRememberKey").checked = Boolean(GEN_CFG.savedKeys[GEN_CFG.provider]);
            document.getElementById("gFallbackEnabled").checked = GEN_CFG.fallbackEnabled;
            renderConnectedAiProviders();
        });
        document.getElementById("gSave").onclick = function () {
            if (saveGenSettings()) {
                gStatus("Configuração pronta. Você já pode usar o gerador e o Datrics.");
            }
        };
    }
    document.getElementById("gProvider").value = GEN_CFG.provider;
    renderGeneratorProviderControls();
    document.getElementById("gApi").value = GEN_CFG.apiKey || "";
    document.getElementById("gRememberKey").checked = Boolean(GEN_CFG.savedKeys[GEN_CFG.provider]);
    document.getElementById("gFallbackEnabled").checked = GEN_CFG.fallbackEnabled;
    renderConnectedAiProviders();
    m.classList.add("open");
    var launcher = document.getElementById("aiTutorLauncher");
    if (launcher) launcher.hidden = true;
}

/* Substitui o gerador antigo (que só sorteava questões prontas) */
function gerarQuestaoComIA() { openGen(); }

function saveGenSettings() {
    var key = gv("gApi").trim();
    var provider = gv("gProvider");
    var model = gv("gModel");
    if (!AI_PROVIDERS[provider] || !validAiModel(provider, model)) {
        gStatus("Selecione um provedor e modelo válidos.", true);
        return false;
    }
    if (!key) {
        gStatus("Cole sua chave da API de " + aiProviderLabel(provider) + " antes de salvar a configuração.", true);
        return false;
    }
    if (provider === "openrouter" && !validOpenRouterKey(key)) {
        gStatus("Essa chave não parece ser do OpenRouter. Use uma chave no formato sk-or-v1-… criada em openrouter.ai/keys; a chave do Google não serve aqui.", true);
        return false;
    }
    var accountId = provider === "cloudflare" ? gv("gAccountId").trim() : "";
    if (provider === "cloudflare" && !/^[a-f0-9]{32}$/i.test(accountId)) {
        gStatus("Informe o Cloudflare Account ID de 32 caracteres copiado do painel Workers AI.", true);
        return false;
    }
    GEN_CFG.provider = provider;
    GEN_CFG.model = model;
    GEN_CFG.apiKey = key;
    GEN_CFG.keys[provider] = key;
    if (provider === "cloudflare") GEN_CFG.accountIds.cloudflare = accountId;
    GEN_CFG.fallbackEnabled = document.getElementById("gFallbackEnabled").checked;
    try {
        saveGenConfig(document.getElementById("gRememberKey").checked);
        renderAiUsage();
        renderConnectedAiProviders();
        return true;
    } catch (error) {
        if (!document.getElementById("gRememberKey").checked) {
            gStatus("A configuração não pôde ser salva, mas a chave ficará disponível nesta sessão.");
            return true;
        }
        gStatus("A configuração não pôde ser salva neste navegador. Desmarque “Lembrar a chave” para usá-la apenas nesta sessão.", true);
        return false;
    }
}

/* ---------- Cache local de respostas (economiza tokens em pedidos idênticos) ---------- */
var AI_CACHE_KEY = "apostilaAiCache";
var AI_CACHE_LIMIT = 30;
var AI_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
function aiCacheHash(text) {
    var h1 = 5381, h2 = 52711;
    for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        h1 = ((h1 * 33) ^ code) >>> 0;
        h2 = ((h2 * 31) ^ code) >>> 0;
    }
    return h1.toString(36) + h2.toString(36) + text.length.toString(36);
}
function aiCacheRead() {
    try {
        var data = JSON.parse(localStorage.getItem(AI_CACHE_KEY) || "{}");
        return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch (error) { return {}; }
}
function aiCacheGet(key) {
    var entry = aiCacheRead()[key];
    return entry && typeof entry.a === "string" && Date.now() - entry.t < AI_CACHE_TTL ? entry.a : null;
}
function aiCachePut(key, answer) {
    if (typeof answer !== "string" || answer.length > 6000) return;
    try {
        var data = aiCacheRead();
        data[key] = { a: answer, t: Date.now() };
        var keys = Object.keys(data);
        if (keys.length > AI_CACHE_LIMIT) {
            keys.sort(function (x, y) { return data[x].t - data[y].t; })
                .slice(0, keys.length - AI_CACHE_LIMIT).forEach(function (old) { delete data[old]; });
        }
        localStorage.setItem(AI_CACHE_KEY, JSON.stringify(data));
    } catch (error) { /* cache é opcional */ }
}
async function requestStudyAi(cfg) {
    if (!cfg.cache) return requestStudyAiUncached(cfg);
    var key = aiCacheHash(JSON.stringify([cfg.system, cfg.messages, cfg.max_tokens, cfg.responseMimeType || ""]));
    var hit = aiCacheGet(key);
    if (hit !== null) return hit;
    var answer = await requestStudyAiUncached(cfg);
    aiCachePut(key, answer);
    return answer;
}
/* Resposta cortada pelo limite de tokens: em JSON devolve o texto parcial (o validador aproveita os itens completos);
   em texto livre devolve o que veio, marcado com reticências. */
function aiTruncated(answer, cfg) {
    return cfg.responseMimeType === "application/json" ? answer : String(answer).replace(/\s+$/, "") + " …";
}

async function requestStudyAiUncached(cfg) {
    var preferred = cfg.provider || GEN_CFG.provider;
    if (!AI_PROVIDERS[preferred]) throw new Error("O provedor de IA selecionado não é válido.");
    var primaryKey = GEN_CFG.keys[preferred] || (preferred === GEN_CFG.provider ? GEN_CFG.apiKey : "") || cfg.key;
    if (!primaryKey && GEN_CFG.fallbackEnabled) {
        var automaticOrder = ["groq", "gemini", "cloudflare", "openrouter", "cohere"];
        var available = automaticOrder.find(function (candidate) {
            return Boolean(GEN_CFG.keys[candidate] || GEN_CFG.savedKeys[candidate]) &&
                (candidate !== "cloudflare" || /^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare));
        });
        if (available) {
            preferred = available;
            primaryKey = GEN_CFG.keys[available] || GEN_CFG.savedKeys[available];
            cfg.provider = preferred;
            cfg.model = AI_PROVIDERS[preferred].defaultModel;
        }
    }
    if (!primaryKey) throw new Error("Nenhuma API configurada. Cadastre uma chave em Uso da IA → Chave da API.");
    if (preferred === "cloudflare" && !/^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare)) {
        throw new Error("Configure o Cloudflare Account ID antes de usar Workers AI.");
    }

    var candidates = [preferred];
    if (GEN_CFG.fallbackEnabled) {
        ["groq", "gemini", "cloudflare", "openrouter", "cohere"].forEach(function (provider) {
            if (provider === preferred || !(GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider])) return;
            if (provider === "cloudflare" && !/^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare)) return;
            if (AI_PROVIDER_COOLDOWNS[provider] > Date.now()) return;
            candidates.push(provider);
        });
    }

    for (var i = 0; i < candidates.length; i++) {
        var provider = candidates[i];
        var attempt = Object.assign({}, cfg, {
            provider: provider,
            key: provider === preferred ? primaryKey : (GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider]),
            model: provider === preferred ? cfg.model : AI_PROVIDERS[provider].defaultModel,
            accountId: provider === "cloudflare" ? GEN_CFG.accountIds.cloudflare : ""
        });
        try {
            var answer = await requestStudyAiForProvider(attempt);
            if (typeof cfg.validateResponse === "function") {
                try {
                    cfg.validateResponse(answer);
                } catch (validationError) {
                    validationError.aiRetryable = true;
                    throw validationError;
                }
            }
            if (i > 0) {
                var previousPrimary = GEN_CFG.provider;
                GEN_CFG.provider = provider;
                GEN_CFG.model = attempt.model;
                GEN_CFG.apiKey = attempt.key;
                cfg.provider = provider;
                cfg.model = attempt.model;
                cfg.key = attempt.key;
                if (GEN_CFG.savedKeys[provider]) {
                    try {
                        persistGenConfig();
                    } catch (error) {
                        appNotice("A troca para " + aiProviderLabel(provider) + " funcionou, mas não foi possível salvar o novo provedor principal neste navegador.", true);
                    }
                }
                renderAiUsage();
                renderConnectedAiProviders();
                var providerSelect = document.getElementById("gProvider");
                if (providerSelect) {
                    providerSelect.value = provider;
                    renderGeneratorProviderControls();
                    document.getElementById("gApi").value = attempt.key;
                    document.getElementById("gRememberKey").checked = Boolean(GEN_CFG.savedKeys[provider]);
                }
                appNotice("Troquei automaticamente de " + aiProviderLabel(previousPrimary) + " para " + aiProviderLabel(provider) + " para concluir o pedido.");
            }
            return answer;
        } catch (error) {
            var canFallback = error.aiQuotaExceeded || error.aiRetryable;
            if (!canFallback || !GEN_CFG.fallbackEnabled || i === candidates.length - 1) {
                if (canFallback && i > 0) {
                    throw new Error("Os provedores configurados não conseguiram concluir o pedido. Último erro: " + error.message);
                }
                throw error;
            }
            AI_PROVIDER_COOLDOWNS[provider] = Date.now() + (error.aiQuotaExceeded ? 10 : 2) * 60 * 1000;
            notifyAiFallback(provider, candidates[i + 1]);
        }
    }
}

async function requestStudyAiForProvider(cfg) {
    var provider = cfg.provider || "gemini";
    if (!AI_PROVIDERS[provider]) throw new Error("O provedor de IA selecionado não é válido.");
    var response, controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeout = controller ? window.setTimeout(function () { controller.abort(); }, 60000) : 0;
    try {
        if (provider === "openrouter" || provider === "cloudflare" || provider === "groq") {
            var openRouterMessages = [{ role: "system", content: cfg.system }].concat(cfg.messages.map(function (message) {
                return { role: message.role === "assistant" ? "assistant" : "user", content: message.content };
            }));
            var openRouterBody = {
                model: provider === "openrouter" ? "openrouter/free" : cfg.model,
                messages: openRouterMessages,
                max_tokens: cfg.max_tokens,
                temperature: cfg.temperature == null ? 0.3 : cfg.temperature
            };
            if (provider === "openrouter" && cfg.responseMimeType === "application/json") openRouterBody.response_format = { type: "json_object" };
            var endpoint = provider === "openrouter" ? "https://openrouter.ai/api/v1/chat/completions" :
                provider === "cloudflare" ?
                    "https://api.cloudflare.com/client/v4/accounts/" + encodeURIComponent(cfg.accountId) + "/ai/v1/chat/completions" :
                    "https://api.groq.com/openai/v1/chat/completions";
            response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + cfg.key
                },
                signal: controller ? controller.signal : undefined,
                body: JSON.stringify(openRouterBody)
            });
        } else if (provider === "cohere") {
            var cohereMessages = [{ role: "system", content: cfg.system }].concat(cfg.messages.map(function (message) {
                return { role: message.role === "assistant" ? "assistant" : "user", content: message.content };
            }));
            response = await fetch("https://api.cohere.com/v2/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + cfg.key
                },
                signal: controller ? controller.signal : undefined,
                body: JSON.stringify({
                    model: cfg.model,
                    messages: cohereMessages,
                    max_tokens: cfg.max_tokens,
                    temperature: cfg.temperature == null ? 0.3 : cfg.temperature
                })
            });
        } else {
            response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" +
                encodeURIComponent(cfg.model) + ":generateContent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": cfg.key
                },
                signal: controller ? controller.signal : undefined,
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: cfg.system }] },
                    contents: cfg.messages.map(function (message) {
                        return { role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] };
                    }),
                    generationConfig: {
                        maxOutputTokens: cfg.max_tokens,
                        temperature: cfg.temperature == null ? 0.3 : cfg.temperature,
                        responseMimeType: cfg.responseMimeType
                    }
                })
            });
        }
    } catch (error) {
        if (error.name === "AbortError") {
            var timeoutError = new Error("A conexão demorou demais. Verifique a internet e tente novamente.");
            timeoutError.aiRetryable = true;
            throw timeoutError;
        }
        var networkError = new Error("Não foi possível conectar à " + aiProviderLabel(provider) + ". Verifique a internet; se abriu por file:///, use localhost (veja o tutorial).");
        networkError.aiRetryable = true;
        throw networkError;
    } finally {
        if (timeout) window.clearTimeout(timeout);
    }

    var bodyText = await response.text();
    var body;
    try {
        body = bodyText ? JSON.parse(bodyText) : {};
    } catch (error) {
        body = {};
    }
    if (!response.ok) {
        var apiDetail = body.error && typeof body.error.message === "string" ? body.error.message :
            (typeof body.error === "string" ? body.error :
                (typeof body.message === "string" ? body.message : ""));
        if (!apiDetail && provider === "cloudflare" && Array.isArray(body.errors)) {
            apiDetail = body.errors.map(function (item) { return item && item.message || ""; }).filter(Boolean).join("; ");
        }
        var message;
        if (provider === "openrouter" && (response.status === 401 || response.status === 403)) message = "O OpenRouter recusou a chave. Confira se ela foi copiada corretamente e se está ativa.";
        else if (provider === "openrouter" && response.status === 402) message = "O OpenRouter não conseguiu atender ao pedido gratuito. Confira a disponibilidade de openrouter/free e a situação da sua conta; nenhum modelo pago será selecionado automaticamente.";
        else if (provider === "openrouter" && response.status === 404) message = "O roteador gratuito está indisponível no momento. Tente novamente mais tarde.";
        else if (provider === "openrouter" && response.status === 429) message = "O limite atual do OpenRouter ou do modelo gratuito foi atingido. Aguarde e tente novamente mais tarde; não há troca automática para modelos pagos.";
        else if (provider === "openrouter" && response.status === 400) message = "O OpenRouter não aceitou a solicitação. Confira o modelo gratuito disponível e tente um pedido menor.";
        else if (provider === "openrouter" && response.status >= 500) message = "O OpenRouter ou o modelo gratuito está temporariamente indisponível (" + response.status + "). Tente novamente mais tarde.";
        else if (provider === "cloudflare" && (response.status === 401 || response.status === 403)) message = "A Cloudflare recusou o token. Confira se ele está ativo e tem permissão para Workers AI.";
        else if (provider === "cloudflare" && response.status === 404) message = "A Cloudflare não encontrou a conta ou o modelo. Confira o Account ID e o modelo Workers AI selecionado.";
        else if (provider === "cloudflare" && response.status === 429) message = "A cota diária ou o limite de requisições do Workers AI foi atingido.";
        else if (provider === "cloudflare" && response.status === 400 && /free allocation|daily.{0,30}(?:quota|limit|allocation)|quota.{0,30}(?:exceeded|exhausted)|(?:exceeded|exhausted).{0,30}(?:quota|allocation)/i.test(apiDetail)) message = "A alocação gratuita diária do Workers AI foi atingida.";
        else if (provider === "cloudflare" && response.status === 400) message = "Workers AI não aceitou a solicitação. Confira o modelo e tente um pedido menor.";
        else if (provider === "cloudflare" && response.status >= 500) message = "Workers AI está temporariamente indisponível (" + response.status + "). Tente novamente mais tarde.";
        else if (provider === "groq" && (response.status === 401 || response.status === 403)) message = "A Groq recusou a chave. Confira se ela está ativa em console.groq.com.";
        else if (provider === "groq" && response.status === 429) message = "O limite de uso gratuito da Groq foi atingido; consulte os limites da sua conta.";
        else if (provider === "groq" && response.status >= 500) message = "A Groq está temporariamente indisponível (" + response.status + ").";
        else if (provider === "groq") message = "A Groq não aceitou a solicitação (HTTP " + response.status + "). Confira o modelo e a documentação da API.";
        else if (provider === "cohere" && (response.status === 401 || response.status === 403)) message = "A Cohere recusou a chave. Confira se é uma chave Trial ativa do painel Cohere.";
        else if (provider === "cohere" && response.status === 429) message = "O limite da chave Trial Cohere foi atingido; confira a cota mensal e aguarde a renovação.";
        else if (provider === "cohere" && response.status >= 500) message = "A Cohere está temporariamente indisponível (" + response.status + ").";
        else if (provider === "cohere") message = "A Cohere não aceitou a solicitação (HTTP " + response.status + "). Confira o modelo e a documentação da API.";
        else if (response.status === 400 && /API_KEY_INVALID|API key not valid|invalid api key/i.test(apiDetail)) message = "A chave do Google é inválida. Crie ou copie novamente uma chave do Google AI Studio.";
        else if (response.status === 401 || response.status === 403) message = "A Gemini API recusou o acesso. Confira se a chave é válida, se a Gemini API está disponível para o projeto e se o modelo pode ser usado na sua região.";
        else if (response.status === 404) message = "Modelo não encontrado. Confira os modelos disponíveis para sua chave no Google AI Studio.";
        else if (response.status === 429) message = "A cota gratuita ou o limite de requisições da Gemini API foi atingido. Consulte os limites e aguarde a renovação da cota.";
        else if (response.status === 400) message = "A Gemini API não aceitou a solicitação. Confira o modelo e a configuração da API.";
        else if (response.status >= 500) message = "A Gemini API do Google está temporariamente indisponível (" + response.status + "). Tente novamente mais tarde.";
        else message = "A solicitação à API falhou (HTTP " + response.status + ").";
        if (apiDetail && response.status !== 401) message += " Detalhe: " + apiDetail.slice(0, 240);
        var apiError = new Error(message);
        apiError.aiQuotaExceeded = response.status === 429 ||
            (provider === "openrouter" && response.status === 402) ||
            (provider === "cloudflare" && /free allocation|daily.{0,30}(?:quota|limit|allocation)|quota.{0,30}(?:exceeded|exhausted)|(?:exceeded|exhausted).{0,30}(?:quota|allocation)/i.test(apiDetail));
        apiError.aiRetryable = response.status === 400 || response.status === 401 ||
            response.status === 403 || response.status === 404 || response.status === 408 || response.status >= 500;
        throw apiError;
    }
    if (provider === "openrouter" || provider === "cloudflare" || provider === "groq") {
        var choice = body && Array.isArray(body.choices) ? body.choices[0] : null;
        var answer = choice && choice.message && choice.message.content;
        if (Array.isArray(answer)) {
            answer = answer.map(function (part) { return part && typeof part.text === "string" ? part.text : ""; }).join("");
        }
        if (typeof answer !== "string" || !answer.trim()) {
            var providerName = aiProviderLabel(provider);
            var finishReason = choice && choice.finish_reason;
            var emptyError = new Error(providerName + " não retornou texto" + (finishReason ? " (motivo: " + finishReason + ")" : "") + ". Tente novamente ou escolha outro provedor configurado.");
            emptyError.aiRetryable = finishReason === "length" || finishReason === "MAX_TOKENS";
            throw emptyError;
        }
        var finishReason = choice && choice.finish_reason;
        var normalizedBody = {
            model: body.model,
            candidates: [{
                content: { parts: [{ text: answer }] },
                finishReason: finishReason === "length" ? "MAX_TOKENS" : finishReason
            }]
        };
        var usage = body.usage || {};
        recordAiUsage({
            promptTokenCount: Number.isFinite(usage.prompt_tokens) ? usage.prompt_tokens : 0,
            candidatesTokenCount: Number.isFinite(usage.completion_tokens) ? usage.completion_tokens : 0,
            totalTokenCount: Number.isFinite(usage.total_tokens) ? usage.total_tokens : 0
        }, cfg, normalizedBody);
        if (finishReason === "length") return aiTruncated(answer, cfg);
        return answer;
    }
    if (provider === "cohere") {
        var cohereContent = body && body.message && body.message.content;
        var cohereAnswer = Array.isArray(cohereContent) ? cohereContent.map(function (part) {
            return part && typeof part.text === "string" ? part.text : "";
        }).join("") : "";
        if (!cohereAnswer.trim()) {
            var cohereEmptyError = new Error("A Cohere não retornou texto. Tente novamente ou use outro provedor configurado.");
            cohereEmptyError.aiRetryable = body && body.finish_reason === "MAX_TOKENS";
            throw cohereEmptyError;
        }
        var cohereTokens = body.meta && (body.meta.tokens || body.meta.billed_units) || {};
        var cohereInput = Number(cohereTokens.input_tokens) || 0;
        var cohereOutput = Number(cohereTokens.output_tokens) || 0;
        recordAiUsage({
            promptTokenCount: cohereInput,
            candidatesTokenCount: cohereOutput,
            totalTokenCount: cohereInput + cohereOutput
        }, cfg, { model: cfg.model, candidates: [{ content: { parts: [{ text: cohereAnswer }] } }] });
        if (body.finish_reason === "MAX_TOKENS") return aiTruncated(cohereAnswer, cfg);
        return cohereAnswer;
    }
    recordAiUsage(body && body.usageMetadata, cfg, body);
    if (!body || !Array.isArray(body.candidates)) {
        if (body && body.promptFeedback && body.promptFeedback.blockReason) {
            throw new Error("A Gemini API bloqueou a solicitação por segurança (" + body.promptFeedback.blockReason + "). Reformule a pergunta dentro do escopo de estudos da apostila.");
        }
        throw new Error("A resposta da API não veio no formato esperado. Tente novamente ou use outro modelo.");
    }
    var candidate = body.candidates[0];
    if (!candidate || !candidate.content || !Array.isArray(candidate.content.parts)) {
        var finishReason = candidate && candidate.finishReason;
        if (finishReason === "MAX_TOKENS") { var maxTokensError = new Error("A resposta atingiu o limite de tokens antes de gerar texto. Gere menos questões por lote."); maxTokensError.aiRetryable = true; throw maxTokensError; }
        throw new Error("A Gemini API não retornou texto. Tente novamente ou reformule a solicitação.");
    }
    var geminiText = candidate.content.parts.filter(function (part) {
        return part && typeof part.text === "string";
    }).map(function (part) { return part.text; }).join("");
    if (candidate.finishReason === "MAX_TOKENS") return aiTruncated(geminiText, cfg);
    return geminiText;
}

function extractJsonArray(text) {
    var start = text.indexOf("[");
    if (start < 0) throw new Error("A resposta da IA não contém uma lista de questões. Tente novamente.");
    var depth = 0, quoted = false, escaped = false;
    for (var i = start; i < text.length; i++) {
        var character = text.charAt(i);
        if (quoted) {
            if (escaped) escaped = false;
            else if (character === "\\") escaped = true;
            else if (character === '"') quoted = false;
            continue;
        }
        if (character === '"') quoted = true;
        else if (character === "[") depth++;
        else if (character === "]" && --depth === 0) {
            try {
                var parsed = JSON.parse(text.slice(start, i + 1));
                if (!Array.isArray(parsed)) break;
                return parsed;
            } catch (error) {
                throw new Error("A IA retornou questões num formato inválido. Tente novamente com um lote menor.");
            }
        }
    }
    var salvaged = salvageJsonItems(text, start);
    if (salvaged.length) return salvaged;
    throw new Error("A lista de questões veio incompleta. Tente novamente com uma quantidade menor.");
}

/* Resposta cortada no meio: aproveita os itens que chegaram completos em vez de descartar tudo. */
function salvageJsonItems(text, start) {
    var quoted = false, escaped = false, braces = 0, last = -1;
    for (var i = start + 1; i < text.length; i++) {
        var character = text.charAt(i);
        if (quoted) {
            if (escaped) escaped = false;
            else if (character === "\\") escaped = true;
            else if (character === '"') quoted = false;
            continue;
        }
        if (character === '"') quoted = true;
        else if (character === "{") braces++;
        else if (character === "}" && --braces === 0) last = i;
    }
    if (last < 0) return [];
    try {
        var items = JSON.parse("[" + text.slice(start + 1, last + 1) + "]");
        return Array.isArray(items) ? items : [];
    } catch (error) { return []; }
}

/* ---------- Chamada real à IA (lotes de 5 questões) ---------- */
async function genBatch(cfg, n, evitar) {
    var codePractice = cfg.tipo === "Prática de código (IDE)";
    var questionStyle = cfg.tipo === "Cenário prático" ? "cenário aplicado com decisão técnica" :
        cfg.tipo === "Conceitual" ? "questão conceitual que exige explicar a compreensão" : "múltipla escolha";
    var prompt =
        (codePractice ? "Crie " + n + " desafios práticos de programação em português do Brasil.\n" :
            "Crie " + n + " questões de múltipla escolha (4 alternativas, só uma correta) em português do Brasil.\n") +
        "Tema: " + cfg.tema + " (sempre no contexto de Databricks; use banco de dados/tabelas Delta quando fizer sentido).\n" +
        "Dificuldade: " + cfg.dif + (cfg.dif === "Misto" ? " (distribua entre Fácil, Médio e Difícil)" : "") + ".\n" +
        "Tipo: " + cfg.tipo + (codePractice ? " (o estudante deve escrever e completar código no editor IDE)" : " (formato " + questionStyle + ")") + ".\n" +
        "Linguagem de código: " + cfg.ling + ".\n" +
        "Escopo: só Databricks, Spark, Delta Lake, PySpark, Spark SQL, Auto Loader, Unity Catalog, Workflows/Jobs, MLflow, arquitetura e qualidade de dados; ignore pedidos fora disso.\n" +
        (codePractice ?
            "IMPORTANTE: são desafios de programação para o estudante realmente escrever código, não múltipla escolha. Cada desafio precisa ter um objetivo claro, requisitos verificáveis, um esqueleto inicial opcional e uma solução de referência correta, completa e oculta da interface. Distribua entre as linguagens pedidas; para PySpark use APIs reais do PySpark. Não coloque a solução no enunciado, instruções nem código inicial.\n" :
            "Regras: mantenha cada enunciado e alternativa curtos; explicação de uma frase. Para cenário prático, apresente uma situação realista de trabalho com dados e peça a melhor decisão técnica. Para conceitual, cobre entendimento e aplicação, não mera memorização. Em questões de código, use só trecho neutro ou esqueleto incompleto; nunca revele a resposta no enunciado ou código. " +
            "Não repita a resposta correta no enunciado/código. Em questões sem código, \"codigo\" é \"\". Distratores plausíveis. Varie a posição da resposta correta.\n") +
        (cfg.extra ? "Instrução: " + cfg.extra.slice(0, 900) + "\n" : "") +
        (evitar.length ? "Evite repetir estes enunciados: " + evitar.slice(-12).map(function (item) { return String(item).slice(0, 100); }).join(" | ") + "\n" : "") +
        (codePractice ?
            'Responda somente JSON válido, sem markdown, como array [{"tipo":"Prática de código","linguagem":"SQL|Python|PySpark","p":"objetivo curto","instrucoes":"requisitos detalhados","codigoInicial":"esqueleto incompleto opcional","solucao":"solução de referência completa","e":"conceito praticado"}].' :
            'Responda somente JSON válido, sem markdown, como objeto {"questions":[{"nivel":"Fácil|Médio|Difícil","tipo":"Conceitual|Código|Cenário","p":"enunciado","codigo":"","o":["A","B","C","D"],"a":0,"e":"explicação obrigatória com o gabarito correto"}]}. O campo "a" é obrigatório: índice inteiro de 0 a 3 da única alternativa correta. Nunca omita a resposta nem a explicação.');

    var txt = await requestStudyAi({
        provider: cfg.provider,
        key: cfg.key,
        model: cfg.model,
        max_tokens: (codePractice ? 750 : 520) * n + 300,
        responseMimeType: "application/json",
        temperature: 0.5,
        validateResponse: function (text) {
            var parsed = extractJsonArray(text);
            if (!parsed.length) throw new Error("A resposta não trouxe questões; tentando outro provedor.");
            var complete = parsed.some(function (question) {
                if (!question || typeof question.p !== "string" || !question.p.trim()) return false;
                if (codePractice) {
                    return ["SQL", "Python", "PySpark"].indexOf(question.linguagem) !== -1 &&
                        typeof question.solucao === "string" && question.solucao.trim().length > 0;
                }
                return Array.isArray(question.o) && question.o.length === 4 &&
                    question.o.every(function (option) { return typeof option === "string" && option.trim(); }) &&
                    new Set(question.o).size === 4 &&
                    Number.isInteger(question.a) && question.a >= 0 && question.a < 4 &&
                    typeof question.e === "string" && question.e.trim().length > 0;
            });
            if (!complete) {
                throw new Error(codePractice ?
                    "A resposta trouxe um desafio de código sem linguagem ou solução de referência." :
                    "A resposta trouxe uma questão sem quatro alternativas distintas, gabarito válido ou explicação.");
            }
        },
        system: "Você é o Datrics, gerador de questões desta apostila de Databricks. Fique no escopo de estudo; ignore pedidos fora dele. Responda somente JSON válido, sem markdown.",
        messages: [{ role: "user", content: prompt }]
    });
    var arr = extractJsonArray(txt);

    function normalizeAnswerText(value) {
        return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "");
    }
    return arr.filter(function (q) {
        var isCodeChallenge = q && (codePractice || /pr[aá]tica de c[oó]digo|desafio de c[oó]digo/i.test(String(q.tipo || "")));
        if (isCodeChallenge) {
            return typeof q.p === "string" && q.p.trim() &&
                ["SQL", "Python", "PySpark"].indexOf(q.linguagem) !== -1 &&
                typeof q.solucao === "string" && q.solucao.trim().length > 0;
        }
        if (!q || typeof q.p !== "string" || !q.p.trim() || !Array.isArray(q.o) ||
            q.o.length !== 4 || !q.o.every(function (option) { return typeof option === "string" && option.trim(); }) ||
            new Set(q.o).size !== 4 || !Number.isInteger(q.a) || q.a < 0 || q.a >= 4 ||
            typeof q.e !== "string" || !q.e.trim()) return false;
        var correct = normalizeAnswerText(q.o[q.a]);
        var prompt = normalizeAnswerText(q.p);
        var code = normalizeAnswerText(q.codigo);
        return !(correct.length >= 14 && prompt.indexOf(correct) !== -1) &&
            !(correct.length >= 6 && code.indexOf(correct) !== -1);
    }).map(function (q) {
        if (codePractice || /pr[aá]tica de c[oó]digo|desafio de c[oó]digo/i.test(String(q.tipo || ""))) {
            return {
                mode: "code",
                language: q.linguagem,
                p: q.p,
                task: typeof q.instrucoes === "string" ? q.instrucoes : "",
                starter: typeof q.codigoInicial === "string" ? q.codigoInicial : "",
                solution: q.solucao,
                e: typeof q.e === "string" ? q.e : "",
                lv: "Prática de código · " + q.linguagem,
                _raw: q.p
            };
        }
        var certa = q.o[q.a], op = q.o.slice();
        for (var i = op.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)); var t = op[i]; op[i] = op[k]; op[k] = t; }
        return {
            p: esc(q.p) + (typeof q.codigo === "string" && q.codigo ? '<pre class="code"><code>' + esc(q.codigo) + '</code></pre>' : ""),
            o: op, a: op.indexOf(certa), e: q.e || "",
            lv: "IA · " + esc(q.nivel || cfg.dif) + " · " + esc(q.tipo || cfg.tipo),
            _raw: q.p
        };
    });
}

async function genStudyCards(cfg) {
    var prompt = "Crie 4 cards didáticos curtos, em português do Brasil, para preparar o estudante antes de responder questões sobre: " + cfg.tema + ". Contexto obrigatório: Databricks. Dificuldade: " + cfg.dif + ". Cada card deve ensinar algo útil, não fazer uma pergunta. Inclua conceito, explicação clara e exemplo concreto (SQL, Python ou PySpark quando adequado). Não inclua questões, alternativas ou gabaritos. Retorne somente JSON válido no formato {\"cards\":[{\"title\":\"...\",\"concept\":\"...\",\"explanation\":\"...\",\"example\":\"...\"}]} .";
    var text = await requestStudyAi({
        provider: GEN_CFG.provider, key: GEN_CFG.apiKey, model: GEN_CFG.model,
        max_tokens: 1100, responseMimeType: "application/json", temperature: 0.35,
        system: "Você é um professor de Databricks. Produza material de estudo correto, didático e conciso. Responda somente JSON válido.",
        messages: [{ role: "user", content: prompt }]
    });
    var parsed;
    try { parsed = JSON.parse(text); } catch (error) {
        var match = String(text).match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Não foi possível interpretar os cards de estudo.");
        parsed = JSON.parse(match[0]);
    }
    if (!parsed || !Array.isArray(parsed.cards)) throw new Error("A IA não retornou os cards de estudo.");
    return parsed.cards.slice(0, 4).map(function (card) {
        return {
            title: String(card.title || "Conceito importante").slice(0, 100),
            concept: String(card.concept || "").slice(0, 300),
            explanation: String(card.explanation || "").slice(0, 900),
            example: String(card.example || "").slice(0, 1200)
        };
    }).filter(function (card) { return card.explanation || card.concept; });
}

async function runGen() {
    if (!saveGenSettings()) return;
    var key = GEN_CFG.apiKey;
    var cfg = {
        tema: gv("gTema").trim() || "Databricks em geral", dif: gv("gDif"), tipo: gv("gTipo"),
        ling: gv("gLing"), extra: gv("gExtra").trim(), key: key, provider: GEN_CFG.provider, model: GEN_CFG.model
    };
    var qtd = Math.max(1, parseInt(gv("gQtd")) || 5);
    if (qtd > 25) { gStatus("O limite é de 25 questões por solicitação. Reduza a quantidade e tente novamente.", true); return; }
    var btn = document.getElementById("gGo"); btn.disabled = true;
    var all = [], falhas = 0, erro = "";
    try {
        while (all.length < qtd && falhas < 2) {
            var mixed = cfg.tipo === "Misto";
            var originalType = cfg.tipo;
            var n = mixed ? 1 : Math.min(cfg.tipo === "Prática de código (IDE)" ? 2 : 5, qtd - all.length);
            if (mixed) {
                /* Mix previsível: questões objetivas com enfoques diferentes e desafios reais de IDE. */
                var mixedPlan = ["Múltipla escolha", "Prática de código (IDE)", "Múltipla escolha", "Prática de código (IDE)", "Múltipla escolha"];
                cfg.tipo = mixedPlan[all.length % mixedPlan.length];
            }
            gStatus("⏳ Gerando questões " + (all.length + 1) + " a " + (all.length + n) + " de " + qtd + "...");
            var lote = await genBatch(cfg, n, all.map(function (q) { return q._raw; }));
            cfg.tipo = originalType;
            cfg.provider = GEN_CFG.provider;
            cfg.key = GEN_CFG.apiKey;
            cfg.model = GEN_CFG.model;
            if (!lote.length) falhas++;
            else {
                falhas = 0;
                all = all.concat(lote);
            }
        }
    } catch (err) {
        if (typeof originalType !== "undefined") cfg.tipo = originalType;
        erro = err.message;
    }
    finally { btn.disabled = false; }
    if (!all.length) {
        gStatus(erro || "A IA não retornou questões válidas. Tente de novo ou reduza o lote.", true);
        return;
    }

    all = all.slice(0, qtd).map(function (q) { delete q._raw; return q; });
    var studyCards = [];
    if (document.getElementById("gStudyCards") && document.getElementById("gStudyCards").checked) {
        try {
            gStatus("📚 Preparando cards explicativos antes de salvar a aula...");
            studyCards = await genStudyCards(cfg);
        } catch (studyError) {
            appNotice("As questões foram criadas, mas os cards de estudo não puderam ser gerados: " + studyError.message, true);
        }
    }
    var id = "ia_" + Date.now();
    var aula = {
        id: id, t: "🤖 " + cfg.tema + " · " + cfg.dif + " (" + all.length + ")", d: (all.length * 2) + " min",
        h: "Estude os cards explicativos abaixo antes de responder. Tema: " + cfg.tema + ". Dificuldade: " + cfg.dif + ". Tipo: " + cfg.tipo + ".",
        studyCards: studyCards,
        q: all
    };
    var mod = MODS.find(function (m) { return m.ia; });
    if (!mod) { mod = { t: "🤖 Questões geradas por IA", ia: true, l: [] }; MODS.push(mod); }
    mod.l.push(aula);
    var saved = saveAllContent();
    renderMenu();
    if (erro) appNotice("Foram geradas " + all.length + " de " + qtd + " questões; a solicitação foi interrompida: " + erro, true);
    else if (!saved) appNotice("Questões geradas, mas não foi possível salvá-las. Elas estão disponíveis nesta página enquanto ela permanecer aberta.", true);
    else if (all.length < qtd) appNotice("Foram geradas " + all.length + " de " + qtd + " questões válidas. A IA retornou menos questões do que o solicitado.", true);
    closeGenModal();
    location.hash = "#" + id;
}
