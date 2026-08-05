-- ============================================================
-- SQL SCHEMA FOR COLD BOX MONITORING SYSTEM (SUPABASE POSTGRESQL)
-- ============================================================

-- 1. Create Devices Table
CREATE TABLE IF NOT EXISTS public.devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) DEFAULT 'ห้องเก็บของ A',
    status VARCHAR(20) DEFAULT 'online',
    status_text VARCHAR(20) DEFAULT 'ออนไลน์',
    battery INT DEFAULT 98,
    wifi_signal VARCHAR(30) DEFAULT 'ดีมาก',
    firmware VARCHAR(20) DEFAULT 'v1.2.4',
    notes TEXT DEFAULT '-',
    cold_box_score INT DEFAULT 96,
    score_label VARCHAR(30) DEFAULT 'Excellent',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Device Settings Table
CREATE TABLE IF NOT EXISTS public.device_settings (
    device_id VARCHAR(50) PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    high_temp_alert NUMERIC DEFAULT 30,
    low_temp_alert NUMERIC DEFAULT 2,
    high_humi_alert NUMERIC DEFAULT 70,
    low_humi_alert NUMERIC DEFAULT 50,
    unit VARCHAR(20) DEFAULT '°C / %RH',
    update_interval VARCHAR(20) DEFAULT '1 นาที',
    door_alert BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Telemetry Logs Table (Supports Dual DHT22 Sensors)
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    temp_1 NUMERIC(4,1) NOT NULL, -- Sensor DHT22 #1 (Main inside box)
    humi_1 NUMERIC(4,1) NOT NULL, -- Sensor DHT22 #1
    temp_2 NUMERIC(4,1),          -- Sensor DHT22 #2 (Secondary/Ambient)
    humi_2 NUMERIC(4,1),          -- Sensor DHT22 #2
    temp_avg NUMERIC(4,1) NOT NULL, -- Calculated Average Temp
    humi_avg NUMERIC(4,1) NOT NULL, -- Calculated Average Humi
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast query on telemetry timeline
CREATE INDEX IF NOT EXISTS idx_telemetry_device_time ON public.telemetry_logs(device_id, recorded_at DESC);

-- 4. Create Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(50) REFERENCES public.devices(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'danger', 'warning', 'normal', 'info'
    category VARCHAR(20) NOT NULL, -- 'temp', 'humi', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for alerts query
CREATE INDEX IF NOT EXISTS idx_alerts_device_time ON public.alerts(device_id, created_at DESC);

-- ============================================================
-- ENABLE SUPABASE REALTIME PUBSUB ENGINE
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;

-- Disable Row Level Security (RLS) for easy development, or add open policies
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED INITIAL SAMPLE DATA
-- ============================================================
INSERT INTO public.devices (id, name, location, status, battery, wifi_signal, firmware, cold_box_score, score_label)
VALUES 
  ('box-1', 'กล่องเก็บความเย็น 1', 'ห้องเก็บของ A', 'online', 98, 'ดีมาก', 'v1.2.4', 96, 'Excellent'),
  ('box-2', 'กล่องเก็บความเย็น 2', 'ห้องปฏิบัติการ B', 'online', 91, 'ปานกลาง', 'v1.2.2', 92, 'Good')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.device_settings (device_id, high_temp_alert, low_temp_alert, high_humi_alert, low_humi_alert)
VALUES 
  ('box-1', 30, 2, 70, 50),
  ('box-2', 8, 2, 70, 50)
ON CONFLICT (device_id) DO NOTHING;

INSERT INTO public.telemetry_logs (device_id, temp_1, humi_1, temp_2, humi_2, temp_avg, humi_avg)
VALUES
  ('box-1', 24.2, 64.0, 24.0, 63.5, 24.1, 63.8),
  ('box-1', 24.5, 65.0, 24.3, 64.8, 24.4, 64.9),
  ('box-1', 25.0, 66.0, 24.8, 65.5, 24.9, 65.8);

INSERT INTO public.alerts (device_id, title, type, category)
VALUES
  ('box-1', 'อุณหภูมิสูงเกิน 30 °C', 'danger', 'temp'),
  ('box-1', 'ความชื้นต่ำกว่า 50 %RH', 'warning', 'humi'),
  ('box-1', 'ค่ากลับสู่ปกติ', 'normal', 'system')
ON CONFLICT DO NOTHING;
