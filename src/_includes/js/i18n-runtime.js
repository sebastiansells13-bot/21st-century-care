// Shared translation helpers. Loads before i18n.js (see base.njk) — that
// file assumes window.t()/window.i18nLang() already exist.
// Adapted from the same pattern used on julia-ketsaa-remax.
(function () {
  let dict = {};
  const dataEl = document.getElementById("i18n-data");
  if (dataEl) {
    try {
      dict = JSON.parse(dataEl.textContent);
    } catch (err) {
      dict = {};
    }
  }

  function i18nLang() {
    try {
      return localStorage.getItem("lang") === "es" ? "es" : "en";
    } catch (err) {
      return "en";
    }
  }

  // t("nav.home") looks up the key in the current language (falling back to
  // English, then to the key itself if it's missing entirely).
  function t(key) {
    const entry = dict[key];
    return entry ? entry[i18nLang()] || entry.en || key : key;
  }

  window.i18nLang = i18nLang;
  window.t = t;
})();
