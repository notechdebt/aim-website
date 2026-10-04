// SEO and integrity checks for the built site in _site/.
// Fails (exit 1) on anything that would quietly hurt search visibility.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "node-html-parser";

const OUT = process.env.SITE_DIR || "_site";
const SITE = "https://aimbusinessinc.com";
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html"));
const urlOf = (file) => "/" + relative(OUT, file).replace(/index\.html$/, "");
const fileOf = (path) => {
  const clean = decodeURIComponent(path.split("#")[0].split("?")[0]);
  const p = join(OUT, clean);
  if (clean.endsWith("/")) return join(p, "index.html");
  if (existsSync(p) && statSync(p).isDirectory()) return join(p, "index.html");
  return p;
};
const text = (s) => s.replace(/\s+/g, " ").trim();

const docs = new Map(htmlFiles.map((f) => [f, parse(readFileSync(f, "utf8"))]));
const ids = (file) => new Set(docs.get(file)?.querySelectorAll("[id]").map((e) => e.id) ?? []);

const isRedirect = (doc) => !!doc.querySelector('meta[http-equiv="refresh"]');
const contentPages = [];

for (const [file, doc] of docs) {
  const rel = relative(OUT, file);
  const raw = readFileSync(file, "utf8");

  // Links and fragments resolve inside the site
  for (const el of doc.querySelectorAll("a[href], link[href], img[src], script[src]")) {
    const ref = el.getAttribute("href") ?? el.getAttribute("src");
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const [path, frag] = ref.split("#");
    const target = path ? fileOf(path.startsWith("/") ? path : "/" + relative(OUT, join(file, "..", path))) : file;
    if (!existsSync(target)) fail(rel, `broken link ${ref}`);
    else if (frag && target.endsWith(".html") && !ids(target).has(frag)) fail(rel, `missing anchor #${frag} (${ref})`);
  }

  if (isRedirect(doc)) {
    const to = doc.querySelector('meta[http-equiv="refresh"]').getAttribute("content").split("url=")[1];
    if (!to?.startsWith("/")) fail(rel, "redirect target must be root-relative");
    continue;
  }
  if (rel === "404.html") continue;
  contentPages.push(urlOf(file));

  // Head essentials
  const url = SITE + urlOf(file);
  const title = doc.querySelector("title")?.text.trim() ?? "";
  if (!title) fail(rel, "missing <title>");
  else if (title.length > 65) fail(rel, `title is ${title.length} chars (max 65): ${title}`);
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  if (desc.length < 70 || desc.length > 160) fail(rel, `meta description is ${desc.length} chars (want 70-160)`);
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
  if (canonical !== url) fail(rel, `canonical ${canonical} != ${url}`);
  if (doc.querySelector('meta[property="og:url"]')?.getAttribute("content") !== url) fail(rel, "og:url does not match canonical");
  if (!doc.querySelector('meta[property="og:image"]')) fail(rel, "missing og:image");

  // One H1
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length !== 1) fail(rel, `expected 1 <h1>, found ${h1s.length}`);

  // Images: alt and dimensions, no large inline data
  for (const img of doc.querySelectorAll("img")) {
    if (!img.hasAttribute("alt")) fail(rel, `img without alt: ${img.getAttribute("src")}`);
    if (!img.getAttribute("width") || !img.getAttribute("height")) fail(rel, `img without width/height: ${img.getAttribute("src")}`);
  }
  for (const m of raw.matchAll(/data:[^"')\s]{2048,}/g)) fail(rel, `inline data URI of ${m[0].length} bytes; use a file`);

  // Structured data parses; FAQ schema matches visible FAQ word for word
  const ld = doc.querySelectorAll('script[type="application/ld+json"]');
  if (!ld.length) fail(rel, "missing JSON-LD");
  for (const s of ld) {
    let json;
    try {
      json = JSON.parse(s.text);
    } catch (e) {
      fail(rel, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    const graph = json["@graph"] ?? [json];
    const faq = graph.find((n) => n["@type"] === "FAQPage");
    const visible = doc.querySelectorAll(".qa details").map((d) => ({
      q: text(d.querySelector("summary").text),
      a: text(d.querySelector(".ans").text),
    }));
    if (faq || visible.length) {
      const schema = (faq?.mainEntity ?? []).map((m) => ({ q: text(m.name), a: text(m.acceptedAnswer.text) }));
      if (schema.length !== visible.length) fail(rel, `FAQ schema has ${schema.length} questions, page shows ${visible.length}`);
      schema.forEach((s, i) => {
        const v = visible[i];
        if (!v || s.q !== v.q || s.a !== v.a) fail(rel, `FAQ schema/visible mismatch at question ${i + 1}: "${s.q}"`);
      });
    }
    if (!graph.some((n) => n["@id"] === `${SITE}/#business`)) fail(rel, "JSON-LD missing the business node");
  }
}

// Sitemap lists exactly the content pages; robots points at it
const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !u.match(/\.(webp|jpe?g|png)$/));
const expected = contentPages.map((p) => SITE + p).sort();
if (JSON.stringify([...locs].sort()) !== JSON.stringify(expected)) {
  fail("sitemap.xml", `lists ${locs.length} URLs, expected ${expected.length}: ${expected.filter((u) => !locs.includes(u)).join(", ") || "extra entries"}`);
}
if (!readFileSync(join(OUT, "robots.txt"), "utf8").includes(`Sitemap: ${SITE}/sitemap.xml`)) fail("robots.txt", "missing Sitemap line");

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ ${contentPages.length} pages, ${htmlFiles.length - contentPages.length} redirect/404 pages checked`);
