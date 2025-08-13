// Cookie Consent Management
class CookieConsent {
  constructor() {
    this.cookieBar = document.getElementById("cookie-consent");
    this.acceptButton = document.getElementById("accept-cookies");
    this.storageKey = "cookieConsentAccepted";
    this.init();
  }

  init() {
    if (this.cookieBar && this.acceptButton) {
      this.checkConsentStatus();
      this.setupEventListeners();
    }
  }

  checkConsentStatus() {
    const consentAccepted = localStorage.getItem(this.storageKey);

    if (consentAccepted === "true") {
      this.hideCookieBar();
    } else {
      this.showCookieBar();
    }
  }

  setupEventListeners() {
    if (this.acceptButton) {
      this.acceptButton.addEventListener("click", () => {
        this.acceptCookies();
      });
    }

    // Add keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && document.activeElement === this.acceptButton) {
        this.acceptCookies();
      }
    });
  }

  acceptCookies() {
    // Store consent in localStorage
    localStorage.setItem(this.storageKey, "true");

    // Hide the cookie bar
    this.hideCookieBar();

    // Trigger custom event for other components
    this.triggerConsentEvent();

    // Optional: Send analytics event
    this.trackConsent();
  }

  hideCookieBar() {
    if (this.cookieBar) {
      this.cookieBar.style.display = "none";
    }
  }

  showCookieBar() {
    if (this.cookieBar) {
      this.cookieBar.style.display = "block";
      this.cookieBar.classList.add("fade-in-up");
    }
  }

  triggerConsentEvent() {
    const event = new CustomEvent("cookieConsentAccepted", {
      detail: {
        timestamp: new Date().toISOString(),
        consent: true,
      },
    });
    document.dispatchEvent(event);
  }

  trackConsent() {
    // Track consent acceptance (if analytics are available)
    if (typeof gtag !== "undefined") {
      gtag("event", "cookie_consent_accepted", {
        event_category: "engagement",
        event_label: "cookie_consent",
      });
    }
  }

  // Public methods for external use
  hasConsent() {
    return localStorage.getItem(this.storageKey) === "true";
  }

  clearConsent() {
    localStorage.removeItem(this.storageKey);
    this.showCookieBar();
  }

  // Method to check if cookies are enabled
  areCookiesEnabled() {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (e) {
      return false;
    }
  }

  // Method to show cookie preferences (for future use)
  showCookiePreferences() {
    // This could open a modal with detailed cookie settings
    console.log("Cookie preferences would open here");
  }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cookieConsent = new CookieConsent();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CookieConsent;
}
