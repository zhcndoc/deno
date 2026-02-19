// fs:/_components/ThemeToggle/darkmode.js
var THEME_KEY = "denoDocsTheme";
var DARK_CLASS = "dark";
var LIGHT_CLASS = "light";
function getPreferredTheme() {
  if (THEME_KEY in localStorage) {
    return localStorage[THEME_KEY];
  }
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_CLASS : LIGHT_CLASS;
}
function setTheme(theme) {
  const root = document.documentElement;
  root.classList.add(theme);
  root.classList.remove(theme === DARK_CLASS ? LIGHT_CLASS : DARK_CLASS);
}
setTheme(getPreferredTheme());

// fs:/_components/ThemeToggle/darkmode-toggle.js
var THEME = {
  DARK: "dark",
  LIGHT: "light",
  STORAGE_KEY: "denoDocsTheme"
};
var colorThemes = document.querySelectorAll("[data-color-mode]");
var darkModeToggleButton = document.getElementById("theme-toggle");
var getUserPreference = () => {
  const storedTheme = localStorage.getItem(THEME.STORAGE_KEY);
  if (storedTheme) return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME.DARK : THEME.LIGHT;
};
var setTheme2 = (theme) => {
  document.documentElement.classList.remove(THEME.DARK, THEME.LIGHT);
  document.documentElement.classList.add(theme);
  colorThemes.forEach((el) => {
    el.setAttribute("data-color-mode", theme);
  });
  localStorage.setItem(THEME.STORAGE_KEY, theme);
};
var toggleDarkMode = () => {
  const currentTheme = getUserPreference();
  const newTheme = currentTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
  setTheme2(newTheme);
};
var init = () => {
  if (!darkModeToggleButton) {
    console.warn("Theme toggle button not found");
    return;
  }
  setTheme2(getUserPreference());
  darkModeToggleButton.addEventListener("click", toggleDarkMode);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME.STORAGE_KEY)) {
      setTheme2(e.matches ? THEME.DARK : THEME.LIGHT);
    }
  });
};
init();

// fs:/_components/SidebarNav/script.js
var sidebar = document.getElementById("nav");
var button = document.getElementById("hamburger-button");
if (sidebar) {
  const toggleButtons = document.querySelectorAll(
    ".sub-nav-toggle[data-accordion-toggle]"
  );
  toggleButtons.forEach((toggleButton) => {
    const accordionId = toggleButton.getAttribute("data-accordion-toggle");
    const parentLi = toggleButton.closest("li");
    const isExpanded = localStorage.getItem(`accordion-${accordionId}`) === "true";
    if (parentLi) {
      if (isExpanded) {
        parentLi.classList.add("expanded");
        toggleButton.setAttribute("aria-expanded", "true");
      } else {
        toggleButton.setAttribute("aria-expanded", "false");
      }
    }
    toggleButton.addEventListener("click", () => {
      if (parentLi) {
        parentLi.classList.add("user-interaction");
        const wasExpanded = parentLi.classList.contains("expanded");
        if (wasExpanded) {
          parentLi.classList.remove("expanded");
          toggleButton.setAttribute("aria-expanded", "false");
          localStorage.setItem(`accordion-${accordionId}`, "false");
        } else {
          toggleButtons.forEach((otherToggleButton) => {
            const otherAccordionId = otherToggleButton.getAttribute(
              "data-accordion-toggle"
            );
            const otherParentLi = otherToggleButton.closest("li");
            if (otherToggleButton !== toggleButton && otherParentLi) {
              otherParentLi.classList.remove("expanded");
              otherToggleButton.setAttribute("aria-expanded", "false");
              localStorage.setItem(`accordion-${otherAccordionId}`, "false");
            }
          });
          parentLi.classList.add("expanded");
          toggleButton.setAttribute("aria-expanded", "true");
          localStorage.setItem(`accordion-${accordionId}`, "true");
        }
      }
    });
  });
}
if (sidebar && button) {
  button.addEventListener("click", () => {
    const wasOpen = button.getAttribute("aria-pressed") === "true";
    sidebar.setAttribute("data-open", String(!wasOpen));
    button.setAttribute("aria-pressed", String(!wasOpen));
    sidebar.focus();
  });
  globalThis.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      sidebar.setAttribute("data-open", "false");
      button.setAttribute("aria-pressed", "false");
    }
  });
}
var currentSidebarItem = sidebar.querySelector("a[data-active=true]") || sidebar.querySelector("[data-active=true]");
if (currentSidebarItem) {
  let currentElement = currentSidebarItem;
  let accordionContainer = null;
  let accordionToggle = null;
  while (currentElement && currentElement !== sidebar) {
    currentElement = currentElement.parentElement;
    if (currentElement && currentElement.tagName === "LI") {
      const toggleButton = currentElement.querySelector(
        ".sub-nav-toggle[data-accordion-toggle]"
      );
      if (toggleButton) {
        accordionContainer = currentElement;
        accordionToggle = toggleButton;
        break;
      }
    }
  }
  if (accordionContainer && accordionToggle) {
    const accordionId = accordionToggle.getAttribute("data-accordion-toggle");
    const allToggleButtons = document.querySelectorAll(
      ".sub-nav-toggle[data-accordion-toggle]"
    );
    allToggleButtons.forEach((otherToggleButton) => {
      const otherAccordionId = otherToggleButton.getAttribute(
        "data-accordion-toggle"
      );
      const otherParentLi = otherToggleButton.closest("li");
      if (otherToggleButton !== accordionToggle && otherParentLi) {
        otherParentLi.classList.remove("expanded");
        otherToggleButton.setAttribute("aria-expanded", "false");
        localStorage.setItem(`accordion-${otherAccordionId}`, "false");
      }
    });
    accordionContainer.classList.add("expanded");
    accordionToggle.setAttribute("aria-expanded", "true");
    localStorage.setItem(`accordion-${accordionId}`, "true");
  }
  setTimeout(() => {
    const aside = document.querySelector("aside");
    const nav = document.getElementById("nav");
    const sidebarElement = aside || nav;
    if (sidebarElement && sidebarElement.scrollTo) {
      try {
        const rect = currentSidebarItem.getBoundingClientRect();
        const sidebarRect = sidebarElement.getBoundingClientRect();
        const targetScrollTop = sidebarElement.scrollTop + rect.top - sidebarRect.top - sidebarRect.height / 2 + rect.height / 2;
        sidebarElement.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth"
        });
      } catch (_e) {
      }
    }
  }, 300);
}
var desktopToc = document.querySelector("#toc");
if (desktopToc) {
  const tocItems = document.querySelectorAll("#toc a");
  const pageHeadings = document.querySelectorAll(
    ".markdown-body :where(h1, h2, h3, h4, h5, h6)"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const tocLink = document.querySelector(`#toc a[href="#${id}"]`);
        if (entry.isIntersecting) {
          tocItems.forEach((item) => item.classList.remove("active"));
          if (tocLink) {
            tocLink.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "-0% 0px -75% 0px",
      threshold: 0.5
    }
  );
  pageHeadings.forEach((heading) => {
    observer.observe(heading);
  });
}

// fs:/_components/VideoPlayer/script.js
var LiteYTEmbed = class _LiteYTEmbed extends HTMLElement {
  connectedCallback() {
    this.videoId = this.getAttribute("videoid");
    let playBtnEl = this.querySelector(".lyt-playbtn,.lty-playbtn");
    this.playLabel = playBtnEl && playBtnEl.textContent.trim() || this.getAttribute("playlabel") || "Play";
    this.dataset.title = this.getAttribute("title") || "";
    if (!this.style.backgroundImage) {
      this.style.backgroundImage = `url("https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg")`;
      this.upgradePosterImage();
    }
    if (!playBtnEl) {
      playBtnEl = document.createElement("button");
      playBtnEl.type = "button";
      playBtnEl.classList.add("lyt-playbtn", "lty-playbtn");
      this.append(playBtnEl);
    }
    if (!playBtnEl.textContent) {
      const playBtnLabelEl = document.createElement("span");
      playBtnLabelEl.className = "lyt-visually-hidden";
      playBtnLabelEl.textContent = this.playLabel;
      playBtnEl.append(playBtnLabelEl);
    }
    this.addNoscriptIframe();
    if (playBtnEl.nodeName === "A") {
      playBtnEl.removeAttribute("href");
      playBtnEl.setAttribute("tabindex", "0");
      playBtnEl.setAttribute("role", "button");
      playBtnEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.activate();
        }
      });
    }
    this.addEventListener("pointerover", _LiteYTEmbed.warmConnections, {
      once: true
    });
    this.addEventListener("focusin", _LiteYTEmbed.warmConnections, {
      once: true
    });
    this.addEventListener("click", this.activate);
    this.needsYTApi = this.hasAttribute("js-api") || navigator.vendor.includes("Apple") || navigator.userAgent.includes("Mobi");
  }
  /**
   * Add a <link rel={preload | preconnect} ...> to the head
   */
  static addPrefetch(kind, url, as) {
    const linkEl = document.createElement("link");
    linkEl.rel = kind;
    linkEl.href = url;
    if (as) {
      linkEl.as = as;
    }
    document.head.append(linkEl);
  }
  /**
   * Begin pre-connecting to warm up the iframe load
   * Since the embed's network requests load within its iframe,
   *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
   * So, the best we can do is warm up a few connections to origins that are in the critical path.
   *
   * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
   * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
   */
  static warmConnections() {
    if (_LiteYTEmbed.preconnected) return;
    _LiteYTEmbed.addPrefetch("preconnect", "https://www.youtube-nocookie.com");
    _LiteYTEmbed.addPrefetch("preconnect", "https://www.google.com");
    _LiteYTEmbed.addPrefetch(
      "preconnect",
      "https://googleads.g.doubleclick.net"
    );
    _LiteYTEmbed.addPrefetch("preconnect", "https://static.doubleclick.net");
    _LiteYTEmbed.preconnected = true;
  }
  fetchYTPlayerApi() {
    if (window.YT || window.YT && window.YT.Player) return;
    this.ytApiPromise = new Promise((res, rej) => {
      var el = document.createElement("script");
      el.src = "https://www.youtube.com/iframe_api";
      el.async = true;
      el.onload = (_) => {
        YT.ready(res);
      };
      el.onerror = rej;
      this.append(el);
    });
  }
  /** Return the YT Player API instance. (Public L-YT-E API) */
  async getYTPlayer() {
    if (!this.playerPromise) {
      await this.activate();
    }
    return this.playerPromise;
  }
  async addYTPlayerIframe() {
    this.fetchYTPlayerApi();
    await this.ytApiPromise;
    const videoPlaceholderEl = document.createElement("div");
    this.append(videoPlaceholderEl);
    const paramsObj = Object.fromEntries(this.getParams().entries());
    this.playerPromise = new Promise((resolve) => {
      let player = new YT.Player(videoPlaceholderEl, {
        width: "100%",
        videoId: this.videoId,
        playerVars: paramsObj,
        events: {
          "onReady": (event) => {
            event.target.playVideo();
            resolve(player);
          }
        }
      });
    });
  }
  // Add the iframe within <noscript> for indexability discoverability. See https://github.com/paulirish/lite-youtube-embed/issues/105
  addNoscriptIframe() {
    const iframeEl = this.createBasicIframe();
    const noscriptEl = document.createElement("noscript");
    noscriptEl.innerHTML = iframeEl.outerHTML;
    this.append(noscriptEl);
  }
  getParams() {
    const params = new URLSearchParams(this.getAttribute("params") || []);
    params.append("autoplay", "1");
    params.append("playsinline", "1");
    return params;
  }
  async activate() {
    if (this.classList.contains("lyt-activated")) return;
    this.classList.add("lyt-activated");
    if (this.needsYTApi) {
      return this.addYTPlayerIframe(this.getParams());
    }
    const iframeEl = this.createBasicIframe();
    this.append(iframeEl);
    iframeEl.focus();
  }
  createBasicIframe() {
    const iframeEl = document.createElement("iframe");
    iframeEl.width = 560;
    iframeEl.height = 315;
    iframeEl.title = this.playLabel;
    iframeEl.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframeEl.allowFullscreen = true;
    iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${this.getParams().toString()}`;
    return iframeEl;
  }
  /**
   * In the spirit of the `lowsrc` attribute and progressive JPEGs, we'll upgrade the reliable
   * poster image to a higher resolution one, if it's available.
   * Interestingly this sddefault webp is often smaller in filesize, but we will still attempt it second
   * because getting _an_ image in front of the user if our first priority.
   *
   * See https://github.com/paulirish/lite-youtube-embed/blob/master/youtube-thumbnail-urls.md for more details
   */
  upgradePosterImage() {
    setTimeout(() => {
      const webpUrl = `https://i.ytimg.com/vi_webp/${this.videoId}/sddefault.webp`;
      const img = new Image();
      img.fetchPriority = "low";
      img.referrerpolicy = "origin";
      img.src = webpUrl;
      img.onload = (e) => {
        const noAvailablePoster = e.target.naturalHeight == 90 && e.target.naturalWidth == 120;
        if (noAvailablePoster) return;
        this.style.backgroundImage = `url("${webpUrl}")`;
      };
    }, 100);
  }
};
customElements.define("lite-youtube", LiteYTEmbed);
