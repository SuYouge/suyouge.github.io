(() => {
  const root = document.documentElement;
  const navToggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".site-nav");
  const themeToggle = document.querySelector(".theme-toggle");

  const closeNavigation = () => {
    if (!navToggle || !navigation) return;
    navigation.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navigation?.classList.toggle("is-open") ?? false;
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeNavigation();
    const maximized = document.querySelector(".excalidraw-paper.is-maximized");
    if (maximized) {
      maximized.classList.remove("is-maximized");
      document.body.style.overflow = "";
      maximized.focus();
    }
  });

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  });

  const toggleDrawing = (drawing) => {
    const isMaximized = drawing.classList.toggle("is-maximized");
    document.body.style.overflow = isMaximized ? "hidden" : "";
  };

  for (const drawing of document.querySelectorAll("[data-excalidraw-zoom]")) {
    drawing.addEventListener("click", () => toggleDrawing(drawing));
    drawing.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDrawing(drawing);
      }
    });
  }
})();
