// Lightweight English/Spanish toggle for this site's own static chrome and
// hardcoded template copy (nav, footer, buttons, hero taglines, the About
// page's narrative, the crisis callout, insurance info, and the "How to Get
// Started" steps). Client-side only — there's no separate /es/ URL per
// page, so this doesn't help a Spanish-language search show up in Google
// the way translated pages would; it's a visitor-facing convenience toggle,
// not an SEO strategy.
//
// What it does NOT translate, by design: anything edited through the CMS
// (services list, FAQ answers, team bios, testimonials, blog posts) or the
// sample Careers listings — those stay in whatever language they were
// written in, the same as any real i18n setup with a single-language
// content source. See AGENTS.md's "Spanish-language toggle" note.
//
// Markup contract:
//   data-i18n="key"          → element's text content is replaced
//   data-i18n-aria-label="key" / data-i18n-alt="key"
//                            → that attribute is replaced (screen-reader
//     labels and image alt text, which data-i18n's text swap can't reach)
//   <title data-i18n-title="key"> → the page-name half of the browser tab
//     title is replaced; the " · 21st Century Care" suffix is kept as-is
//     (set from each page's `titleKey` front matter — see base.njk)
//   data-i18n-lang="en"|"es" → element is shown only when that's the
//     current language (the other is `hidden`) — for content built with
//     the bilingual() macro (macros/bilingual.njk), used wherever a
//     translated string needs to interpolate business.json data.
// Relies on window.t()/window.i18nLang() from i18n-runtime.js, which must
// load before this script (see base.njk).
(function () {
  if (typeof window.t !== "function") return;

  function applyTo(el, lang) {
    // Cache the original English copy once, on the element itself, so
    // switching back to English restores exactly what the template
    // rendered — no need to keep a parallel "en" copy in the dictionary
    // for elements where the template text IS the English string.
    if (el.dataset.i18nEnCache === undefined) el.dataset.i18nEnCache = el.textContent;
    el.textContent = lang === "en" ? el.dataset.i18nEnCache : window.t(el.dataset.i18n);
  }

  var TRANSLATED_ATTRS = ["aria-label", "alt"];

  function applyAttrs(lang) {
    TRANSLATED_ATTRS.forEach(function (attr) {
      var dataAttr = "data-i18n-" + attr;
      var cacheAttr = "data-i18n-en-" + attr;
      document.querySelectorAll("[" + dataAttr + "]").forEach(function (el) {
        if (!el.hasAttribute(cacheAttr)) el.setAttribute(cacheAttr, el.getAttribute(attr) || "");
        el.setAttribute(attr, lang === "en" ? el.getAttribute(cacheAttr) : window.t(el.getAttribute(dataAttr)));
      });
    });
  }

  function applyTitle(lang) {
    var titleEl = document.querySelector("title[data-i18n-title]");
    if (!titleEl) return;
    if (titleEl.dataset.i18nEnCache === undefined) titleEl.dataset.i18nEnCache = document.title;
    var english = titleEl.dataset.i18nEnCache;
    var sep = english.indexOf(" · ");
    document.title = lang === "en" || sep === -1
      ? english
      : window.t(titleEl.dataset.i18nTitle) + english.slice(sep);
  }

  function applyAll(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      applyTo(el, lang);
    });
    applyAttrs(lang);
    applyTitle(lang);
    document.querySelectorAll("[data-i18n-lang]").forEach(function (el) {
      el.hidden = el.dataset.i18nLang !== lang;
    });
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.langToggle === lang));
    });
  }

  function setLanguage(lang) {
    try {
      localStorage.setItem("lang", lang);
    } catch (err) {
      // Private browsing / storage blocked — still apply for this page view.
    }
    applyAll(lang);
  }

  document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.dataset.langToggle);
    });
  });

  applyAll(window.i18nLang());
})();
