// Mobile menu functionality
class MobileMenu {
  constructor() {
    this.mobileMenuBtn = null;
    this.mobileNav = null;
    this.body = document.body;
    this.init();
  }

  init() {
    // Wait for DOM to be ready and header to be loaded
    this.waitForHeader();
  }

  waitForHeader() {
    const checkHeader = () => {
      this.mobileMenuBtn = document.getElementById("mobile-menu-btn");
      this.mobileNav = document.getElementById("mobile-nav");

      if (this.mobileMenuBtn && this.mobileNav) {
        console.log("Mobile menu elements found, setting up...");
        this.setupMobileMenu();
        this.isInitialized = true;
      } else {
        // Check again in a short while
        setTimeout(checkHeader, 100);
      }
    };

    checkHeader();
  }

  setupMobileMenu() {
    console.log("Setting up mobile menu event listeners...");

    // Setup mobile menu button click
    this.mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("Mobile menu button clicked");
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking on links
    const mobileNavLinks = this.mobileNav.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.mobileMenuBtn.contains(e.target) &&
        !this.mobileNav.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.mobileNav.classList.toggle("active");
    this.mobileMenuBtn.classList.toggle("active");
    this.body.classList.toggle("mobile-menu-open");
  }

  closeMobileMenu() {
    this.mobileNav.classList.remove("active");
    this.mobileMenuBtn.classList.remove("active");
    this.body.classList.remove("mobile-menu-open");
  }

  openMobileMenu() {
    this.mobileNav.classList.add("active");
    this.mobileMenuBtn.classList.add("active");
    this.body.classList.add("mobile-menu-open");
  }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.mobileMenu = new MobileMenu();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = MobileMenu;
}
