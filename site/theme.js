(function () {
  var root = document.documentElement;
  var theme = null;
  try { theme = localStorage.getItem("theme"); } catch (e) {}
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  root.setAttribute("data-theme", theme);

  function label() {
    var dark = root.getAttribute("data-theme") === "dark";
    var text = dark ? "Switch to day mode" : "Switch to night mode";
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", text);
      buttons[i].setAttribute("title", text);
    }
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest || !event.target.closest(".theme-toggle")) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", label);
  else label();
})();
