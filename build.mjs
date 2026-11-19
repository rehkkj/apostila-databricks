// Gera a versão otimizada em /dist (CSS e JS minificados, 1 arquivo de cada).
import { build, transform } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync, brotliCompressSync } from "node:zlib";

const read = (p) => readFileSync(p, "utf8");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/assets", { recursive: true });

// CSS
const css = await transform(read("src/css/styles.css"), { loader: "css", minify: true, target: "es2019" });
// JS: concatena na ordem (escopo global compartilhado, igual ao original) e minifica
const files = readdirSync("src/js").filter((f) => f.endsWith(".js")).sort();
const js = await transform(files.map((f) => read(`src/js/${f}`)).join("\n"), { loader: "js", minify: true, target: "es2018", legalComments: "none" });

const hash = (s) => createHash("sha1").update(s).digest("hex").slice(0, 8);
const cssName = `styles.${hash(css.code)}.min.css`;
const jsName = `app.${hash(js.code)}.min.js`;
writeFileSync(`dist/assets/${cssName}`, css.code);
writeFileSync(`dist/assets/${jsName}`, js.code);

let html = read("src/index.dist.html").replace("assets/styles.min.css", `assets/${cssName}`).replace("assets/app.min.js", `assets/${jsName}`);
writeFileSync("dist/index.html", html);

// Versões pré-comprimidas (úteis em hospedagens que servem .br/.gz)
for (const f of ["index.html", `assets/${cssName}`, `assets/${jsName}`]) {
  const buf = readFileSync(`dist/${f}`);
  writeFileSync(`dist/${f}.gz`, gzipSync(buf, { level: 9 }));
  writeFileSync(`dist/${f}.br`, brotliCompressSync(buf));
}
const kb = (n) => (n / 1024).toFixed(1) + " KB";
console.log("CSS:", kb(css.code.length), "| JS:", kb(js.code.length), "| HTML:", kb(html.length));
