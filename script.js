document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cardForm');
    const previewSection = document.getElementById('previewSection');
    const previewContainer = document.getElementById('cardPreview');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    let currentCardData = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع البيانات من النموذج
        const formData = {
            name: document.getElementById('name').value,
            position: document.getElementById('position').value,
            company: document.getElementById('company').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            whatsapp: document.getElementById('whatsapp').value,
            website: document.getElementById('website').value,
            description: document.getElementById('description').value
        };

        // حفظ البيانات الحالية
        currentCardData = formData;

        // إنشاء البطاقة
        createCard(formData);

        // إظهار قسم المعاينة
        previewSection.style.display = 'block';
        
        // التمرير لقسم المعاينة
        previewSection.scrollIntoView({ behavior: 'smooth' });
    });

    sendEmailBtn.addEventListener('click', function() {
        if (currentCardData) {
            sendCardByEmail(currentCardData);
        }
    });

    function createCard(data) {
        // استنساخ القالب
        const template = document.getElementById('cardTemplate');
        const cardElement = template.content.cloneNode(true);

        // ملء البيانات
        cardElement.querySelector('.name').textContent = data.name;
        cardElement.querySelector('.position').textContent = data.position + ' - ' + data.company;
        cardElement.querySelector('.description').textContent = data.description || 'A professional focused on excellence in providing innovative, high-quality technical services that satisfy clients.';
        cardElement.querySelector('.email').textContent = data.email;
        cardElement.querySelector('.phone').textContent = data.phone;
        // cardElement.querySelector('.company-name').textContent = data.company;

        // إضافة رابط الواتساب إذا وجد
        const whatsappItem = cardElement.querySelector('.whatsapp');
        if (data.whatsapp) {
            whatsappItem.style.display = 'flex';
            whatsappItem.addEventListener('click', () => {
                window.open(`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`);
            });
        } else {
            whatsappItem.style.display = 'none';
        }

        // إضافة رابط الموقع إذا وجد
        const websiteItem = cardElement.querySelector('.website');
        if (data.website) {
            websiteItem.style.display = 'flex';
            websiteItem.addEventListener('click', () => {
                window.open(data.website);
            });
        } else {
            websiteItem.style.display = 'none';
        }

        // إضافة وظيفة حفظ جهة الاتصال
        const saveContactBtn = cardElement.querySelector('.save-contact');
        saveContactBtn.addEventListener('click', () => {
            createVCard(data);
        });

        // تنظيف المعاينة السابقة وإضافة البطاقة الجديدة
        previewContainer.innerHTML = '';
        previewContainer.appendChild(cardElement);
    }

    function createVCard(data) {
        // إنشاء محتوى HTML
        const htmlContent = generateCardHTML(data);
        
        // إنشاء محتوى CSS
        const cssContent = generateCardCSS();
        
        // إنشاء محتوى JavaScript
        const jsContent = generateCardJS(data);
        
        // إنشاء ملف ZIP
        createZipFile(data, htmlContent, cssContent, jsContent);
    }

    function generateCardCSS() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
}

body {
    background-color: #f5f5f5;
    padding: 20px;
    line-height: 1.6;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.card-container {
    max-width: 500px;
    margin: 0 auto;
}

.business-card {
    background: white;
    width: 350px;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 20px;
    text-align: center;
}

.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #ddd;
}

.company-card {
    width: 80px;
    height: 50px;
    border-radius: 5px;
    background: #ddd;
}

.profile-section {
    margin-bottom: 20px;
}

.profile-circle {
    width: 80px;
    height: 80px;
    border: 3px solid #dc3545;
    border-radius: 50%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-text {
    color: #dc3545;
    font-weight: bold;
}

.name {
    font-size: 24px;
    margin: 15px 0 5px;
    color: #333;
}

.position {
    font-size: 16px;
    color: #666;
    text-transform: uppercase;
    margin-bottom: 20px;
}

.description {
    color: #444;
    margin-bottom: 30px;
    font-size: 14px;
}

.contact-info {
    margin-bottom: 30px;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px 0;
    cursor: pointer;
}

.icon {
    margin-left: 10px;
    font-size: 20px;
}

.email, .phone {
    flex-grow: 1;
    text-align: right;
}

.work-label {
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 12px;
    margin-right: 10px;
}

.save-contact {
    background: black;
    color: white;
    width: 100%;
    padding: 12px;
    border-radius: 30px;
    margin-bottom: 20px;
    border: none;
    cursor: pointer;
}

.powered-by {
    color: #999;
    font-size: 14px;
}

.company-name {
    color: #666;
    font-weight: bold;
}`;
    }

    function generateCardJS(data) {
        return `document.addEventListener('DOMContentLoaded', function() {
    // إضافة الوظائف التفاعلية لأزرار البطاقة
    const saveContactBtn = document.querySelector('.save-contact');
    const whatsappItem = document.querySelector('.whatsapp');
    const websiteItem = document.querySelector('.website');
    
    // حفظ جهة الاتصال
    saveContactBtn.addEventListener('click', function() {
        alert('تم حفظ جهة الاتصال!');
        // هنا يمكن إضافة أي وظيفة مخصصة
    });
    
    // الواتساب
    ${data.whatsapp ? `whatsappItem.addEventListener('click', function() {
        window.open('https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}');
    });` : ''}
    
    // الموقع الإلكتروني
    ${data.website ? `websiteItem.addEventListener('click', function() {
        window.open('${data.website}');
    });` : ''}
});
`;
    }

    function createZipFile(data, htmlContent, cssContent, jsContent) {
        // تحميل JSZip من CDN
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.body.appendChild(scriptElement);

        scriptElement.onload = function() {
            // إنشاء ملف ZIP
            const zip = new JSZip();
            
            // إضافة ملفات للـ ZIP
            zip.file('index.html', htmlContent);
            zip.file('styles.css', cssContent);
            zip.file('script.js', jsContent);
            
            // توليد ملف ZIP وتحميله
            zip.generateAsync({type: 'blob'}).then(function(content) {
                const url = window.URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${data.name.replace(/\s+/g, '_')}_business_card.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            });
        };

        scriptElement.onerror = function() {
            alert('حدث خطأ أثناء تحميل مكتبة JSZip. يرجى التحقق من اتصالك بالإنترنت.');
        };
    }

    function sendCardByEmail(data) {
        // إنشاء HTML للبطاقة لإرسالها بالبريد
        const cardHTML = generateCardHTML(data);

        // إعداد البارامترز للبريد
        const templateParams = {
            to_email: data.email,
            from_name: 'Business Card Generator',
            to_name: data.name,
            message: 'تم إنشاء بطاقة العمل الخاصة بك بنجاح',
            card_html: cardHTML
        };

        // إرسال البريد باستخدام EmailJS
        emailjs.send('service_h4iregr', 'template_rgrw5mk', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('تم إرسال البطاقة بنجاح إلى بريدك الإلكتروني!');
            }, function(error) {
                console.log('FAILED...', error);
                alert('حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.');
            });
    }

    function generateCardHTML(data) {
        return `<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بطاقة عمل ${data.name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="card-container">
        <div class="business-card">
            <div class="card-header">
                <div class="logo"></div>
                <div class="company-card"></div>
            </div>
            
            <div class="profile-section">
                <div class="profile-circle">
                    <span class="profile-text">Profile</span>
                </div>
            </div>
            
            <h1 class="name">${data.name}</h1>
            <h2 class="position">${data.position} - ${data.company}</h2>
            
            <p class="description">${data.description || 'خبير متخصص في تقديم خدمات تقنية مبتكرة وعالية الجودة لإرضاء العملاء.'}</p>
            
            <div class="contact-info">
                <div class="contact-item">
                    <span class="icon">📧</span>
                    <span class="email">${data.email}</span>
                    <span class="work-label">Work</span>
                </div>
                
                <div class="contact-item">
                    <span class="icon">📞</span>
                    <span class="phone">${data.phone}</span>
                    <span class="work-label">Work</span>
                </div>
                
                ${data.whatsapp ? `<div class="contact-item whatsapp">
                    <span class="icon">📱</span>
                    <span class="text">تواصل معي على واتساب</span>
                </div>` : ''}
                
                ${data.website ? `<div class="contact-item website">
                    <span class="icon">🌐</span>
                    <span class="text">زيارة موقعنا الإلكتروني</span>
                </div>` : ''}
            </div>
            
            <button class="save-contact">حفظ جهة الاتصال</button>
            
            <div class="powered-by">
                تم الإنشاء بواسطة <span class="company-name">${data.company}</span>
            </div>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
`;
    }
});
