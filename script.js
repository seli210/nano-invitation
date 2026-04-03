// ==========================================
// ⚠️ خطوة هامة: ضع رابط الـ Web App الخاص بك هنا
// ==========================================
// بعد ما ترفع السكريبت على Google Apps Script، انسخ الرابط الدائم (Web App URL) الخاص بك وضعه هنا بين علامتي التنصيص.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWXfG9wghMrIjZm4i4awg-TwbuD-jL4jAelWNZWqrUtqu-Zq-dlBcPw-MvcJ49a4-Z/exec";
document.addEventListener('DOMContentLoaded', () => {
    // جلب رقم الـ ID من رابط الويب، مثلاً: ticket.html?id=105
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');

    const loadingState = document.getElementById('loading');
    const errorState = document.getElementById('error-state');
    const ticketState = document.getElementById('ticket-state');

    // لو مفيش id في الرابط أو لم يتم وضع رابط السكربت، أظهر خطأ مباشرة
    if (!ticketId || SCRIPT_URL === "ضع_رابط_سكربت_جوجل_هنا") {
        showError();
        return;
    }

    // إرسال طلب للـ API (Google Apps Script)
    fetch(`${SCRIPT_URL}?id=${encodeURIComponent(ticketId)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showTicket(data.data);
            } else {
                // الاسم مش موجود في الشيت أو الشيت لم يرسل نجاح
                showError();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            showError();
        });

    function showTicket(data) {
        // إخفاء التحميل وإظهار التذكرة
        loadingState.classList.remove('active');
        loadingState.classList.add('hidden');
        
        ticketState.classList.remove('hidden');
        ticketState.classList.add('active');

        // ملء البيانات
        document.getElementById('ticket-id-display').textContent = `#${data.id}`;
        document.getElementById('attendee-name').textContent = data.name;
        document.getElementById('attendee-team').textContent = data.team;
        
        const statusBadge = document.getElementById('attendee-status');
        statusBadge.textContent = data.ticketStatus;

        // تغيير لون الحالة بناءً على قيمتها
        if (data.ticketStatus && data.ticketStatus.includes('مؤكد')) {
            statusBadge.style.color = 'var(--success-color)';
            statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
            statusBadge.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        } else {
            statusBadge.style.color = '#f59e0b'; // برتقالي مثلاً الانتظار
            statusBadge.style.background = 'rgba(245, 158, 11, 0.1)';
            statusBadge.style.border = '1px solid rgba(245, 158, 11, 0.3)';
        }

        // إنشاء الـ QR Code
        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = ''; // مسح أي QR قديم

        // حساب الرابط لصفحة scan.html في نفس المجلد
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        const scanUrl = `${baseUrl}/scan.html?id=${data.id}`;

        new QRCode(qrcodeContainer, {
            text: scanUrl,
            width: 120,
            height: 120,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    function showError() {
        loadingState.classList.remove('active');
        loadingState.classList.add('hidden');
        
        errorState.classList.remove('hidden');
        errorState.classList.add('active');
    }
});

