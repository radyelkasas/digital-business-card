# دليل البدء السريع

## الخطوات الأساسية للبدء

### 1. إعداد EmailJS (اختياري - فقط إذا كنت تريد إرسال البطاقات بالبريد)
1. سجل في [EmailJS](https://www.emailjs.com/)
2. أضف خدمة Gmail (أو أي خدمة بريد أخرى)
3. أنشئ قالب بريد جديد ونسخ محتوى `emailjs-template-example.html`
4. احصل على المفاتيح المطلوبة:
   - Public Key
   - Service ID  
   - Template ID

### 2. تحديث المفاتيح
1. في `index.html` السطر 130:
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY");
   ```
   
2. في `script.js` السطر 163:
   ```javascript
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
   ```

### 3. اختبار التطبيق
1. افتح `index.html` في المتصفح
2. املأ البيانات واضغط "إنشاء البطاقة"
3. اضغط على "حفظ جهة الاتصال" لتحميل البطاقة كملفات HTML+CSS+JS في ZIP
4. اضغط "إرسال البطاقة" لاختبار البريد

## استكشاف الأخطاء

### لا يتم تحميل ملف ZIP:
1. تأكد من تحميل مكتبة JSZip بشكل صحيح
2. افتح وحدة التحكم في المتصفح (F12) للتحقق من الأخطاء

### لا يتم إرسال البريد:
1. تأكد من المفاتيح صحيحة
2. تحقق من إعدادات CORS في EmailJS
3. افتح Console في المتصفح للتحقق من الأخطاء

### البطاقة لا تظهر:
1. افتح المصفوفة في المتصفح (F12)
2. تحقق من وجود أخطاء JavaScript

## تخصيص سريع

### تغيير الألوان:
في `styles.css`:
```css
.business-card {
    background: white; /* لون الخلفية */
}

.profile-circle {
    border: 3px solid #dc3545; /* لون الإطار */
}
```

### تخصيص البطاقة بشكل كامل:
بمجرد تحميل ملف ZIP، يمكنك فتح وتعديل الملفات مباشرة:
- `index.html` - هيكل البطاقة
- `styles.css` - تنسيق البطاقة
- `script.js` - التفاعلات والوظائف

## الاستخدام النهائي
يمكن استخدام الملفات المحزمة في ZIP بالطرق التالية:
1. استضافتها على أي موقع استضافة
2. إرسالها للعميل ليفتحها على جهازه
3. تخصيصها وتعديلها حسب الاحتياجات الخاصة

## مزايا هذا الحل (بدون backend)
1. لا حاجة لخادم خلفي (backend)
2. سهل الاستخدام والتعديل
3. يمكن استخدامه بدون اتصال بالإنترنت
4. سريع وخفيف
5. يمكن للعميل تعديله بسهولة
