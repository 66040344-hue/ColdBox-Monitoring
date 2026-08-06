# 📦 ColdBox - Dashboard แสดงผลค่าอุณหภูมิและความชื้น ESP32 (Dual DHT22)

หน้าเว็บ Dashboard สำหรับแสดงผลค่าอุณหภูมิและความชื้นเรียลไทม์จากบอร์ด **ESP32** ร่วมกับเซนเซอร์ **DHT22** 2 ตัว (GPIO 4 และ GPIO 16) ผ่าน **Supabase Realtime Database**

---

## 🚀 คุณสมบัติเด่น (Features)

1. **พัฒนาด้วย Pure HTML, CSS, JS เท่านั้น (ไม่มี Dependency ซับซ้อน)**
   - ใช้งานง่าย เพียงดับเบิ้ลคลิกไฟล์ `index.html` ก็เปิดใช้งานบนเว็บเบราว์เซอร์ได้ทันที
   - โหลดไลบรารีผ่าน CDN (FontAwesome, Chart.js, Supabase JS SDK)
2. **รองรับเซนเซอร์ Dual DHT22 (2 จุด)**
   - **DHT22 #1 (ภายในกล่องเก็บความเย็น)**: เชื่อมต่อผ่านขา **GPIO 4**
   - **DHT22 #2 (สภาพแวดล้อมภายนอก)**: เชื่อมต่อผ่านขา **GPIO 16**
3. **การเชื่อมต่อข้อมูลแบบ Real-time**
   - ใช้ **Supabase Realtime (WebSocket)** เมื่อ ESP32 ยิงข้อมูลเข้าตาราง `telemetry_logs` หน้าจอจะอัปเดตกราฟและตัวเลขทันทีโดยไม่ต้องกด Refresh
4. **แสดงผลครบถ้วน**
   - ค่าอุณหภูมิและความชื้นเฉลี่ย (Large Live Cards)
   - แยกรายละเอียดค่าของแต่ละเซนเซอร์ (GPIO 4 vs GPIO 16)
   - กราฟแนวโน้มเรียลไทม์ (Interactive Line Chart จาก Chart.js)
   - สรุปสถิติประจำวัน (ค่าเฉลี่ย, ค่าสูงสุดพร้อมเวลา, ค่าต่ำสุดพร้อมเวลา)
   - ตารางประวัติการบันทึกย้อนหลัง 10 รายการล่าสุด
5. **ปุ่มจำลองยิงข้อมูล (Test POST)**
   - สามารถกดปุ่ม **"จำลองยิงข้อมูลจาก ESP32"** เพื่อทดสอบการส่งข้อมูลเข้า Supabase DB ได้ทันทีแม้ไม่ได้เปิดบอร์ด ESP32

---

## 🛠️ โครงสร้างไฟล์ในโปรเจกต์ (`D:\1Project_IoT_smartfarm\ColdBox`)

```
ColdBox/
├── index.html       # โครงสร้างหน้าเว็บ Dashboard (HTML5 + CDN)
├── style.css        # สไตล์การออกแบบ UI (Responsive + Modern Design System)
├── app.js           # โลจิกดึงข้อมูล เชื่อมต่อ Supabase Realtime & Render Chart
└── README.md        # เอกสารแนะนำการใช้งาน
```

---

## 🔑 Supabase Configuration Key

```javascript
const PROJECT_REF = 'vxzbgfrdrzdsifmqnvdl';
const DEFAULT_URL = 'https://vxzbgfrdrzdsifmqnvdl.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4emJnZnJkcnpkc2lmbXFudmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mzk3NTEsImV4cCI6MjEwMTUxNTc1MX0._lQrHVitWHD1fiPUivOAMBeEY-69Msedab7l3_bTc5I';
```

---

## 💻 ตารางข้อมูล Supabase Schema (`telemetry_logs`)

```sql
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    temp_1 NUMERIC(4,1) NOT NULL,  -- เซนเซอร์ DHT22 #1 (GPIO 4)
    humi_1 NUMERIC(4,1) NOT NULL,  -- เซนเซอร์ DHT22 #1 (GPIO 4)
    temp_2 NUMERIC(4,1),           -- เซนเซอร์ DHT22 #2 (GPIO 16)
    humi_2 NUMERIC(4,1),           -- เซนเซอร์ DHT22 #2 (GPIO 16)
    temp_avg NUMERIC(4,1) NOT NULL,-- ค่าอุณหภูมิเฉลี่ย
    humi_avg NUMERIC(4,1) NOT NULL,-- ค่าความชื้นเฉลี่ย
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิดใช้งาน Realtime สำหรับตาราง
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry_logs;
```

---

## 🌐 วิธีเปิดใช้งาน Dashboard

1. เปิดโฟลเดอร์ `D:\1Project_IoT_smartfarm\ColdBox`
2. ดับเบิ้ลคลิกไฟล์ [index.html](file:///d:/1Project_IoT_smartfarm/ColdBox/index.html) ใน Google Chrome, Microsoft Edge หรือ Web Browser ใดๆ
3. ทดลองกดปุ่ม **"จำลองยิงข้อมูลจาก ESP32"** บนหน้าจอเพื่อดูผลการอัปเดตแบบเรียลไทม์!
