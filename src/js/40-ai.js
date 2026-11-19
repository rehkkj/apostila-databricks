var GEN_KEY = "apostilaGenCfg";
var AI_USAGE_KEY = "apostilaAiUsage";
var AI_WIDGET_POSITION_KEY = "apostilaAiWidgetPosition";
var AI_PROVIDERS = {
    gemini: {
        label: "Google Gemini (gratuito)",
        defaultModel: "gemini-3.8-flash",
        models: ["gemini-3.8-flash", "gemini-2.5-flash-lite"],
        keyUrl: "https://aistudio.google.com/apikey",
        freeNote: "O Google oferece uma faixa gratuita para modelos elegíveis. A disponibilidade e os limites variam por modelo/região; confira o painel e a tabela oficial. Na faixa gratuita, os dados podem ser usados para melhorar produtos do Google.",
        api: "gemini"
    },
    openrouter: {
        label: "OpenRouter Free (modelos :free)",
        defaultModel: "openrouter/free",
        models: ["openrouter/free"],
        keyUrl: "https://openrouter.ai/keys",
        freeNote: "O roteador openrouter/free seleciona apenas modelos gratuitos disponíveis. Há limites compartilhados por conta; a lista de modelos muda. Não adicione créditos nem selecione modelos sem o sufixo :free.",
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        api: "openai"
    },
    cloudflare: {
        label: "Cloudflare Workers AI (cota grátis)",
        defaultModel: "@cf/meta/llama-3.1-8b-instruct",
        models: ["@cf/meta/llama-3.1-8b-instruct", "@cf/openai/gpt-oss-120b", "@cf/meta/llama-4-scout-17b-16e-instruct", "@cf/zai-org/glm-4.7-flash"],
        keyUrl: "https://dash.cloudflare.com/profile/api-tokens",
        freeNote: "O plano Workers Free tem uma alocação diária de Neurons. Neurons não são tokens; o consumo varia por modelo. Verifique a conta e não habilite cobrança se quiser permanecer sem custos.",
        api: "openai"
    },
    groq: {
        label: "Groq (plano gratuito limitado)",
        defaultModel: "openai/gpt-oss-20b",
        models: ["openai/gpt-oss-20b", "openai/gpt-oss-120b"],
        keyUrl: "https://console.groq.com/keys",
        freeNote: "O plano gratuito tem limites por modelo, minuto e dia. A disponibilidade de cada modelo no plano gratuito pode mudar; confira o painel Limits e não habilite cobrança.",
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        api: "openai"
    },
    nvidia: {
        label: "NVIDIA NIM (endpoints gratuitos de prototipagem)",
        defaultModel: "nvidia/nemotron-3.5-bolt-e4b",
        models: [
            "nvidia/nemotron-3.5-bolt-e4b",
            "nvidia/nemotron-3.5-super-vl-120b-a12b",
            "stepfun-ai/step-5-preview",
            "minimaxai/minimax-m3.1-flash",
            "z-ai/glm-5-3-flash",
            "moonshotai/kimi-k3.1-pro"
        ],
        keyUrl: "https://build.nvidia.com/settings/api-keys",
        freeNote: "O catálogo NVIDIA Build mostra endpoints marcados como Free Endpoint para prototipagem. Selecione somente um modelo com essa etiqueta na página do catálogo. Limites e modelos disponíveis variam; alguns modelos do catálogo podem ser pagos, parceiros ou apenas para download.",
        endpoint: "https://integrate.api.nvidia.com/v1/chat/completions",
        api: "openai"
    },
    cohere: {
        label: "Cohere (chave de avaliação gratuita)",
        defaultModel: "command-a-03-2025",
        models: ["command-a-03-2025"],
        keyUrl: "https://dashboard.cohere.com/api-keys",
        freeNote: "A Cohere disponibiliza chave de avaliação com limites e restrições. É uma cota de teste, não ilimitada; confirme no painel se a chave está no modo Trial e confira os limites antes de usar.",
        endpoint: "https://api.cohere.com/compatibility/v1/chat/completions",
        api: "openai"
    },
    zai: {
        label: "Z.AI / GLM (Flash gratuito elegível)",
        defaultModel: "glm-4.5-flash",
        models: ["glm-4.5-flash"],
        keyUrl: "https://z.ai/model-api",
        freeNote: "A oferta gratuita é específica dos modelos Flash elegíveis e pode variar por região/conta. Use apenas o modelo identificado como gratuito no painel Z.AI; os demais modelos GLM podem ser pagos.",
        endpoint: "https://api.z.ai/api/paas/v4/chat/completions",
        api: "openai"
    },
    aion: {
        label: "Aion Labs (créditos diários gratuitos)",
        defaultModel: "aion-labs/aion-rp-llama-3.1-8b",
        models: ["aion-labs/aion-rp-llama-3.1-8b"],
        keyUrl: "https://www.aionlabs.ai/",
        freeNote: "A conta Free recebe uma pequena franquia diária de créditos e limites de 20.000 tokens/dia. Os modelos podem ter preço por token: a franquia é consumida; não recarregue créditos nem mude para plano pago.",
        endpoint: "https://api.aionlabs.ai/v1/chat/completions",
        api: "openai"
    },
    typhoon: {
        label: "Typhoon API (pesquisa gratuita)",
        defaultModel: "typhoon-v2.5-30b-a3b-instruct",
        models: ["typhoon-v2.5-30b-a3b-instruct", "typhoon-v2.1-12b-instruct"],
        keyUrl: "https://opentyphoon.ai/",
        freeNote: "A documentação oficial descreve a API como gratuita para pesquisa/demonstração. Os modelos são otimizados para tailandês; qualidade em português pode ser inferior. Sujeito a disponibilidade e limites de uso.",
        endpoint: "https://api.opentyphoon.ai/v1/chat/completions",
        api: "openai"
    },
    modelscope: {
        label: "ModelScope API Inference (gratuito com limites)",
        defaultModel: "Qwen/Qwen3-30B-A3B-Instruct-2507",
        models: ["Qwen/Qwen3-30B-A3B-Instruct-2507", "Qwen/Qwen3-235B-A22B-Instruct-2507", "Qwen/Qwen3-Coder-30B-A3B-Instruct"],
        keyUrl: "https://modelscope.cn/my/myaccesstoken",
        freeNote: "Modelos marcados como hospedados pelo ModelScope são gratuitos com token de acesso. A cota diária é compartilhada e por modelo, ajustada conforme capacidade; modelos de terceiros podem ter regras diferentes.",
        endpoint: "https://api-inference.modelscope.cn/v1/chat/completions",
        api: "openai"
    }
};
var GEN_CFG = {
    provider: "groq",
    apiKey: "",
    model: "openai/gpt-oss-20b",
    keys: { gemini: "", openrouter: "", cloudflare: "", groq: "", nvidia: "", cohere: "", zai: "", aion: "", typhoon: "", modelscope: "" },
    savedKeys: { gemini: "", openrouter: "", cloudflare: "", groq: "", nvidia: "", cohere: "", zai: "", aion: "", typhoon: "", modelscope: "" },
    accountIds: { cloudflare: "" },
    fallbackEnabled: true
};
var AI_PROVIDER_COOLDOWNS = {};
/* Estado temporário de saúde das APIs. Não representa saldo numérico de tokens: a maioria dos provedores não expõe esse dado por uma API comum. */
var AI_PROVIDER_HEALTH = {};
var AI_PROVIDER_HEALTH_TTL = 90 * 1000;
var AI_ACTIVE_CONTROLLER = null;
/* Orquestração multi-IA: preferências e checkpoints locais (sem armazenar API keys). */
var AI_ORCHESTRATION_KEY = "databricksAiOrchestration";
var AI_WORK_CHECKPOINT_KEY = "databricksAiWorkCheckpoint";
var AI_ORCHESTRATION = { mode: "automatic", finalReview: true, checkpoint: "cada_etapa", version: 1 };
try {
    var savedOrchestration = JSON.parse(localStorage.getItem(AI_ORCHESTRATION_KEY) || "null");
    if (savedOrchestration && savedOrchestration.version === 1) {
        AI_ORCHESTRATION.mode = "automatic";
        AI_ORCHESTRATION.finalReview = true;
        AI_ORCHESTRATION.checkpoint = "cada_etapa";
    }
} catch (orchestrationLoadError) { /* usa os padrões solicitados */ }
function persistAiOrchestration() {
    try { localStorage.setItem(AI_ORCHESTRATION_KEY, JSON.stringify(AI_ORCHESTRATION)); return true; }
    catch (error) { return false; }
}
function loadAiWorkCheckpoint() {
    try {
        var state = JSON.parse(localStorage.getItem(AI_WORK_CHECKPOINT_KEY) || "null");
        return state && state.version === 1 && ["question-generation", "tutor-study-lesson", "tutor-questions"].indexOf(state.kind) !== -1 ? state : null;
    } catch (error) { return null; }
}
function saveAiWorkCheckpoint(state) {
    state.updatedAt = new Date().toISOString();
    try { localStorage.setItem(AI_WORK_CHECKPOINT_KEY, JSON.stringify(state)); return true; }
    catch (error) {
        appNotice("Não consegui salvar o checkpoint local (armazenamento cheio ou bloqueado). O trabalho continua nesta sessão, mas não ficará protegido contra fechamento da página.", true);
        return false;
    }
}
function clearAiWorkCheckpoint() {
    try { localStorage.removeItem(AI_WORK_CHECKPOINT_KEY); } catch (error) { /* opcional */ }
}
function renderAiCheckpointControls() {
    var button = document.getElementById("gResume");
    var info = document.getElementById("gCheckpointInfo");
    if (!button) return;
    var state = loadAiWorkCheckpoint();
    button.hidden = !state || state.status === "completed";
    if (info) {
        var done = (state && (state.all || state.partialQuestions) || []).length;
        if (state && state.kind === "tutor-study-lesson") done += (state.lessons || []).reduce(function (sum, lesson) { return sum + (lesson.q || []).length; }, 0);
        var total = state && (state.qtd || state.totalQuestions || (state.settings && state.settings.count) || "—");
        info.textContent = state ? "Trabalho salvo: " + (state.cfg && (state.cfg.tema || state.cfg.topic) || state.topic || "geração") + " · " + done + "/" + total + " questões · etapa: " + (state.stage || "em andamento") + "." : "Nenhum trabalho interrompido salvo.";
    }
}
function aiConnectedProviders(exceptProvider) {
    return Object.keys(AI_PROVIDERS).filter(function (provider) {
        return provider !== exceptProvider && Boolean(GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider]) &&
            (provider !== "cloudflare" || /^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare));
    });
}
function aiConfiguredProviderOrder(exceptProvider) {
    var order = ["groq", "gemini", "openrouter", "cloudflare", "nvidia", "cohere", "zai", "aion", "typhoon", "modelscope"];
    return order.filter(function (provider) {
        return provider !== exceptProvider && Boolean(GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider]) &&
            (provider !== "cloudflare" || /^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare));
    });
}
async function aiProbeProvider(provider, signal) {
    var cached = AI_PROVIDER_HEALTH[provider];
    if (cached && cached.expiresAt > Date.now()) return cached.available;
    if (AI_PROVIDER_COOLDOWNS[provider] > Date.now()) return false;
    var key = GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider];
    if (!key || !AI_PROVIDERS[provider]) return false;
    try {
        /* Verificação real, paralela e de baixo consumo. Não existe endpoint universal para consultar saldo de tokens. */
        await requestStudyAiForProvider({
            provider: provider, key: key, model: AI_PROVIDERS[provider].defaultModel,
            accountId: provider === "cloudflare" ? GEN_CFG.accountIds.cloudflare : "",
            system: "Responda somente OK.",
            messages: [{ role: "user", content: "Teste de disponibilidade. Responda OK." }],
            max_tokens: 12, temperature: 0, timeoutMs: 12000, signal: signal, cache: false
        });
        AI_PROVIDER_HEALTH[provider] = { available: true, checkedAt: Date.now(), expiresAt: Date.now() + AI_PROVIDER_HEALTH_TTL, reason: "" };
        return true;
    } catch (error) {
        if (error.name === "AbortError" || (signal && signal.aborted)) throw error;
        var quota = Boolean(error.aiQuotaExceeded);
        AI_PROVIDER_HEALTH[provider] = { available: false, checkedAt: Date.now(), expiresAt: Date.now() + (quota ? 10 : 2) * 60 * 1000, reason: String(error.message || "Falha na verificação").slice(0, 220) };
        if (quota) AI_PROVIDER_COOLDOWNS[provider] = Date.now() + 10 * 60 * 1000;
        return false;
    }
}
async function aiFindReadyProviders(exceptProvider, signal) {
    var candidates = aiConfiguredProviderOrder(exceptProvider).filter(function (provider) {
        return !(AI_PROVIDER_COOLDOWNS[provider] > Date.now());
    });
    var checks = await Promise.all(candidates.map(function (provider) {
        return aiProbeProvider(provider, signal).then(function (available) { return { provider: provider, available: available }; });
    }));
    return checks.filter(function (item) { return item.available; }).map(function (item) { return item.provider; });
}
function aiNextConnectedProvider(current) {
    var order = ["groq", "gemini", "openrouter", "cloudflare", "nvidia", "cohere", "zai", "aion", "typhoon", "modelscope"];
    return order.find(function (provider) {
        return provider !== current && Boolean(GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider]) &&
            (provider !== "cloudflare" || /^[a-f0-9]{32}$/i.test(GEN_CFG.accountIds.cloudflare)) &&
            !(AI_PROVIDER_COOLDOWNS[provider] > Date.now());
    }) || "";
}
function aiActivateProvider(provider) {
    if (!AI_PROVIDERS[provider]) return;
    GEN_CFG.provider = provider;
    GEN_CFG.model = AI_PROVIDERS[provider].defaultModel;
    GEN_CFG.apiKey = GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider] || "";
    try { persistGenConfig(); } catch (error) { /* mantém em memória */ }
    var select = document.getElementById("gProvider");
    if (select) {
        select.value = provider;
        renderGeneratorProviderControls();
        var input = document.getElementById("gApi"); if (input) input.value = GEN_CFG.apiKey;
        var model = document.getElementById("gModel"); if (model) model.value = GEN_CFG.model;
    }
    renderConnectedAiProviders();
}
async function resumeAiWorkCheckpoint() {
    var state = loadAiWorkCheckpoint();
    if (!state) { gStatus("Não há trabalho salvo para retomar.", true); return; }
    if (state.kind === "question-generation") return runGen(true);
    if (typeof resumeTutorWorkCheckpoint === "function") return resumeTutorWorkCheckpoint(state);
    gStatus("Este tipo de trabalho salvo não pode ser retomado nesta versão.", true);
}
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

/* ---------- Backup criptografado das credenciais ---------- */
var AI_BACKUP_ITERATIONS = 310000;
function aiBytesToBase64(bytes) {
    var binary = "";
    new Uint8Array(bytes).forEach(function (b) { binary += String.fromCharCode(b); });
    return btoa(binary);
}
function aiBase64ToBytes(value) {
    var binary = atob(value);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}
async function aiBackupKeyFromPassword(password, salt) {
    var material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: AI_BACKUP_ITERATIONS, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
function aiBackupPayload() {
    var keys = {};
    Object.keys(AI_PROVIDERS).forEach(function (provider) {
        var key = GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider] || "";
        if (provider === GEN_CFG.provider) key = (document.getElementById("gApi") && document.getElementById("gApi").value.trim()) || key;
        if (key) keys[provider] = key;
    });
    return {
        format: "databricks-academy-ai-keys", version: 1, createdAt: new Date().toISOString(),
        provider: GEN_CFG.provider, model: GEN_CFG.model, keys: keys,
        accountIds: { cloudflare: GEN_CFG.accountIds.cloudflare || (document.getElementById("gAccountId") ? document.getElementById("gAccountId").value.trim() : "") },
        fallbackEnabled: GEN_CFG.fallbackEnabled,
        orchestration: AI_ORCHESTRATION,
        workCheckpoint: loadAiWorkCheckpoint()
    };
}
async function exportAiCredentialsBackup() {
    var status = document.getElementById("gBackupStatus");
    try {
        if (!window.crypto || !crypto.subtle || !window.isSecureContext) throw new Error("A criptografia segura exige HTTPS ou localhost e um navegador atualizado.");
        var password = document.getElementById("gBackupPassword").value;
        var confirm = document.getElementById("gBackupPasswordConfirm").value;
        if (password.length < 12) throw new Error("Crie uma senha exclusiva com pelo menos 12 caracteres.");
        if (password !== confirm) throw new Error("As duas senhas não coincidem.");
        var salt = crypto.getRandomValues(new Uint8Array(16));
        var iv = crypto.getRandomValues(new Uint8Array(12));
        var key = await aiBackupKeyFromPassword(password, salt);
        var plain = new TextEncoder().encode(JSON.stringify(aiBackupPayload()));
        var encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, plain);
        var backup = { format: "databricks-academy-encrypted-backup", version: 1, kdf: "PBKDF2-SHA256", iterations: AI_BACKUP_ITERATIONS, cipher: "AES-256-GCM", salt: aiBytesToBase64(salt), iv: aiBytesToBase64(iv), data: aiBytesToBase64(encrypted) };
        var blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a"); a.href = url; a.download = "databricks-academy-apis-backup.enc.json";
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        document.getElementById("gBackupPassword").value = "";
        document.getElementById("gBackupPasswordConfirm").value = "";
        if (status) status.textContent = "Backup criptografado exportado. Guarde o arquivo e a senha em locais separados.";
    } catch (error) { if (status) status.textContent = error.message || "Não foi possível exportar o backup."; }
}
async function importAiCredentialsBackup(file) {
    var status = document.getElementById("gBackupStatus");
    try {
        if (!window.crypto || !crypto.subtle || !window.isSecureContext) throw new Error("A descriptografia exige HTTPS ou localhost e um navegador atualizado.");
        if (!file || file.size > 5 * 1024 * 1024) throw new Error("Selecione um backup válido de até 5 MB.");
        var password = document.getElementById("gImportPassword").value;
        if (!password) throw new Error("Digite a senha usada na exportação.");
        var backup = JSON.parse(await file.text());
        if (backup.format !== "databricks-academy-encrypted-backup" || backup.version !== 1 || backup.cipher !== "AES-256-GCM" || backup.kdf !== "PBKDF2-SHA256" || backup.iterations !== AI_BACKUP_ITERATIONS) throw new Error("Formato de backup desconhecido ou incompatível.");
        var key = await aiBackupKeyFromPassword(password, aiBase64ToBytes(backup.salt));
        var decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: aiBase64ToBytes(backup.iv) }, key, aiBase64ToBytes(backup.data));
        var payload = JSON.parse(new TextDecoder().decode(decrypted));
        if (payload.format !== "databricks-academy-ai-keys" || payload.version !== 1 || !payload.keys || typeof payload.keys !== "object") throw new Error("O conteúdo descriptografado não é um backup válido do Datrics.");
        var imported = 0;
        Object.keys(AI_PROVIDERS).forEach(function (provider) {
            if (typeof payload.keys[provider] === "string" && payload.keys[provider].trim()) {
                GEN_CFG.keys[provider] = payload.keys[provider].trim();
                GEN_CFG.savedKeys[provider] = payload.keys[provider].trim(); imported++;
            }
        });
        if (payload.accountIds && typeof payload.accountIds.cloudflare === "string") GEN_CFG.accountIds.cloudflare = payload.accountIds.cloudflare;
        if (AI_PROVIDERS[payload.provider]) GEN_CFG.provider = payload.provider;
        if (validAiModel(GEN_CFG.provider, payload.model)) GEN_CFG.model = payload.model;
        else GEN_CFG.model = AI_PROVIDERS[GEN_CFG.provider].defaultModel;
        GEN_CFG.apiKey = GEN_CFG.keys[GEN_CFG.provider] || "";
        GEN_CFG.fallbackEnabled = payload.fallbackEnabled !== false;
        if (payload.orchestration && payload.orchestration.version === 1) {
            AI_ORCHESTRATION.mode = "automatic";
            AI_ORCHESTRATION.finalReview = true;
            AI_ORCHESTRATION.checkpoint = "cada_etapa";
            persistAiOrchestration();
        }
        if (payload.workCheckpoint && payload.workCheckpoint.version === 1 && ["question-generation", "tutor-study-lesson", "tutor-questions"].indexOf(payload.workCheckpoint.kind) !== -1) saveAiWorkCheckpoint(payload.workCheckpoint);
        persistGenConfig();
        var providerSelect = document.getElementById("gProvider");
        if (providerSelect) providerSelect.value = GEN_CFG.provider;
        var apiInput = document.getElementById("gApi"); if (apiInput) apiInput.value = GEN_CFG.apiKey;
        var remember = document.getElementById("gRememberKey"); if (remember) remember.checked = Boolean(GEN_CFG.apiKey);
        var fallback = document.getElementById("gFallbackEnabled"); if (fallback) fallback.checked = GEN_CFG.fallbackEnabled;
        var account = document.getElementById("gAccountId"); if (account) account.value = GEN_CFG.accountIds.cloudflare || "";
        renderGeneratorProviderControls(); renderConnectedAiProviders(); renderAiUsage(); renderAiCheckpointControls();
        document.getElementById("gImportPassword").value = "";
        if (status) status.textContent = imported + " provedores importados e salvos neste navegador. Teste as conexões antes de usar.";
    } catch (error) {
        if (status) status.textContent = /OperationError|decrypt|padding/i.test(error.name + " " + error.message) ? "Não foi possível abrir o backup. Confira a senha e se o arquivo está íntegro." : (error.message || "Falha ao importar backup.");
    }
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
// Remove credenciais antigas de provedores que não fazem mais parte da lista gratuita.
if (savedGenCfg && savedGenCfg.keys && (Object.prototype.hasOwnProperty.call(savedGenCfg.keys, "mistral") || Object.prototype.hasOwnProperty.call(savedGenCfg.keys, "sambanova"))) {
    try { persistGenConfig(); } catch (cleanupError) { /* a configuração antiga não será reutilizada */ }
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
            gemini: ["https://ai.google.dev/gemini-api/docs/pricing", "Cotas do Gemini"]
        };
        var usageInfo = usageLinks[GEN_CFG.provider] || [AI_PROVIDERS[GEN_CFG.provider].keyUrl, "Painel de " + aiProviderLabel(GEN_CFG.provider)];
        providerLink.href = usageInfo[0];
        providerLink.textContent = usageInfo[1];
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
            var label = id === "openrouter/free" ? "Roteador automático · somente modelos gratuitos" :
                id.indexOf("@cf/") === 0 ? id.replace("@cf/", "") + " · Cloudflare" :
                provider === "nvidia" ? id + " · NVIDIA NIM" :
                provider === "modelscope" ? id + " · ModelScope" :
                provider === "groq" ? id + " · Groq" :
                provider === "gemini" ? id + " · Google AI Studio" :
                id + " · modelo disponível";
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
            "Criar chave em " + AI_PROVIDERS[provider].label;
    }
    if (modelHelp) {
        modelHelp.textContent = config.freeNote ||
            "A disponibilidade da cota gratuita depende da conta e do modelo. Confira os limites oficiais; não há uso ilimitado nem garantia de disponibilidade.";
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
        '<div class="ai-widget-compose"><form id="aiWidgetChatForm" class="ai-chat-form"><label class="sr-only" for="aiWidgetChatInput">Sua dúvida para o Datrics</label><textarea id="aiWidgetChatInput" maxlength="1200" placeholder="Escreva sua dúvida sobre a apostila..." required></textarea><button type="submit" class="cf btn-ai" data-tutor-send aria-label="Enviar pergunta">Enviar</button><button type="button" class="btn-header ai-stop-button" data-tutor-stop hidden>PARAR</button></form>' +
        '<div class="ai-research-tools"><label><input type="checkbox" id="aiWidgetWebSearch"> Web Search</label><button type="button" class="btn-header" data-rag-import>+ Documentos</button><button type="button" class="btn-header" data-rag-clear>Limpar docs</button><input type="file" data-rag-files accept=".txt,.md,.csv,.json,.pdf,.docx" multiple hidden><span data-rag-status></span></div><div class="ai-chat-actions"><button type="button" class="btn-header" data-tutor-clear>Limpar conversa</button><button type="button" class="btn-header" id="aiWidgetConfigure">Configurar IA</button><a class="btn-header" href="#ia-study">Tutorial</a></div></div></div>';
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    document.getElementById("aiWidgetChatForm").addEventListener("submit", sendTutorMessage);
    initializeTutorResearchControls(panel);
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
            '<div class="gfull"><label class="field-label" for="gProvider">Provedor principal / chave em edição</label><select id="gProvider">' + Object.keys(AI_PROVIDERS).map(function (key) { return '<option value="' + key + '"' + (key === GEN_CFG.provider ? " selected" : "") + '>' + AI_PROVIDERS[key].label + '</option>'; }).join("") + '</select><p class="meta">Conecte um por vez: escolha o provedor, informe a chave e salve. Depois, selecione qual será o principal.</p></div>' +
            '<div class="gfull"><label class="field-label" for="gTema">Tema</label><input id="gTema" placeholder="Ex.: MERGE em Delta Lake, Auto Loader, permissões no Unity Catalog..."><details class="g-suggestions"><summary>Ver sugestões de temas</summary><div class="chips" id="gChips"></div></details></div>' +
            '<div class="gfull"><label class="field-label" for="gQtd">Quantidade de questões (1–25)</label><input id="gQtd" type="number" min="1" max="25" value="5"><p class="meta">Limite de 25 por solicitação. Tipos mistos alternam questões conceituais e desafios de código. A geração pode demorar ou parar se o provedor atingir o limite. As questões concluídas são preservadas.</p></div>' +
            '<details class="gfull generator-options"><summary>Opções avançadas (dificuldade, tipo e linguagem)</summary><div class="ggrid">' +
            '<div><label class="field-label">Dificuldade</label>' + gSel("gDif", ["Fácil", "Médio", "Difícil", "Misto"], "Médio") + '</div>' +
            '<div><label class="field-label">Tipo de questão</label>' + gSel("gTipo", ["Conceitual", "Código (SQL/PySpark)", "Prática de código (IDE)", "Cenário prático", "Misto"], "Misto") + '</div>' +
            '<div><label class="field-label">Linguagem do código</label>' + gSel("gLing", ["SQL", "PySpark", "Python", "Misto"], "Misto") + '</div>' +
            '<div class="gfull"><label class="meta"><input id="gStudyCards" type="checkbox" checked> Criar cards explicativos para estudar antes das questões</label><p class="meta">A IA prepara pequenos cards com conceitos, explicações e exemplos antes dos exercícios.</p></div>' +
            '<div class="gfull"><label class="field-label">Instruções extras (opcional)</label><textarea id="gExtra" rows="2" placeholder="Ex.: use dados de vendas; foque em erros comuns..."></textarea></div></div></details>' +
            '<div class="gfull api-key-panel"><span class="lv">CONFIGURAR PROVEDOR</span><label class="field-label" id="gApiProviderLabel" for="gApi">Chave da API</label><input id="gApi" type="password" autocomplete="off" placeholder="Cole sua chave/token aqui"><div id="gAccountIdField" hidden><label class="field-label" for="gAccountId">Cloudflare Account ID</label><input id="gAccountId" type="text" autocomplete="off" placeholder="32 caracteres (copiados do painel Cloudflare)"></div><p class="meta api-key-help"><label><input id="gRememberKey" type="checkbox"> Lembrar a chave neste navegador</label></p><p class="meta api-key-help">A chave/token fica disponível neste dispositivo. Não a compartilhe nem use em computadores públicos. <a id="gProviderKeyLink" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Criar chave</a> · <a href="#ia-study">Tutorial e privacidade</a>.</p></div>' +
            '<div class="gfull api-key-panel ai-backup-panel"><span class="lv">MIGRAR PARA OUTRO COMPUTADOR</span><h3>Backup seguro das APIs</h3><p class="meta">Exporte todas as chaves conectadas, preferências multi-IA e o checkpoint de um trabalho em andamento em um arquivo criptografado com AES-256-GCM. No novo aparelho, importe o arquivo e informe a mesma senha para restaurar as conexões e retomar o trabalho salvo.</p><label class="field-label" for="gBackupPassword">Senha do backup (mínimo 12 caracteres)</label><input id="gBackupPassword" type="password" autocomplete="new-password" placeholder="Crie uma senha forte e exclusiva"><label class="field-label" for="gBackupPasswordConfirm">Confirme a senha</label><input id="gBackupPasswordConfirm" type="password" autocomplete="new-password" placeholder="Repita a senha"><button type="button" class="cf btn-secundario" id="gExportBackup">🔒 Exportar backup criptografado</button><hr><label class="field-label" for="gBackupFile">Arquivo de backup (.json)</label><input id="gBackupFile" type="file" accept=".json,application/json"><label class="field-label" for="gImportPassword">Senha do backup</label><input id="gImportPassword" type="password" autocomplete="current-password" placeholder="Senha usada ao exportar"><button type="button" class="cf btn-secundario" id="gImportBackup">🔓 Importar e restaurar APIs</button><p class="meta" id="gBackupStatus" role="status" aria-live="polite"></p><p class="meta"><strong>Segurança:</strong> a senha nunca é salva nem enviada. A criptografia ocorre neste navegador. Guarde o arquivo e a senha separadamente; sem a senha, não há recuperação. Não use em computadores públicos e apague o arquivo após transferi-lo.</p></div>' +
            '<div class="gfull api-key-panel"><span class="lv">ORQUESTRAÇÃO MULTI-IA</span><strong>Modo automático · revisão final ativada · checkpoint a cada etapa</strong><p class="meta api-key-help">Quando um provedor atingir limite ou falhar, o sistema tenta outro provedor conectado com o contexto da etapa. O progresso das questões é salvo localmente a cada lote, sem salvar API Keys no checkpoint.</p><p class="meta" id="gCheckpointInfo">Nenhum trabalho interrompido salvo.</p><button type="button" class="cf btn-secundario" id="gResume" hidden>▶ Retomar trabalho salvo</button><p class="meta api-key-help" id="gConnectedProviders"></p></div>' +
            '<div class="gfull api-key-panel"><label class="field-label"><input id="gFallbackEnabled" type="checkbox" checked> Usar automaticamente outro provedor conectado se este falhar</label><p class="meta api-key-help">A transferência mantém a solicitação, as etapas concluídas e as instruções de continuidade. O provedor seguinte não deve recriar o conteúdo já salvo.</p></div>' +
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
        document.getElementById("gGo").onclick = function () { runGen(false); };
        document.getElementById("gResume").onclick = resumeAiWorkCheckpoint;
        document.getElementById("gExportBackup").onclick = exportAiCredentialsBackup;
        document.getElementById("gImportBackup").onclick = function () {
            var file = document.getElementById("gBackupFile").files[0];
            importAiCredentialsBackup(file);
        };
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
    persistAiOrchestration();
    renderAiCheckpointControls();
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
var AI_TRUNCATION_MARKER = "\n[[DATRICS_AI_CONTINUE_HERE]]";
async function requestStudyAi(cfg) {
    var cacheKey = cfg.cache ? aiCacheHash(JSON.stringify([cfg.system, cfg.messages, cfg.max_tokens, cfg.responseMimeType || ""])) : "";
    if (cacheKey) {
        var hit = aiCacheGet(cacheKey);
        if (hit !== null) return hit;
    }
    var workingCfg = Object.assign({}, cfg);
    var answer = await requestStudyAiUncached(workingCfg);
    /* JSON é continuado no nível do gerador para preservar objetos completos e evitar JSON quebrado. */
    if (cfg.responseMimeType !== "application/json" && answer.indexOf(AI_TRUNCATION_MARKER) !== -1) {
        var accumulated = answer.replace(AI_TRUNCATION_MARKER, "").replace(/\s+$/, "");
        var hops = 0, stoppedWithoutProvider = false;
        while (hops < 4) {
            var nextProvider = aiNextConnectedProvider(workingCfg.provider || GEN_CFG.provider);
            if (!nextProvider) { stoppedWithoutProvider = true; break; }
            aiActivateProvider(nextProvider);
            workingCfg = Object.assign({}, cfg, {
                provider: nextProvider, model: AI_PROVIDERS[nextProvider].defaultModel,
                key: GEN_CFG.keys[nextProvider] || GEN_CFG.savedKeys[nextProvider], cache: false,
                messages: (cfg.messages || []).concat([
                    { role: "assistant", content: accumulated },
                    { role: "user", content: "Continue exatamente do ponto em que o texto anterior terminou. Não repita, não resuma e não reinicie. Preserve a estrutura, os nomes, as decisões e o progresso já apresentado. Escreva somente a continuação." }
                ])
            });
            var continuation;
            try { continuation = await requestStudyAiUncached(workingCfg); }
            catch (handoffError) {
                accumulated += "\n\n[O provedor seguinte não conseguiu continuar: " + String(handoffError.message || "falha de conexão").slice(0, 180) + ". O trecho anterior foi preservado.]";
                break;
            }
            var stillTruncated = continuation.indexOf(AI_TRUNCATION_MARKER) !== -1;
            accumulated += continuation.replace(AI_TRUNCATION_MARKER, "").replace(/^\s+/, "");
            hops++;
            if (!stillTruncated) break;
        }
        answer = accumulated;
        if (answer.indexOf(AI_TRUNCATION_MARKER) !== -1) answer = answer.replace(AI_TRUNCATION_MARKER, "");
        if (hops > 0) appNotice("A resposta foi continuada automaticamente com " + aiProviderLabel(GEN_CFG.provider) + ".");
        if (stoppedWithoutProvider) answer += "\n\n[O texto foi preservado, mas não há outro provedor conectado disponível para continuar automaticamente.]";
        if (hops >= 4) answer += "\n\n[Continuação interrompida após quatro transferências automáticas. Peça para continuar a partir deste ponto.]";
    }
    if (cacheKey && answer.indexOf(AI_TRUNCATION_MARKER) === -1) aiCachePut(cacheKey, answer);
    return answer;
}
/* Marca explicitamente a resposta cortada para acionar o handoff sem perder o trecho recebido. */
function aiTruncated(answer, cfg) {
    return String(answer).replace(/\s+$/, "") + AI_TRUNCATION_MARKER;
}

async function requestStudyAiUncached(cfg) {
    var preferred = cfg.provider || GEN_CFG.provider;
    if (!AI_PROVIDERS[preferred]) throw new Error("O provedor de IA selecionado não é válido.");
    var primaryKey = GEN_CFG.keys[preferred] || (preferred === GEN_CFG.provider ? GEN_CFG.apiKey : "") || cfg.key;
    if (!primaryKey && GEN_CFG.fallbackEnabled) {
        var automaticOrder = ["groq", "gemini", "openrouter", "cloudflare", "nvidia", "cohere", "zai", "aion", "typhoon", "modelscope"];
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
        /* Verifica as chaves conectadas em paralelo e só então monta a fila; APIs sem cota/acesso são puladas. */
        var readyProviders = await aiFindReadyProviders("", cfg.signal || (AI_ACTIVE_CONTROLLER && AI_ACTIVE_CONTROLLER.signal));
        var orderedReady = [preferred].concat(readyProviders.filter(function (provider) { return provider !== preferred; }));
        candidates = orderedReady.filter(function (provider) {
            return (provider === preferred ? Boolean(primaryKey) : Boolean(GEN_CFG.keys[provider] || GEN_CFG.savedKeys[provider])) &&
                !(AI_PROVIDER_COOLDOWNS[provider] > Date.now());
        });
        if (!candidates.length && primaryKey) candidates = [preferred];
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
            if (error.name === "AbortError" || (cfg.signal && cfg.signal.aborted) || (AI_ACTIVE_CONTROLLER && AI_ACTIVE_CONTROLLER.signal.aborted)) throw error;
            var canFallback = error.aiQuotaExceeded || error.aiRetryable;
            if (!canFallback || !GEN_CFG.fallbackEnabled || i === candidates.length - 1) {
                if (canFallback && i > 0) {
                    throw new Error("Os provedores configurados não conseguiram concluir o pedido. Último erro: " + error.message);
                }
                throw error;
            }
            AI_PROVIDER_COOLDOWNS[provider] = Date.now() + (error.aiQuotaExceeded ? 10 : 2) * 60 * 1000;
            AI_PROVIDER_HEALTH[provider] = { available: false, checkedAt: Date.now(), expiresAt: AI_PROVIDER_COOLDOWNS[provider], reason: String(error.message || "Falha na chamada").slice(0, 220) };
            notifyAiFallback(provider, candidates[i + 1]);
        }
    }
}

async function requestStudyAiForProvider(cfg) {
    var provider = cfg.provider || "gemini";
    if (!AI_PROVIDERS[provider]) throw new Error("O provedor de IA selecionado não é válido.");
    var response, controller = typeof AbortController === "function" ? new AbortController() : null;
    var externalSignal = cfg.signal || (AI_ACTIVE_CONTROLLER && AI_ACTIVE_CONTROLLER.signal) || undefined;
    var timedOut = false;
    if (controller && externalSignal) {
        if (externalSignal.aborted) controller.abort();
        else externalSignal.addEventListener("abort", function () { controller.abort(); }, { once: true });
    }
    var activeSignal = controller ? controller.signal : externalSignal;
    var timeout = controller ? window.setTimeout(function () { timedOut = true; controller.abort(); }, Math.max(3000, Math.min(60000, Number(cfg.timeoutMs) || 60000))) : 0;
    try {
        if (AI_PROVIDERS[provider].api === "openai") {
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
            var endpoint = provider === "cloudflare" ?
                "https://api.cloudflare.com/client/v4/accounts/" + encodeURIComponent(cfg.accountId) + "/ai/v1/chat/completions" :
                AI_PROVIDERS[provider].endpoint;
            response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + cfg.key
                },
                signal: activeSignal,
                body: JSON.stringify(openRouterBody)
            });
        } else {
            response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" +
                encodeURIComponent(cfg.model) + ":generateContent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": cfg.key
                },
                signal: activeSignal,
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
        if (error.name === "AbortError" || (activeSignal && activeSignal.aborted)) {
            if (timedOut && !(externalSignal && externalSignal.aborted)) {
                var timeoutError = new Error("A conexão demorou demais. Verifique a internet e tente novamente.");
                timeoutError.aiRetryable = true;
                throw timeoutError;
            }
            var cancelled = new Error("Execução interrompida pelo usuário.");
            cancelled.name = "AbortError";
            throw cancelled;
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
    if (AI_PROVIDERS[provider].api === "openai") {
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
            "Não repita a resposta correta no enunciado/código. Em questões sem código, \"codigo\" é \"\". Distratores plausíveis e tecnicamente plausíveis. Cada alternativa deve conter uma resposta completa e significativa (frase, conceito, comando ou decisão técnica), NUNCA apenas letras, rótulos ou marcadores como A, B, C, D, \"Alternativa A\" ou \"Opção B\". Varie a posição da resposta correta.\n") +
        (cfg.extra ? "Instrução e fontes de referência: " + cfg.extra.slice(0, 6500) + "\n" : "") +
        (evitar.length ? "Evite repetir estes enunciados: " + evitar.slice(-12).map(function (item) { return String(item).slice(0, 100); }).join(" | ") + "\n" : "") +
        (codePractice ?
            'Responda somente JSON válido, sem markdown, como array [{"tipo":"Prática de código","linguagem":"SQL|Python|PySpark","p":"objetivo curto","instrucoes":"requisitos detalhados","codigoInicial":"esqueleto incompleto opcional","solucao":"solução de referência completa","e":"conceito praticado"}].' :
            'Responda somente JSON válido, sem markdown, como objeto {"questions":[{"nivel":"Fácil|Médio|Difícil","tipo":"Conceitual|Código|Cenário","p":"enunciado","codigo":"","o":["texto completo da alternativa 1","texto completo da alternativa 2","texto completo da alternativa 3","texto completo da alternativa 4"],"a":0,"correta":"copie exatamente o texto da alternativa correta","e":"explique por que a alternativa correta é certa e as demais não são"}]}. O campo "a" é obrigatório: índice inteiro de 0 a 3 da única alternativa correta. Nunca omita a resposta nem a explicação.');

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
                    question.o.every(function (option) { return typeof option === "string" && option.trim() && !/^(?:[a-d]|alternativa\s+[a-d]|op[cç][aã]o\s+[a-d])\.?$/i.test(option.trim()); }) &&
                    new Set(question.o).size === 4 &&
                    Number.isInteger(question.a) && question.a >= 0 && question.a < 4 &&
                    typeof question.correta === "string" && question.correta.trim().length > 0 &&
                    question.o.some(function (option) { return option.replace(/^[A-D][).:\-]\s*/i, "").trim() === question.correta.trim(); }) &&
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
    var wasTruncated = txt.indexOf(AI_TRUNCATION_MARKER) !== -1;
    if (wasTruncated) {
        txt = txt.replace(AI_TRUNCATION_MARKER, "");
        var continuationProvider = aiNextConnectedProvider(cfg.provider || GEN_CFG.provider);
        if (continuationProvider) {
            aiActivateProvider(continuationProvider);
            cfg.provider = continuationProvider;
            cfg.model = AI_PROVIDERS[continuationProvider].defaultModel;
            cfg.key = GEN_CFG.keys[continuationProvider] || GEN_CFG.savedKeys[continuationProvider];
        }
    }
    var arr = extractJsonArray(txt);
    arr.forEach(function (question) {
        if (!question || !Array.isArray(question.o)) return;
        question.o = question.o.map(function (option) { return String(option || "").replace(/^[A-D][).:\-]\s*/i, "").trim(); });
        if (typeof question.correta === "string") {
            var expected = question.correta.replace(/^[A-D][).:\-]\s*/i, "").trim();
            var exactIndex = question.o.findIndex(function (option) { return option === expected; });
            if (exactIndex !== -1) question.a = exactIndex;
        }
    });

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
            q.o.length !== 4 || !q.o.every(function (option) { return typeof option === "string" && option.trim() && !/^(?:[a-d]|alternativa\s+[a-d]|op[cç][aã]o\s+[a-d])\.?$/i.test(option.trim()); }) ||
            new Set(q.o).size !== 4 || !Number.isInteger(q.a) || q.a < 0 || q.a >= 4 ||
            typeof q.correta !== "string" || q.o[q.a] !== q.correta.replace(/^[A-D][).:\-]\s*/i, "").trim() ||
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
    var prompt = "Crie 4 cards didáticos curtos, em português do Brasil, para preparar o estudante antes de responder questões sobre: " + cfg.tema + ". Contexto obrigatório: Databricks. Dificuldade: " + cfg.dif + ". " + (cfg.context ? "Foco desta aula: " + cfg.context + ". " : "") + (cfg.extra ? "Use também estas fontes e trechos como referência, sem inventar fatos: " + cfg.extra.slice(0, 5000) + "\n" : "") + "Cada card deve ensinar algo útil, não fazer uma pergunta. Inclua conceito, explicação clara e exemplo concreto (SQL, Python ou PySpark quando adequado). Não inclua questões, alternativas ou gabaritos. Retorne somente JSON válido no formato {\"cards\":[{\"title\":\"...\",\"concept\":\"...\",\"explanation\":\"...\",\"example\":\"...\"}]} .";
    var text = await requestStudyAi({
        provider: cfg.provider || GEN_CFG.provider, key: cfg.key || GEN_CFG.apiKey, model: cfg.model || GEN_CFG.model,
        max_tokens: 1100, responseMimeType: "application/json", temperature: 0.35,
        system: "Você é um professor de Databricks. Produza material de estudo correto, didático e conciso. Responda somente JSON válido.",
        messages: [{ role: "user", content: prompt }],
        validateResponse: function (responseText) {
            var clean = String(responseText).replace(AI_TRUNCATION_MARKER, "");
            var match = clean.match(/\{[\s\S]*\}/);
            var candidate = JSON.parse(match ? match[0] : clean);
            if (!candidate || !Array.isArray(candidate.cards) || candidate.cards.length < 2) throw new Error("A resposta de cards veio incompleta.");
        }
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

async function reviewGeneratedQuestions(questions, cfg) {
    if (!AI_ORCHESTRATION.finalReview || !questions.length) return { enabled: false, approved: null, issues: [], reviewer: "" };
    var readyReviewers = await aiFindReadyProviders(cfg.provider, cfg.signal || (AI_ACTIVE_CONTROLLER && AI_ACTIVE_CONTROLLER.signal));
    var reviewerProvider = readyReviewers[0] || cfg.provider || GEN_CFG.provider;
    var reviewerKey = GEN_CFG.keys[reviewerProvider] || GEN_CFG.savedKeys[reviewerProvider] || (reviewerProvider === GEN_CFG.provider ? GEN_CFG.apiKey : "");
    var compact = questions.map(function (q, index) {
        return q.mode === "code" ? { index: index, type: "code", language: q.language, prompt: q.p, task: q.task, solution: q.solution, explanation: q.e } :
            { index: index, type: "multiple_choice", prompt: String(q.p || "").replace(/<[^>]*>/g, " ").slice(0, 1200), options: q.o, correctIndex: q.a, explanation: q.e };
    });
    var prompt = "Faça uma revisão técnica final independente destas questões sobre Databricks. Não recrie nem reescreva as questões. Verifique precisão técnica, coerência entre enunciado e gabarito, alternativas ambíguas, erros de SQL/Python/PySpark e explicações. Retorne somente JSON: {\"approved\":true|false,\"issues\":[{\"index\":0,\"severity\":\"alta|média|baixa\",\"reason\":\"...\",\"suggestion\":\"...\"}]}. Use índices de 0 a " + (questions.length - 1) + ". Se não houver problemas, use approved=true e issues=[]. Não invente problemas." + "\nQUESTÕES: " + JSON.stringify(compact);
    var raw = await requestStudyAi({
        provider: reviewerProvider, key: reviewerKey, model: AI_PROVIDERS[reviewerProvider].defaultModel,
        max_tokens: Math.min(1800, 350 + questions.length * 110), responseMimeType: "application/json", temperature: 0.1,
        cache: false, system: "Você é um revisor técnico independente de material didático Databricks. Seja conservador, preciso e objetivo.",
        messages: [{ role: "user", content: prompt }],
        validateResponse: function (text) {
            var clean = String(text).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
            var result = JSON.parse(clean);
            if (typeof result.approved !== "boolean" || !Array.isArray(result.issues)) throw new Error("O revisor retornou um relatório inválido.");
        }
    });
    var clean = String(raw).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    var report = JSON.parse(clean);
    report.enabled = true;
    report.reviewer = GEN_CFG.provider || reviewerProvider;
    report.independent = report.reviewer !== cfg.provider;
    report.reviewedAt = new Date().toISOString();
    return report;
}

async function runGen(resumeExisting) {
    if (!saveGenSettings()) return;
    var savedWork = resumeExisting ? loadAiWorkCheckpoint() : null;
    if (resumeExisting && !savedWork) { gStatus("Não há trabalho salvo para retomar.", true); renderAiCheckpointControls(); return; }
    var cfg, qtd, all, state;
    if (savedWork) {
        cfg = Object.assign({}, savedWork.cfg);
        cfg.provider = GEN_CFG.provider;
        cfg.model = GEN_CFG.model;
        cfg.key = GEN_CFG.keys[cfg.provider] || GEN_CFG.savedKeys[cfg.provider] || GEN_CFG.apiKey;
        qtd = savedWork.qtd;
        all = Array.isArray(savedWork.all) ? savedWork.all.slice() : [];
        state = savedWork;
        if (!cfg.key) { gStatus("Conecte uma API antes de retomar. O checkpoint não armazena chaves por segurança.", true); return; }
        gStatus("↻ Retomando do checkpoint: " + all.length + " de " + qtd + " questões já concluídas.");
    } else {
        cfg = {
            tema: gv("gTema").trim() || "Databricks em geral", dif: gv("gDif"), tipo: gv("gTipo"),
            ling: gv("gLing"), extra: gv("gExtra").trim(), key: GEN_CFG.apiKey, provider: GEN_CFG.provider, model: GEN_CFG.model
        };
        qtd = Math.max(1, parseInt(gv("gQtd")) || 5);
        if (qtd > 25) { gStatus("O limite é de 25 questões por solicitação. Reduza a quantidade e tente novamente.", true); return; }
        all = [];
        state = { version: 1, kind: "question-generation", status: "running", stage: "questions", cfg: { tema: cfg.tema, dif: cfg.dif, tipo: cfg.tipo, ling: cfg.ling, extra: cfg.extra, provider: cfg.provider, model: cfg.model }, qtd: qtd, all: [], studyCards: [], reviewReport: null, batchesCompleted: 0, createdAt: new Date().toISOString() };
        saveAiWorkCheckpoint(state);
    }
    var btn = document.getElementById("gGo"); btn.disabled = true;
    var resumeBtn = document.getElementById("gResume"); if (resumeBtn) resumeBtn.disabled = true;
    var falhas = 0, erro = "";
    try {
        while (all.length < qtd && falhas < 2) {
            var mixed = cfg.tipo === "Misto";
            var originalType = cfg.tipo;
            var n = mixed ? 1 : Math.min(cfg.tipo === "Prática de código (IDE)" ? 2 : 5, qtd - all.length);
            if (mixed) {
                var mixedPlan = ["Múltipla escolha", "Prática de código (IDE)", "Múltipla escolha", "Prática de código (IDE)", "Múltipla escolha"];
                cfg.tipo = mixedPlan[all.length % mixedPlan.length];
            }
            state.stage = "questions"; state.status = "running"; state.all = all; state.nextQuestion = all.length + 1;
            saveAiWorkCheckpoint(state);
            gStatus("⏳ Etapa " + (state.batchesCompleted + 1) + ": gerando questões " + (all.length + 1) + " a " + (all.length + n) + " de " + qtd + "...");
            var lote = await genBatch(cfg, n, all.map(function (q) { return q._raw || q.p; }));
            cfg.tipo = originalType;
            cfg.provider = GEN_CFG.provider;
            cfg.key = GEN_CFG.apiKey;
            cfg.model = GEN_CFG.model;
            if (!lote.length) falhas++;
            else {
                falhas = 0;
                all = all.concat(lote).slice(0, qtd);
                state.all = all; state.batchesCompleted += 1; state.nextQuestion = all.length + 1;
                state.lastProvider = GEN_CFG.provider; state.status = "running";
                saveAiWorkCheckpoint(state);
                renderAiCheckpointControls();
            }
        }
        if (all.length < qtd) throw new Error("A geração parou antes de completar todas as questões. O progresso concluído foi salvo; use Retomar trabalho salvo.");
    } catch (err) {
        if (typeof originalType !== "undefined") cfg.tipo = originalType;
        erro = err.message;
        state.status = "paused"; state.all = all; state.lastError = erro; state.lastProvider = GEN_CFG.provider;
        saveAiWorkCheckpoint(state);
    }
    finally { btn.disabled = false; if (resumeBtn) resumeBtn.disabled = false; }
    if (!all.length) {
        renderAiCheckpointControls();
        gStatus(erro || "A IA não retornou questões válidas. Tente de novo ou reduza o lote.", true);
        return;
    }
    if (erro) {
        renderAiCheckpointControls();
        gStatus("Trabalho pausado. " + all.length + "/" + qtd + " questões salvas. " + erro, true);
        return;
    }

    state.stage = "cards"; state.status = "running"; state.all = all; saveAiWorkCheckpoint(state);
    var studyCards = Array.isArray(state.studyCards) ? state.studyCards : [];
    if (!studyCards.length && document.getElementById("gStudyCards") && document.getElementById("gStudyCards").checked) {
        try {
            gStatus("📚 Etapa de cards: preparando material explicativo...");
            studyCards = await genStudyCards(cfg);
            state.studyCards = studyCards; saveAiWorkCheckpoint(state);
        } catch (studyError) {
            appNotice("As questões foram criadas, mas os cards de estudo não puderam ser gerados: " + studyError.message, true);
        }
    }

    var reviewReport = state.reviewReport;
    if (!reviewReport && AI_ORCHESTRATION.finalReview) {
        try {
            state.stage = "final-review"; saveAiWorkCheckpoint(state);
            gStatus("🔎 Revisão final: um provedor disponível está verificando as questões...");
            reviewReport = await reviewGeneratedQuestions(all, cfg);
            state.reviewReport = reviewReport; saveAiWorkCheckpoint(state);
        } catch (reviewError) {
            reviewReport = { enabled: true, approved: null, issues: [{ severity: "baixa", reason: "A revisão automática não foi concluída: " + reviewError.message }], reviewer: "indisponível" };
            state.reviewReport = reviewReport; saveAiWorkCheckpoint(state);
            appNotice("As questões foram geradas, mas a revisão independente não foi concluída: " + reviewError.message, true);
        }
    }
    all = all.slice(0, qtd).map(function (q) { delete q._raw; return q; });
    var id = "ia_" + Date.now();
    var aula = {
        id: id, t: "🤖 " + cfg.tema + " · " + cfg.dif + " (" + all.length + ")", d: (all.length * 2) + " min",
        h: "Estude os cards explicativos abaixo antes de responder. Tema: " + cfg.tema + ". Dificuldade: " + cfg.dif + ". Tipo: " + cfg.tipo + ".",
        studyCards: studyCards,
        aiReview: reviewReport || null,
        q: all
    };
    var mod = MODS.find(function (m) { return m.ia; });
    if (!mod) { mod = { t: "🤖 Questões geradas por IA", ia: true, l: [] }; MODS.push(mod); }
    var priorAula = mod.l.find(function (existing) { return existing.id === id; });
    if (!priorAula) mod.l.push(aula);
    state.stage = "saving"; state.status = "completed"; state.finalAulaId = id; state.all = all; state.reviewReport = reviewReport;
    saveAiWorkCheckpoint(state);
    var saved = saveAllContent();
    if (saved) clearAiWorkCheckpoint();
    else { state.status = "paused"; state.lastError = "Não foi possível persistir o conteúdo no armazenamento local."; saveAiWorkCheckpoint(state); }
    renderMenu();
    if (erro) appNotice("Foram geradas " + all.length + " de " + qtd + " questões; a solicitação foi interrompida: " + erro, true);
    else if (!saved) appNotice("Questões geradas, mas não foi possível salvá-las. Elas estão disponíveis nesta página enquanto ela permanecer aberta.", true);
    else if (all.length < qtd) appNotice("Foram geradas " + all.length + " de " + qtd + " questões válidas. A IA retornou menos questões do que o solicitado.", true);
    else if (reviewReport && reviewReport.approved === false) appNotice("Geração concluída. A revisão de " + aiProviderLabel(reviewReport.reviewer) + " sinalizou " + reviewReport.issues.length + " ponto(s) para conferência. Consulte a aula.", true);
    else if (reviewReport && reviewReport.approved === true) appNotice("Geração concluída e revisada por " + aiProviderLabel(reviewReport.reviewer) + (reviewReport.independent ? " (revisão cruzada)." : " (mesmo provedor; não é uma revisão independente)."));
    renderAiCheckpointControls();
    closeGenModal();
    location.hash = "#" + id;
}
