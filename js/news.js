// News page JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const modal = document.getElementById("newsModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const modalImage = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close");

  // Global function to open modal
  window.openModal = function (title, content, imageUrl) {
    if (modal && modalTitle && modalContent) {
      modalTitle.textContent = title;
      modalContent.textContent = content;

      // Показуємо або приховуємо зображення
      if (imageUrl) {
        modalImage.src = imageUrl;
        modalImage.style.display = "block";
      } else {
        modalImage.style.display = "none";
      }

      modal.style.display = "block";
      document.body.style.overflow = "hidden";

      // Focus management for accessibility
      modal.focus();
      closeBtn.focus();
    } else {
      console.error("Modal elements not found");
    }
  };

  // Function to close modal
  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // Close modal when clicking on X
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }

  // Close modal when clicking outside of it
  if (modal) {
    window.onclick = function (event) {
      if (event.target === modal) {
        closeModal();
      }
    };
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal && modal.style.display === "block") {
      closeModal();
    }
  });

  // Add click event listeners to all Read More buttons
  const readMoreButtons = document.querySelectorAll(".read-more-btn");
  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the news item data
      const newsItem = this.closest(".news-item");
      const title = newsItem.querySelector(".news-item-title").textContent;
      const content =
        this.getAttribute("data-content") || this.getAttribute("onclick");
      const imageUrl = this.getAttribute("data-image");

      // Extract content from onclick attribute if data-content is not available
      let fullContent = "";
      if (content && content.includes("openModal(")) {
        const match = content.match(/openModal\('([^']+)',\s*'([^']+)'/);
        if (match) {
          fullContent = match[2].replace(/\\'/g, "'");
        }
      }

      if (fullContent) {
        openModal(title, fullContent, imageUrl);
      } else {
        // Fallback: show basic content
        const basicContent =
          newsItem.querySelector(".news-item-content").textContent;
        openModal(title, basicContent, imageUrl);
      }
    });
  });

  // Initialize animations
  const newsItems = document.querySelectorAll(".news-item");
  newsItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });

  console.log("News page JavaScript loaded successfully");
});
