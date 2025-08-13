// Main JavaScript file for Tung TungBall and Labububall website
class GameWebsite {
  constructor() {
    this.data = null;
    this.currentPage = "home";
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.loadPageContent();
      this.initializeAnimations();
    } catch (error) {
      console.error("Failed to initialize website:", error);
    }
  }

  async loadData() {
    try {
      const response = await fetch("./data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error("Failed to load data:", error);
      // Fallback data if JSON fails to load
      this.data = this.getFallbackData();
    }
  }

  getFallbackData() {
    return {
      site: {
        title: "Skillarenalegends.com – Tung TungBall and Labububall",
        description:
          "You must survive in the world of balls. Two friends, Tungball and Labububall, need your help.",
        keywords: "2 Player, 2 Player Games, 2D, Adventure, Arcade, Ball",
      },
      navigation: {
        home: "Home",
        news: "News",
        contacts: "Contact",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        disclaimer: "Legal Disclaimer",
      },
    };
  }

  setupEventListeners() {
    // Smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      if (e.target.tagName === "A" && e.target.hash) {
        e.preventDefault();
        this.smoothScrollTo(e.target.hash);
      }
    });

    // Intersection Observer for animations
    this.setupIntersectionObserver();

    // Form submissions
    this.setupFormHandlers();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll("section, .animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });
  }

  setupFormHandlers() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleContactForm(e));
    }
  }

  handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Basic validation
    if (!this.validateName(name)) {
      this.showFormError(
        "name",
        this.data.contact.form.validation.nameRequired
      );
      return;
    }

    if (!this.validateEmail(email)) {
      this.showFormError(
        "email",
        this.data.contact.form.validation.emailRequired
      );
      return;
    }

    if (!message.trim()) {
      this.showFormError(
        "message",
        this.data.contact.form.validation.messageRequired
      );
      return;
    }

    // Clear form and show success message
    e.target.reset();
    this.showSuccessMessage(this.data.contact.form.success);
  }

  validateName(name) {
    return /^[A-Za-z\s]+$/.test(name.trim());
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  showFormError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      // Remove existing error
      const existingError = field.parentNode.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }

      // Add new error
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.color = "red";
      errorDiv.style.fontSize = "0.875rem";
      errorDiv.style.marginTop = "0.25rem";

      field.parentNode.appendChild(errorDiv);
      field.style.borderColor = "red";
    }
  }

  showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    successDiv.style.color = "green";
    successDiv.style.textAlign = "center";
    successDiv.style.padding = "1rem";
    successDiv.style.backgroundColor = "#f0f8f0";
    successDiv.style.borderRadius = "8px";
    successDiv.style.marginTop = "1rem";

    const form = document.getElementById("contact-form");
    if (form) {
      form.parentNode.insertBefore(successDiv, form.nextSibling);

      // Remove success message after 5 seconds
      setTimeout(() => {
        successDiv.remove();
      }, 5000);
    }
  }

  loadPageContent() {
    // Load footer
    this.loadComponent("footer-placeholder", "./parts/footer.html");

    // Load page-specific content
    if (this.currentPage === "home") {
      this.loadHomePageContent();
    }
  }

  async loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
      const response = await fetch(componentPath);
      if (response.ok) {
        const html = await response.text();
        placeholder.innerHTML = html;

        // Execute any scripts in the loaded component
        this.executeScripts(placeholder);
      }
    } catch (error) {
      console.error(`Failed to load component ${componentPath}:`, error);
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((script) => {
      // Skip if script is already processed
      if (script.dataset.processed) {
        return;
      }

      const newScript = document.createElement("script");
      if (script.src) {
        // Check if script with same src already exists
        const existingScript = document.querySelector(
          `script[src="${script.src}"]`
        );
        if (existingScript) {
          script.dataset.processed = "true";
          return;
        }
        newScript.src = script.src;
      } else {
        // Check if inline script with same content already exists
        const existingScripts = document.querySelectorAll("script:not([src])");
        const scriptExists = Array.from(existingScripts).some(
          (existing) => existing.textContent === script.textContent
        );
        if (scriptExists) {
          script.dataset.processed = "true";
          return;
        }
        newScript.textContent = script.textContent;
      }

      // Mark script as processed
      script.dataset.processed = "true";

      // Add to head only if not already there
      if (!document.head.contains(newScript)) {
        document.head.appendChild(newScript);
      }
    });
  }

  async loadHomePageContent() {
    const sections = [
      { id: "banner-placeholder", path: "./parts/banner.html" },
      { id: "advantages-placeholder", path: "./parts/advantages.html" },
      { id: "handbook-placeholder", path: "./parts/handbook.html" },
      { id: "worldmap-placeholder", path: "./parts/worldmap.html" },
      { id: "community-placeholder", path: "./parts/community.html" },
      { id: "story-placeholder", path: "./parts/story.html" },
    ];

    for (const section of sections) {
      await this.loadComponent(section.id, section.path);
    }
  }

  smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  initializeAnimations() {
    // Add animation classes to elements
    document.querySelectorAll(".animate-on-scroll").forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax effect for background images
    this.setupParallax();
  }

  setupParallax() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".parallax");

      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Utility methods
  getData(path) {
    return path.split(".").reduce((obj, key) => obj && obj[key], this.data);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Error handling
  showError(message) {
    console.error(message);
    // You can implement a user-friendly error display here
  }
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.gameWebsite = new GameWebsite();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameWebsite;
}
