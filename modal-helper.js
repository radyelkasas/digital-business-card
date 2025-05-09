/**
 * Helper functions for modal functionality in the downloaded business card package
 */

// Function to generate the showModal function code for the downloadable card
function generateModalCode(primaryColor) {
  return `
/**
 * Show modal message with animation
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showModal(message, isError = false) {
  // Check if modal exists in the HTML file
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
          <i class="fas \${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        </div>
        <h3 class="modal-title">\${isError ? 'حدث خطأ!' : 'تم بنجاح!'}</h3>
        <p class="modal-message">\${message || "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك."}</p>
        <button class="modal-button" style="background-color: \${isError ? '#dc3545' : primaryColor};">حسناً</button>
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
      closeButton.addEventListener("click", function() {
        hideModal();
      });
    }
    
    // Add click event to close on background click
    customModal.addEventListener("click", function(e) {
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
        modalIcon.className = \`fas \${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}\`;
        modalIcon.style.color = isError ? "#dc3545" : "#28a745";
      }
      
      const modalTitle = modalContent.querySelector(".modal-title");
      if (modalTitle) {
        modalTitle.textContent = isError ? "حدث خطأ!" : "تم بنجاح!";
      }
      
      const modalMessage = modalContent.querySelector(".modal-message");
      if (modalMessage) {
        modalMessage.textContent = message || "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك.";
      }
      
      const modalButton = modalContent.querySelector(".modal-button");
      if (modalButton) {
        modalButton.style.backgroundColor = isError ? "#dc3545" : primaryColor;
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
`;
}

// Export the function
module.exports = {
  generateModalCode,
};
