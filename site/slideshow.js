// Screenshot slideshow. Without JavaScript the links just open the images.
(function () {
  var slides = [
    { src: "/assets/screenshots/main-menu.png", w: 1557, h: 770, caption: "Main menu: every area of the system, with the Sales reports expanded.", alt: "The GoEasyERP main menu with the Sales area open, listing customers, journals, orders, invoices, reports and ledger entries." },
    { src: "/assets/screenshots/search-menu.png", w: 776, h: 636, caption: "Menu search: type a few letters to jump to any function.", alt: "Menu search results for the letters \"cu\", listing functions such as Currencies, Customers and Customer Ledger Entries with their menu paths." },
    { src: "/assets/screenshots/customer-list.png", w: 1530, h: 752, caption: "Customer list with balances and sales, and a keyboard shortcut on every action.", alt: "The GoEasyERP customer list: a table of customers with number, name, city, phone, balance and sales columns, and a toolbar with New, Edit and Delete and their keyboard shortcuts." },
    { src: "/assets/screenshots/customer-card.png", w: 1240, h: 808, caption: "Customer card, opened over the list.", alt: "A customer card opened over the customer list, showing general details such as name, address, city, balance and credit limit, and a Communication section." },
    { src: "/assets/screenshots/salesorder.png", w: 1556, h: 803, caption: "Sales order with header and lines, and Posting, Functions and Print in the action bar.", alt: "A sales order with a General section for the customer and dates, and a Lines table with three items and their quantities, prices and amounts." }
  ];

  var dlg = document.getElementById("viewer");
  if (!dlg || typeof dlg.showModal !== "function") return;
  var img = dlg.querySelector(".viewer-img");
  var cap = dlg.querySelector(".viewer-caption");
  var count = dlg.querySelector(".viewer-count");
  var current = 0;
  var opener = null;

  function show(i) {
    current = (i + slides.length) % slides.length;
    var s = slides[current];
    img.src = s.src;
    img.alt = s.alt;
    img.width = s.w;
    img.height = s.h;
    cap.textContent = s.caption;
    count.textContent = "Screenshot " + (current + 1) + " of " + slides.length;
    // Warm the cache for the neighbours.
    [current - 1, current + 1].forEach(function (n) {
      new Image().src = slides[(n + slides.length) % slides.length].src;
    });
  }

  function open(i, from) {
    opener = from || null;
    show(i);
    if (!dlg.open) dlg.showModal();
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-slide]");
    if (!a) return;
    e.preventDefault();
    open(parseInt(a.getAttribute("data-slide"), 10) || 0, a);
  });

  dlg.querySelector(".viewer-prev").addEventListener("click", function () { show(current - 1); });
  dlg.querySelector(".viewer-next").addEventListener("click", function () { show(current + 1); });
  dlg.querySelector(".viewer-close").addEventListener("click", function () { dlg.close(); });

  // Click on the dark backdrop closes; clicks on the picture or buttons do not.
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });

  dlg.addEventListener("close", function () {
    img.removeAttribute("src");
    if (opener) opener.focus();
  });

  // Swipe on touch screens.
  var x0 = null;
  dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });

  // Deep link: /#slide-3 opens the third screenshot.
  var m = /^#slide-(\d+)$/.exec(location.hash);
  if (m) open(Math.min(Math.max(parseInt(m[1], 10) - 1, 0), slides.length - 1));
})();
