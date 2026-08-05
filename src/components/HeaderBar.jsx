import React from 'react';
import { Bell, Wifi, Activity, CheckCircle, RefreshCw } from 'lucide-react';

export default function HeaderBar({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice, 
  alertCount, 
  onOpenAlerts,
  isLiveSimulating,
  onToggleLiveSim,
  onOpenDeviceDetail 
}) {
  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  return (
    <header className="header-bar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select 
            value={selectedDeviceId} 
            onChange={(e) => onSelectDevice(e.target.value)}
            className="device-select"
          >
            {devices.map(dev => (
              <option key={dev.id} value={dev.id}>
                {dev.name}
              </option>
            ))}
          </select>
          <button 
            onClick={onOpenDeviceDetail}
            title="ดูรายละเอียดอุปกรณ์"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              color: '#3B82F6',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Activity size={12} /> ข้อมูล
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
          <span>อัปเดตล่าสุด {currentDevice.lastUpdate}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: currentDevice.status === 'online' ? '#10B981' : '#EF4444', fontWeight: 600 }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: currentDevice.status === 'online' ? '#10B981' : '#EF4444',
              display: 'inline-block',
              boxShadow: currentDevice.status === 'online' ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none'
            }}></span>
            {currentDevice.statusText}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Live simulation toggle button */}
        <button
          onClick={() => onToggleLiveSim(!isLiveSimulating)}
          title={isLiveSimulating ? "ปิดจำลองข้อมูลสด" : "เปิดจำลองข้อมูลสด (Real-time Live Sim)"}
          style={{
            background: isLiveSimulating ? '#D1FAE5' : '#F1F5F9',
            color: isLiveSimulating ? '#059669' : '#64748B',
            border: 'none',
            borderRadius: '20px',
            padding: '5px 10px',
            fontSize: '10px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={11} className={isLiveSimulating ? "animate-spin" : ""} />
          {isLiveSimulating ? "Live On" : "Live Sim"}
        </button>

        {/* Bell Alert Icon */}
        <button 
          onClick={onOpenAlerts}
          style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} color="#334155" />
          {alertCount > 0 && (
            <span className="nav-badge" style={{ top: '2px', right: '2px' }}>
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
