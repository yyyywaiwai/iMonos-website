const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Scroll reveal. CSS hides these only while `html.js` is set, so a failed
   script leaves the page fully readable. */
const revealables = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealables.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );

  for (const el of revealables) {
    // Anything already on screen at load reveals immediately — no pop-in for
    // content the visitor is looking at before they scroll.
    if (el.getBoundingClientRect().top < innerHeight * 0.92) {
      el.classList.add("is-visible");
    } else {
      revealObserver.observe(el);
    }
  }
}

/* Nav: mark the section currently under the reader. */
const nav = document.querySelector("nav[aria-label='Primary']");

if (nav && "IntersectionObserver" in window) {
  const sections = new Map<string, Element>();

  for (const link of nav.querySelectorAll<HTMLAnchorElement>("a[href*='#']")) {
    const id = link.href.split("#")[1];
    const target = id && document.getElementById(id);
    if (target) sections.set(target.id, link);
  }

  const ids = [...sections.keys()].sort(
    (a, b) =>
      document.getElementById(a)!.offsetTop - document.getElementById(b)!.offsetTop,
  );

  if (ids.length) {
    const visible = new Set<string>();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        // Recompute from scratch: back in the hero nothing is current, and the
        // last section visited must not stay highlighted.
        sections.forEach((link) => link.removeAttribute("aria-current"));
        const active = ids.find((id) => visible.has(id));
        if (active) sections.get(active)!.setAttribute("aria-current", "page");
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );

    for (const id of ids) sectionObserver.observe(document.getElementById(id)!);
  }
}
