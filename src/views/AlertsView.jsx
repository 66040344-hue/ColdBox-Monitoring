import React, { useState } from 'react';
import { SlidersHorizontal, AlertTriangle, AlertCircle, CheckCircle, Info, CheckCheck } from 'lucide-react';
import { initialAlerts } from '../services/mockData';

export default function AlertsView() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [alerts, setAlerts] = useState(initialAlerts.map(a => ({ ...a, isRead: false })));
  const [selectedAlertDetail, setSelectedAlertDetail] = useState(null);

  const filteredAlerts = activeCategory === 'all'
    ? alerts
    : alerts.filter(a => a.category === activeCategory);

  const todayAlerts = filteredAlerts.filter(a => a.dateGroup === 'วันนี้');
  const yesterdayAlerts = filteredAlerts.filter(a => a.dateGroup === 'เมื่อวาน');

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const handleItemClick = (item) => {
    setSelectedAlertDetail(item);
    setAlerts(prev => prev.map(a => a.id === item.id ? { ...a, isRead: true } : a));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={18} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={18} color="#F59E0B" />;
      case 'normal':
        return <CheckCircle size={18} color="#10B981" />;
      case 'info':
      default:
        return <Info size={18} color="#3B82F6" />;
    }
  };

  const getStatusBadge = (type, text) => {
    switch (type) {
      case 'danger':
        return <span className="status-pill danger">{text}</span>;
      case 'warning':
        return <span className="status-pill warning">{text}</span>;
      case 'normal':
        return <span className="status-pill normal">{text}</span>;
      case 'info':
      default:
        return <span className="status-pill info">{text}</span>;
    }
  };

  const renderAlertItem = (item) => (
    <div 
      key={item.id}
      onClick={() => handleItemClick(item)}
      style={{
        background: item.isRead ? '#FFFFFF' : '#F0F7FF',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '8px',
        border: item.isRead ? '1px solid #E2E8F0' : '1px solid #93C5FD',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {!item.isRead && (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#1E6BFF'
        }} />
      )}

      <div style={{
        padding: '8px',
        borderRadius: '50%',
        background: item.type === 'danger' ? '#FEE2E2' : item.type === 'warning' ? '#FEF3C7' : item.type === 'normal' ? '#D1FAE5' : '#DBEAFE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {getAlertIcon(item.type)}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.time}</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              {item.device}
            </div>
          </div>
          <div>
            {getStatusBadge(item.type, item.statusText)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>การแจ้งเตือน</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#3B82F6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="ทำให้อ่านแล้วทั้งหมด"
          >
            <CheckCheck size={14} /> อ่านหมดแล้ว
          </button>
        </div>
      </div>

      {/* 1. Category Tabs */}
      <div className="tabs-container">
        {[
          { id: 'all', label: 'ทั้งหมด' },
          { id: 'temp', label: 'อุณหภูมิ' },
          { id: 'humi', label: 'ความชื้น' },
          { id: 'system', label: 'ระบบ' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2. Today Timeline Group */}
      {todayAlerts.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
            วันนี้
          </div>
          {todayAlerts.map(renderAlertItem)}
        </div>
      )}

      {/* 3. Yesterday Timeline Group */}
      {yesterdayAlerts.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
            เมื่อวาน
          </div>
          {yesterdayAlerts.map(renderAlertItem)}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlertDetail && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 110
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              {getAlertIcon(selectedAlertDetail.type)}
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>{selectedAlertDetail.title}</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
              อุปกรณ์: <strong>{selectedAlertDetail.device}</strong><br/>
              เวลาที่เกิดเหตุการณ์: <strong>{selectedAlertDetail.dateGroup} เวลา {selectedAlertDetail.time} น.</strong>
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#334155', marginBottom: '16px' }}>
              💡 <strong>คำแนะนำ:</strong> กรุณาตรวจสอบการปิดประตูของกล่องเก็บความเย็น และตรวจสอบระบบทำความเย็นหากอุณหภูมิยังคงสูงเกินเกณฑ์
            </div>
            <button
              onClick={() => setSelectedAlertDetail(null)}
              className="btn-primary"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
