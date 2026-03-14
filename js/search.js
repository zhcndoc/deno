import {
  __name
} from "../chunk-Y5CWL2B3.js";

// js/search.ts
var ORAMA_CONFIG = {
  projectId: "c9394670-656a-4f78-a551-c2603ee119e7",
  apiKey: "c1_E4q2kmwSiWpPYzeIzP38VyHmekjnZUJL3yB7Kprr8$YF-u_cXBSn3u0-AvX"
};
var _OramaSearch = class _OramaSearch {
  client = null;
  searchInput = null;
  searchResults = null;
  searchLoading = null;
  ariaLiveRegion = null;
  searchTimeout = null;
  isResultsOpen = false;
  selectedIndex = -1;
  // Track selected result for keyboard navigation
  constructor() {
    this.init();
  }
  async init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupElements());
    } else {
      this.setupElements();
    }
    await this.initOramaClient();
  }
  setupElements() {
    this.searchInput = document.getElementById(
      "orama-search-input"
    );
    this.searchResults = document.getElementById(
      "orama-search-results-content"
    );
    this.searchLoading = document.getElementById("orama-search-loading");
    this.ariaLiveRegion = document.getElementById("orama-results-announcer");
    if (!this.searchInput) {
      console.warn("Orama search input not found");
      return;
    }
    this.searchInput.addEventListener("input", this.handleInput.bind(this));
    this.searchInput.addEventListener("focus", this.handleFocus.bind(this));
    this.searchInput.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.searchResults?.addEventListener("keyup", (event) => {
      if (event.key === "Escape") this.handleEscape();
    });
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        this.searchInput?.focus();
      }
    });
    const searchKey = document.getElementById("search-key");
    let isMac = false;
    const uaPlatform = navigator.userAgentData?.platform;
    if (uaPlatform && uaPlatform.toUpperCase().startsWith("MAC") || navigator.userAgent.indexOf("Mac OS X") != -1 || navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
      isMac = true;
    }
    if (searchKey) {
      if (isMac) {
        searchKey.textContent = "\u2318K";
      } else {
        searchKey.textContent = "Ctrl+K";
      }
    }
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
  }
  async initOramaClient() {
    try {
      if (ORAMA_CONFIG.projectId === "YOUR_ORAMA_PROJECT_ID_HERE" || ORAMA_CONFIG.apiKey === "YOUR_ORAMA_API_KEY_HERE") {
        console.warn(
          "Orama search not configured. Please add your project ID and API key to search.client.ts"
        );
        this.showNotConfiguredMessage();
        return;
      }
      const { OramaCloud } = await import("../src-3DS57ZAY.js");
      this.client = new OramaCloud({
        projectId: ORAMA_CONFIG.projectId,
        apiKey: ORAMA_CONFIG.apiKey
      });
      console.log("Orama search client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Orama client:", error);
      this.showErrorMessage("Failed to initialize search");
    }
  }
  handleInput(event) {
    const value = event.target.value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (!value.trim()) {
      this.hideResults();
      return;
    }
    this.selectedIndex = -1;
    this.searchTimeout = setTimeout(() => {
      this.performSearch(value);
    }, 300);
  }
  handleFocus() {
    if (this.searchInput?.value.trim() && this.searchResults?.children.length) {
      this.showResults();
    }
  }
  handleEscape() {
    this.hideResults();
    if (this.searchInput) {
      this.searchInput.value = "";
      this.searchInput.focus();
    }
    this.selectedIndex = -1;
  }
  handleKeyDown(event) {
    if (!this.isResultsOpen) {
      return;
    }
    const resultsLinks = this.searchResults?.querySelectorAll(
      ".search-result-link"
    );
    const totalResults = resultsLinks?.length || 0;
    switch (event.key) {
      case "Escape":
        this.handleEscape();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, totalResults - 1);
        this.updateSelection();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
        break;
      case "Enter":
        event.preventDefault();
        if (this.selectedIndex >= 0 && resultsLinks) {
          const selectedLink = resultsLinks[this.selectedIndex];
          if (selectedLink) {
            this.hideResults();
            globalThis.location.href = selectedLink.href;
          }
        }
        break;
    }
  }
  updateSelection() {
    const resultsLinks = this.searchResults?.querySelectorAll(
      ".search-result-link"
    );
    if (!resultsLinks) return;
    resultsLinks.forEach((link, index) => {
      link.classList.remove("bg-blue-50", "dark:bg-blue-900/20");
      if (index === this.selectedIndex) {
        link.classList.add("bg-blue-50", "dark:bg-blue-900/20");
        link.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }
  handleClickOutside(event) {
    const target = event.target;
    if (target.closest(".search-result-link")) {
      return;
    }
    const searchContainer = document.getElementById("orama-search-results");
    if (!this.searchInput?.parentElement?.contains(target) && !searchContainer?.contains(target)) {
      this.hideResults();
    }
  }
  async performSearch(term) {
    if (!this.client) {
      this.showNotConfiguredMessage();
      return;
    }
    this.showLoading(true);
    try {
      const results = await this.client.search({
        term,
        mode: "fulltext",
        limit: 8,
        threshold: 1,
        properties: ["title", "content", "description"],
        datasources: ["b03275f5-6d98-499e-9fe5-5d704221006e"],
        boost: {
          title: 12,
          content: 4,
          description: 2
        }
      });
      this.renderResults(
        results,
        term
      );
      this.showResults();
    } catch (error) {
      console.error("Search error:", error);
      this.showErrorMessage("Search failed. Please try again.");
    } finally {
      this.showLoading(false);
    }
  }
  renderResults(results, searchTerm) {
    if (!this.searchResults) return;
    if (results.hits.length === 0) {
      this.searchResults.innerHTML = `
        <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
          <h3 class="text-sm font-semibold text-foreground-primary">Search Results</h3>
        </div>
        <div class="p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-foreground-tertiary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-foreground-primary mb-1">No results found</p>
          <p class="text-xs text-foreground-secondary">Try different keywords or check your spelling</p>
        </div>
      `;
      return;
    }
    const validResults = results.hits.filter((hit) => {
      if (!hit.document) return false;
      const hasValidUrl = hit.document.url || hit.document.path || hit.document.title || hit.id;
      if (!hasValidUrl) return false;
      if (this.isNavigationContent(hit)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return scoreB - scoreA;
    });
    const resultsHtml = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-foreground-primary" id="search-results__heading">Search Results</h2>
          <span class="text-xs text-foreground-secondary">${validResults.length} result${validResults.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <ul aria-labelledby="search-results__heading">
        ${validResults.map((hit) => `
        <li>
          <a
            href="${this.escapeHtml(hit.document.url || hit.document.path || "#")}"
            class="flex flex-col px-4 py-3 hover:bg-foreground-quaternary transition-colors duration-150 border-b border-foreground-quaternary last:border-b-0 search-result-link group"
          >
            <div class="font-bold text-foreground-primary text-sm mb-2 group-hover:text-primary transition-colors">
              ${this.highlightMatch(
      this.escapeHtml(this.cleanTitle(hit.document.title)),
      searchTerm
    )}
            </div>
            <div class="pl-3 border-l border-foreground-quaternary text-sm text-foreground-secondary leading-relaxed mb-2 line-clamp-3">
              ${this.highlightMatch(
      this.escapeHtml(hit.document.content.slice(0, 200)) + "...",
      searchTerm
    )}
            </div>
            <div class="flex items-center text-xs text-gray-500 dark:color-gray-600">
              <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              ${this.escapeHtml(hit.document.url || hit.document.path || "")}
            </div>
          </a>
        </li>
      `).join("")}
      </ul>
    `;
    this.searchResults.innerHTML = resultsHtml;
    this.selectedIndex = -1;
    if (this.ariaLiveRegion) {
      this.ariaLiveRegion.textContent = `${validResults.length} results found for "${searchTerm}"`;
    }
  }
  showNotConfiguredMessage() {
    if (!this.searchResults) return;
    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <h3 class="text-sm font-semibold text-foreground-primary">Search</h3>
      </div>
      <div class="p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 text-foreground-tertiary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground-primary mb-1">Search not configured</p>
        <p class="text-xs text-foreground-secondary">Please add your Orama credentials</p>
      </div>
    `;
    this.showResults();
  }
  showErrorMessage(message) {
    if (!this.searchResults) return;
    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <h3 class="text-sm font-semibold text-foreground-primary">Search Error</h3>
      </div>
      <div class="p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground-primary mb-1">${this.escapeHtml(message)}</p>
        <p class="text-xs text-foreground-secondary">Please try again or contact support</p>
      </div>
    `;
    this.showResults();
  }
  showResults() {
    const resultsContainer = document.getElementById("orama-search-results");
    if (resultsContainer) {
      resultsContainer.classList.remove("hidden");
      this.isResultsOpen = true;
    }
  }
  hideResults() {
    const resultsContainer = document.getElementById("orama-search-results");
    if (resultsContainer) {
      resultsContainer.classList.add("hidden");
      this.isResultsOpen = false;
      this.selectedIndex = -1;
    }
  }
  showLoading(show) {
    if (this.searchLoading) {
      if (show) {
        this.searchLoading.classList.remove("hidden");
      } else {
        this.searchLoading.classList.add("hidden");
      }
    }
  }
  highlightMatch(text, term) {
    if (!term.trim()) return text;
    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(
      regex,
      '<mark class="bg-runtime px-[1px] py-0.5 rounded text-black font-bold">$1</mark>'
    );
  }
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  // Helper method to clean titles by removing unwanted text
  cleanTitle(title) {
    if (!title) return title;
    let cleaned = title.replace(/[\s#-]*jump to heading[\s#-]*/gi, "").trim();
    cleaned = cleaned.replace(/^#+|#+$/g, "");
    if (!cleaned || cleaned.trim() === "") {
      return title;
    }
    return cleaned;
  }
  // Helper method to detect navigation/menu content
  isNavigationContent(hit) {
    if (!hit.document) return false;
    const title = hit.document.title?.toLowerCase() || "";
    const content = hit.document.content?.toLowerCase() || "";
    const section = hit.document.section?.toLowerCase() || "";
    const category = hit.document.category?.toLowerCase() || "";
    const navTitlePatterns = [
      /^(home|menu|navigation|nav|sidebar|header|footer)$/,
      /^(getting started|quick start|overview)$/,
      /^(table of contents|toc)$/,
      /^(breadcrumb|breadcrumbs)$/
    ];
    const navContentPatterns = [
      /^(home|menu|navigation|nav|sidebar|header|footer|skip to|jump to)$/,
      /^\s*(getting started|quick start|overview|table of contents|toc|breadcrumb)\s*$/,
      /^\s*\|\s*$/,
      // Just pipe characters (common in nav separators)
      /^(previous|next|back|continue)$/
    ];
    if (content.length < 50 && (navContentPatterns.some((pattern) => pattern.test(content)) || navTitlePatterns.some((pattern) => pattern.test(title)))) {
      return true;
    }
    const navSections = [
      "navigation",
      "nav",
      "menu",
      "sidebar",
      "header",
      "footer",
      "breadcrumb"
    ];
    if (navSections.includes(section) || navSections.includes(category)) {
      return true;
    }
    const navWords = [
      "home",
      "about",
      "docs",
      "api",
      "guide",
      "tutorial",
      "reference",
      "examples"
    ];
    const words = content.split(/\s+/).filter((w) => w.length > 2);
    if (words.length <= 5 && words.every((word) => navWords.includes(word))) {
      return true;
    }
    return false;
  }
};
__name(_OramaSearch, "OramaSearch");
var OramaSearch = _OramaSearch;
var oramaSearch = new OramaSearch();
globalThis.oramaSearch = oramaSearch;
