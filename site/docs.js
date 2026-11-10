// Adds a "copy" button to every code box on the documentation pages.
(function () {
  var COPY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  var DONE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  var live = document.createElement("p");
  live.className = "sr-only";
  live.setAttribute("role", "status");
  document.body.appendChild(live);

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.className = "sr-only";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  document.querySelectorAll(".code").forEach(function (box) {
    var pre = box.querySelector("pre");
    if (!pre) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.innerHTML = COPY;
    var timer = null;

    btn.addEventListener("click", function () {
      copyText(pre.textContent.replace(/\s+$/, "")).then(function () {
        btn.innerHTML = DONE;
        btn.classList.add("copied");
        btn.setAttribute("aria-label", "Copied");
        live.textContent = "Copied to clipboard";
      }, function () {
        live.textContent = "Copy failed. Select the text and copy it manually.";
      }).then(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.innerHTML = COPY;
          btn.classList.remove("copied");
          btn.setAttribute("aria-label", "Copy code to clipboard");
          live.textContent = "";
        }, 2000);
      });
    });
    box.appendChild(btn);
  });
})();
