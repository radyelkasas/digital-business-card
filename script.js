/**
 * Bcaitech Digital Business Card Creator
 * Main JavaScript file
 * Author: Claude
 * Version: 1.0
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations
  AOS.init();

  // DOM Elements
  const form = document.getElementById("cardForm");
  const previewSection = document.getElementById("previewSection");
  const previewContainer = document.getElementById("cardPreview");
  const downloadBtn = document.getElementById("downloadBtn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");

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

  // Handle image upload and preview
  setupImageUpload(profilePicInput, profilePreview, "profile");
  setupImageUpload(backgroundImageInput, backgroundPreview, "background");
  setupImageUpload(logoImageInput, logoPreview, "logo");

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
    };

    // Save current data
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
   * Set up the classic template with specific data
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {Object} data - Card data from form
   */
  function setupClassicTemplate(cardElement, data) {
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
   * Set up the modern template with specific data
   * @param {DocumentFragment} cardElement - The card template clone
   * @param {Object} data - Card data from form
   */
  function setupModernTemplate(cardElement, data) {
    // Set certification text (can be customized based on data)
    const licenseText = cardElement.querySelector(".license-text");
    if (licenseText) {
      licenseText.textContent = `"Licensed by the Ministry of Commerce - ${data.company} Professional"`;
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

    // Set company logo if available
    if (imageData.logo) {
      const companyLogo = cardElement.querySelector(".company-logo");
      if (companyLogo) {
        companyLogo.src = imageData.logo;
      }
    }

    // Set optional background elements (could be customized based on data)
    const companyTagline = cardElement.querySelector(".company-tagline");
    if (companyTagline) {
      companyTagline.textContent = `${data.company} - Professional Services`;
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

      // Add background image for elegant template
      if (templateType === "elegant" && imageData.background) {
        // Could add background to elegant template if needed
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
      const whatsappElements = cardElement.querySelectorAll(
        ".whatsapp-item, .whatsapp-block, .whatsapp-item"
      );
      whatsappElements.forEach((el) => {
        el.addEventListener("click", () => {
          window.open(`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`);
        });
      });
    }

    // Website links
    if (data.website) {
      const websiteElements = cardElement.querySelectorAll(
        ".website-item, .website-block, .website-item"
      );
      websiteElements.forEach((el) => {
        el.addEventListener("click", () => {
          window.open(data.website);
        });
      });
    }

    // Email elements
    const emailElements = cardElement.querySelectorAll(
      ".email-item, .email-block, .elegant-contact-item:nth-child(1)"
    );
    emailElements.forEach((el) => {
      el.addEventListener("click", () => {
        window.location.href = `mailto:${data.email}`;
      });
    });

    // Phone elements
    const phoneElements = cardElement.querySelectorAll(
      ".phone-item, .phone-block, .elegant-contact-item:nth-child(2)"
    );
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

    // Show success alert
    alert("Contact saved successfully!");
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
    <title>${data.name} - Business Card</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
            <div class="card-header">
                <div class="logo-container">
                    <img src="assets/media/logo.jpg" alt="Logo" class="logo"
                        onerror="this.src='https://via.placeholder.com/50?text=Logo'">
                </div>
                <div class="company-card-container">
                    <img src="" alt="Company Card" class="company-card"
                        onerror="this.src='https://via.placeholder.com/80x50?text=Company'">
                </div>
            </div>

            <div class="profile-section">
                <div class="profile-circle">
                    <img src="assets/media/profile.jpg" alt="Profile" class="profile-img"
                        onerror="this.src='https://via.placeholder.com/150?text=Profile'">
                </div>
            </div>

            <h1 class="name">${data.name}</h1>
            <h2 class="position">${data.position} - ${data.company}</h2>

            <p class="description">${
              data.description ||
              "A professional focused on delivering innovative, high-quality technical services that exceed client expectations."
            }</p>

            <div class="contact-info">
                <div class="contact-item email-item">
                    <span class="icon"><i class="fas fa-envelope"></i></span>
                    <span class="email">${data.email}</span>
                    <span class="label">Work</span>
                </div>

                <div class="contact-item phone-item">
                    <span class="icon"><i class="fas fa-phone"></i></span>
                    <span class="phone">${data.phone}</span>
                    <span class="label">Work</span>
                </div>

                ${
                  data.whatsapp
                    ? `<div class="contact-item whatsapp-item">
                    <span class="icon"><i class="fab fa-whatsapp"></i></span>
                    <span class="text">Connect on WhatsApp</span>
                </div>`
                    : ""
                }

                ${
                  data.website
                    ? `<div class="contact-item website-item">
                    <span class="icon"><i class="fas fa-globe"></i></span>
                    <span class="text">Visit our website</span>
                </div>`
                    : ""
                }
            </div>

            <button class="save-contact">Save Contact</button>

            <div class="powered-by">
                Powered by <strong>Bcaitech</strong>
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
                <div class="header-left">
                    <img src="assets/media/logo.jpg" alt="Company Logo" class="company-logo"
                        onerror="this.src='https://via.placeholder.com/150x60?text=${
                          data.company
                        }'">
                </div>
                <div class="header-right">
                    <img src="assets/media/legal-symbol.jpg" alt="Legal Symbol" class="legal-symbol" 
                         onerror="this.src='https://via.placeholder.com/150x100?text=Professional'">
                </div>
            </div>
            
            <!-- Company branding section -->
            <div class="brand-ribbon">
                <div class="ribbon-content">
                    <p class="company-tagline">${
                      data.company
                    } - Professional Services</p>
                </div>
            </div>
            
            <!-- Profile section -->
            <div class="profile-section">
                <div class="profile-circle">
                    <img src="assets/media/profile.jpg" alt="Profile Photo" class="profile-img"
                        onerror="this.src='https://via.placeholder.com/80?text=Profile'">
                </div>
            </div>
            
            <!-- Name and title section -->
            <div class="identity-section">
                <h1 class="name">${data.name}</h1>
                <h2 class="position">${data.position}</h2>
                
                <!-- Certification text -->
                <div class="certification-text">
                    <p class="license-text">"Licensed by the Ministry of Commerce - ${
                      data.company
                    } Professional"</p>
                    <p class="arabic-text">جهة مرخصة من وزارة التجارة لممارسة أنشطة التقنية المالية</p>
                </div>
            </div>
            
            <!-- Description section -->
            <div class="description-container">
                <p class="description">${
                  data.description ||
                  "At " +
                    data.company +
                    ", we specialize in precise professional services, ensuring excellence and safeguarding client interests, delivering exceptional solutions with integrity and efficiency."
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
                        onerror="this.src='https://via.placeholder.com/40?text=Logo'">
                </div>
                <div class="company-name">${data.company}</div>
            </div>
            
            <div class="elegant-profile">
                <div class="profile-container">
                    <img src="assets/media/profile.jpg" alt="Profile" class="profile-img"
                        onerror="this.src='https://via.placeholder.com/120?text=Profile'">
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
                Powered by <strong>Bcaitech</strong>
            </div>
        </div>`;
  }

  /**
   * Generate CSS for the card package
   * @param {string} templateType - Type of template (classic, modern, elegant)
   * @returns {string} CSS content
   */
  function generateCardCSS(templateType) {
    // Common CSS styles
    const commonCSS = `/* Bcaitech Business Card Styles */
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
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.business-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.classic-card {
    background: white;
    padding: 25px;
    text-align: center;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.company-card {
    width: 80px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
}

.profile-section {
    margin-bottom: 25px;
}

.profile-circle {
    width: 100px;
    height: 100px;
    border: 3px solid #007bff;
    border-radius: 50%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.name {
    font-size: 24px;
    margin: 15px 0 5px;
    color: #212529;
    font-weight: 700;
}

.position {
    font-size: 16px;
    color: #6c757d;
    text-transform: uppercase;
    margin-bottom: 20px;
    font-weight: 600;
    letter-spacing: 1px;
}

.description {
    color: #495057;
    margin-bottom: 30px;
    font-size: 14px;
    line-height: 1.6;
}

.contact-info {
    margin-bottom: 25px;
    text-align: left;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 5px;
    background: #f8f9fa;
    transition: all 0.3s ease;
    cursor: pointer;
}

.contact-item:hover {
    background: #e9ecef;
    transform: translateX(5px);
}

.contact-item .icon {
    margin-right: 15px;
    font-size: 18px;
    color: #007bff;
    width: 20px;
    text-align: center;
}

.contact-item .text {
    flex-grow: 1;
    font-size: 14px;
    color: #495057;
}

.email, .phone {
    flex-grow: 1;
    font-size: 14px;
    color: #495057;
}

.label {
    background: #e9ecef;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
    color: #6c757d;
}

.save-contact {
    background: #343a40;
    color: white;
    width: 100%;
    padding: 12px;
    border-radius: 30px;
    margin-bottom: 20px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.save-contact:hover {
    background: #212529;
    transform: translateY(-2px);
}

.powered-by {
    color: #adb5bd;
    font-size: 14px;
    margin-top: 15px;
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
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
}

.business-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.modern-card {
    position: relative;
    padding: 0;
    background: #fff;
    color: #333;
    overflow: hidden;
    height: 650px;
    display: flex;
    flex-direction: column;
}

/* Header Section */
.modern-header {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #f1f1f1;
}

.header-left {
    display: flex;
    align-items: center;
}

.company-logo {
    height: 60px;
    object-fit: contain;
}

.header-right {
    height: 100px;
}

.legal-symbol {
    height: 100px;
    border-radius: 5px;
    object-fit: cover;
}

/* Company Branding */
.brand-ribbon {
    background-color: #f8f8f8;
    padding: 8px 15px;
    text-align: right;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.company-tagline {
    font-size: 12px;
    color: #777;
    margin: 0;
}

/* Profile Section */
.profile-section {
    display: flex;
    justify-content: flex-start;
    padding: 15px;
    margin-top: 10px;
}

.profile-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #fff;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Identity Section */
.identity-section {
    padding: 0 20px;
    text-align: left;
}

.identity-section .name {
    font-size: 24px;
    color: #222;
    margin: 0;
    font-weight: 700;
}

.identity-section .position {
    font-size: 16px;
    color: #555;
    margin: 5px 0 15px;
    font-weight: 500;
    text-transform: none;
}

/* Certification Text */
.certification-text {
    margin: 10px 0 15px;
}

.license-text {
    font-size: 13px;
    color: #555;
    font-style: italic;
    margin: 0 0 5px;
    position: relative;
}

.arabic-text {
    font-size: 13px;
    color: #555;
    margin: 0;
    direction: rtl;
    text-align: right;
    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
}

/* Description Section */
.description-container {
    padding: 10px 20px;
    margin-bottom: 15px;
}

.description {
    font-size: 14px;
    line-height: 1.6;
    color: #555;
    text-align: left;
    margin: 0;
}

/* Contact Information */
.contact-info {
    padding: 0 20px;
    margin-bottom: 20px;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    cursor: pointer;
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
    flex-shrink: 0;
}

.contact-icon i {
    color: #fff;
    font-size: 16px;
}

.contact-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.contact-details span {
    font-size: 14px;
    color: #333;
}

.contact-details .label {
    font-size: 12px;
    color: #777;
    background: none;
    padding: 0;
}

.contact-details .text {
    font-size: 14px;
    color: #333;
}

/* Save Contact Button */
.save-contact-container {
    padding: 0 20px;
    margin-top: auto;
    margin-bottom: 20px;
}

.save-contact {
    background: #333;
    color: white;
    width: 100%;
    padding: 12px;
    border-radius: 30px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.save-contact:hover {
    background: #222;
    transform: translateY(-2px);
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
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
}

.business-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.elegant-card {
    background: white;
    padding: 0;
    text-align: center;
    height: 600px;
    display: flex;
    flex-direction: column;
}

.elegant-header {
    background: #f8f9fa;
    padding: 20px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
}

.company-logo {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.company-logo .logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.company-name {
    font-size: 18px;
    font-weight: 700;
    color: #343a40;
}

.elegant-profile {
    padding: 30px 20px;
}

.profile-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 20px;
    overflow: hidden;
    border: 3px solid #f8f9fa;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.profile-container .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.elegant-profile .name {
    font-size: 26px;
    color: #212529;
    margin-bottom: 5px;
}

.elegant-profile .position {
    font-size: 16px;
    color: #6c757d;
    text-transform: none;
    font-weight: 400;
}

.elegant-divider {
    width: 50px;
    height: 3px;
    background: #007bff;
    margin: 0 auto 20px;
}

.elegant-card .description {
    padding: 0 30px;
    margin-bottom: 30px;
    font-style: italic;
    color: #6c757d;
}

.elegant-contact {
    padding: 0 20px;
    margin-bottom: 30px;
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
}

.elegant-contact-item:last-child {
    border-bottom: none;
}

.elegant-contact-item:hover {
    background: #f8f9fa;
}

.elegant-contact-item i {
    color: #007bff;
    font-size: 16px;
    width: 20px;
    text-align: center;
}

.elegant-save {
    background: #343a40;
    width: 70%;
    margin: 0 auto 30px;
    border-radius: 5px;
    color: white;
    padding: 12px;
    border: none;
    cursor: pointer;
}

.elegant-save:hover {
    background: #212529;
}

.elegant-footer {
    margin-top: auto;
    background: #f8f9fa;
    padding: 15px;
    color: #6c757d;
    font-size: 13px;
    border-top: 1px solid #e9ecef;
}`;
  }

  /**
   * Generate JavaScript for the card package
   * @param {Object} data - Card data from form
   * @returns {string} JavaScript content
   */
  function generateCardJS(data) {
    return `/**
 * Bcaitech Digital Business Card
 * Interactive functions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive elements
    setupCardInteractions();
    
    /**
     * Set up interactive elements on the card
     */
    function setupCardInteractions() {
        // Save contact button
        const saveContactBtn = document.querySelector('.save-contact');
        if (saveContactBtn) {
            saveContactBtn.addEventListener('click', saveContact);
        }
        
        // WhatsApp link
        const whatsappElements = document.querySelectorAll('.whatsapp-item, .whatsapp-block, .whatsapp-item');
        whatsappElements.forEach(el => {
            el.addEventListener('click', openWhatsApp);
        });
        
        // Website link
        const websiteElements = document.querySelectorAll('.website-item, .website-block, .website-item');
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
    }
    
    /**
     * Save contact information
     */
    function saveContact() {
        // Here would be vCard creation
        alert('Contact saved!');
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
        alert("تم إرسال البطاقة بنجاح إلى بريدك الإلكتروني!");
      },
      function (error) {
        console.log("فشل...", error);
        alert("حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.");
      }
    );
  }
});
