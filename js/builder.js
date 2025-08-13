// Component Builder for dynamic content loading
class ComponentBuilder {
  constructor() {
    this.cache = new Map();
    this.init();
  }

  init() {
    // Initialize component loading
    this.loadComponents();
  }

  async loadComponents() {
    try {
      // Load header
      await this.loadComponent("header-placeholder", "./parts/header.html");

      // Load footer
      await this.loadComponent("footer-placeholder", "./parts/footer.html");

      // Load page-specific components based on current page
      this.loadPageSpecificComponents();
    } catch (error) {
      console.error("Failed to load components:", error);
    }
  }

  async loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder ${placeholderId} not found`);
      return;
    }

    try {
      // Check cache first
      if (this.cache.has(componentPath)) {
        placeholder.innerHTML = this.cache.get(componentPath);
        this.processComponent(placeholder);
        return;
      }

      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Cache the component
      this.cache.set(componentPath, html);

      // Insert the component
      placeholder.innerHTML = html;

      // Process the component (execute scripts, setup events)
      this.processComponent(placeholder);
    } catch (error) {
      console.error(`Failed to load component ${componentPath}:`, error);
      this.showComponentError(placeholder, componentPath);
    }
  }

  processComponent(container) {
    // Execute any scripts in the loaded component
    this.executeScripts(container);

    // Setup component-specific event listeners
    this.setupComponentEvents(container);

    // Initialize animations
    this.initializeComponentAnimations(container);

    // Replace data placeholders with actual content
    this.replaceDataPlaceholders(container);

    // Initialize mobile menu if header is loaded
    if (container.querySelector("#mobile-menu-btn")) {
      this.initializeMobileMenu();
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((script) => {
      const newScript = document.createElement("script");

      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }

      // Remove the old script to avoid duplicates
      script.remove();

      // Append the new script to head
      document.head.appendChild(newScript);
    });
  }

  setupComponentEvents(container) {
    // Setup navigation events
    const navLinks = container.querySelectorAll("nav a, .nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("./")) {
          e.preventDefault();
          this.navigateToPage(href);
        }
      });
    });

    // Setup form events
    const forms = container.querySelectorAll("form");
    forms.forEach((form) => {
      if (form.id === "contact-form") {
        form.addEventListener("submit", (e) => this.handleContactForm(e));
      }
    });

    // Setup button events
    const buttons = container.querySelectorAll(".btn, button");
    buttons.forEach((button) => {
      if (button.classList.contains("read-more")) {
        button.addEventListener("click", (e) => this.handleReadMore(e));
      }
    });
  }

  initializeComponentAnimations(container) {
    // Add animation classes to elements
    const animateElements = container.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
      el.classList.add("fade-in-up");
    });

    // Setup parallax effects
    const parallaxElements = container.querySelectorAll(".parallax");
    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      element.style.transform = `translateY(0px)`;
    });
  }

  replaceDataPlaceholders(container) {
    // Replace data placeholders with actual content from data.json
    if (window.gameWebsite && window.gameWebsite.data) {
      const data = window.gameWebsite.data;

      // Replace common placeholders
      const placeholders = {
        "{{site.title}}": data.site?.title || "",
        "{{site.description}}": data.site?.description || "",
        "{{navigation.home}}": data.navigation?.home || "Home",
        "{{navigation.news}}": data.navigation?.news || "News",
        "{{navigation.contacts}}": data.navigation?.contacts || "Contact",
        "{{navigation.privacy}}": data.navigation?.privacy || "Privacy Policy",
        "{{navigation.cookies}}": data.navigation?.cookies || "Cookie Policy",
        "{{navigation.disclaimer}}":
          data.navigation?.disclaimer || "Legal Disclaimer",
        "{{footer.copyright}}":
          data.footer?.copyright || "© Skillarenalegends.com",
        "{{footer.year}}":
          data.footer?.year || new Date().getFullYear().toString(),
      };

      Object.entries(placeholders).forEach(([placeholder, value]) => {
        const elements = container.querySelectorAll(
          `[data-placeholder="${placeholder}"]`
        );
        elements.forEach((element) => {
          element.textContent = value;
        });
      });
    }
  }

  navigateToPage(href) {
    const page = href.replace("./", "").replace(".html", "");

    if (page === "index" || page === "") {
      // Stay on home page
      return;
    }

    // Update current page
    if (window.gameWebsite) {
      window.gameWebsite.currentPage = page;
    }

    // Load the new page
    window.location.href = href;
  }

  handleContactForm(e) {
    e.preventDefault();

    if (window.gameWebsite) {
      window.gameWebsite.handleContactForm(e);
    }
  }

  handleReadMore(e) {
    e.preventDefault();

    const button = e.target;
    const container = button.closest(".news-section");

    if (container) {
      // Load more news content
      this.loadMoreNews(container);
    }
  }

  async loadMoreNews(container) {
    try {
      // Simulate loading more content
      const loadingText = container.querySelector(".loading-text");
      if (loadingText) {
        loadingText.style.display = "block";
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add more news items (this would normally come from an API)
      const newsContainer = container.querySelector(".news-grid");
      if (newsContainer) {
        const additionalNews = this.createAdditionalNewsItems();
        newsContainer.appendChild(additionalNews);
      }

      // Hide loading text
      if (loadingText) {
        loadingText.style.display = "none";
      }
    } catch (error) {
      console.error("Failed to load more news:", error);
    }
  }

  createAdditionalNewsItems() {
    const fragment = document.createDocumentFragment();

    // Create additional news items
    const additionalItems = [
      {
        title: "Community Tournament Announced",
        date: "December 20, 2024",
        content:
          "Join our first community tournament and compete with players from around the world!",
        category: "gameProgress",
      },
      {
        title: "Winter Update Preview",
        date: "December 18, 2024",
        content:
          "Get a sneak peek at our upcoming winter-themed content and special events.",
        category: "adventureJournal",
      },
    ];

    additionalItems.forEach((item) => {
      const newsItem = document.createElement("article");
      newsItem.className = "news-item animate-on-scroll";
      newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <time>${item.date}</time>
                <p>${item.content}</p>
            `;
      fragment.appendChild(newsItem);
    });

    return fragment;
  }

  showComponentError(placeholder, componentPath) {
    placeholder.innerHTML = `
            <div class="component-error">
                <p>Failed to load component: ${componentPath}</p>
                <button onclick="location.reload()" class="btn">Retry</button>
            </div>
        `;
  }

  loadPageSpecificComponents() {
    // Load page-specific components based on current page
    const currentPage = this.getCurrentPage();

    switch (currentPage) {
      case "news":
        this.loadNewsComponents();
        break;
      case "contacts":
        this.loadContactComponents();
        break;
      case "privacy":
        this.loadPrivacyComponents();
        break;
      case "cookies":
        this.loadCookieComponents();
        break;
      case "disclaimer":
        this.loadDisclaimerComponents();
        break;
      default:
        // Home page - no additional components needed
        break;
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("tung-news")) return "news";
    if (path.includes("tung-contacts")) return "contacts";
    if (path.includes("tung-privacy")) return "privacy";
    if (path.includes("tung-cookies")) return "cookies";
    if (path.includes("tung-disclaimer")) return "disclaimer";
    return "home";
  }

  loadNewsComponents() {
    // Load news-specific components if needed
    console.log("Loading news components");
  }

  loadContactComponents() {
    // Load contact-specific components if needed
    console.log("Loading contact components");
  }

  loadPrivacyComponents() {
    // Load privacy-specific components if needed
    console.log("Loading privacy components");
  }

  loadCookieComponents() {
    // Load cookie-specific components if needed
    console.log("Loading cookie components");
  }

  loadDisclaimerComponents() {
    // Load disclaimer-specific components if needed
    console.log("Loading disclaimer components");
  }

  initializeMobileMenu() {
    // Check if mobile menu is already initialized
    if (window.mobileMenu && window.mobileMenu.isInitialized) {
      return;
    }

    // Initialize mobile menu if the class exists
    if (window.MobileMenu) {
      window.mobileMenu = new window.MobileMenu();
    } else {
      // Fallback: setup basic mobile menu functionality
      this.setupBasicMobileMenu();
    }
  }

  setupBasicMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");

    if (!mobileMenuBtn || !mobileNav) return;

    // Setup mobile menu button click
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
      document.body.classList.toggle("mobile-menu-open");
    });

    // Close mobile menu when clicking on links
    const mobileNavLinks = mobileNav.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
      });
    });

    // Close mobile menu when clicking close button
    const mobileCloseBtn = mobileNav.querySelector("#mobile-close-btn");
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
      }
    });

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        mobileNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
      }
    });

    console.log("Basic mobile menu initialized");
  }

  // Utility methods
  clearCache() {
    this.cache.clear();
  }

  preloadComponent(componentPath) {
    fetch(componentPath)
      .then((response) => response.text())
      .then((html) => {
        this.cache.set(componentPath, html);
      })
      .catch((error) => {
        console.error(`Failed to preload component ${componentPath}:`, error);
      });
  }
}

// Initialize the component builder when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.componentBuilder = new ComponentBuilder();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ComponentBuilder;
}
