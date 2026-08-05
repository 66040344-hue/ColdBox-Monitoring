export const initialDevices = [
  {
    id: "box-1",
    name: "กล่องเก็บความเย็น 1",
    status: "online",
    statusText: "ออนไลน์",
    lastUpdate: "09:41 น.",
    battery: 98,
    wifiSignal: "ดีมาก",
    tempSensorStatus: "ปกติ",
    humiSensorStatus: "ปกติ",
    loggerStatus: "ปกติ",
    firmware: "v1.2.4",
    location: "ห้องเก็บของ A",
    notes: "-",
    coldBoxScore: 96,
    scoreLabel: "Excellent",
    tempCurrent: 24.2,
    tempDiff30m: 0.6,
    tempMinRange: 2,
    tempMaxRange: 8,
    humiCurrent: 64,
    humiDiff30m: -3,
    humiMinRange: 50,
    humiMaxRange: 70,
    todayStats: {
      avgTemp: 24.2,
      maxTemp: 26.1,
      maxTempTime: "14:23",
      minTemp: 22.8,
      minTempTime: "03:42",
      avgHumi: 64,
      maxHumi: 72,
      minHumi: 52,
      optimalTime: "23 ชม. 32 นาที",
      alertCount: 2
    },
    settings: {
      highTempAlert: 30,
      lowTempAlert: 2,
      highHumiAlert: 70,
      lowHumiAlert: 50,
      unit: "°C / %RH",
      updateInterval: "1 นาที",
      doorAlert: true
    }
  },
  {
    id: "box-2",
    name: "กล่องเก็บความเย็น 2",
    status: "online",
    statusText: "ออนไลน์",
    lastUpdate: "09:40 น.",
    battery: 91,
    wifiSignal: "ปานกลาง",
    tempSensorStatus: "ปกติ",
    humiSensorStatus: "ปกติ",
    loggerStatus: "ปกติ",
    firmware: "v1.2.2",
    location: "ห้องปฏิบัติการ B",
    notes: "เก็บวัคซีนโซน B",
    coldBoxScore: 92,
    scoreLabel: "Good",
    tempCurrent: 4.8,
    tempDiff30m: -0.2,
    tempMinRange: 2,
    tempMaxRange: 8,
    humiCurrent: 58,
    humiDiff30m: 1,
    humiMinRange: 50,
    humiMaxRange: 70,
    todayStats: {
      avgTemp: 4.6,
      maxTemp: 6.2,
      maxTempTime: "11:15",
      minTemp: 3.5,
      minTempTime: "04:10",
      avgHumi: 58,
      maxHumi: 65,
      minHumi: 51,
      optimalTime: "24 ชม. 00 นาที",
      alertCount: 0
    },
    settings: {
      highTempAlert: 8,
      lowTempAlert: 2,
      highHumiAlert: 70,
      lowHumiAlert: 50,
      unit: "°C / %RH",
      updateInterval: "1 นาที",
      doorAlert: true
    }
  },
  {
    id: "box-3",
    name: "กล่องเก็บความเย็น 3",
    status: "offline",
    statusText: "ออฟไลน์",
    lastUpdate: "เมื่อวาน 18:30 น.",
    battery: 42,
    wifiSignal: "อ่อน",
    tempSensorStatus: "ตรวจสอบ",
    humiSensorStatus: "ปกติ",
    loggerStatus: "ปกติ",
    firmware: "v1.2.0",
    location: "คลังสินค้า C",
    notes: "รอซ่อมบำรุงเซนเซอร์",
    coldBoxScore: 78,
    scoreLabel: "Fair",
    tempCurrent: 12.5,
    tempDiff30m: 1.5,
    tempMinRange: 2,
    tempMaxRange: 8,
    humiCurrent: 48,
    humiDiff30m: -5,
    humiMinRange: 50,
    humiMaxRange: 70,
    todayStats: {
      avgTemp: 11.2,
      maxTemp: 15.4,
      maxTempTime: "16:00",
      minTemp: 8.1,
      minTempTime: "02:20",
      avgHumi: 48,
      maxHumi: 55,
      minHumi: 42,
      optimalTime: "18 ชม. 15 นาที",
      alertCount: 5
    },
    settings: {
      highTempAlert: 10,
      lowTempAlert: 2,
      highHumiAlert: 70,
      lowHumiAlert: 45,
      unit: "°C / %RH",
      updateInterval: "5 นาที",
      doorAlert: false
    }
  }
];

export const telemetry24h = [
  { time: "09:00", temp: 24.0, humi: 62 },
  { time: "11:00", temp: 24.5, humi: 65 },
  { time: "13:00", temp: 25.8, humi: 60 },
  { time: "15:00", temp: 26.1, humi: 58 },
  { time: "17:00", temp: 25.2, humi: 64 },
  { time: "19:00", temp: 24.6, humi: 68 },
  { time: "21:00", temp: 24.2, humi: 72 },
  { time: "23:00", temp: 23.5, humi: 69 },
  { time: "01:00", temp: 23.1, humi: 65 },
  { time: "03:00", temp: 22.8, humi: 60 },
  { time: "05:00", temp: 23.2, humi: 55 },
  { time: "07:00", temp: 23.8, humi: 58 },
  { time: "09:00", temp: 24.2, humi: 64 }
];

export const telemetryDaily7d = [
  { date: "30 เม.ย.", temp: 23.8, humi: 62 },
  { date: "1 พ.ค.", temp: 24.5, humi: 65 },
  { date: "2 พ.ค.", temp: 23.2, humi: 60 },
  { date: "3 พ.ค.", temp: 24.5, humi: 65 },
  { date: "4 พ.ค.", temp: 23.0, humi: 58 },
  { date: "5 พ.ค.", temp: 24.8, humi: 70 },
  { date: "6 พ.ค.", temp: 24.2, humi: 64 }
];

export const initialAlerts = [
  {
    id: "alt-1",
    dateGroup: "วันนี้",
    time: "21:42",
    title: "อุณหภูมิสูงเกิน 30 °C",
    device: "กล่องเก็บความเย็น 1",
    type: "danger",
    statusText: "อันตราย",
    category: "temp"
  },
  {
    id: "alt-2",
    dateGroup: "วันนี้",
    time: "19:30",
    title: "ความชื้นต่ำกว่า 50 %RH",
    device: "กล่องเก็บความเย็น 1",
    type: "warning",
    statusText: "เฝ้าระวัง",
    category: "humi"
  },
  {
    id: "alt-3",
    dateGroup: "วันนี้",
    time: "16:20",
    title: "ค่ากลับสู่ปกติ",
    device: "กล่องเก็บความเย็น 1",
    type: "normal",
    statusText: "ปกติ",
    category: "system"
  },
  {
    id: "alt-4",
    dateGroup: "วันนี้",
    time: "14:10",
    title: "เปิดประตูเกิน 2 นาที",
    device: "กล่องเก็บความเย็น 1",
    type: "info",
    statusText: "ข้อมูล",
    category: "system"
  },
  {
    id: "alt-5",
    dateGroup: "เมื่อวาน",
    time: "23:05",
    title: "อุณหภูมิสูงเกิน 30 °C",
    device: "กล่องเก็บความเย็น 1",
    type: "danger",
    statusText: "อันตราย",
    category: "temp"
  },
  {
    id: "alt-6",
    dateGroup: "เมื่อวาน",
    time: "18:45",
    title: "ค่ากลับสู่ปกติ",
    device: "กล่องเก็บความเย็น 1",
    type: "normal",
    statusText: "ปกติ",
    category: "system"
  },
  {
    id: "alt-7",
    dateGroup: "เมื่อวาน",
    time: "12:15",
    title: "ความชื้นต่ำกว่า 50 %RH",
    device: "กล่องเก็บความเย็น 1",
    type: "warning",
    statusText: "เฝ้าระวัง",
    category: "humi"
  }
];

export const heatmapData = [
  { day: "อา.", values: [22, 22, 23, 24, 25, 26, 25, 24, 23, 23, 22, 22] },
  { day: "ส.", values: [23, 23, 24, 25, 27, 28, 27, 25, 24, 23, 23, 22] },
  { day: "ศ.", values: [22, 22, 23, 24, 25, 26, 25, 24, 23, 22, 22, 22] },
  { day: "พฤ.", values: [23, 23, 23, 24, 26, 27, 26, 25, 24, 23, 23, 22] },
  { day: "พ.", values: [22, 23, 24, 25, 26, 27, 26, 25, 24, 23, 22, 22] },
  { day: "อ.", values: [23, 23, 24, 24, 25, 26, 25, 24, 23, 23, 22, 22] },
  { day: "จ.", values: [22, 22, 23, 24, 25, 26, 25, 24, 23, 22, 22, 22] }
];
