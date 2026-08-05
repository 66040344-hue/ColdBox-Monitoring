/**
 * Telemetry Service & Supabase DB Integration Engine
 */

import { initialDevices, telemetry24h, telemetryDaily7d, initialAlerts, heatmapData } from './mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const API_CONFIG = {
  USE_REAL_SUPABASE: isSupabaseConfigured(),
};

class TelemetryService {
  constructor() {
    this.devices = [...initialDevices];
    this.alerts = [...initialAlerts];
    this.telemetry24h = [...telemetry24h];
    this.listeners = [];
    this.isLiveSimulating = false;
    this.simInterval = null;
    this.realtimeChannel = null;

    if (API_CONFIG.USE_REAL_SUPABASE) {
      this.initSupabaseData();
    }
  }

  // Initial Data Fetching & Supabase Realtime Listener Setup
  async initSupabaseData() {
    console.log('⚡ Connecting to Supabase Database Engine...');

    // 1. Fetch Existing History Logs from Supabase DB
    try {
      const { data: logs, error: logsError } = await supabase
        .from('telemetry_logs')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(24);

      if (!logsError && logs && logs.length > 0) {
        console.log(`📥 Loaded ${logs.length} real telemetry logs from Supabase.`);
        
        // Reverse so chronologically ordered
        const chronologLogs = [...logs].reverse();
        
        // Update 24h Telemetry Chart Data
        this.telemetry24h = chronologLogs.map(log => ({
          time: new Date(log.recorded_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          temp: Number(log.temp_avg || log.temp_1),
          humi: Number(log.humi_avg || log.humi_1)
        }));

        // Update latest current reading for device
        const latest = logs[0];
        const dev = this.devices.find(d => d.id === latest.device_id) || this.devices[0];
        dev.tempCurrent = Number(latest.temp_avg || latest.temp_1);
        dev.humiCurrent = Number(latest.humi_avg || latest.humi_1);
        dev.lastUpdate = new Date(latest.recorded_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
        dev.status = 'online';
        dev.statusText = 'ออนไลน์';
      }

      // 2. Fetch Alerts from Supabase DB
      const { data: dbAlerts, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!alertsError && dbAlerts && dbAlerts.length > 0) {
        this.alerts = dbAlerts.map(a => ({
          id: `alt-${a.id}`,
          dateGroup: 'วันนี้',
          time: new Date(a.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          title: a.title,
          device: 'กล่องเก็บความเย็น 1',
          type: a.type,
          statusText: a.type === 'danger' ? 'อันตราย' : a.type === 'warning' ? 'เฝ้าระวัง' : 'ปกติ',
          category: a.category,
          isRead: Boolean(a.is_read)
        }));
      }

      this.notifyListeners();
    } catch (err) {
      console.warn('⚠️ Supabase initial fetch fallback to mock data:', err);
    }

    // 3. Subscribe to Realtime Subscriptions for ESP32 INSERTS
    this.realtimeChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetry_logs' },
        (payload) => {
          console.log('📡 Live ESP32 Telemetry Received:', payload.new);
          const newLog = payload.new;
          
          // Update device state
          const targetDev = this.devices.find(d => d.id === newLog.device_id) || this.devices[0];
          targetDev.tempCurrent = Number(newLog.temp_avg || newLog.temp_1);
          targetDev.humiCurrent = Number(newLog.humi_avg || newLog.humi_1);
          targetDev.lastUpdate = new Date(newLog.recorded_at || Date.now()).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
          targetDev.status = 'online';
          targetDev.statusText = 'ออนไลน์';

          // Push to 24h telemetry array
          const timeStr = new Date(newLog.recorded_at || Date.now()).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
          this.telemetry24h.push({
            time: timeStr,
            temp: Number(newLog.temp_avg || newLog.temp_1),
            humi: Number(newLog.humi_avg || newLog.humi_1)
          });
          if (this.telemetry24h.length > 24) this.telemetry24h.shift();

          this.notifyListeners();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          console.log('🚨 Live Alert Received:', payload.new);
          this.alerts.unshift({
            id: `alt-${payload.new.id}`,
            dateGroup: 'วันนี้',
            time: new Date(payload.new.created_at || Date.now()).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            title: payload.new.title,
            device: 'กล่องเก็บความเย็น 1',
            type: payload.new.type,
            statusText: payload.new.type === 'danger' ? 'อันตราย' : payload.new.type === 'warning' ? 'เฝ้าระวัง' : 'ปกติ',
            category: payload.new.category,
            isRead: false
          });
          this.notifyListeners();
        }
      )
      .subscribe();
  }

  // Retrieve list of cold boxes
  getDevices() {
    return this.devices;
  }

  getDeviceById(id) {
    return this.devices.find(d => d.id === id) || this.devices[0];
  }

  // Update device settings
  updateDeviceSettings(deviceId, newSettings) {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      if (newSettings.name) device.name = newSettings.name;
      if (newSettings.location) device.location = newSettings.location;
      if (newSettings.notes) device.notes = newSettings.notes;
      if (newSettings.settings) device.settings = { ...device.settings, ...newSettings.settings };

      // Sync with Supabase if configured
      if (API_CONFIG.USE_REAL_SUPABASE) {
        supabase.from('devices').update({
          name: device.name,
          location: device.location,
          notes: device.notes
        }).eq('id', deviceId);
      }

      this.notifyListeners();
    }
    return device;
  }

  // Get alerts list
  getAlerts(category = 'all') {
    if (category === 'all') return this.alerts;
    return this.alerts.filter(a => a.category === category);
  }

  // CSV Generator for real file downloading
  generateCSV(deviceId, options = {}) {
    const device = this.getDeviceById(deviceId);
    let csvContent = `data:text/csv;charset=utf-8,\uFEFF`;
    csvContent += `รายงานข้อมูลการติดตามกล่องเก็บความเย็น: ${device.name}\n`;
    csvContent += `วันที่ส่งออก: ${new Date().toLocaleString('th-TH')}\n\n`;
    csvContent += `เวลา,อุณหภูมิ (°C),ความชื้น (%RH),สถานะ\n`;

    this.telemetry24h.forEach(row => {
      const status = (row.temp > device.settings.highTempAlert || row.temp < device.settings.lowTempAlert) ? 'แจ้งเตือน' : 'ปกติ';
      csvContent += `${row.time},${row.temp},${row.humi},${status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coldbox_telemetry_${device.name.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Simulation mode toggling for real-time demonstration
  toggleLiveSimulation(enable, callback) {
    this.isLiveSimulating = enable;
    if (enable) {
      if (this.simInterval) clearInterval(this.simInterval);
      this.simInterval = setInterval(() => {
        // Drifting temp & humi slightly
        this.devices.forEach(dev => {
          if (dev.status === 'online') {
            const tempDelta = (Math.random() * 0.4 - 0.2);
            const humiDelta = Math.floor(Math.random() * 3 - 1);
            dev.tempCurrent = +(dev.tempCurrent + tempDelta).toFixed(1);
            dev.humiCurrent = Math.min(100, Math.max(0, dev.humiCurrent + humiDelta));
            dev.lastUpdate = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
          }
        });
        if (callback) callback([...this.devices]);
      }, 3000);
    } else {
      if (this.simInterval) clearInterval(this.simInterval);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(l => l(this.devices));
  }
}

export const telemetryService = new TelemetryService();
