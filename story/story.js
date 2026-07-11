(function () {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);

  var media = gsap.matchMedia();
  media.add("(min-width: 901px)", function () {
    ScrollTrigger.create({
      trigger: ".story-reading",
      start: "top top+=90",
      end: "bottom bottom-=80",
      pin: ".story-aside",
      pinSpacing: false
    });

    gsap.to(".story-progress span", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: ".story-reading", start: "top 80%", end: "bottom 90%", scrub: true }
    });
  });

  gsap.utils.toArray(".story-novel h2, .story-novel h3, .story-novel blockquote").forEach(function (element) {
    gsap.fromTo(element, { opacity: .12, y: 35 }, {
      opacity: 1,
      y: 0,
      ease: "none",
      scrollTrigger: { trigger: element, start: "top 88%", end: "top 48%", scrub: true }
    });
  });

  gsap.utils.toArray(".story-novel > p").forEach(function (paragraph) {
    gsap.fromTo(paragraph, { opacity: .18 }, {
      opacity: 1,
      ease: "none",
      scrollTrigger: { trigger: paragraph, start: "top 92%", end: "top 64%", scrub: true }
    });
  });
})();
