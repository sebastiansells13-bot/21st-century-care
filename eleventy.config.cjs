const { DateTime } = require("luxon");
const { createHash } = require("node:crypto");
const { readFileSync, existsSync } = require("node:fs");
const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

const isProduction = process.env.ELEVENTY_ENV === "production";
const outputDirectory = isProduction ? "docs" : "dev";

// Content-address an asset so production caching can be immutable and
// far-future without ever serving a stale file after a deploy.
function contentHash(filePath) {
  if (!existsSync(filePath)) return "dev";
  return createHash("sha256").update(readFileSync(filePath)).digest("hex").slice(0, 12);
}

const assetFiles = {
  stylesheet: "src/_includes/css/index.css",
};
const assetPaths = {
  stylesheet: `/assets/css/index.${contentHash(assetFiles.stylesheet)}.css`,
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);
  // Note: @quasibit/eleventy-plugin-sitemap builds <loc> via `new URL(page.url,
  // hostname)`, which drops any path segment in `hostname` (root-relative
  // page.url resolves against the origin only) — fine for a client site on
  // its own domain, but wrong for this GitHub Pages project URL. See
  // src/sitemap.xml.njk, which builds the sitemap manually instead of using
  // this plugin's hostname, for that reason.
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://sebastiansells13-bot.github.io",
    },
  });

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.ignores.add("**/.DS_Store");
  eleventyConfig.watchIgnores.add("**/.DS_Store");
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addGlobalData("assetPaths", assetPaths);

  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy")
  );

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd")
  );

  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("slugify", (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  });

  // Keyword → emoji lookup for service cards, so the 20-item services list
  // (src/_data/services.json) gets a distinct, colorful glyph per card
  // without needing a real photo/icon uploaded for each one. Matched by
  // substring against the service title, first match wins, falls back to a
  // generic icon for anything added later that doesn't match a keyword.
  // Update this list rather than the (still-supported) per-service `icon`
  // image field in .pages.yml if a client wants a real icon for one entry.
  const serviceIconMap = [
    [["housing", "homeless"], "🏠"],
    [["transportation"], "🚐"],
    [["utility"], "💡"],
    [["stress"], "🌿"],
    [["medication"], "💊"],
    [["family therapy", "individual and family", "therapy"], "🤝"],
    [["ssi"], "📝"],
    [["medical appointment"], "🩺"],
    [["financial assistance"], "💵"],
    [["tutoring"], "📚"],
    [["job search"], "🔍"],
    [["interviewing", "presentation"], "🎤"],
    [["social and communication", "communication skills"], "💬"],
    [["recreational"], "🎨"],
    [["financial literacy"], "📊"],
    [["crisis"], "🆘"],
    [["substance"], "🌱"],
    [["reentry"], "🔑"],
    [["drug screening"], "✅"],
    [["parenting"], "👨‍👩‍👧"],
  ];
  eleventyConfig.addFilter("serviceIcon", (title) => {
    const t = (title || "").toLowerCase();
    for (const [keywords, icon] of serviceIconMap) {
      if (keywords.some((k) => t.includes(k))) return icon;
    }
    return "✨";
  });

  // During `npm start`, serve source images directly instead of copying
  // them into `dev/` on every rebuild. Production media is optimized by
  // the CI pipeline (scripts/optimize-media.mjs) after Eleventy runs.
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy({ "src/_includes/img": "img" });
  eleventyConfig.addPassthroughCopy({
    [assetFiles.stylesheet]: assetPaths.stylesheet.slice(1),
  });
  eleventyConfig.addPassthroughCopy({ "src/_includes/favicons": "favicons" });
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ class: "direct-link", symbol: "#" }),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    // GitHub Pages project site (no custom domain yet) serves this at
    // /21st-century-care/, so every root-relative href/src needs that
    // prefix. Eleventy's bundled html-base-plugin (registered via the RSS
    // plugin above) rewrites them automatically based on this value. Switch
    // back to "/" if/when the client points a custom domain (CNAME) here.
    pathPrefix: "/21st-century-care/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: outputDirectory,
    },
  };
};
