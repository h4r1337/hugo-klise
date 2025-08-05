(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
    } else {
      initTheme(state);
    }
  };

  lamp.addEventListener("click", () =>
    toggleTheme(localStorage.getItem("theme")),
  );

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });
})();

// Add vim key bindings
// j for scrolling down
// k for scrolling up
// gg for go to top
// G for go to end
(function () {
  const SCROLL_STEP = 10;
  const ACCELERATION = 1.1;
  const MAX_SCROLL_STEP = 100;

  let scrollDirection = 0;
  let scrollSpeed = SCROLL_STEP;
  let isScrolling = false;
  let scrollFrame;

  // gg detection
  let gPressedOnce = false;
  let gTimer;

  function scrollLoop() {
    if (scrollDirection !== 0) {
      window.scrollBy(0, scrollDirection * scrollSpeed);
      scrollSpeed = Math.min(scrollSpeed * ACCELERATION, MAX_SCROLL_STEP);
      scrollFrame = requestAnimationFrame(scrollLoop);
    }
  }

  function handleKeyDown(e) {
    if (
      ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) ||
      document.activeElement.isContentEditable
    ) {
      return;
    }

    const key = e.key;

    // gg = go to top
    if (key === "g") {
      if (gPressedOnce) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        gPressedOnce = false;
        clearTimeout(gTimer);
      } else {
        gPressedOnce = true;
        gTimer = setTimeout(() => {
          gPressedOnce = false;
        }, 400); // 400ms to enter second "g"
      }
      return;
    }

    // G = go to bottom
    if (key === "G" && e.shiftKey) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }

    // j = scroll down
    if (key === "j" && scrollDirection !== 1) {
      scrollDirection = 1;
      scrollSpeed = SCROLL_STEP;
      if (!isScrolling) {
        isScrolling = true;
        scrollLoop();
      }
    }

    // k = scroll up
    if (key === "k" && scrollDirection !== -1) {
      scrollDirection = -1;
      scrollSpeed = SCROLL_STEP;
      if (!isScrolling) {
        isScrolling = true;
        scrollLoop();
      }
    }
  }

  function handleKeyUp(e) {
    if (
      (e.key === "j" && scrollDirection === 1) ||
      (e.key === "k" && scrollDirection === -1)
    ) {
      scrollDirection = 0;
      scrollSpeed = SCROLL_STEP;
      isScrolling = false;
      cancelAnimationFrame(scrollFrame);
    }
  }

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
})();
