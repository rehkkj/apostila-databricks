/* Pesquisa web e RAG local para documentos importados. Todo o índice fica neste navegador. */
var TUTOR_RAG_KEY = "databricksTutorRagIndexV1";
var TUTOR_RAG_MAX_DOCS = 30;
var TUTOR_RAG_MAX_CHARS = 2400000;
var TUTOR_RAG_CHUNK = 1050;
var TUTOR_RAG_OVERLAP = 160;
var TUTOR_RAG_INDEX = (function () {
    try { var saved = JSON.parse(localStorage.getItem(TUTOR_RAG_KEY) || "[]"); return Array.isArray(saved) ? saved : []; }
    catch (error) { return []; }
})();
function persistTutorRag() {
    try {
        var compact = TUTOR_RAG_INDEX.slice();
        var names = Array.from(new Set(compact.map(function (item) { return item.file; })));
        while (names.length > TUTOR_RAG_MAX_DOCS) { var oldest = names.shift(); compact = compact.filter(function (item) { return item.file !== oldest; }); }
        while (JSON.stringify(compact).length > TUTOR_RAG_MAX_CHARS && compact.length) compact.shift();
        TUTOR_RAG_INDEX = compact;
        localStorage.setItem(TUTOR_RAG_KEY, JSON.stringify(compact));
        return true;
    } catch (error) { return false; }
}
function tutorRagChunks(text, fileName) {
    var clean = String(text || "").replace(/\r/g, "").replace(/[\t ]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    var chunks = [];
    for (var start = 0; start < clean.length; start += TUTOR_RAG_CHUNK - TUTOR_RAG_OVERLAP) {
        var part = clean.slice(start, start + TUTOR_RAG_CHUNK).trim();
        if (part.length > 40) chunks.push({ file: fileName, text: part });
        if (start + TUTOR_RAG_CHUNK >= clean.length) break;
    }
    return chunks;
}
function loadExternalScript(src, test) {
    return new Promise(function (resolve, reject) {
        if (test()) return resolve();
        var existing = document.querySelector('script[data-ai-lib="' + src + '"]');
        if (existing) { existing.addEventListener("load", resolve, { once: true }); existing.addEventListener("error", reject, { once: true }); return; }
        var script = document.createElement("script"); script.src = src; script.async = true; script.dataset.aiLib = src;
        script.onload = resolve; script.onerror = function () { reject(new Error("Não foi possível carregar o leitor do formato do documento.")); };
        document.head.appendChild(script);
    });
}
async function extractTutorDocument(file) {
    var ext = (file.name.split(".").pop() || "").toLowerCase();
    if (["txt", "md", "csv", "json"].includes(ext)) return await file.text();
    if (ext === "pdf") {
        await loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", function () { return Boolean(window.pdfjsLib); });
        if (!window.pdfjsLib) throw new Error("Leitor PDF indisponível.");
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        var pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        var pages = [];
        for (var pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
            var page = await pdf.getPage(pageNo); var content = await page.getTextContent();
            pages.push(content.items.map(function (item) { return item.str || ""; }).join(" "));
        }
        return pages.join("\n\n");
    }
    if (ext === "docx") {
        await loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js", function () { return Boolean(window.mammoth); });
        if (!window.mammoth) throw new Error("Leitor DOCX indisponível.");
        var result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        return result.value || "";
    }
    throw new Error("Formato não suportado. Use TXT, MD, CSV, JSON, PDF ou DOCX.");
}
function initializeTutorResearchControls(root) {
    if (!root) return;
    root.querySelectorAll("[data-tutor-stop]").forEach(function (button) {
        if (button.dataset.researchBound) return; button.dataset.researchBound = "true";
        button.addEventListener("click", stopTutorGeneration);
    });
    root.querySelectorAll("[data-rag-import]").forEach(function (button) {
        if (button.dataset.researchBound) return; button.dataset.researchBound = "true";
        button.addEventListener("click", function () { var input = root.querySelector("[data-rag-files]"); if (input) input.click(); });
    });
    root.querySelectorAll("[data-rag-clear]").forEach(function (button) {
        if (button.dataset.researchBound) return; button.dataset.researchBound = "true";
        button.addEventListener("click", function () {
            if (!TUTOR_RAG_INDEX.length) return;
            if (!window.confirm("Remover todos os documentos importados do Datrics neste navegador?")) return;
            TUTOR_RAG_INDEX = []; persistTutorRag();
            root.querySelectorAll("[data-rag-status]").forEach(function (status) { status.textContent = "Documentos removidos."; });
        });
    });
    root.querySelectorAll("[data-rag-files]").forEach(function (input) {
        if (input.dataset.researchBound) return; input.dataset.researchBound = "true";
        input.addEventListener("change", async function () {
            var status = root.querySelector("[data-rag-status]"); var files = Array.from(input.files || []);
            if (!files.length) return;
            if (files.some(function (file) { return file.size > 15 * 1024 * 1024; })) { if (status) status.textContent = "Cada arquivo deve ter no máximo 15 MB."; input.value = ""; return; }
            if (status) status.textContent = "Lendo documentos...";
            var added = 0; var errors = [];
            for (var i = 0; i < files.length; i++) {
                try {
                    var content = await extractTutorDocument(files[i]);
                    var chunks = tutorRagChunks(content, files[i].name);
                    if (!chunks.length) throw new Error("Nenhum texto extraível encontrado.");
                    TUTOR_RAG_INDEX = TUTOR_RAG_INDEX.filter(function (item) { return item.file !== files[i].name; }).concat(chunks);
                    added++;
                } catch (error) { errors.push(files[i].name + ": " + error.message); }
            }
            var saved = persistTutorRag();
            if (status) status.textContent = added + " documento(s) indexado(s)" + (saved ? " localmente." : "; armazenamento cheio, remova documentos antigos.") + (errors.length ? " Erros: " + errors.join("; ") : "");
            input.value = "";
        });
    });
}
function tutorSearchTerms(text) {
    return String(text || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .split(/[^a-z0-9_]+/).filter(function (word) { return word.length > 2 && !/^(que|para|com|uma|como|qual|quais|sobre|isso|essa|este|the|and|for|with|what|how)$/.test(word); });
}
function retrieveTutorDocuments(query, limit) {
    var terms = tutorSearchTerms(query);
    if (!terms.length) return [];
    return TUTOR_RAG_INDEX.map(function (chunk) {
        var body = chunk.text.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        var score = 0;
        terms.forEach(function (term) { var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); var matches = body.match(new RegExp("\\b" + escaped, "g")); score += matches ? Math.min(matches.length, 5) : 0; });
        return { chunk: chunk, score: score };
    }).filter(function (item) { return item.score > 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, limit || 4).map(function (item) { return item.chunk; });
}
async function tutorWebSearch(query) {
    var terms = encodeURIComponent(query);
    var results = [];
    try {
        var ddg = await fetch("https://api.duckduckgo.com/?q=" + terms + "&format=json&no_html=1&skip_disambig=1", { signal: AI_ACTIVE_CONTROLLER ? AI_ACTIVE_CONTROLLER.signal : undefined });
        if (ddg.ok) {
            var data = await ddg.json();
            if (data.AbstractText) results.push({ title: data.Heading || "DuckDuckGo", text: data.AbstractText, url: data.AbstractURL || "https://duckduckgo.com/?q=" + terms });
            (data.RelatedTopics || []).forEach(function (item) {
                if (item && item.Text && item.FirstURL && results.length < 5) results.push({ title: item.Text.slice(0, 100), text: item.Text, url: item.FirstURL });
                (item.Topics || []).forEach(function (sub) { if (sub && sub.Text && sub.FirstURL && results.length < 5) results.push({ title: sub.Text.slice(0, 100), text: sub.Text, url: sub.FirstURL }); });
            });
        }
    } catch (error) { if (error.name === "AbortError") throw error; }
    var wikiUrl = "https://pt.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + terms + "&gsrlimit=4&prop=extracts&exintro=1&explaintext=1&format=json&origin=*";
    try {
        var wiki = await fetch(wikiUrl, { signal: AI_ACTIVE_CONTROLLER ? AI_ACTIVE_CONTROLLER.signal : undefined });
        if (wiki.ok) {
            var wikiData = await wiki.json();
            Object.keys((wikiData.query && wikiData.query.pages) || {}).forEach(function (id) {
                var page = wikiData.query.pages[id];
                if (page.extract) results.push({ title: page.title, text: page.extract.slice(0, 1100), url: "https://pt.wikipedia.org/?curid=" + id });
            });
        }
    } catch (error) { if (error.name === "AbortError") throw error; }
    return results.slice(0, 7);
}
async function buildTutorResearchContext(query, form) {
    var sections = [];
    var local = retrieveTutorDocuments(query, 4);
    if (local.length) sections.push("DOCUMENTOS IMPORTADOS (RAG local; priorize estes trechos quando pertinentes):\n" + local.map(function (item, index) { return "[Documento " + (index + 1) + ": " + item.file + "]\n" + item.text; }).join("\n\n"));
    var researchScope = form && (form.parentElement || form);
    var webToggle = researchScope && researchScope.querySelector('input[type="checkbox"][id$="WebSearch"]');
    if (webToggle && webToggle.checked) {
        try {
            var webResults = await tutorWebSearch(query);
            if (webResults.length) sections.push("RESULTADOS DE PESQUISA WEB (fontes externas; cite os links ao usar):\n" + webResults.map(function (item, index) { return "[Web " + (index + 1) + "] " + item.title + "\n" + item.text + "\nURL: " + item.url; }).join("\n\n"));
            else sections.push("A pesquisa web não retornou resultados úteis. Não invente fontes.");
        } catch (error) {
            if (error.name === "AbortError") throw error;
            sections.push("A pesquisa web falhou nesta tentativa (" + error.message + "). Não afirme que pesquisou na internet.");
        }
    }
    if (!sections.length) return "";
    return "\n\nFERRAMENTAS DE PESQUISA ATIVADAS:\n" + sections.join("\n\n") + "\n\nREGRAS: diferencie documentos importados de fontes web; não invente citações; se usar resultado web, inclua links Markdown correspondentes. Se os trechos não responderem, diga isso claramente.";
}
