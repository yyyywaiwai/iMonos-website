/* Reading progress for the chapter index. The sidebar itself is pinned with
   CSS `position: sticky`, so nothing here is load-bearing for layout.
   Browsers already coalesce scroll events to one per frame, so this needs no
   throttling of its own. */
const reading = document.querySelector<HTMLElement>("[data-story-reading]");
const bar = document.querySelector<HTMLElement>("[data-story-progress] span");

if (reading && bar) {
  const update = () => {
    const { top, height } = reading.getBoundingClientRect();
    const progress = (innerHeight - top) / (height + innerHeight);
    bar.style.transform = `scaleY(${Math.min(Math.max(progress, 0), 1)})`;
  };

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
}
