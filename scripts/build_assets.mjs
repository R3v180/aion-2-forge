#!/usr/bin/env node
/**
 * Genera CSS/JS minificados.
 *
 * El minificado a mano de app.min.js (commit 4d9574c) trataba `//` como
 * comentario de línea y rompía la expresión regular `/^\//` de enPrincipal.
 * Ese archivo no llegaba a evaluarse, así que `cabecera` no existía.
 * Aquí se minifica con esbuild (respeta cadenas y regex) y se comprueba
 * que el resultado parsea y que enPrincipal sigue bien.
 *
 * Uso: node scripts/build_assets.mjs
 * Requiere el binario `esbuild` (ESBUILD=/ruta/esbuild si no está en el PATH).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ru", "ko", "ja"];

function esbuildBin() {
  if (process.env.ESBUILD && fs.existsSync(process.env.ESBUILD)) return process.env.ESBUILD;
  const local = "/tmp/asset-tools/node_modules/.bin/esbuild";
  if (fs.existsSync(local)) return local;
  const which = spawnSync("bash", ["-lc", "command -v esbuild"], { encoding: "utf8" });
  if (which.status === 0 && which.stdout.trim()) return which.stdout.trim();
  console.error("No está esbuild. Instálalo o exporta ESBUILD=/ruta/al/binario.");
  process.exit(1);
}

const ESBUILD = esbuildBin();

function esbuild(args) {
  const r = spawnSync(ESBUILD, args, { cwd: RAIZ, encoding: "utf8" });
  if (r.status !== 0) {
    console.error(r.stdout);
    console.error(r.stderr);
    throw new Error("esbuild falló: " + args.join(" "));
  }
}

function minifyJs(src, dest) {
  esbuild([src, "--minify", `--outfile=${dest}`]);
}

function minifyCss(src, dest) {
  esbuild([src, "--minify", `--outfile=${dest}`]);
}

function extraerTextos(src) {
  const start = src.indexOf("var TEXTOS = ");
  const end = src.indexOf("\nvar CLASES_INFO");
  if (start < 0 || end < 0) throw new Error("No se encontró TEXTOS o CLASES_INFO en js/i18n.js");
  const chunk = src.slice(start, end);
  const TEXTOS = vm.runInNewContext(chunk + "\nTEXTOS;");
  if (!TEXTOS || typeof TEXTOS !== "object") throw new Error("TEXTOS vacío");
  return { TEXTOS, start, end };
}

function nucleoI18n(src, start, end) {
  const reemplazo = "this.TEXTOS = this.TEXTOS || {};\n";
  return src.slice(0, start) + reemplazo + src.slice(end);
}

function escribirPaquetes(TEXTOS) {
  for (const lang of LANGS) {
    const plano = {};
    for (const [clave, valor] of Object.entries(TEXTOS)) {
      if (valor && typeof valor === "object") plano[clave] = valor[lang] || valor.es || "";
      else plano[clave] = valor == null ? "" : String(valor);
    }
    // JSON.stringify ya es JS válido. No pasar por esbuild: convierte · en \xB7,
    // que el navegador acepta pero json.loads de Flask no.
    const cuerpo = "var TEXTOS=" + JSON.stringify(plano) + ";\n";
    const dest = path.join(RAIZ, "js", `i18n-${lang}.min.js`);
    fs.writeFileSync(dest, cuerpo);
    const out = fs.readFileSync(dest, "utf8");
    if (!out.includes("var TEXTOS=")) throw new Error("el paquete " + lang + " no expone TEXTOS");
    vm.runInNewContext(out, {});
  }
}

function cssCritico() {
  const marco = fs.readFileSync(path.join(RAIZ, "css", "marco.css"), "utf8");
  const app = fs.readFileSync(path.join(RAIZ, "css", "app.css"), "utf8");
  const re = /\/\*\s*@critical-home\s*\*\/([\s\S]*?)\/\*\s*@\/critical-home\s*\*\//g;
  const trozos = [];
  let m;
  while ((m = re.exec(app))) trozos.push(m[1].trim());
  if (trozos.length < 4) throw new Error("faltan bloques @critical-home en css/app.css (" + trozos.length + ")");
  const tmp = path.join(RAIZ, "css", ".home-critical.tmp.css");
  const dest = path.join(RAIZ, "css", "home-critical.min.css");
  fs.writeFileSync(tmp, marco.replace(/\/\*\s*@critical-home[\s\S]*?\*\//g, "") + "\n" + trozos.join("\n") + "\n");
  try {
    minifyCss(tmp, dest);
  } finally {
    fs.unlinkSync(tmp);
  }
}

function comprobarAppMin() {
  const archivo = path.join(RAIZ, "js", "app.min.js");
  const code = fs.readFileSync(archivo, "utf8");
  const sandbox = {
    location: {
      hostname: "127.0.0.1",
      protocol: "http:",
      pathname: "/index.html",
      search: "",
      hash: "",
      port: "",
      replace() {},
    },
    document: { addEventListener() {}, getElementById() { return null; } },
    navigator: { language: "es" },
    URLSearchParams,
    console,
  };
  vm.runInNewContext(code, sandbox, { filename: "js/app.min.js" });
  if (typeof sandbox.cabecera !== "function") throw new Error("cabecera no quedó definida en app.min.js");
  if (sandbox.enPrincipal("/abc") !== sandbox.WEB_PRINCIPAL + "/abc") {
    throw new Error("enPrincipal rompió la barra inicial: " + sandbox.enPrincipal("/abc"));
  }
  if (sandbox.enPrincipal("abc") !== sandbox.WEB_PRINCIPAL + "/abc") {
    throw new Error("enPrincipal no antepone la barra");
  }
  const vistas = fs.readFileSync(path.join(RAIZ, "js", "vistas.min.js"), "utf8");
  const noticias = fs.readFileSync(path.join(RAIZ, "js", "noticias.min.js"), "utf8");
  vm.runInNewContext(vistas, sandbox, { filename: "js/vistas.min.js" });
  vm.runInNewContext(noticias, sandbox, { filename: "js/noticias.min.js" });
  const foto = "https://profileimg.plaync.com/x";
  if (sandbox.urlFotoPj(foto) !== foto) throw new Error("regex de urlFotoPj rota");
  if (!sandbox.imagenNoticia({ imagen: "https://assets.playnccdn.com/download_thumbnail/a.jpg" }).includes("/download/")) {
    throw new Error("regex de imagenNoticia rota");
  }
}

function main() {
  process.chdir(RAIZ);
  const src = fs.readFileSync("js/i18n.js", "utf8");
  const { TEXTOS, start, end } = extraerTextos(src);
  escribirPaquetes(TEXTOS);
  const nucleo = path.join(RAIZ, "js", ".i18n-core.tmp.js");
  fs.writeFileSync(nucleo, nucleoI18n(src, start, end));
  try {
    minifyJs(nucleo, "js/i18n.min.js");
  } finally {
    fs.unlinkSync(nucleo);
  }
  const pares = [
    ["js/i18n-boot.js", "js/i18n-boot.min.js"],
    ["js/app.js", "js/app.min.js"],
    ["js/hero-carrusel.js", "js/hero-carrusel.min.js"],
    ["js/vistas.js", "js/vistas.min.js"],
    ["js/noticias.js", "js/noticias.min.js"],
    ["js/inicio.js", "js/inicio.min.js"],
  ];
  for (const [a, b] of pares) minifyJs(a, b);
  minifyCss("css/app.css", "css/app.min.css");
  minifyCss("css/marco.css", "css/marco.min.css");
  cssCritico();
  comprobarAppMin();
  const core = fs.statSync("js/i18n.min.js").size;
  const es = fs.statSync("js/i18n-es.min.js").size;
  const crit = fs.statSync("css/home-critical.min.css").size;
  console.log(`i18n núcleo ${core} B, paquete es ${es} B, crítico ${crit} B`);
  if (core > 80000) throw new Error("el núcleo i18n sigue llevando el diccionario (" + core + ")");
  console.log("assets minificados y comprobados");
}

main();
