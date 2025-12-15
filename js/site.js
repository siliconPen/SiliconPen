function initHeader() {
  const navToggle = document.querySelector(".nav-toggle");
  const navPill = document.querySelector(".nav-pill");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (navToggle && navPill) {
    navToggle.addEventListener("click", () => {
      navPill.classList.toggle("nav-open");
    });
  }

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("dropdown-open");
    });

    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("dropdown-open");
    });
  }
}
function initPost() {
  // Reading time
  const contentEl = document.querySelector(".post-content");
  const readingEl = document.getElementById("reading-time");

  if (contentEl && readingEl) {
    const text = contentEl.innerText || "";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    readingEl.textContent = `${minutes} min read`;
  }

  // Share buttons
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const copyBtn = document.getElementById("copy-link-btn");
  const xLink = document.getElementById("share-x");
  const liLink = document.getElementById("share-linkedin");
  const waLink = document.getElementById("share-whatsapp");

  if (xLink) {
    xLink.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
  }

  if (liLink) {
    liLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  }

  if (waLink) {
    waLink.href = `https://api.whatsapp.com/send?text=${pageTitle}%20-%20${pageUrl}`;
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy link"), 1500);
      } catch {
        copyBtn.textContent = "Failed :(";
      }
    });
  }
}
function initTOC() {
  const content = document.querySelector(".post-content");
  const tocList = document.getElementById("post-toc-list");

  if (!content || !tocList) return;

  const headings = content.querySelectorAll("h1, h2");

  if (!headings.length) {
    const tocContainer = tocList.closest(".post-toc");
    if (tocContainer) tocContainer.style.display = "none";
    return;
  }

  const items = [];

  headings.forEach((h) => {
    if (!h.id) {
      h.id = h.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const level = h.tagName === "H2" ? 2 : 1;

    const link = document.createElement("a");
    link.href = `#${h.id}`;
    link.textContent = h.textContent.trim();
    link.className = `toc-link toc-level-${level}`;

    const wrapper = document.createElement("div");
    wrapper.appendChild(link);
    tocList.appendChild(wrapper);

    items.push({ heading: h, link });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const item = items.find((i) => i.heading === entry.target);
        if (!item) return;

        if (entry.isIntersecting) {
          items.forEach((i) => i.link.classList.remove("active"));
          item.link.classList.add("active");
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0.1,
    }
  );

  items.forEach(({ heading }) => observer.observe(heading));
}
function initScrollProgress() {
  const fill = document.querySelector(".scroll-progress-fill");
  if (!fill) return;

  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;

    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    fill.style.width = percent + "%";
  }

  window.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();
}
function initCookie() {
  const banner = document.getElementById("cookieConsent");
  const acceptBtn = document.getElementById("cookieAccept");

  if (!banner || !acceptBtn) return;

  if (!localStorage.getItem("sp_cookie_ok")) {
    banner.style.display = "block";
  }

  acceptBtn.onclick = () => {
    localStorage.setItem("sp_cookie_ok", "yes");
    banner.style.display = "none";
  };
}
function initComments() {
  const container = document.getElementById("giscus_thread");
  if (!container) return;

  // Prevent double-loading
  if (container.dataset.loaded) return;
  container.dataset.loaded = "true";

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";

  script.setAttribute("data-repo", "siliconPen/SiliconPen");
  script.setAttribute("data-repo-id", "R_kgDOQjGn8g");
  script.setAttribute("data-category", "Comments");
  script.setAttribute("data-category-id", "DIC_kwDOQjGn8s4Czfyv");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", "dark_dimmed");
  script.setAttribute("data-lang", "en");

  container.appendChild(script);
}
