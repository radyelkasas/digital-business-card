/**
 * تصحيح لمشكلة نافذة الإشعار (modal) في البطاقات المنزلة
 * 
 * كيفية الاستخدام:
 * 1. قم بنسخ هذا الملف إلى المجلد الذي يحتوي على البطاقة المنزلة
 * 2. أضف سطر تضمين لهذا الملف في نهاية script.js الخاص بالبطاقة المنزلة
 * 
 * <!-- في ملف index.html للبطاقة، أضف بعد تضمين script.js -->
 * <script src="fix-card.js"></script>
 */

// تعريف وظيفة إظهار النافذة المنبثقة
function showModal(message, isError = false) {
  // تحقق إذا كانت النافذة موجودة في ملف HTML
  let customModal = document.getElementById("customModal");
  
  // اللون الرئيسي
  const primaryColor = window.primaryColor || "#8B0000";
  
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
        <p class="modal-message">${message || "تم ح