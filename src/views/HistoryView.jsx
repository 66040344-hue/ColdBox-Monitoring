import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function HistoryView({ device, telemetry24h, onOpenExport }) {
  const [activeRangeTab, setActiveRangeTab] = useState('today');
  const [currentDateOffset, setCurrentDateOffset] = useState(0); // 0 = today, -1 = yesterday, etc.
  const [customDate, setCustomDate] = useState('2026-08-06');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isFahrenheit = device.settings?.unit?.includes('°F');
  const tempSymbol = isFahrenheit ? '°F' : '°C';

  const formatTemp = (valC) => {
    if (isFahrenheit) return (valC * 9 / 5 + 32).toFixed(1);
    return valC;
  };

  // Generate dynamic date text based on offset
  const getDateLabel = () => {
    const d = new Date();
    d.setDate(d.getDate() + currentDateOffset);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Dynamically offset data slightly when switching dates
  const dynamicTelemetry = telemetry24h.map((item, idx) => {
    const factor = (currentDateOffset * 0.4);
    const baseTemp = +(item.temp + factor).toFixed(1);
    return {
      ...item,
      tempDisplay: formatTemp(baseTemp)
    };
  });

  const baseStats = device.todayStats;

  return (
    <div>
      {/* View Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>ประวัติข้อมูล</h2>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{ background: 'none', border: 'none', color: '#1E6BFF', cursor: 'pointer' }}
            title="เลือกวันที่"
          >
            <Calendar size={20} />
          </button>
          {showDatePicker && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setShowDatePicker(false);
                setActiveRangeTab('custom');
              }}
              style={{
                position: 'absolute',
                top: '28px',
                right: 0,
                zIndex: 20,
                padding: '6px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          )}
        </div>
      </div>

      {/* 1. Filter Range Tabs */}
      <div className="tabs-container">
        {[
          { id: 'today', label: 'วันนี้', offset: 0 },
          { id: 'yesterday', label: 'เมื่อวาน', offset: -1 },
          { id: '7d', label: '7 วัน', offset: 0 },
          { id: '30d', label: '30 วัน', offset: 0 },
          { id: 'custom', label: 'กำหนดเอง', offset: 0 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveRangeTab(tab.id);
              if (tab.id === 'today') setCurrentDateOffset(0);
              if (tab.id === 'yesterday') setCurrentDateOffset(-1);
            }}
            className={`tab-btn ${activeRangeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Date Navigation Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '10px 14px',
        border: '1px solid #E2E8F0',
        marginBottom: '16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#1E293B'
      }}>
        <button 
          onClick={() => setCurrentDateOffset(prev => prev - 1)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1E6BFF' }}
        >
          <ChevronLeft size={18} />
        </button>
        <span>{activeRangeTab === 'custom' ? customDate : getDateLabel()}</span>
        <button 
          onClick={() => setCurrentDateOffset(prev => Math.min(0, prev + 1))}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: currentDateOffset === 0 ? '#CBD5E1' : '#1E6BFF' }}
          disabled={currentDateOffset === 0}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 3. Temperature History Graph Card */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: '6px' }}>
          <span>อุณหภูมิ ({tempSymbol})</span>
        </div>
        
        {/* Temp Stats Row */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
          <div>เฉลี่ย <strong style={{ color: '#1E293B' }}>{formatTemp(baseStats.avgTemp)} {tempSymbol}</strong></div>
          <div>สูงสุด <strong style={{ color: '#EF4444' }}>{formatTemp(baseStats.maxTemp)} {tempSymbol}</strong></div>
          <div>ต่ำสุด <strong style={{ color: '#2563EB' }}>{formatTemp(baseStats.minTemp)} {tempSymbol}</strong></div>
        </div>

        {/* Temp Area Chart */}
        <div style={{ width: '100%', height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicTelemetry} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[10, 40]} tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val) => [`${val} ${tempSymbol}`, 'อุณหภูมิ']} />
              <Area type="monotone" dataKey="tempDisplay" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Humidity History Graph Card */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: '6px' }}>
          <span>ความชื้น (%RH)</span>
        </div>
        
        {/* Humidity Stats Row */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
          <div>เฉลี่ย <strong style={{ color: '#1E293B' }}>{baseStats.avgHumi}%</strong></div>
          <div>สูงสุด <strong style={{ color: '#2563EB' }}>{baseStats.maxHumi}%</strong></div>
          <div>ต่ำสุด <strong style={{ color: '#64748B' }}>{baseStats.minHumi}%</strong></div>
        </div>

        {/* Humidity Area Chart */}
        <div style={{ width: '100%', height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicTelemetry} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="humiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val) => [`${val} %RH`, 'ความชื้น']} />
              <Area type="monotone" dataKey="humi" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#humiGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Daily Summary Card */}
      <div className="card">
        <div className="card-title">สรุปข้อมูลประจำวัน</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>อุณหภูมิเฉลี่ย</span>
            <strong style={{ color: '#1E293B' }}>{formatTemp(baseStats.avgTemp)} {tempSymbol}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>ความชื้นเฉลี่ย</span>
            <strong style={{ color: '#1E293B' }}>{baseStats.avgHumi} %RH</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>เวลาในช่วงเหมาะสม</span>
            <strong style={{ color: '#059669' }}>{baseStats.optimalTime}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>เหตุการณ์แจ้งเตือน</span>
            <strong style={{ color: '#EF4444' }}>{baseStats.alertCount} ครั้ง</strong>
          </div>
        </div>
      </div>

      {/* 6. Export Button */}
      <button className="btn-primary" onClick={onOpenExport}>
        <Download size={18} />
        ส่งออกข้อมูล
      </button>
    </div>
  );
}
