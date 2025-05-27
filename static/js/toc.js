document.addEventListener("DOMContentLoaded", () => {
  const toc = document.getElementById("TableOfContents");
  if (!toc) return;

  // grab all headings (h1–h6) with anchors that match your TOC links
  const links = Array.from(toc.querySelectorAll("a[href^='#']"));
  const targets = links
    .map(link => {
      const id = decodeURIComponent(link.getAttribute("href").slice(1));
      return document.getElementById(id);
    })
    .filter(Boolean);

  let lastActiveId = null;

  function updateToc(activeId) {
    // clear old
    toc.querySelectorAll("a.active").forEach(a => a.classList.remove("active"));
    toc.querySelectorAll("li.expanded").forEach(li => li.classList.remove("expanded"));

    // mark new
    const link = toc.querySelector(`a[href="#${CSS.escape(activeId)}"]`);
    if (!link) return;

    let li = link.closest("li");
    while (li) {
      li.classList.add("expanded");
      const a = li.querySelector(":scope > a");
      if (a) a.classList.add("active");
      li = li.parentElement.closest("li");
    }
  }

  function onScroll() {
    // set threshold: 20% down from top of viewport
    const threshold = window.innerHeight * 0.2;
    let current = null;

    for (let t of targets) {
      const rect = t.getBoundingClientRect();
      if (rect.top <= threshold) {
        current = t;
      } else {
        break;
      }
    }

    const newId = current ? current.id : (targets[0] && window.scrollY < targets[0].offsetTop ? null : lastActiveId);
    if (newId && newId !== lastActiveId) {
      lastActiveId = newId;
      updateToc(newId);
    }
  }

  // throttle via requestAnimationFrame
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // init on load in case you’re already scrolled
  onScroll();
});

