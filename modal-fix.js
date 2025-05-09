/**
 * تصحيح لمشكلة نافذة الإشعار (modal) في البطاقات المنزلة
 * 
 * كيفية الاستخدام:
 * 1. قم بنسخ هذا الملف إلى المجلد الذي يحتوي على البطاقة المنزلة
 * 2. أضف سطر تضمين لهذا الملف في ملف index.html الخاص بالبطاقة المنزلة:
 *    <script src="modal-fix.js"></script>
 */

document.addEventListener('DOMContentLoaded', function() {
  // تحديد اللون الرئيسي
  const primaryColor = typeof window.primaryColor !== 'undefined' ? window.primaryColor : "#8B0000";
  
  // إنشاء أنماط CSS للنافذة المنبثقة
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
      background: linear-gradient(to right, ${primaryColor}, #ff6b6b);
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
      background-color: ${primaryColor};
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
      background-color: ${primaryColor};
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
  
  // تعريف وظيفة إظهار النافذة المنبثقة
  window.showModal = function(message, isError = false) {
    // تحقق إذا كانت النافذة موجودة في ملف HTML
    let customModal = document.getElementById("customModal");
    
    // إذا لم تكن النافذة موجودة، قم بإنشائها ديناميكيًا
    if (!customModal) {
      customModal = document.createElement("div");
      customModal.id = "customModal";
      customModal.className = "modal-container";
      
      // إنشاء محتوى النافذة
      customModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-icon">
            <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
          </div>
          <h3 class="modal-title">${isError ? 'حدث خطأ!' : 'تم بنجاح!'}</h3>
          <p class="modal-message">${message || "تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك."}</p>
          <button class="modal-button" style="background-color: ${isError ? '#dc3545' : primaryColor};">حسناً</button>
        </div>
      `;
      
      // إضافة النافذة إلى الصفحة
      document.body.appendChild(customModal);
      
      // إضافة معالجات الأحداث للأزرار
      const closeButton = customModal.querySelector(".modal-button");
      if (closeButton) {
        closeButton.addEventListener("click", hideModal);
      }
      
      // إضافة معالج حدث للنقر خارج النافذة
      customModal.addEventListener("click", function(e) {
        if (e.target === customModal) {
          hideModal();
        }
      });
    } else {
      // تحديث محتوى النافذة الحالية
      const modalContent = customModal.querySelector(".modal-content");
      if (modalContent) {
        const modalIcon = modalContent.querySelector(".modal-icon i");
        if (modalIcon) {
          modalIcon.className = `fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}`;
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
    
    // إظهار النافذة
    customModal.classList.add("show");
    
    // منع التمرير في الصفحة
    document.body.style.overflow = "hidden";
    
    // إضافة دعم لزر Escape لإغلاق النافذة
    document.addEventListener("keydown", handleEscKeyPress);
  };
  
  // معالج حدث لزر Escape
  function handleEscKeyPress(e) {
    if (e.key === "Escape") {
      hideModal();
    }
  }
  
  // وظيفة إخفاء النافذة
  function hideModal() {
    const customModal = document.getElementById("customModal");
    if (customModal) {
      customModal.classList.remove("show");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscKeyPress);
    }
  }
  
  // إضافة الوظيفة لنطاق window حتى يمكن الوصول إليها من أي مكان
  window.hideModal = hideModal;
  
  // تحسين الحياة! تعديل دالة saveContact للتأكد من استخدام showModal
  const saveContactBtns = document.querySelectorAll('.save-contact');
  if (saveContactBtns.length > 0) {
    saveContactBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const originalClick = this.onclick;
        if (typeof originalClick === 'function') {
          // تنفيذ الوظيفة الأصلية
          originalClick.call(this);
        }
        
        // التأكد من أن showModal سيتم استدعاؤها بعد الحفظ
        setTimeout(() => {
          window.showModal("تم حفظ جهة الاتصال بنجاح! تحقق من مجلد التنزيلات الخاص بك.");
        }, 100);
      });
    });
  }
});
