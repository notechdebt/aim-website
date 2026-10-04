import { readFileSync } from "node:fs";
import { buildGraph } from "./src/_lib/schema.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/fonts": "fonts",
    "src/images": "images",
    "src/favicon.ico": "favicon.ico",
    "src/apple-touch-icon.png": "apple-touch-icon.png",
    "src/site.webmanifest": "site.webmanifest",
    "src/CNAME": "CNAME",
  });

  // Sitemap <lastmod> comes from each page's last git commit.
  eleventyConfig.addGlobalData("date", "git Last Modified");

  // Inline a file from _includes verbatim (CSS/JS), without template parsing.
  eleventyConfig.addShortcode("inline", (path) => readFileSync(`src/_includes/${path}`, "utf8").trim());

  eleventyConfig.addShortcode("structuredData", function () {
    const json = JSON.stringify(buildGraph(this.ctx)).replace(/</g, "\\u003c");
    return `<script type="application/ld+json">\n${json}\n</script>`;
  });

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addWatchTarget("src/_lib/");

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
