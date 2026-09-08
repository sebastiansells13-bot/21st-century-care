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

  function applyAll(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      applyTo(el, lang);
    });
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
