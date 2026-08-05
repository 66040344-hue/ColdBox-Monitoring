import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { heatmapData } from '../services/mockData';

export default function AnalyticsView() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedCell, setSelectedCell] = useState(null);

  // Dynamic datasets for daily, weekly, monthly
  const dailyData = [
    { date: "30 เม.ย.", temp: 23.8, humi: 62 },
    { date: "1 พ.ค.", temp: 24.5, humi: 65 },
    { date: "2 พ.ค.", temp: 23.2, humi: 60 },
    { date: "3 พ.ค.", temp: 24.5, humi: 65 },
    { date: "4 พ.ค.", temp: 23.0, humi: 58 },
    { date: "5 พ.ค.", temp: 24.8, humi: 70 },
    { date: "6 พ.ค.", temp: 24.2, humi: 64 }
  ];

  const weeklyData = [
    { date: "สัปดาห์ 15", temp: 23.5, humi: 61 },
    { date: "สัปดาห์ 16", temp: 24.1, humi: 64 },
    { date: "สัปดาห์ 17", temp: 23.9, humi: 63 },
    { date: "สัปดาห์ 18", temp: 24.4, humi: 66 }
  ];

  const monthlyData = [
    { date: "ม.ค.", temp: 22.8, humi: 59 },
    { date: "ก.พ.", temp: 23.4, humi: 62 },
    { date: "มี.ค.", temp: 24.1, humi: 65 },
    { date: "เม.ย.", temp: 24.8, humi: 67 },
    { date: "พ.ค.", temp: 24.2, humi: 64 }
  ];

  const chartData = activeTab === 'weekly' ? weeklyData : activeTab === 'monthly' ? monthlyData : dailyData;

  // Heatmap color generator
  const getHeatmapColor = (val) => {
    if (val <= 22) return '#93C5FD'; // Light blue
    if (val <= 23) return '#60A5FA'; // Medium blue
    if (val <= 24) return '#86EFAC'; // Light green
    if (val <= 25) return '#FDE047'; // Yellow
    if (val <= 26) return '#F97316'; // Orange
    return '#EF4444';                // Red
  };

  return (
    <div>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>การวิเคราะห์ข้อมูล</h2>
        <Calendar size={20} color="#1E6BFF" />
      </div>

      {/* 1. Time Aggregation Tabs */}
      <div className="tabs-container">
        {[
          { id: 'daily', label: 'รายวัน' },
          { id: 'weekly', label: 'รายสัปดาห์' },
          { id: 'monthly', label: 'รายเดือน' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 2. Date Range Selector */}
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
        <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1E6BFF' }}>
          <ChevronLeft size={18} />
        </button>
        <span>
          {activeTab === 'daily' ? '30 เม.ย. - 6 พ.ค. 2567' : activeTab === 'weekly' ? 'เมษายน - พฤษภาคม 2567' : 'ปี 2567'}
        </span>
        <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1E6BFF' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 3. Average Temperature Bar Chart */}
      <div className="card">
        <div className="card-title">
          <span>อุณหภูมิเฉลี่ย ({activeTab === 'weekly' ? 'รายสัปดาห์' : activeTab === 'monthly' ? 'รายเดือน' : 'รายวัน'}) (°C)</span>
        </div>
        <div style={{ width: '100%', height: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[20, 28]} tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val) => [`${val} °C`, 'อุณหภูมิเฉลี่ย']} />
              <Bar dataKey="temp" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Average Humidity Bar Chart */}
      <div className="card">
        <div className="card-title">
          <span>ความชื้นเฉลี่ย ({activeTab === 'weekly' ? 'รายสัปดาห์' : activeTab === 'monthly' ? 'รายเดือน' : 'รายวัน'}) (%RH)</span>
        </div>
        <div style={{ width: '100%', height: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val) => [`${val} %RH`, 'ความชื้นเฉลี่ย']} />
              <Bar dataKey="humi" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Heat Map (อุณหภูมิ) */}
      <div className="card">
        <div className="card-title">
          <span>Heat Map (อุณหภูมิ)</span>
        </div>

        <div className="heatmap-grid">
          {/* Day Label & Hourly cells */}
          {heatmapData.map((row, rIdx) => (
            <React.Fragment key={rIdx}>
              <div style={{ fontWeight: '600', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                {row.day}
              </div>
              {row.values.map((val, cIdx) => (
                <div
                  key={cIdx}
                  className="heatmap-cell"
                  style={{ backgroundColor: getHeatmapColor(val), cursor: 'pointer' }}
                  onClick={() => setSelectedCell({ day: row.day, hour: cIdx * 2, val })}
                  title={`วัน${row.day} เวลา ${cIdx * 2}:00 น. -> ${val} °C`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Hour markers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', fontSize: '9px', color: '#94A3B8', marginTop: '6px' }}>
          <span>00</span>
          <span>04</span>
          <span>08</span>
          <span>12</span>
          <span>16</span>
          <span>20</span>
          <span>24</span>
        </div>

        {/* Heatmap Legend */}
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #93C5FD, #86EFAC, #FDE047, #F97316, #EF4444)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
            <span>ต่ำเกินไป</span>
            <span>สูงเกินไป</span>
          </div>
        </div>
      </div>

      {/* Heatmap Cell Detail Dialog */}
      {selectedCell && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 110
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>รายละเอียดอุณหภูมิในจุดนี้</h4>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1E6BFF', margin: '10px 0' }}>
              {selectedCell.val} °C
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              ช่วงวัน <strong>{selectedCell.day}</strong> เวลาประมาณ <strong>{selectedCell.hour}:00 น.</strong>
            </p>
            <button className="btn-primary" onClick={() => setSelectedCell(null)}>
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
