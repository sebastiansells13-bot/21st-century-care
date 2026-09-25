// Collapses the primary nav behind a "Menu" button on narrow screens (see
// .nav-toggle in components.scss). The .js class gates that CSS, so with
// scripts off the nav simply stays expanded rather than becoming unreachable.
(function () {
  var header = document.querySelector(".site-header");
  var toggle = header && header.querySelector(".nav-toggle");
  if (!toggle) return;

  document.documentElement.classList.add("js");

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
