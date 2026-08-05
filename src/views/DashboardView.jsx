import React, { useState } from 'react';
import { CheckCircle2, Thermometer, Droplets, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ScoreDetailModal from '../components/ScoreDetailModal';

export default function DashboardView({ device, telemetry24h, onOpenDeviceDetail, onNavigateTab }) {
  const [timeRange, setTimeRange] = useState('24h');
  const [showScoreModal, setShowScoreModal] = useState(false);

  const isFahrenheit = device.settings?.unit?.includes('°F');

  // Convert temp dynamically if Fahrenheit selected
  const formatTemp = (valC) => {
    if (isFahrenheit) {
      return (valC * 9 / 5 + 32).toFixed(1);
    }
    return valC;
  };

  const tempSymbol = isFahrenheit ? '°F' : '°C';

  // Filter telemetry based on selected range (12h, 24h, 7d)
  const displayTelemetry = timeRange === '12h' 
    ? telemetry24h.slice(-7) 
    : telemetry24h;

  const convertedTelemetry = displayTelemetry.map(item => ({
    ...item,
    tempDisplay: formatTemp(item.temp)
  }));

  const stats = device.todayStats;

  return (
    <div>
      {/* 1. Normal Status Card Banner */}
      <div 
        onClick={onOpenDeviceDetail}
        style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1px solid #A7F3D0',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#065F46' }}>
            สถานะปกติ
          </div>
          <div style={{ fontSize: '12px', color: '#047857' }}>
            อุณหภูมิและความชื้นอยู่ในเกณฑ์ปลอดภัย
          </div>
        </div>
      </div>

      {/* 2. Temperature & Humidity Side-by-Side Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {/* Temperature Card */}
        <div className="card" style={{ padding: '14px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
            <Thermometer size={16} />
            <span>อุณหภูมิ</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1E293B', lineHeight: '1' }}>
            {formatTemp(device.tempCurrent)} <span style={{ fontSize: '16px', fontWeight: '600' }}>{tempSymbol}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669', marginTop: '6px', fontWeight: '500' }}>
            <ArrowUpRight size={14} color="#059669" />
            <span>+{device.tempDiff30m} {tempSymbol}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
            จาก 30 นาทีที่แล้ว
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #E2E8F0' }}>
            ช่วงเหมาะสม {formatTemp(device.tempMinRange)} - {formatTemp(device.tempMaxRange)} {tempSymbol}
          </div>
        </div>

        {/* Humidity Card */}
        <div className="card" style={{ padding: '14px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
            <Droplets size={16} />
            <span>ความชื้น</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1E293B', lineHeight: '1' }}>
            {device.humiCurrent} <span style={{ fontSize: '15px', fontWeight: '600' }}>%RH</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#EF4444', marginTop: '6px', fontWeight: '500' }}>
            <ArrowDownRight size={14} color="#EF4444" />
            <span>{device.humiDiff30m} %RH</span>
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
            จาก 30 นาทีที่แล้ว
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #E2E8F0' }}>
            ช่วงเหมาะสม {device.humiMinRange} - {device.humiMaxRange} %RH
          </div>
        </div>
      </div>

      {/* 3. Telemetry Trend Chart Card */}
      <div className="card">
        <div className="card-title">
          <span>กราฟ 24 ชั่วโมงล่าสุด</span>
          <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '2px', borderRadius: '8px' }}>
            {['12 ชม.', '24 ชม.', '7 วัน'].map((label, idx) => {
              const keys = ['12h', '24h', '7d'];
              const isActive = timeRange === keys[idx];
              return (
                <button
                  key={keys[idx]}
                  onClick={() => setTimeRange(keys[idx])}
                  style={{
                    border: 'none',
                    background: isActive ? '#1E6BFF' : 'transparent',
                    color: isActive ? 'white' : '#64748B',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginBottom: '12px', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#EF4444', borderRadius: '2px' }}></span>
            <span>อุณหภูมิ ({tempSymbol})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px' }}></span>
            <span>ความชื้น (%RH)</span>
          </div>
        </div>

        {/* Line Chart */}
        <div style={{ width: '100%', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={convertedTelemetry} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" domain={[0, 40]} tick={{ fontSize: 10, fill: '#EF4444' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: '#2563EB' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                formatter={(val, name) => [val, name === 'tempDisplay' ? `อุณหภูมิ (${tempSymbol})` : 'ความชื้น (%RH)']}
              />
              <Line yAxisId="left" type="monotone" dataKey="tempDisplay" stroke="#EF4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="humi" stroke="#2563EB" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Quick Today Stats (Average, Max, Min) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div style={{ background: '#FFFFFF', padding: '10px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#64748B' }}>ค่าเฉลี่ยวันนี้</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginTop: '2px' }}>
            {formatTemp(stats.avgTemp)} {tempSymbol}
          </div>
          <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>อุณหภูมิเฉลี่ย</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '10px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#DC2626', fontWeight: 600 }}>สูงสุดวันนี้</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#DC2626', marginTop: '2px' }}>
            {formatTemp(stats.maxTemp)} {tempSymbol}
          </div>
          <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>เวลา {stats.maxTempTime}</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '10px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#2563EB', fontWeight: 600 }}>ต่ำสุดวันนี้</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#2563EB', marginTop: '2px' }}>
            {formatTemp(stats.minTemp)} {tempSymbol}
          </div>
          <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>เวลา {stats.minTempTime}</div>
        </div>
      </div>

      {/* 5. Cold Box Score Gauge Card */}
      <div 
        onClick={() => setShowScoreModal(true)}
        className="card" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={13} />
            <span>Cold Box Score</span>
            <Info size={12} color="#94A3B8" style={{ marginLeft: '4px' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1E293B', marginTop: '2px' }}>
            {device.coldBoxScore}%
          </div>
          <div style={{ fontSize: '13px', color: '#059669', fontWeight: '700' }}>
            {device.scoreLabel}
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div style={{ width: '65px', height: '65px', position: 'relative' }}>
          <svg width="65" height="65" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeDasharray={`${device.coldBoxScore}, 100`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Score Modal */}
      <ScoreDetailModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        score={device.coldBoxScore}
        scoreLabel={device.scoreLabel}
      />
    </div>
  );
}
