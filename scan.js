document.addEventListener('DOMContentLoaded', () => {
    // جلب رابط السكربت من المكان الذي تم فيه تعريفه أو نستخدم طريقة أخرى.
    // لسهولة الاستخدام، سنقوم بجلب السكربت المحدث من قبل المستخدم في script.js
    // عن طريق طلبه بشكل مباشر. لكن بما أن script.js يحتوي على Logic مخصص للتذكرة،
    // سنقوم بتعريف الثابت هنا وطلب المستخدم بنسخه أيضاً أو نعدله برمجياً.
    
    // ملاحظة: لقد قمت بتحديث نسختك من script.js لذلك سأضع نفس الرابط الذي وضعته.
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWXfG9wghMrIjZm4i4awg-TwbuD-jL4jAelWNZWqrUtqu-Zq-dlBcPw-MvcJ49a4-Z/exec";

    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');

    const loadingState = document.getElementById('loading');
    const successState = document.getElementById('success-state');
    const errorState = document.getElementById('error-state');

    if (!ticketId) {
        showError("لا يوجد رقم تعريف في الرابط.");
        return;
    }

    // إضافة action=checkin
    fetch(`${SCRIPT_URL}?id=${encodeURIComponent(ticketId)}&action=checkin`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showSuccess(data.data.name);
            } else {
                showError("التذكرة غير صالحة أو غير موجودة.");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            showError("حدث خطأ في الاتصال بالخادم.");
        });

    function showSuccess(name) {
        loadingState.classList.add('hidden');
        successState.classList.remove('hidden');
        if (name) {
            document.getElementById('attendee-name').textContent = `تم تسجيل حضور: ${name}`;
        }
    }

    function showError(msg) {
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        document.getElementById('error-msg').textContent = msg;
    }
});
