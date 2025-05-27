document.addEventListener("DOMContentLoaded", () => {
  const toc = document.getElementById("TableOfContents");
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll("a[href^='#']"));
  const targets = links
    .map(link => {
      const id = decodeURIComponent(link.getAttribute("href").slice(1));
      return document.getElementById(id);
    })
    .filter(Boolean);

  let lastActiveId = null;

  function updateToc(activeId) {
    toc.querySelectorAll("a.active").forEach(a => a.classList.remove("active"));
    toc.querySelectorAll("li.expanded").forEach(li => li.classList.remove("expanded"));

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

  const stickyToc = document.getElementById("sticky-top");
  const tocRect = stickyToc.getBoundingClientRect();
  const tocTop = tocRect.top + window.scrollY;
  const cssTop = parseFloat(getComputedStyle(toc).top) || 0;
  const fixThreshold = tocTop - cssTop;

  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const offset = rootFontSize * 2;
  function updateFixed() {
    if (window.scrollY > fixThreshold - offset) {
      stickyToc.classList.add("fixed");
      console.log("updated")
    } else {
      stickyToc.classList.remove("fixed");
    }
  }

  // throttle via requestAnimationFrame
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        updateFixed()
        ticking = false;
      });
      ticking = true;
    }
  });

  onScroll();
  updateFixed();
});

