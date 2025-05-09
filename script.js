/**
 * Bcaitech Digital Business Card Creator
 * Main JavaScript file
 * Author: Claude
 * Version: 1.1
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations
  AOS.init();

  // Get DOM elements
  const form = document.getElementById("cardForm");
  const previewSection = document.getElementById("previewSection");
  const previewContainer = document.getElementById("cardPreview");
  const downloadBtn = document.getElementById("downloadBtn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const customModal = document.getElementById("customModal");
  const modalButton = document.querySelector(".modal-button");

  // Image Uploads
  const profilePicInput = document.getElementById("profilePic");
  const backgroundImageInput = document.getElementById("backgroundImage");
  const logoImageInput = document.getElementById("logoImage");
  const profilePreview = document.getElementById("profilePreview");
  const backgroundPreview = document.getElementById("backgroundPreview");
  const logoPreview = document.getElementById("logoPreview");

  // Store current card data and images
  let currentCardData = null;
  let imageData = {
    profile: null,
    background: null,
    logo: null,
  };
  let primaryColor = "#8B0000"; // Default primary color

  /**
   * Show modal message with animation
   * @param {string} message - Message to display
   * @param {boolean} isError - Whether this is an error message
   */
  function showModal(message, isError = false) {
    // Check if modal exists in the HTML file (downloaded version)
    let customModal = document.getElementById("customModal");

    // If modal doesn't exist, create it dynamically
    if (!customModal) {
      customModal = document.createElement("div");
      customModal.id = "customModal";
      customModal.className = "modal-container";

      // Create modal content
      customModal.innerHTML = `
          <div class="modal-content">
            <div class="modal-icon">
              <i class="fas ${
                isError ? "fa-exclamation-circle" : "fa-check-circle"
              }"></i>
            </div>
            <h3 class="modal-title">${isError ? "حدث خطأ!" : "تم بنجاح!"}</h3>
            <p class="modal-message">${
              message ||
              "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك."
            }</p>
            <button class="modal-button" style="background-color: ${
              isError ? "#dc3545" : primaryColor
            };">حسناً</button>
          </div>
        `;

      // Add modal styles if they don't exist
      if (!document.getElementById("modalStyles")) {
        const styleEl = document.createElement("style");
        styleEl.id = "modalStyles";
        styleEl.textContent = `
            .modal-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s ease;
            }
            
            .modal-container.show {
              opacity: 1;
              visibility: visible;
            }
            
            .modal-content {
              background-color: white;
              padding: 30px;
              border-radius: 15px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
              max-width: 400px;
              width: 90%;
              transform: translateY(30px) scale(0.9);
              transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
              position: relative;
              overflow: hidden;
            }
            
            .modal-container.show .modal-content {
              transform: translateY(0) scale(1);
            }
            
            .modal-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 5px;
              background: linear-gradient(to right, var(--primary-color, ${primaryColor}), #ff6b6b);
            }
            
            .modal-icon {
              margin-bottom: 20px;
            }
            
            .modal-icon i {
              font-size: 70px;
              color: #28a745;
              animation: modalIconAnimation 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            @keyframes modalIconAnimation {
              0% {
                transform: scale(0.3);
                opacity: 0;
              }
              70% {
                transform: scale(1.2);
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            
            .modal-title {
              font-size: 24px;
              color: #333;
              margin-bottom: 15px;
              font-weight: 600;
              animation: fadeInUp 0.4s ease forwards;
              animation-delay: 0.2s;
              opacity: 0;
            }
            
            .modal-message {
              font-size: 16px;
              color: #666;
              margin-bottom: 25px;
              line-height: 1.6;
              animation: fadeInUp 0.4s ease forwards;
              animation-delay: 0.3s;
              opacity: 0;
            }
            
            .modal-button {
              background-color: var(--primary-color, ${primaryColor});
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 25px;
              font-size: 16px;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.3s ease;
              animation: fadeInUp 0.4s ease forwards;
              animation-delay: 0.4s;
              opacity: 0;
              margin-top: 10px;
            }
            
            .modal-button:hover {
              background-color: var(--hover-color, ${primaryColor});
              transform: translateY(-3px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            @keyframes fadeInUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `;
        document.head.appendChild(styleEl);
      }

      // Append modal to body
      document.body.appendChild(customModal);

      // Add event listener to close button
      const closeButton = customModal.querySelector(".modal-button");
      if (closeButton) {
        closeButton.addEventListener("click", function () {
          hideModal();
        });
      }

      // Add click event to close on background click
      customModal.addEventListener("click", function (e) {
        if (e.target === customModal) {
          hideModal();
        }
      });
    } else {
      // Update existing modal content
      const modalContent = customModal.querySelector(".modal-content");
      if (modalContent) {
        const modalIcon = modalContent.querySelector(".modal-icon i");
        if (modalIcon) {
          modalIcon.className = `fas ${
            isError ? "fa-exclamation-circle" : "fa-check-circle"
          }`;
          modalIcon.style.color = isError ? "#dc3545" : "#28a745";
        }

        const modalTitle = modalContent.querySelector(".modal-title");
        if (modalTitle) {
          modalTitle.textContent = isError ? "حدث خطأ!" : "تم بنجاح!";
        }

        const modalMessage = modalContent.querySelector(".modal-message");
        if (modalMessage) {
          modalMessage.textContent =
            message ||
            "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك.";
        }

        const modalButton = modalContent.querySelector(".modal-button");
        if (modalButton) {
          modalButton.style.backgroundColor = isError
            ? "#dc3545"
            : primaryColor;
        }
      }
    }

    // Show modal
    customModal.classList.add("show");

    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // Add ESC key support to close modal
    document.addEventListener("keydown", handleEscKeyPress);
  }

  /**
   * Handle ESC key press to close modal
   */
  function handleEscKeyPress(e) {
    if (e.key === "Escape") {
      hideModal();
    }
  }

  /**
   * Hide modal
   */
  function hideModal() {
    const customModal = document.getElementById("customModal");
    if (customModal) {
      customModal.classList.remove("show");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscKeyPress);
    }
  }

  // Update template preview images
  updateTemplatePreviewImages();

  // Update template HTML structures
  updateTemplateHTML();

  // Add updated CSS styles for templates
  updateTemplateCSS();

  // Setup modal button event
  if (modalButton) {
    modalButton.addEventListener("click", function () {
      hideModal();
    });

    // Also close modal when clicking outside of it
    customModal.addEventListener("click", function (e) {
      if (e.target === customModal) {
        hideModal();
      }
    });

    // Add escape key support
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && customModal.classList.contains("show")) {
        hideModal();
      }
    });
  }

  /**
   * Show the custom modal with success message
   * @param {string} message - Optional custom message to display
   * @param {boolean} isError - Whether this is an error message
   */
  function showModal(message, isError = false) {
    // Apply the primary color to the modal components
    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
      modalContent.innerHTML = `
        <div class="modal-icon">
          <i class="fas ${
            isError ? "fa-exclamation-circle" : "fa-check-circle"
          }"></i>
        </div>
        <h3 class="modal-title">${isError ? "حدث خطأ!" : "تم بنجاح!"}</h3>
        <p class="modal-message">${
          message ||
          "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك."
        }</p>
        <button class="modal-button" style="background-color: ${
          isError ? "#dc3545" : primaryColor
        };">حسناً</button>
      `;

      // Add error class if needed
      if (isError) {
        modalContent.classList.add("error");
        modalContent.querySelector(".modal-icon i").style.color = "#dc3545";
      } else {
        modalContent.classList.remove("error");
        modalContent.querySelector(".modal-icon i").style.color = "#28a745";
      }

      // Reset modal button event
      modalContent
        .querySelector(".modal-button")
        .addEventListener("click", hideModal);

      // Apply gradient to modal header
      modalContent.style.setProperty(
        "--modal-gradient-color",
        isError ? "#dc3545" : primaryColor
      );
    }

    // Show the modal with animation
    customModal.classList.add("show");

    // Prevent scrolling on body
    document.body.style.overflow = "hidden";
  }

  /**
   * Hide the custom modal
   */
  function hideModal() {
    customModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  // Handle image upload and preview
  setupImageUpload(profilePicInput, profilePreview, "profile");
  setupImageUpload(backgroundImageInput, backgroundPreview, "background");
  setupImageUpload(logoImageInput, logoPreview, "logo");

  // Handle primary color selection
  const primaryColorInput = document.getElementById("primaryColor");
  if (primaryColorInput) {
    primaryColorInput.addEventListener("change", function (e) {
      primaryColor = e.target.value;

      // If card is already generated, update it with the new color
      if (currentCardData) {
        createCard(currentCardData);
      }
    });
  }

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const cardData = {
      name: formData.get("name"),
      position: formData.get("position"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      website: formData.get("website"),
      description: formData.get("description"),
      template: formData.get("template"),
      primaryColor: formData.get("primaryColor"),
    };

    // Save current data
    primaryColor = cardData.primaryColor;
    currentCardData = cardData;

    // Create the card
    createCard(cardData);

    // Show preview section with animation
    previewSection.style.display = "block";

    // Scroll to preview section
    previewSection.scrollIntoView({ behavior: "smooth" });
  });

  // Handle download button click
  downloadBtn.addEventListener("click", function () {
    if (currentCardData) {
      createCardPackage(currentCardData);
    }
  });

  // Handle send email button click
  sendEmailBtn.addEventListener("click", function () {
    if (currentCardData) {
      sendCardByEmail(currentCardData);
    }
  });

  /**
   * Update template preview images in the template selection section
   */
  function updateTemplatePreviewImages() {
    // Classic template preview (Image 1 - Ahmed Al-Khazraji)
    const classicTemplatePreview = document.querySelector(
      "#template1 + label img"
    );
    if (classicTemplatePreview) {
      classicTemplatePreview.src = "assets/media/template1.png";
      classicTemplatePreview.alt = "Classic Template";

      // Add hover effect to template preview
      const classicTemplateLabel = document.querySelector("#template1 + label");
      if (classicTemplateLabel) {
        classicTemplateLabel.addEventListener("mouseenter", function () {
          classicTemplatePreview.style.transform = "scale(1.05)";
          classicTemplatePreview.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
        });

        classicTemplateLabel.addEventListener("mouseleave", function () {
          classicTemplatePreview.style.transform = "";
          classicTemplatePreview.style.boxShadow = "";
        });
      }
    }

    // Modern template preview (Image 2)
    const modernTemplatePreview = document.querySelector(
      "#template2 + label img"
    );
    if (modernTemplatePreview) {
      modernTemplatePreview.src = "assets/media/template2.png";
      modernTemplatePreview.alt = "Modern Template";
    }

    // Add hover effects to all template selections
    const templateOptions = document.querySelectorAll(".template-option");
    templateOptions.forEach((option) => {
      const label = option.querySelector("label");
      const img = option.querySelector("img");
      const span = option.querySelector("span");
      if (label && img && span) {
        label.addEventListener("mouseenter", function () {
          if (!option.querySelector("input").checked) {
            img.style.transform = "translateY(-5px)";
            img.style.boxShadow = "0 5px 10px rgba(0,0,0,0.1)";
            span.style.color = "#8B0000";
          }
        });

        label.addEventListener("mouseleave", function () {
          if (!option.querySelector("input").checked) {
            img.style.transform = "";
            img.style.boxShadow = "";
            span.style.color = "";
          }
        });
      }
    });
  }

  /**
   * Update the HTML structure of the templates
   */
  function updateTemplateHTML() {
    // =====================================
    // Update Classic Template (Image 1)
    // =====================================
    const classicTemplate = document.getElementById("classicTemplate");
    if (classicTemplate) {
      classicTemplate.innerHTML = `
      <div class="business-card classic-card">
          <div class="classic-header">
              <img src="" alt="Cover" class="cover-image">
          </div>

          <div class="profile-section">
              <div class="profile-container">
                  <div class="profile-circle">
                      <img src="" alt="Profile" class="profile-img">
                  </div>
              </div>
              <div class="company-logo-container">
                  <img src="" alt="Company Logo" class="company-logo">
              </div>
          </div>

          <div class="identity-section">
              <h1 class="name"></h1>
              <h2 class="position"></h2>
          </div>

          <p class="description"></p>

          <div class="contact-info">
              <div class="contact-item email-item">
                  <span class="icon"><i class="fas fa-envelope"></i></span>
                  <div class="contact-details">
                      <span class="email"></span>
                      <span class="label">Work</span>
                  </div>
              </div>

              <div class="contact-item phone-item">
                  <span class="icon"><i class="fas fa-phone"></i></span>
                  <div class="contact-details">
                      <span class="phone"></span>
                      <span class="label">Work</span>
                  </div>
              </div>

              <div class="contact-item whatsapp-item">
                  <span class="icon"><i class="fab fa-whatsapp"></i></span>
                  <div class="contact-details">
                      <span class="text">Connect with me on WhatsApp</span>
                  </div>
              </div>

              <div class="contact-item website-item">
                  <span class="icon"><i class="fas fa-globe"></i></span>
                  <div class="contact-details">
                      <span class="text">Visit our website</span>
                  </div>
              </div>
          </div>

          <button class="save-contact">Save Contact</button>

          <div class="powered-by">
              Powered by <a href="https://bcaitech.bh/" target="_blank"
                    rel="noopener noreferrer" class="powered-by-brand">Bcaitech</a>
          </div>
      </div>`;
    }

    // =====================================
    // Update Modern Template (Image 2)
    // =====================================
    const modernTemplate = document.getElementById("modernTemplate");
    if (modernTemplate) {
      modernTemplate.innerHTML = `
      <div class="business-card modern-card">
          <!-- Top header with logos -->
          <div class="modern-header">
              <div class="left-logo">
                  <img src="" alt="Company Logo" class="company-logo">
              </div>
              <div class="right-logo">
                  <img src="" alt="Legal Symbol" class="legal-symbol">
              </div>
          </div>
          
          <!-- Arabic info banner -->
          <div class="arabic-banner">
              <img src="" alt="Arabic Info" class="arabic-info">
          </div>
          
          <!-- Profile section -->
          <div class="profile-section">
              <div class="profile-circle">
                  <img src="" alt="Profile Photo" class="profile-img">
              </div>
          </div>
          
          <!-- Name and title section -->
          <div class="identity-section">
              <h1 class="name"></h1>
              <h2 class="position"></h2>
              
              <!-- Certification text -->
              <div class="certification-text">
                  <p class="license-text"></p>
                  <p class="arabic-text"></p>
              </div>
          </div>
          
          <!-- Description section -->
          <div class="description-container">
              <p class="description"></p>
          </div>
          
          <!-- Contact information -->
          <div class="contact-info">
              <div class="contact-item">
                  <div class="contact-icon">
                      <i class="fas fa-envelope"></i>
                  </div>
                  <div class="contact-details">
                      <span class="email"></span>
                      <span class="label">Work</span>
                  </div>
              </div>
              
              <div class="contact-item">
                  <div class="contact-icon">
                      <i class="fas fa-phone"></i>
                  </div>
                  <div class="contact-details">
                      <span class="phone"></span>
                      <span class="label">Work</span>
                  </div>
              </div>
              
              <div class="contact-item whatsapp-item">
                  <div class="contact-icon">
                      <i class="fab fa-whatsapp"></i>
                  </div>
                  <div class="contact-details">
                      <span class="text">Connect with me on WhatsApp</span>
                  </div>
              </div>
              
              <div class="contact-item website-item">
                  <div class="contact-icon">
                      <i class="fas fa-globe"></i>
                  </div>
                  <div class="contact-details">
                      <span class="text">Visit our website</span>
                  </div>
              </div>
          </div>
          
          <!-- Save contact button -->
          <div class="save-contact-container">
              <button class="save-contact">Save Contact</button>
          </div>
      </div>`;
    }
  }

  /**
   * Update the CSS styles for the templates
   */
  function updateTemplateCSS() {
    // Create a new style element
    const styleEl = document.createElement("style");

    // Add updated CSS
    styleEl.textContent = `
      /* ==============================
         Classic Card Styles - Enhanced with Animations 
         ============================== */
      .classic-card {
          background: white;
          padding: 0;
          text-align: center;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          max-width: 350px;
          height: 600px;
          margin: 0 auto;
          position: relative;
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          display: flex;
          flex-direction: column;
      }
      
      .classic-header {
          width: 100%;
          height: 100px;
          overflow: hidden;
          background-color: #fff;
      }
      
      .classic-header .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #fff;
      }
      
      .classic-card .profile-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 20px;
          position: relative;
          margin-top: -40px;
          margin-bottom: 20px;
      }
      
      .classic-card .profile-container {
          z-index: 2;
      }
      
      .classic-card .profile-circle {
          width: 80px;
          height: 80px;
          border: 3px solid #8B0000;
          border-radius: 50%;
          overflow: hidden;
          background: white;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
      }
      
      .classic-card:hover .profile-circle {
          transform: scale(1.05);
          border-color: #b10000;
      }
      
      .classic-card .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
      }
      
      .classic-card .company-logo-container {
          width: 120px;
          height: 80px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 8px;
          transition: all 0.3s ease;
      }
      
      .classic-card:hover .company-logo-container {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }
      
      .classic-card .company-logo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
      }
      
      .classic-card .identity-section {
          padding: 10px 20px 5px;
          text-align: center;
          animation: fadeIn 0.6s ease-out;
      }
      
      .classic-card .name {
          font-size: 1.6rem;
          font-weight: 700;
          color: #333;
          margin: 0;
          text-align: center;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
      }
      
      .classic-card:hover .name {
          color: #8B0000;
      }
      
      .classic-card .position {
          font-size: 1.1rem;
          color: #666;
          font-weight: 500;
          margin: 8px 0 20px;
          text-transform: none;
          text-align: center;
      }
      
      .classic-card .description {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #333;
          text-align: left;
          padding: 15px;
          margin: 0 20px 15px;
          background: #f8f9fa;
          border-radius: 10px;
      }
      
      .classic-card .contact-info {
          padding: 5px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      
      .classic-card .contact-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: none;
          text-decoration: none;
          transition: all 0.3s ease;
          color: #333;
          cursor: pointer;
      }
      
      .classic-card .contact-item:hover {
          color: #8B0000;
          transform: translateX(5px);
          background-color: rgba(0, 0, 0, 0.02);
          border-radius: 8px;
      }
      
      .classic-card .icon {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 15px;
          font-size: 16px;
          color: inherit;
          transition: all 0.3s ease;
      }
      
      .classic-card .contact-item:hover .icon {
          background: #8B0000;
          color: white;
          transform: scale(1.1);
      }
      
      .classic-card .contact-details {
          display: flex;
          flex-direction: column;
      }
      
      .classic-card .email, 
      .classic-card .phone,
      .classic-card .text {
          flex: 1;
          font-size: 14px;
          color: inherit;
          font-weight: 500;
          text-align: left;
      }
      
      .classic-card .label {
          font-size: 12px;
          color: #666;
          background: transparent;
          padding: 0;
          margin-left: 0;
          text-align: left;
          display: block;
          margin-top: 2px;
      }
      
      .classic-card .save-contact {
          background: #000;
          color: white;
          border: none;
          border-radius: 30px;
          width: 90%;
          margin: 15px auto;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
      }
      
      .classic-card .save-contact::before {
          content: "";
          display: inline-block;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>');
          width: 18px;
          height: 18px;
          background-size: contain;
          background-repeat: no-repeat;
          margin-right: 8px;
          transition: all 0.3s ease;
      }
      
      .classic-card .save-contact:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      
      .classic-card .save-contact:hover::before {
          transform: rotate(10deg) scale(1.2);
      }
      
      .classic-card .powered-by {
          text-align: center;
          padding: 10px 0 20px;
          color: #888;
          font-size: 0.9rem;
          margin-top: auto;
      }
      
      .classic-card .powered-by-brand {
          font-weight: 600;
          color: #8B0000;
      }
      
      .classic-card a.powered-by-brand {
          text-decoration: none;
          color: #8B0000;
          transition: all 0.3s ease;
      }
      
      .classic-card a.powered-by-brand:hover {
          text-decoration: underline;
          color: #b10000;
      }
      
      /* Animation keyframes */
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes icon-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
      }
      
      .business-card {
          animation: cardEntrance 0.8s ease-out;
      }
      
      @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
      }
      
      /* ==============================
         Modern Card Styles
         ============================== */
      .modern-card {
          background: white;
          padding: 0;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          max-width: 350px;
          margin: 0 auto;
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
      }
      
      .modern-header {
          display: flex;
          justify-content: space-between;
          padding: 15px;
      }
      
      .modern-header .left-logo {
          width: 120px;
          display: flex;
          align-items: center;
      }
      
      .modern-header .company-logo {
          max-width: 100%;
          height: auto;
      }
      
      .modern-header .right-logo {
          width: 150px;
          height: 100px;
      }
      
      .modern-header .legal-symbol {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5px;
      }
      
      .arabic-banner {
          padding: 10px 15px;
          background-color: #f9f9f9;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          text-align: right;
      }
      
      .arabic-banner .arabic-info {
          max-width: 100%;
          height: auto;
      }
      
      .modern-card .profile-section {
          padding: 20px 15px 10px;
      }
      
      .modern-card .profile-circle {
          width: 85px;
          height: 85px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      }
      
      .modern-card .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
      }
      
      .modern-card .identity-section {
          padding: 5px 15px 10px;
          text-align: left;
      }
      
      .modern-card .name {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0 0 5px 0;
      }
      
      .modern-card .position {
          font-size: 16px;
          color: #555;
          margin: 0 0 15px;
      }
      
      .modern-card .certification-text {
          margin-bottom: 15px;
      }
      
      .modern-card .license-text {
          font-size: 13px;
          font-style: italic;
          color: #666;
          margin: 0 0 5px;
      }
      
      .modern-card .arabic-text {
          font-size: 13px;
          color: #666;
          direction: rtl;
          text-align: right;
          margin: 0;
      }
      
      .modern-card .description-container {
          padding: 5px 15px 15px;
      }
      
      .modern-card .description {
          font-size: 14px;
          line-height: 1.5;
          color: #555;
          text-align: left;
          margin: 0;
      }
      
      .modern-card .contact-info {
          padding: 5px 15px 20px;
      }
      
      .modern-card .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
      }
      
      .modern-card .contact-icon {
          width: 36px;
          height: 36px;
          background-color: #333;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 15px;
      }
      
      .modern-card .contact-icon i {
          color: white;
          font-size: 16px;
      }
      
      .modern-card .contact-details {
          display: flex;
          flex-direction: column;
      }
      
      .modern-card .contact-details .email,
      .modern-card .contact-details .phone,
      .modern-card .contact-details .text {
          font-size: 14px;
          color: #333;
      }
      
      .modern-card .contact-details .label {
          font-size: 12px;
          color: #999;
          background: transparent;
          padding: 0;
      }
      
      .modern-card .save-contact-container {
          padding: 0 15px 25px;
      }
      
      .modern-card .save-contact {
          background: #333;
          color: white;
          border: none;
          border-radius: 25px;
          width: 100%;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
      }
      
      /* Animations and effects */
      .contact-item {
          transition: all 0.3s ease;
      }
      
      .contact-item:hover {
          transform: translateX(5px);
      }
      
      .save-contact {
          transition: all 0.3s ease;
      }
      
      .save-contact:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    `;

    // Append the style element to the head
    document.head.appendChild(styleEl);
  }

  /**
   * Set up image upload handling
   * @param {HTMLElement} inputElement - The file input element
   * @param {HTMLElement} previewElement - The preview container
   * @param {string} imageType - Type of image (profile, background, logo)
   */
  function setupImageUpload(inputElement, previewElement, imageType) {
    inputElement.addEventListener("change", function (e) {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          // Store image data
          imageData[imageType] = e.target.result;

          // Create preview
          const img = document.createElement("img");
          img.src = e.target.result;

          // Clear previous preview
          previewElement.innerHTML = "";
          previewElement.appendChild(img);
        };

        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Create business card based on selected template
   * @param {Object} data - Card data from form
   */
  function createCard(data) {
    // Get selected template
    const templateId = `${data.template}Template`;
    const template = document.getElementById(templateId);

    if (!template) {
      console.error("Template not found:", templateId);
      return;
    }

    // Clone template
    const cardElement = template.content.cloneNode(true);

    // Fill in common data
    cardElement.querySelector(".name").textContent = data.name;

    // Handle position and company
    const positionElement = cardElement.querySelector(".position");
    if (positionElement) {
      positionElement.textContent = data.position;

      // Add company name if not in elegant template
      if (data.template !== "elegant") {
        positionElement.textContent += " - " + data.company;
      }
    }

    // Set description or default
    const descriptionElement = cardElement.querySelector(".description");
    if (descriptionElement) {
      descriptionElement.textContent =
        data.description ||
        "A professional focused on delivering innovative, high-quality technical services that exceed client expectations.";
    }

    // Set email and phone
    const emailElements = cardElement.querySelectorAll(
      ".email, .email-block span"
    );
    emailElements.forEach((el) => (el.textContent = data.email));

    const phoneElements = cardElement.querySelectorAll(
      ".phone, .phone-block span"
    );
    phoneElements.forEach((el) => (el.textContent = data.phone));

    // Template-specific handling
    switch (data.template) {
      case "classic":
        setupClassicTemplate(cardElement, data);
        break;
      case "modern":
        setupModernTemplate(cardElement, data);
        break;
      case "elegant":
        setupElegantTemplate(cardElement, data);
        break;
    }

    // Add images
    addImagesToCard(cardElement, data.template);

    // Apply custom colors
    applyCustomColors(cardElement, data.template);

    // Add card interactions
    addCardInteractions(cardElement, data);

    // Clear previous preview and add the new card
    previewContainer.innerHTML = "";
    previewContainer.appendChild(cardElement);

    // Add animations
    const card = previewContainer.querySelector(".business-card");
    card.classList.add("fadeIn");
  }

  /**
   * Apply custom colors to card elements based on selected primary color
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {string} templateType - Type of template (classic, modern, elegant)
   */
  function applyCustomColors(cardElement, templateType) {
    // Get all color-customizable elements based on template type
    if (templateType === "classic") {
      // Profile circle border
      const profileCircle = cardElement.querySelector(".profile-circle");
      if (profileCircle) {
        profileCircle.style.borderColor = primaryColor;
      }

      // Name color on hover (added inline via style to override CSS)
      const name = cardElement.querySelector(".name");
      if (name) {
        name.parentElement.insertAdjacentHTML(
          "beforeend",
          `<style>
            .classic-card:hover .name { color: ${primaryColor} !important; }
            .classic-card .contact-item:hover { color: ${primaryColor} !important; }
            .classic-card .contact-item:hover .icon { background: ${primaryColor} !important; }
            .classic-card .save-contact:hover { background: ${primaryColor} !important; }
            .powered-by-brand { color: ${primaryColor} !important; }
          </style>`
        );
      }
    } else if (templateType === "modern") {
      // Contact icons
      const contactIcons = cardElement.querySelectorAll(".contact-icon");
      contactIcons.forEach((icon) => {
        icon.style.backgroundColor = primaryColor;
      });

      // Save button
      const saveButton = cardElement.querySelector(".save-contact");
      if (saveButton) {
        saveButton.style.backgroundColor = primaryColor;
      }

      // Add style for hover effects
      cardElement.querySelector(".modern-card").insertAdjacentHTML(
        "beforeend",
        `<style>
          .modern-card .contact-item:hover .contact-details .label { color: ${primaryColor} !important; }
          .modern-card .save-contact:hover { background: ${primaryColor} !important; }
        </style>`
      );
    } else if (templateType === "elegant") {
      // Divider
      const divider = cardElement.querySelector(".elegant-divider");
      if (divider) {
        divider.style.background = primaryColor;
      }

      // Icons
      const icons = cardElement.querySelectorAll(".elegant-contact-item i");
      icons.forEach((icon) => {
        icon.style.color = primaryColor;
      });

      // Save button
      const saveButton = cardElement.querySelector(".elegant-save");
      if (saveButton) {
        saveButton.style.background = primaryColor;
      }
    }
  }

  /**
   * Set up the classic template with specific data (Image 1)
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {Object} data - Card data from form
   */
  function setupClassicTemplate(cardElement, data) {
    // Set profile image
    const profileImg = cardElement.querySelector(".profile-img");
    if (profileImg) {
      if (imageData.profile) {
        profileImg.src = imageData.profile;
      } else {
        profileImg.src = "https://via.placeholder.com/80?text=Profile";
      }
    }

    // Set company logo
    const companyLogo = cardElement.querySelector(".company-logo");
    if (companyLogo) {
      if (imageData.logo) {
        companyLogo.src = imageData.logo;
      } else {
        companyLogo.src = "https://via.placeholder.com/120?text=Logo";
      }
    }

    // Set cover image
    const coverImage = cardElement.querySelector(".cover-image");
    if (coverImage) {
      if (imageData.background) {
        coverImage.src = imageData.background;
      } else {
        coverImage.src = "https://via.placeholder.com/350x100?text=Cover";
      }
    }

    // Set email and phone in the contact details
    const emailElement = cardElement.querySelector(".email-item .email");
    if (emailElement) {
      emailElement.textContent = data.email;
    }

    const phoneElement = cardElement.querySelector(".phone-item .phone");
    if (phoneElement) {
      phoneElement.textContent = data.phone;
    }

    // Handle WhatsApp
    const whatsappItem = cardElement.querySelector(".whatsapp-item");
    if (data.whatsapp) {
      whatsappItem.style.display = "flex";
      const whatsappText = cardElement.querySelector(".whatsapp-item .text");
      if (whatsappText) {
        whatsappText.textContent = "Connect with me on WhatsApp";
      }
    } else {
      whatsappItem.style.display = "none";
    }

    // Handle Website
    const websiteItem = cardElement.querySelector(".website-item");
    if (data.website) {
      websiteItem.style.display = "flex";
      const websiteText = cardElement.querySelector(".website-item .text");
      if (websiteText) {
        websiteText.textContent = "Visit our website";
      }
    } else {
      websiteItem.style.display = "none";
    }

    // Add hover animations
    addHoverAnimations(cardElement);
  }

  /**
   * Add hover animations to the classic card
   * @param {DocumentFragment} cardElement - The card template clone
   */
  function addHoverAnimations(cardElement) {
    const card = cardElement.querySelector(".classic-card");
    if (!card) return;

    // Add entrance animation
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100);

    // Add contact item hover effects
    const contactItems = card.querySelectorAll(".contact-item");
    contactItems.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        this.style.transform = "translateX(5px)";
        const icon = this.querySelector(".icon");
        if (icon) {
          icon.style.backgroundColor = "#8B0000";
          icon.style.color = "white";
        }
      });

      item.addEventListener("mouseleave", function () {
        this.style.transform = "translateX(0)";
        const icon = this.querySelector(".icon");
        if (icon) {
          icon.style.backgroundColor = "";
          icon.style.color = "";
        }
      });
    });
  }

  /**
   * Set up the modern template with specific data (Image 2)
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {Object} data - Card data from form
   */
  function setupModernTemplate(cardElement, data) {
    // Set profile image
    const profileImg = cardElement.querySelector(".profile-img");
    if (profileImg) {
      if (imageData.profile) {
        profileImg.src = imageData.profile;
      } else {
        profileImg.src = "https://via.placeholder.com/85?text=Profile";
      }
    }

    // Set company logo
    const companyLogo = cardElement.querySelector(".company-logo");
    if (companyLogo) {
      if (imageData.logo) {
        companyLogo.src = imageData.logo;
      } else {
        companyLogo.src = "https://via.placeholder.com/120x60?text=Logo";
      }
    }

    // Set legal symbol/background image
    const legalSymbol = cardElement.querySelector(".legal-symbol");
    if (legalSymbol) {
      if (imageData.background) {
        legalSymbol.src = imageData.background;
      } else {
        legalSymbol.src = "https://via.placeholder.com/150x100?text=Symbol";
      }
    }

    // Set certification text
    const licenseText = cardElement.querySelector(".license-text");
    if (licenseText) {
      licenseText.textContent = `"Licensed by the Ministry of Justice - Kingdom of Bahrain"`;
    }

    // Handle WhatsApp
    const whatsappItem = cardElement.querySelector(".whatsapp-item");
    if (data.whatsapp) {
      whatsappItem.style.display = "flex";
    } else {
      whatsappItem.style.display = "none";
    }

    // Handle Website
    const websiteItem = cardElement.querySelector(".website-item");
    if (data.website) {
      websiteItem.style.display = "flex";
    } else {
      websiteItem.style.display = "none";
    }
  }

  /**
   * Set up the elegant template with specific data
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {Object} data - Card data from form
   */
  function setupElegantTemplate(cardElement, data) {
    // Set company name
    const companyNameElement = cardElement.querySelector(".company-name");
    if (companyNameElement) {
      companyNameElement.textContent = data.company;
    }

    // Handle WhatsApp
    const whatsappItem = cardElement.querySelector(".whatsapp-item");
    if (data.whatsapp) {
      whatsappItem.style.display = "flex";
    } else {
      whatsappItem.style.display = "none";
    }

    // Handle Website
    const websiteItem = cardElement.querySelector(".website-item");
    if (data.website) {
      websiteItem.style.display = "flex";
    } else {
      websiteItem.style.display = "none";
    }
  }

  /**
   * Add uploaded images to the card
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {string} templateType - Type of template (classic, modern, elegant)
   */
  function addImagesToCard(cardElement, templateType) {
    // Add profile image
    const profileImgElements = cardElement.querySelectorAll(".profile-img");
    profileImgElements.forEach((el) => {
      if (imageData.profile) {
        el.src = imageData.profile;
      } else {
        el.src = "https://via.placeholder.com/150?text=Profile";
      }
    });

    // Add logo image
    if (templateType === "modern") {
      // For modern template, logo goes to company-logo
      const logoElement = cardElement.querySelector(".company-logo");
      if (logoElement) {
        if (imageData.logo) {
          logoElement.src = imageData.logo;
        } else {
          logoElement.src = "https://via.placeholder.com/150x60?text=Logo";
        }
      }

      // Add legal symbol/background image
      const legalSymbol = cardElement.querySelector(".legal-symbol");
      if (legalSymbol) {
        if (imageData.background) {
          legalSymbol.src = imageData.background;
        } else {
          legalSymbol.src = "https://via.placeholder.com/150x100?text=Symbol";
        }
      }
    } else {
      // For other templates, logo goes to .logo
      const logoElements = cardElement.querySelectorAll(".logo");
      logoElements.forEach((el) => {
        if (imageData.logo) {
          el.src = imageData.logo;
        } else {
          el.src = "https://via.placeholder.com/50?text=Logo";
        }
      });

      // Add background image for classic template
      if (templateType === "classic") {
        const coverImage = cardElement.querySelector(".cover-image");
        if (coverImage && imageData.background) {
          coverImage.src = imageData.background;
        }
      }
    }
  }

  /**
   * Add interactive functionality to card elements
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {Object} data - Card data from form
   */
  function addCardInteractions(cardElement, data) {
    // Save contact button
    const saveContactBtn = cardElement.querySelector(".save-contact");
    if (saveContactBtn) {
      saveContactBtn.addEventListener("click", () => {
        createVCard(data);
      });
    }

    // WhatsApp links
    if (data.whatsapp) {
      const whatsappElements = cardElement.querySelectorAll(".whatsapp-item");
      whatsappElements.forEach((el) => {
        el.addEventListener("click", () => {
          window.open(`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`);
        });
      });
    }

    // Website links
    if (data.website) {
      const websiteElements = cardElement.querySelectorAll(".website-item");
      websiteElements.forEach((el) => {
        el.addEventListener("click", () => {
          window.open(data.website);
        });
      });
    }

    // Email elements
    const emailElements = cardElement.querySelectorAll(".email-item");
    emailElements.forEach((el) => {
      el.addEventListener("click", () => {
        window.location.href = `mailto:${data.email}`;
      });
    });

    // Phone elements
    const phoneElements = cardElement.querySelectorAll(".phone-item");
    phoneElements.forEach((el) => {
      el.addEventListener("click", () => {
        window.location.href = `tel:${data.phone}`;
      });
    });
  }

  /**
   * Create a vCard file for contact saving
   * @param {Object} data - Card data from form
   */
  function createVCard(data) {
    // Create vCard content
    const vCardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${data.name}`,
      `ORG:${data.company}`,
      `TITLE:${data.position}`,
      `EMAIL:${data.email}`,
      `TEL;TYPE=WORK,VOICE:${data.phone}`,
      data.whatsapp ? `TEL;TYPE=CELL,VOICE:${data.whatsapp}` : "",
      data.website ? `URL:${data.website}` : "",
      data.description ? `NOTE:${data.description}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    // Create a downloadable file
    const blob = new Blob([vCardContent], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, "_")}_contact.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success modal
    showModal("تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك.");
  }

  /**
   * Create a downloadable package with HTML, CSS, and JS files
   * @param {Object} data - Card data from form
   */
  function createCardPackage(data) {
    // Generate HTML content
    const htmlContent = generateCardHTML(data);

    // Generate CSS content
    const cssContent = generateCardCSS(data.template);

    // Generate JavaScript content
    const jsContent = generateCardJS(data);

    // Create a ZIP file
    const zip = new JSZip();

    // Add files to ZIP
    zip.file("index.html", htmlContent);
    zip.file("styles.css", cssContent);
    zip.file("script.js", jsContent);

    // Create assets folder
    const assets = zip.folder("assets");
    const media = assets.folder("media");

    // Add images to media folder
    if (imageData.profile) {
      const profileImg = imageData.profile.split(",")[1];
      media.file("profile.jpg", profileImg, { base64: true });
    }

    if (imageData.logo) {
      const logoImg = imageData.logo.split(",")[1];
      media.file("logo.jpg", logoImg, { base64: true });
    }

    if (imageData.background) {
      const bgImg = imageData.background.split(",")[1];
      media.file("background.jpg", bgImg, { base64: true });
    }

    // Generate and download ZIP file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name.replace(/\s+/g, "_")}_business_card.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  /**
   * Generate HTML content for the card package
   * @param {Object} data - Card data from form
   * @returns {string} HTML content
   */
  function generateCardHTML(data) {
    // Set a custom style block to handle the primary color
    const customColorStyle = `
    <style>
      :root {
        --primary-color: ${data.primaryColor || primaryColor};
      }
      .profile-circle { border-color: var(--primary-color) !important; }
      .classic-card:hover .name { color: var(--primary-color) !important; }
      .classic-card .contact-item:hover { color: var(--primary-color) !important; }
      .classic-card .contact-item:hover .icon { background: var(--primary-color) !important; }
      .classic-card .save-contact:hover { background: var(--primary-color) !important; }
      .powered-by-brand { color: var(--primary-color) !important; }
      .modern-card .contact-icon { background-color: var(--primary-color) !important; }
      .modern-card .save-contact:hover { background: var(--primary-color) !important; }
      .elegant-divider { background: var(--primary-color) !important; }
      .elegant-contact-item i { color: var(--primary-color) !important; }
      .elegant-save { background: var(--primary-color) !important; }
    </style>
    `;
    // Get appropriate template based on selected type
    let cardTemplateHTML = "";

    switch (data.template) {
      case "classic":
        cardTemplateHTML = generateClassicCardHTML(data);
        break;
      case "modern":
        cardTemplateHTML = generateModernCardHTML(data);
        break;
      case "elegant":
        cardTemplateHTML = generateElegantCardHTML(data);
        break;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>${data.name} - Business Card</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${customColorStyle}
</head>
<body>
    <div class="card-container">
        ${cardTemplateHTML}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  /**
   * Generate HTML for classic card template
   * @param {Object} data - Card data from form
   * @returns {string} HTML content
   */
  function generateClassicCardHTML(data) {
    return `<div class="business-card classic-card">
        <div class="classic-header">
            <img src="assets/media/background.jpg" alt="Cover" class="cover-image"
         >
        </div>
  
        <div class="profile-section">
            <div class="profile-container">
                <div class="profile-circle">
                    <img src="assets/media/profile.jpg" alt="Profile" class="profile-img"
                 >
                </div>
            </div>
            <div class="company-logo-container">
                <img src="assets/media/logo.jpg" alt="Company Logo" class="company-logo"
              >
            </div>
        </div>
  
        <div class="identity-section">
            <h1 class="name">${data.name}</h1>
            <h2 class="position">${data.position} - ${data.company}</h2>
        </div>
  
        <p class="description">${
          data.description ||
          "A Bahraini technology leader focused on innovation with a clear strategy, striving for excellence in providing innovative, high-quality technical services that satisfy clients."
        }</p>
  
        <div class="contact-info">
            <div class="contact-item email-item">
                <span class="icon"><i class="fas fa-envelope"></i></span>
                <div class="contact-details">
                  <span class="email">${data.email}</span>
                  <span class="label">Work</span>
                </div>
            </div>
  
            <div class="contact-item phone-item">
                <span class="icon"><i class="fas fa-phone"></i></span>
                <div class="contact-details">
                  <span class="phone">${data.phone}</span>
                  <span class="label">Work</span>
                </div>
            </div>
  
            ${
              data.whatsapp
                ? `<div class="contact-item whatsapp-item">
                    <span class="icon"><i class="fab fa-whatsapp"></i></span>
                    <div class="contact-details">
                      <span class="text">Connect with me on WhatsApp</span>
                    </div>
                  </div>`
                : ""
            }
  
            ${
              data.website
                ? `<div class="contact-item website-item">
                    <span class="icon"><i class="fas fa-globe"></i></span>
                    <div class="contact-details">
                      <span class="text">Visit our website</span>
                    </div>
                  </div>`
                : ""
            }
        </div>
  
        <button class="save-contact">Save Contact</button>
  
        <div class="powered-by">
            Powered by <a href="https://bcaitech.bh/" target="_blank"
                    rel="noopener noreferrer" class="powered-by-brand">Bcaitech</a>
        </div>
    </div>`;
  }

  /**
   * Generate HTML for modern card template
   * @param {Object} data - Card data from form
   * @returns {string} HTML content
   */
  function generateModernCardHTML(data) {
    return `<div class="business-card modern-card">
        <!-- Top header with logos -->
        <div class="modern-header">
            <div class="left-logo">
                <img src="assets/media/logo.jpg" alt="Company Logo" class="company-logo"
                  >
            </div>
            <div class="right-logo">
                <img src="assets/media/background.jpg" alt="Legal Symbol" class="legal-symbol" 
                    >
            </div>
        </div>
        
        <!-- Arabic info banner -->
        <div class="arabic-banner">
            <p class="company-tagline">${
              data.company
            } - Professional Services</p>
        </div>
        
        <!-- Profile section -->
        <div class="profile-section">
            <div class="profile-circle">
                <img src="assets/media/profile.jpg" alt="Profile Photo" class="profile-img"
                  >
            </div>
        </div>
        
        <!-- Name and title section -->
        <div class="identity-section">
            <h1 class="name">${data.name}</h1>
            <h2 class="position">${data.position}</h2>
            
            <!-- Certification text -->
            <div class="certification-text">
                <p class="license-text">"Licensed by the Ministry of Justice - Kingdom of Bahrain"</p>
            </div>
        </div>
        
        <!-- Description section -->
        <div class="description-container">
            <p class="description">${
              data.description ||
              "At " +
                data.company +
                ", we specialize in precise judicial enforcement and asset recovery services, ensuring swift justice, safeguarding your rights, and delivering exceptional legal solutions with integrity and efficiency."
            }</p>
        </div>
        
        <!-- Contact information -->
        <div class="contact-info">
            <div class="contact-item">
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="contact-details">
                    <span class="email">${data.email}</span>
                    <span class="label">Work</span>
                </div>
            </div>
            
            <div class="contact-item">
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="contact-details">
                    <span class="phone">${data.phone}</span>
                    <span class="label">Work</span>
                </div>
            </div>
            
            ${
              data.whatsapp
                ? `<div class="contact-item whatsapp-item">
                    <div class="contact-icon">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <div class="contact-details">
                        <span class="text">Connect with me on WhatsApp</span>
                    </div>
                </div>`
                : ""
            }
            
            ${
              data.website
                ? `<div class="contact-item website-item">
                    <div class="contact-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="contact-details">
                        <span class="text">Visit our website</span>
                    </div>
                </div>`
                : ""
            }
        </div>
        
        <!-- Save contact button -->
        <div class="save-contact-container">
            <button class="save-contact">Save Contact</button>
        </div>
    </div>`;
  }

  /**
   * Generate HTML for elegant card template
   * @param {Object} data - Card data from form
   * @returns {string} HTML content
   */
  function generateElegantCardHTML(data) {
    return `<div class="business-card elegant-card">
            <div class="elegant-header">
                <div class="company-logo">
                    <img src="assets/media/logo.jpg" alt="Logo" class="logo"
                     >
                </div>
                <div class="company-name">${data.company}</div>
            </div>
            
            <div class="elegant-profile">
                <div class="profile-container">
                    <img src="assets/media/profile.jpg" alt="Profile" class="profile-img"
                     >
                </div>
                <h1 class="name">${data.name}</h1>
                <h2 class="position">${data.position}</h2>
            </div>
            
            <div class="elegant-divider"></div>
            
            <p class="description">${
              data.description ||
              "A professional focused on delivering innovative, high-quality technical services that exceed client expectations."
            }</p>
            
            <div class="elegant-contact">
                <div class="elegant-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span class="email">${data.email}</span>
                </div>
                
                <div class="elegant-contact-item">
                    <i class="fas fa-phone"></i>
                    <span class="phone">${data.phone}</span>
                </div>
                
                ${
                  data.whatsapp
                    ? `<div class="elegant-contact-item whatsapp-item">
                    <i class="fab fa-whatsapp"></i>
                    <span class="whatsapp-text">Message on WhatsApp</span>
                </div>`
                    : ""
                }
                
                ${
                  data.website
                    ? `<div class="elegant-contact-item website-item">
                    <i class="fas fa-globe"></i>
                    <span class="website-text">Visit Website</span>
                </div>`
                    : ""
                }
            </div>
            
            <button class="save-contact elegant-save">Save Contact</button>
            
            <div class="elegant-footer">
                Powered by <a href="https://bcaitech.bh/" target="_blank"
                    rel="noopener noreferrer" class="powered-by-brand">Bcaitech</a>
            </div>
        </div>`;
  }

  /**
   * Generate CSS for the card package
   * @param {string} templateType - Type of template (classic, modern, elegant)
   * @returns {string} CSS content
   */
  function generateCardCSS(templateType) {
    // Define CSS variables with custom color
    const customColorVars = `
:root {
    --brand-red: ${primaryColor};
    --primary-color: ${primaryColor};
    --brand-blue: #4285F4;
    --dark: #000000;
    --gray: #666666;
    --light-gray: #f8f9fa;
}
`;
    // Common CSS styles
    const commonCSS = `/* Bcaitech Business Card Styles */
${customColorVars}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
}

body {
    background-color: #f8f9fa;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.card-container {
    max-width: 500px;
    margin: 0 auto;
}

/* Animation keyframes */
@keyframes cardEntrance {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes icon-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
}

@keyframes ripple {
    0% { transform: scale(0, 0); opacity: 0.5; }
    20% { transform: scale(25, 25); opacity: 0.3; }
    100% { opacity: 0; transform: scale(40, 40); }
}`;

    // Generate template-specific CSS
    let templateCSS = "";

    switch (templateType) {
      case "classic":
        templateCSS = generateClassicCSS();
        break;
      case "modern":
        templateCSS = generateModernCSS();
        break;
      case "elegant":
        templateCSS = generateElegantCSS();
        break;
    }

    return commonCSS + templateCSS;
  }

  /**
   * Generate CSS for classic template
   * @returns {string} CSS content
   */
  function generateClassicCSS() {
    return `
/* Classic Card Styles */
.business-card {
    width: 350px;
    margin: 0 auto;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    animation: cardEntrance 0.8s ease-out;
}

.business-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.classic-card {
    background: white;
    padding: 0;
    text-align: center;
    width: 350px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Header with cover image */
.classic-header {
    width: 100%;
    height: 100px;
    overflow: hidden;
    background-color: #fff;
    position: relative;
}

.classic-header .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Profile and company logo section */
.profile-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 20px;
    position: relative;
    margin-top: -40px;
    margin-bottom: 20px;
}

.profile-container {
    z-index: 2;
}

.profile-circle {
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #8B0000;
    padding: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.classic-card:hover .profile-circle {
    transform: scale(1.05);
    border-color: #b10000;
}

.profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.company-logo-container {
    width: 120px;
    height: 80px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 8px;
    transition: all 0.3s ease;
}

.classic-card:hover .company-logo-container {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.company-logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

/* Identity section */
.identity-section {
    padding: 10px 20px 5px;
    text-align: center;
    animation: fadeIn 0.6s ease-out;
}

.classic-card .name {
    font-size: 1.6rem;
    font-weight: 700;
    color: #000;
    margin: 0;
    text-align: center;
    letter-spacing: -0.02em;
    transition: all 0.3s ease;
}

.classic-card:hover .name {
    color: #8B0000;
}

.classic-card .position {
    font-size: 1.1rem;
    color: #666;
    font-weight: 500;
    margin: 8px 0 20px;
    text-transform: none;
    text-align: center;
}

.classic-card .description {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
    text-align: left;
    padding: 15px;
    margin: 0 20px 20px;
    background: #f8f9fa;
    border-radius: 10px;
}

/* Contact info styling */
.classic-card .contact-info {
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.classic-card .contact-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: none;
    text-decoration: none;
    transition: all 0.3s ease;
    color: #333;
    cursor: pointer;
}

.classic-card .contact-item:hover {
    color: #8B0000;
    transform: translateX(5px);
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
}

.classic-card .icon {
    width: 40px;
    height: 40px;
    background: #f8f9fa;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    font-size: 16px;
    color: inherit;
    animation: icon-idle 2s infinite ease-in-out;
    transition: all 0.3s ease;
}

.classic-card .contact-item:hover .icon {
    background: #8B0000;
    color: white;
    transform: scale(1.1);
}

.classic-card .contact-details {
    display: flex;
    flex-direction: column;
}

.classic-card .email,
.classic-card .phone,
.classic-card .text {
    flex: 1;
    font-size: 0.95rem;
    color: inherit;
    font-weight: 500;
    text-align: left;
}

.classic-card .label {
    font-size: 0.8rem;
    color: #666;
    background: transparent;
    padding: 0;
    margin-left: 0;
    text-align: left;
    display: block;
    margin-top: 2px;
}

/* Save contact button */
.classic-card .save-contact {
    background: #000;
    color: white;
    border: none;
    border-radius: 30px;
    width: 90%;
    margin: 15px auto;
    padding: 14px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.classic-card .save-contact::before {
    content: "";
    display: inline-block;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>');
    width: 18px;
    height: 18px;
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 8px;
    transition: all 0.3s ease;
}

.classic-card .save-contact:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.classic-card .save-contact:hover::before {
    transform: rotate(10deg) scale(1.2);
}

.classic-card .save-contact::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

.classic-card .save-contact:hover::after {
    animation: ripple 1s ease-out;
}

/* Powered by section */
.classic-card .powered-by {
    text-align: center;
    padding: 10px 0 20px;
    color: #888;
    font-size: 0.9rem;
    margin-top: auto;
}

.powered-by-brand {
    font-weight: 600;
    color: #8B0000;
}

.classic-card a.powered-by-brand {
    text-decoration: none;
    color: #8B0000;
    transition: all 0.3s ease;
}

.classic-card a.powered-by-brand:hover {
    color: #b10000;
    text-decoration: underline;
}`;
  }

  /**
   * Generate CSS for modern template
   * @returns {string} CSS content
   */
  function generateModernCSS() {
    return `
/* Modern Card Styles */
.business-card {
    width: 350px;
    height: 650px;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    animation: cardEntrance 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    transform-style: preserve-3d;
    perspective: 1000px;
}

.business-card:hover {
    transform: translateY(-8px) rotateX(2deg) rotateY(2deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modern-card {
    background: white;
    padding: 0;
    color: #333;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
}

.modern-card::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0) 100%);
    z-index: -1;
    transform: translateZ(-10px);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
}

.modern-card:hover::before {
    opacity: 1;
}

/* Header Section */
.modern-header {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.modern-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.05), transparent);
    transform: scaleX(0.7);
    opacity: 0;
    transition: all 0.5s ease;
}

.modern-card:hover .modern-header::after {
    transform: scaleX(1);
    opacity: 1;
}

.left-logo {
    width: 120px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    transition: transform 0.3s ease;
}

.modern-card:hover .left-logo {
    transform: translateZ(20px) scale(1.03);
}

.company-logo {
    max-width: 100%;
    height: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: all 0.4s ease;
}

.modern-card:hover .company-logo {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.right-logo {
    width: 150px;
    height: 100px;
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    transition: all 0.3s ease;
    border-radius: 5px;
}

.modern-card:hover .right-logo {
    transform: translateZ(30px) scale(1.05);
}

.legal-symbol {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    transition: all 0.5s ease;
    transform: scale(1);
    filter: contrast(1) brightness(1);
}

.modern-card:hover .legal-symbol {
    transform: scale(1.08);
    filter: contrast(1.1) brightness(1.05);
}

/* Company Branding */
.arabic-banner {
    background-color: rgba(249, 249, 249, 0.9);
    padding: 10px 15px;
    text-align: right;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.arabic-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.02), transparent);
    transform: translateX(-100%);
    transition: transform 2s ease;
}

.modern-card:hover .arabic-banner::before {
    transform: translateX(100%);
}

.company-tagline {
    font-size: 12px;
    color: #777;
    margin: 0;
    position: relative;
    transition: all 0.3s ease;
}

.modern-card:hover .company-tagline {
    color: #555;
    letter-spacing: 0.2px;
}

/* Profile Section */
.profile-section {
    padding: 20px 15px 10px;
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
}

.modern-card:hover .profile-section {
    transform: translateZ(15px);
}

.profile-circle {
    width: 85px;
    height: 85px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.profile-circle::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 0 rgba(255, 255, 255, 0.6);
    transition: box-shadow 0.4s ease;
}

.modern-card:hover .profile-circle {
    transform: scale(1.1) translateZ(30px);
    border-width: 4px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.modern-card:hover .profile-circle::after {
    box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6);
}

.profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
    transform: scale(1);
    filter: contrast(1) brightness(1);
}

.modern-card:hover .profile-img {
    transform: scale(1.1);
    filter: contrast(1.05) brightness(1.05);
}

/* Identity Section */
.identity-section {
    padding: 5px 15px 10px;
    text-align: left;
    transition: all 0.4s ease;
    position: relative;
    z-index: 2;
}

.modern-card:hover .identity-section {
    transform: translateZ(20px);
}

.identity-section .name {
    font-size: 24px;
    color: #222;
    margin: 0 0 5px 0;
    font-weight: 700;
    transition: all 0.3s ease;
    transform-origin: left;
    position: relative;
    display: inline-block;
}

.identity-section .name::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #8B0000, #DC143C);
    transition: width 0.4s ease;
}

.modern-card:hover .identity-section .name {
    color: #000;
    letter-spacing: 0.3px;
    transform: scale(1.03);
}

.modern-card:hover .identity-section .name::after {
    width: 100%;
}

.identity-section .position {
    font-size: 16px;
    color: #555;
    margin: 0 0 15px;
    font-weight: 500;
    text-transform: none;
    transition: all 0.3s ease;
}

.modern-card:hover .identity-section .position {
    color: #333;
    transform: translateX(5px);
}

/* Certification Text */
.certification-text {
    margin-bottom: 15px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.modern-card:hover .certification-text {
    transform: translateZ(10px);
}

.license-text {
    font-size: 13px;
    color: #555;
    font-style: italic;
    margin: 0 0 5px;
    transition: all 0.3s ease;
    position: relative;
}

.license-text::before {
    content: '"';
    font-size: 20px;
    color: rgba(139, 0, 0, 0.3);
    position: absolute;
    left: -5px;
    top: -5px;
    opacity: 0;
    transition: all 0.3s ease;
}

.license-text::after {
    content: '"';
    font-size: 20px;
    color: rgba(139, 0, 0, 0.3);
    position: absolute;
    right: -5px;
    bottom: -5px;
    opacity: 0;
    transition: all 0.3s ease;
}

.modern-card:hover .license-text {
    color: #444;
    padding: 0 5px;
}

.modern-card:hover .license-text::before,
.modern-card:hover .license-text::after {
    opacity: 1;
}

.arabic-text {
    font-size: 13px;
    color: #555;
    direction: rtl;
    text-align: right;
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
    transition: all 0.3s ease;
}

.modern-card:hover .arabic-text {
    color: #444;
    transform: translateX(-5px);
}

/* Description Section */
.description-container {
    padding: 5px 15px 15px;
    position: relative;
    transition: all 0.3s ease;
    z-index: 2;
}

.modern-card:hover .description-container {
    transform: translateZ(15px);
}

.description-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 15px;
    width: calc(100% - 30px);
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.05), transparent);
    transform: scaleX(0);
    opacity: 0;
    transition: all 0.5s ease;
}

.modern-card:hover .description-container::after {
    transform: scaleX(1);
    opacity: 1;
}

.description {
    font-size: 14px;
    line-height: 1.5;
    color: #555;
    text-align: left;
    margin: 0;
    transition: all 0.3s ease;
}

.modern-card:hover .description {
    color: #333;
}

/* Contact Information */
.contact-info {
    padding: 5px 15px 20px;
    position: relative;
    z-index: 2;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 5px 5px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.contact-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.03);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    border-radius: 8px;
    z-index: -1;
}

.contact-item:hover {
    transform: translateX(5px);
}

.contact-item:hover::before {
    transform: scaleX(1);
}

.contact-icon {
    width: 36px;
    height: 36px;
    background-color: #333;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
}

.contact-icon::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 80%);
    opacity: 0;
    transition: opacity 0.4s ease;
}

.contact-item:hover .contact-icon {
    transform: scale(1.1);
    background-color: #8B0000;
    box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}

.contact-item:hover .contact-icon::before {
    opacity: 0.4;
    animation: iconGlow 1.5s infinite ease-in-out;
}

@keyframes iconGlow {

    0%,
    100% {
        opacity: 0.4;
        transform: scale(0.8);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.2);
    }
}

.contact-icon i {
    color: white;
    font-size: 16px;
    transition: all 0.3s ease;
}

.contact-item:hover .contact-icon i {
    transform: scale(1.2);
}

.contact-details {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
}

.contact-item:hover .contact-details {
    transform: translateX(3px);
}

.contact-details span {
    font-size: 14px;
    color: #333;
    transition: all 0.3s ease;
}

.contact-item:hover .contact-details span {
    color: #000;
}

.contact-details .label {
    font-size: 12px;
    color: #777;
    background: none;
    padding: 0;
    transition: all 0.3s ease;
}

.contact-item:hover .contact-details .label {
    color: #8B0000;
}

.contact-details .text {
    font-size: 14px;
    color: #333;
    transition: all 0.3s ease;
}

.contact-item:hover .contact-details .text {
    color: #000;
}

/* Save Contact Button */
.save-contact-container {
    padding: 0 15px 25px;
    margin-top: auto;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
}

.modern-card:hover .save-contact-container {
    transform: translateZ(25px);
}

.modern-card .save-contact {
    background: #333;
    color: white;
    width: 100%;
    padding: 12px;
    border-radius: 25px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
}

.modern-card .save-contact::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent);
    transition: all 0.4s ease;
}

.modern-card .save-contact:hover {
    background: #8B0000;
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 16px rgba(139, 0, 0, 0.3);
    letter-spacing: 0.5px;
}

.modern-card .save-contact:hover::before {
    animation: shine 1.5s infinite;
}

@keyframes shine {
    0% {
        left: -100%;
    }

    20% {
        left: 100%;
    }

    100% {
        left: 100%;
    }
}

.modern-card .save-contact:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 8px rgba(139, 0, 0, 0.3);
}

/* Additional animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(139, 0, 0, 0.4);
    }

    70% {
        box-shadow: 0 0 0 10px rgba(139, 0, 0, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(139, 0, 0, 0);
    }
}`;
  }

  /**
   * Generate CSS for elegant template
   * @returns {string} CSS content
   */
  function generateElegantCSS() {
    return `
/* Elegant Card Styles */
.business-card {
    width: 350px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d;
    animation: cardEntrance 0.8s ease forwards;
}

.business-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.02);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
}

.business-card:hover {
    transform: translateY(-10px) rotateX(3deg);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 15px 25px rgba(0, 0, 0, 0.08);
}

.business-card:hover::after {
    opacity: 1;
}

.elegant-card {
    background: white;
    padding: 0;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.elegant-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: linear-gradient(45deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            rgba(255, 255, 255, 0.05) 70%,
            rgba(255, 255, 255, 0) 100%);
    transform: rotate(45deg) translateY(-100%);
    transition: transform 0.8s ease;
    z-index: -1;
    pointer-events: none;
}

.elegant-card:hover::before {
    transform: rotate(45deg) translateY(100%);
}

.elegant-header {
    background: linear-gradient(to right, #f8f9fa, #f1f3f5, #f8f9fa);
    padding: 22px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    position: relative;
    transition: all 0.4s ease;
    overflow: hidden;
}

.elegant-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, #007bff, transparent);
    transform: scaleX(0.8);
    opacity: 0;
    transition: all 0.5s ease;
}

.elegant-card:hover .elegant-header {
    background: linear-gradient(to right, #f1f3f5, #f8f9fa, #f1f3f5);
    transform: translateZ(20px);
}

.elegant-card:hover .elegant-header::after {
    transform: scaleX(1);
    opacity: 1;
}

.company-logo {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: white;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    z-index: 1;
}

.company-logo::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(0, 123, 255, 0), rgba(0, 123, 255, 0.1));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
}

.elegant-card:hover .company-logo {
    transform: scale(1.1) translateZ(30px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.elegant-card:hover .company-logo::before {
    opacity: 1;
}

.company-logo .logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    transition: all 0.4s ease;
    transform: scale(0.95);
}

.elegant-card:hover .company-logo .logo {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.company-name {
    font-size: 18px;
    font-weight: 700;
    color: #343a40;
    position: relative;
    transition: all 0.4s ease;
}

.company-name::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, transparent, #007bff, transparent);
    transition: width 0.4s ease;
}

.elegant-card:hover .company-name {
    color: #212529;
    letter-spacing: 0.2px;
    transform: translateZ(25px);
}

.elegant-card:hover .company-name::after {
    width: 100%;
}

.elegant-profile {
    padding: 35px 20px;
    position: relative;
    z-index: 1;
    transition: all 0.4s ease;
}

.elegant-card:hover .elegant-profile {
    transform: translateZ(30px);
}

.profile-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 25px;
    overflow: hidden;
    border: 3px solid #f8f9fa;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.profile-container::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 0 solid rgba(0, 123, 255, 0.2);
    transition: all 0.4s ease;
    z-index: 2;
}

.elegant-card:hover .profile-container {
    transform: scale(1.05) translateZ(35px);
    border-color: #e9ecef;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05);
}

.elegant-card:hover .profile-container::before {
    border-width: 4px;
    animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
    0% {
        border-color: rgba(0, 123, 255, 0.6);
        transform: scale(1);
    }

    50% {
        border-color: rgba(0, 123, 255, 0.3);
        transform: scale(1.1);
    }

    100% {
        border-color: rgba(0, 123, 255, 0.6);
        transform: scale(1);
    }
}

.profile-container .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
    filter: saturate(1.05);
}

.elegant-card:hover .profile-container .profile-img {
    transform: scale(1.08);
    filter: contrast(1.05) saturate(1.1);
}

.elegant-profile .name {
    font-size: 28px;
    color: #212529;
    margin-bottom: 8px;
    position: relative;
    display: inline-block;
    transition: all 0.4s ease;
}

.elegant-profile .name::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #007bff, #00c6ff);
    transform: translateX(-50%);
    transition: width 0.4s ease;
}

.elegant-card:hover .elegant-profile .name {
    color: #000;
    transform: translateY(-3px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.elegant-card:hover .elegant-profile .name::after {
    width: 80%;
}

.elegant-profile .position {
    font-size: 16px;
    color: #6c757d;
    text-transform: none;
    font-weight: 400;
    transition: all 0.3s ease;
    opacity: 0.9;
    position: relative;
}

.elegant-card:hover .elegant-profile .position {
    color: #495057;
    letter-spacing: 0.3px;
    opacity: 1;
}

.elegant-divider {
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #007bff, #00c6ff);
    margin: 0 auto 20px;
    border-radius: 3px;
    transition: all 0.4s ease;
}

.elegant-card:hover .elegant-divider {
    width: 80px;
    transform: translateZ(20px);
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
    animation: gradient-shift 3s infinite linear;
}

@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.elegant-card .description {
    padding: 0 35px;
    margin-bottom: 30px;
    font-style: italic;
    color: #6c757d;
    transition: all 0.4s ease;
    position: relative;
    line-height: 1.6;
    font-size: 15px;
}

.elegant-card:hover .description {
    color: #495057;
    transform: translateZ(15px);
}

.elegant-card .description::before,
.elegant-card .description::after {
    content: '';
    position: absolute;
    height: 10px;
    width: 15px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="rgba(108, 117, 125, 0.3)" d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>');
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0;
    transition: all 0.4s ease;
}

.elegant-card .description::before {
    top: -10px;
    left: 15px;
}

.elegant-card .description::after {
    bottom: -10px;
    right: 15px;
    transform: rotate(180deg);
}

.elegant-card:hover .description::before,
.elegant-card:hover .description::after {
    opacity: 1;
}

.elegant-contact {
    padding: 0 20px;
    margin-bottom: 30px;
    transition: all 0.3s ease;
}

.elegant-card:hover .elegant-contact {
    transform: translateZ(20px);
}

.elegant-contact-item {
    padding: 12px 0;
    border-bottom: 1px solid #f1f3f5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.elegant-contact-item:last-child {
    border-bottom: none;
}

.elegant-contact-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 123, 255, 0.03);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: -1;
}

.elegant-contact-item:hover {
    background: transparent;
    transform: translateX(8px);
    gap: 20px;
}

.elegant-contact-item:hover::before {
    transform: scaleX(1);
}

.elegant-contact-item i {
    color: #007bff;
    font-size: 16px;
    width: 24px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
}

.elegant-contact-item:hover i {
    color: #0056b3;
    transform: scale(1.2) rotate(5deg);
}

.elegant-contact-item i::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    background: radial-gradient(circle, rgba(0, 123, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: -1;
}

.elegant-contact-item:hover i::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
}

.elegant-contact-item span {
    transition: all 0.3s ease;
    color: #495057;
}

.elegant-contact-item:hover span {
    color: #212529;
    font-weight: 500;
}

.elegant-save {
    background: linear-gradient(to right, #343a40, #495057);
    width: 70%;
    margin: 0 auto 30px;
    border-radius: 6px;
    color: white;
    padding: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    font-weight: 500;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.elegant-save::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent);
    transition: all 0.6s ease;
}

.elegant-save:hover {
    background: linear-gradient(to right, #007bff, #0056b3);
    transform: translateY(-3px) translateZ(25px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
    letter-spacing: 0.5px;
}

.elegant-save:hover::before {
    animation: shine 1.5s infinite;
}

@keyframes shine {
    0% {
        left: -100%;
    }

    20% {
        left: 100%;
    }

    100% {
        left: 100%;
    }
}

.elegant-save:active {
    transform: translateY(1px) scale(0.98);
}

.elegant-footer {
    margin-top: auto;
    background: linear-gradient(to right, #f8f9fa, #f1f3f5, #f8f9fa);
    padding: 15px;
    color: #6c757d;
    font-size: 13px;
    border-top: 1px solid #e9ecef;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.elegant-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(0, 123, 255, 0.2), transparent);
    transform: scaleX(0.5);
    opacity: 0;
    transition: all 0.4s ease;
}

.elegant-card:hover .elegant-footer {
    background: linear-gradient(to right, #f5f7f9, #f8f9fa, #f5f7f9);
    transform: translateZ(10px);
}

.elegant-card:hover .elegant-footer::before {
    transform: scaleX(1);
    opacity: 1;
}

.powered-by-brand {
    font-weight: 600;
    color: #007bff;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;
}

.powered-by-brand::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #007bff;
    transition: width 0.3s ease;
}

.powered-by-brand:hover {
    color: #0056b3;
}

.powered-by-brand:hover::after {
    width: 100%;
}`;
  }

  /**
   * Generate JavaScript for the card package
   * @param {Object} data - Card data from form
   * @returns {string} JavaScript content
   */
  function generateCardJS(data) {
    // Get the primary color for use in JS
    const customColor = data.primaryColor || primaryColor;
    // Include code to apply the custom color to dynamic elements
    return `/**
 * Bcaitech Digital Business Card
 * Interactive functions and animations
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set custom primary color from the generated card
    const primaryColor = '${customColor}';
    // Initialize interactive elements and animations
    setupCardInteractions();
    
    /**
     * Set up interactive elements on the card
     */
    function setupCardInteractions() {
        // Save contact button
        const saveContactBtn = document.querySelector('.save-contact');
        if (saveContactBtn) {
            saveContactBtn.addEventListener('click', saveContact);
            
            // Add ripple effect to save button
            saveContactBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                
                // Apply primary color to save button on hover if it's not already set
                const cardType = this.closest('.business-card');
                if (cardType && cardType.classList.contains('classic-card')) {
                    this.style.backgroundColor = primaryColor;
                }
            });
            
            saveContactBtn.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        }
        
        // Contact items hover effects
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.backgroundColor = 'rgba(0,0,0,0.02)';
                this.style.borderRadius = '8px';
                
                // Change icon color and background
                const icon = this.querySelector('.icon');
                if (icon) {
                    icon.style.backgroundColor = primaryColor;
                    icon.style.color = 'white';
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.backgroundColor = '';
                this.style.borderRadius = '';
                
                // Reset icon styles
                const icon = this.querySelector('.icon');
                if (icon) {
                    icon.style.backgroundColor = '';
                    icon.style.color = '';
                    icon.style.transform = '';
                }
            });
        });
        
        // WhatsApp link
        const whatsappElements = document.querySelectorAll('.whatsapp-item, .whatsapp-block');
        whatsappElements.forEach(el => {
            el.addEventListener('click', openWhatsApp);
        });
        
        // Website link
        const websiteElements = document.querySelectorAll('.website-item, .website-block');
        websiteElements.forEach(el => {
            el.addEventListener('click', openWebsite);
        });
        
        // Email elements
        const emailElements = document.querySelectorAll('.email-item, .email-block, .elegant-contact-item:nth-child(1)');
        emailElements.forEach(el => {
            el.addEventListener('click', sendEmail);
        });
        
        // Phone elements
        const phoneElements = document.querySelectorAll('.phone-item, .phone-block, .elegant-contact-item:nth-child(2)');
        phoneElements.forEach(el => {
            el.addEventListener('click', callPhone);
        });
        
        // Profile picture and logo hover effects for classic template
        const classicCard = document.querySelector('.classic-card');
        if (classicCard) {
            const profileCircle = classicCard.querySelector('.profile-circle');
            if (profileCircle) {
                profileCircle.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.borderColor = primaryColor;
                });
                
                profileCircle.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.borderColor = '';
                });
            }
            
            const logoContainer = classicCard.querySelector('.company-logo-container');
            if (logoContainer) {
                logoContainer.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                });
                
                logoContainer.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                });
            }
            
            const name = classicCard.querySelector('.name');
            if (name) {
                name.addEventListener('mouseenter', function() {
                    this.style.color = primaryColor;
                });
                
                name.addEventListener('mouseleave', function() {
                    this.style.color = '';
                });
            }
        }
    }
    
    /**
     * Show modal message with animation
     * @param {string} message - Message to display
     * @param {boolean} isError - Whether this is an error message
     */
    function showModal(message, isError = false) {
      // Check if modal exists in the HTML file (downloaded version)
      let customModal = document.getElementById("customModal");

      // If modal doesn't exist, create it dynamically
      if (!customModal) {
        customModal = document.createElement("div");
        customModal.id = "customModal";
        customModal.className = "modal-container";

        // Create modal content
        customModal.innerHTML = \`
            <div class="modal-content">
              <div class="modal-icon">
                <i class="fas \${
                  isError ? "fa-exclamation-circle" : "fa-check-circle"
                }"></i>
              </div>
              <h3 class="modal-title">\${isError ? "حدث خطأ!" : "تم بنجاح!"}</h3>
              <p class="modal-message">\${
                message ||
                "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك."
              }</p>
              <button class="modal-button" style="background-color: \${
                isError ? "#dc3545" : primaryColor
              };">حسناً</button>
            </div>
          \`;

        // Add modal styles if they don't exist
        if (!document.getElementById("modalStyles")) {
          const styleEl = document.createElement("style");
          styleEl.id = "modalStyles";
          styleEl.textContent = \`
              .modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
              }
              
              .modal-container.show {
                opacity: 1;
                visibility: visible;
              }
              
              .modal-content {
                background-color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
                transform: translateY(30px) scale(0.9);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
                overflow: hidden;
              }
              
              .modal-container.show .modal-content {
                transform: translateY(0) scale(1);
              }
              
              .modal-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
                background: linear-gradient(to right, var(--primary-color, \${primaryColor}), #ff6b6b);
              }
              
              .modal-icon {
                margin-bottom: 20px;
              }
              
              .modal-icon i {
                font-size: 70px;
                color: #28a745;
                animation: modalIconAnimation 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              
              @keyframes modalIconAnimation {
                0% {
                  transform: scale(0.3);
                  opacity: 0;
                }
                70% {
                  transform: scale(1.2);
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              
              .modal-title {
                font-size: 24px;
                color: #333;
                margin-bottom: 15px;
                font-weight: 600;
                animation: fadeInUp 0.4s ease forwards;
                animation-delay: 0.2s;
                opacity: 0;
              }
              
              .modal-message {
                font-size: 16px;
                color: #666;
                margin-bottom: 25px;
                line-height: 1.6;
                animation: fadeInUp 0.4s ease forwards;
                animation-delay: 0.3s;
                opacity: 0;
              }
              
              .modal-button {
                background-color: var(--primary-color, \${primaryColor});
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 16px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
                animation: fadeInUp 0.4s ease forwards;
                animation-delay: 0.4s;
                opacity: 0;
                margin-top: 10px;
              }
              
              .modal-button:hover {
                background-color: var(--hover-color, \${primaryColor});
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
              }
              
              @keyframes fadeInUp {
                from {
                  transform: translateY(20px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            \`;
          document.head.appendChild(styleEl);
        }

        // Append modal to body
        document.body.appendChild(customModal);

        // Add event listener to close button
        const closeButton = customModal.querySelector(".modal-button");
        if (closeButton) {
          closeButton.addEventListener("click", function () {
            hideModal();
          });
        }

        // Add click event to close on background click
        customModal.addEventListener("click", function (e) {
          if (e.target === customModal) {
            hideModal();
          }
        });
      } else {
        // Update existing modal content
        const modalContent = customModal.querySelector(".modal-content");
        if (modalContent) {
          const modalIcon = modalContent.querySelector(".modal-icon i");
          if (modalIcon) {
            modalIcon.className = \`fas \${
              isError ? "fa-exclamation-circle" : "fa-check-circle"
            }\`;
            modalIcon.style.color = isError ? "#dc3545" : "#28a745";
          }

          const modalTitle = modalContent.querySelector(".modal-title");
          if (modalTitle) {
            modalTitle.textContent = isError ? "حدث خطأ!" : "تم بنجاح!";
          }

          const modalMessage = modalContent.querySelector(".modal-message");
          if (modalMessage) {
            modalMessage.textContent =
              message ||
              "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك.";
          }

          const modalButton = modalContent.querySelector(".modal-button");
          if (modalButton) {
            modalButton.style.backgroundColor = isError
              ? "#dc3545"
              : primaryColor;
          }
        }
      }

      // Show modal
      customModal.classList.add("show");

      // Prevent scrolling
      document.body.style.overflow = "hidden";

      // Add ESC key support to close modal
      document.addEventListener("keydown", handleEscKeyPress);
    }

    /**
     * Handle ESC key press to close modal
     */
    function handleEscKeyPress(e) {
      if (e.key === "Escape") {
        hideModal();
      }
    }

    /**
     * Hide modal
     */
    function hideModal() {
      const customModal = document.getElementById("customModal");
      if (customModal) {
        customModal.classList.remove("show");
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscKeyPress);
      }
    }
    
    function saveContact() {
    // Get the closest business card parent element
    var card = this.closest('.business-card');
    
    // Extract data from card
    var name = '';
    var positionFull = '';
    var position = '';
    var company = '';
    var email = '';
    var phone = '';
    var description = '';
    
    // Get name
    if (card.querySelector('.name')) {
      name = card.querySelector('.name').textContent;
    }
    
    // Get position and company
    if (card.querySelector('.position')) {
      positionFull = card.querySelector('.position').textContent;
      if (positionFull.includes(' - ')) {
        position = positionFull.split(' - ')[0];
        company = positionFull.split(' - ')[1];
      } else {
        position = positionFull;
        company = '';
      }
    }
    
    // Get email
    if (card.querySelector('.email')) {
      email = card.querySelector('.email').textContent;
    }
    
    // Get phone
    if (card.querySelector('.phone')) {
      phone = card.querySelector('.phone').textContent;
    }
    
    // Get description
    if (card.querySelector('.description')) {
      description = card.querySelector('.description').textContent;
    }
    
    // Check for WhatsApp and Website
    var hasWhatsapp = false;
    var hasWebsite = false;
    
    // Check WhatsApp
    var whatsappItem = card.querySelector('.whatsapp-item');
    if (whatsappItem && whatsappItem.style.display !== 'none') {
      hasWhatsapp = true;
    }
    
    // Check Website
    var websiteItem = card.querySelector('.website-item');
    if (websiteItem && websiteItem.style.display !== 'none') {
      hasWebsite = true;
    }
    
    // Create vCard content array
    var vCardContent = [];
    
    // Add mandatory fields
    vCardContent.push("BEGIN:VCARD");
    vCardContent.push("VERSION:3.0");
    vCardContent.push("FN:" + name);
    
    // Add company if available
    if (company) {
      vCardContent.push("ORG:" + company);
    }
    
    // Add position if available
    if (position) {
      vCardContent.push("TITLE:" + position);
    }
    
    // Add email if available
    if (email) {
      vCardContent.push("EMAIL:" + email);
    }
    
    // Add phone if available
    if (phone) {
      vCardContent.push("TEL;TYPE=WORK,VOICE:" + phone);
    }
    
    // Add WhatsApp if available
    if (hasWhatsapp && phone) {
      vCardContent.push("TEL;TYPE=CELL,VOICE:" + phone);
    }
    
    // Add website if available
    if (hasWebsite) {
      vCardContent.push("URL:https://www.example.com");
    }
    
    // Add description if available
    if (description) {
      vCardContent.push("NOTE:" + description);
    }
    
    // Add end of vCard
    vCardContent.push("END:VCARD");
    
    // Using String.fromCharCode for newline character
    var newline = String.fromCharCode(10);
    var finalVCard = vCardContent.join(newline);
    
    // Create a downloadable file
    var blob = new Blob([finalVCard], { type: "text/vcard" });
    var url = window.URL.createObjectURL(blob);
    
    // Create download link
    var a = document.createElement("a");
    a.href = url;
    a.download = name.replace(/\\s+/g, "_") + "_contact.vcf";
    
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Release URL object
    window.URL.revokeObjectURL(url);
    
    // Show success modal instead of alert
    showModal("تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك.");
  }
    
    /**
     * Open WhatsApp with the contact number
     */
    function openWhatsApp() {
        ${
          data.whatsapp
            ? `window.open('https://wa.me/${data.whatsapp.replace(
                /[^0-9]/g,
                ""
              )}');`
            : ""
        }
    }
    
    /**
     * Open website URL
     */
    function openWebsite() {
        ${data.website ? `window.open('${data.website}');` : ""}
    }
    
    /**
     * Send email to contact
     */
    function sendEmail() {
        window.location.href = 'mailto:${data.email}';
    }
    
    /**
     * Call phone number
     */
    function callPhone() {
        window.location.href = 'tel:${data.phone}';
    }
    
    // Add animation when page loads
    const card = document.querySelector('.business-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    }
});`;
  }

  /**
   * Send card information via email
   * @param {Object} data - Card data from form
   */
  function sendCardByEmail(data) {
    // Create HTML content for email
    const template = data.template || "classic";
    let cardHTML = "";

    switch (template) {
      case "classic":
        cardHTML = generateClassicCardHTML(data);
        break;
      case "modern":
        cardHTML = generateModernCardHTML(data);
        break;
      case "elegant":
        cardHTML = generateElegantCardHTML(data);
        break;
    }

    // Prepare email parameters
    const templateParams = {
      message: "تم إنشاء بطاقة العمل الخاصة بك بنجاح",
      from_name: "Bcaitech Card Generator",
      to_name: data.name,
      to_email: data.email,
      card_html: cardHTML,
    };
    // Send email using EmailJS
    emailjs.send("service_h4iregr", "template_rgrw5mk", templateParams).then(
      function (response) {
        console.log("نجاح!", response.status, response.text);
        // Show success message
        showModal("تم إرسال البطاقة بنجاح إلى بريدك الإلكتروني!");
      },
      function (error) {
        console.log("فشل...", error);
        showModal("حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.", true);
      }
    );
  }
});
