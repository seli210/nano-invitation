/**
 * هذا السكريبت خاص بـ Google Apps Script لربط شيت الإكسيل بصفحة الويب
 * تعليمات التركيب:
 * 1. افتح شيت جوجل الخاص بك.
 * 2. تأكد من أن أسماء الأعمدة في الصف الأول كالتالي (أو مشابهة):
 *    (ID | Name | Team | Status)  مهم أن يكون ID في العمود الأول (A)
 * 3. من القائمة العلوية اضغط على Extensions (الإضافات) ثم Apps Script
 * 4. امسح الكود الموجود وضع هذا الكود مكانه.
 * 5. اضغط على Deploy (نشر) -> New deployment (نشر جديد)
 * 6. اختر النوع Web App (تطبيق ويب)
 * 7. اجعل Who has access: "Anyone" (أي شخص)
 * 8. اضغط Deploy وانسخ الرابط (Web App URL) وضعه في ملف script.js في مشروع الويب.
 */

function doGet(e) {
  // تفعيل دعم الـ CORS عشان صفحة الويب تقدر توصل للبيانات
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  
  // التأكد من أن المستخدم أرسل id
  if (!e.parameter.id) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", 
      message: "No ID provided"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var requestedId = e.parameter.id.toString().trim();
  
  try {
    // فتح الشيت النشط
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // افتراض أن الصف الأول يحتوي على أسماء الأعمدة (Headers)
    // نبدأ البحث من الصف الثاني (index 1)
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var rowId = row[0] ? row[0].toString().trim() : ""; // العمود A
        var name = row[1] ? row[1].toString() : "";         // العمود B
        var team = row[2] ? row[2].toString() : "";         // العمود C
        var status = row[3] ? row[3].toString() : "";       // العمود D
        
        // إذا وجدنا الـ ID
        if (rowId === requestedId) {
            // التحقق إذا كان الطلب هو "تسجيل حضور"
            if (e.parameter.action === "checkin") {
                // تحديث العمود E (والذي هو index 5 يعني الخلية i+1, 5) إلى "تم الحضور"
                sheet.getRange(i + 1, 5).setValue("✅ تم الحضور");
                
                return ContentService.createTextOutput(JSON.stringify({
                  status: "success",
                  message: "تم تسجيل الحضور بنجاح",
                  data: {
                    id: rowId,
                    name: name
                  }
                })).setMimeType(ContentService.MimeType.JSON);
            }
            
            // في حالة الطلب العادي (عرض التذكرة)
            return ContentService.createTextOutput(JSON.stringify({
              status: "success",
              data: {
                id: rowId,
                name: name,
                team: team,
                ticketStatus: status
              }
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }
    
    // إذا انتهت الحلقة ولم يجد الـ ID
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "User not found"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

