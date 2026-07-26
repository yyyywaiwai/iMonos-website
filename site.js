(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     Header: fade the translucent plate in once the page has moved.
     ---------------------------------------------------------------------- */
  var body = document.body;
  var scrolled = false;

  function syncHeader() {
    var next = window.scrollY > 12;
    if (next === scrolled) return;
    scrolled = next;
    body.classList.toggle("is-scrolled", next);
  }

  var headerTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (headerTicking) return;
      headerTicking = true;
      window.requestAnimationFrame(function () {
        syncHeader();
        headerTicking = false;
      });
    },
    { passive: true }
  );
  syncHeader();

  /* ----------------------------------------------------------------------
     Scroll reveal. Elements are hidden by CSS only while `html.js` is set,
     so a failed script leaves the page fully readable.
     ---------------------------------------------------------------------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
      );

      revealables.forEach(function (el) {
        // Anything already on screen at load reveals immediately — no pop-in
        // for content the visitor is looking at before they scroll.
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight * 0.92) {
          el.classList.add("is-visible");
          return;
        }
        revealObserver.observe(el);
      });
    }
  }

  /* ----------------------------------------------------------------------
     Nav: mark the section currently under the reader.
     ---------------------------------------------------------------------- */
  var nav = document.querySelector(".site-nav");
  if (!nav || !("IntersectionObserver" in window)) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href*="#"]'));
  var map = {};

  links.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    var hash = href.indexOf("#");
    if (hash < 0) return;
    // Only track links that point at a section on this page.
    if (hash > 0 && href.slice(0, hash) !== "" && href.slice(0, hash) !== location.pathname.split("/").pop()) return;
    var target = document.getElementById(href.slice(hash + 1));
    if (target) map[target.id] = link;
  });

  var ids = Object.keys(map).sort(function (a, b) {
    return document.getElementById(a).offsetTop - document.getElementById(b).offsetTop;
  });
  if (!ids.length) return;

  var active = {};

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        active[entry.target.id] = entry.isIntersecting;
      });

      // Recompute from scratch: back in the hero, nothing is current, and the
      // last section visited must not stay highlighted.
      links.forEach(function (l) { l.removeAttribute("aria-current"); });

      for (var i = 0; i < ids.length; i++) {
        if (active[ids[i]]) {
          map[ids[i]].setAttribute("aria-current", "page");
          break;
        }
      }
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
  );

  ids.forEach(function (id) { sectionObserver.observe(document.getElementById(id)); });
})();
