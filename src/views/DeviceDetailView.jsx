import React, { useState } from 'react';
import { ChevronLeft, Edit3, Battery, Wifi, CheckCircle2, RefreshCw, Box } from 'lucide-react';
import EditDeviceModal from '../components/EditDeviceModal';

export default function DeviceDetailView({ device, onBack, onUpdateDevice }) {
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartMessage, setRestartMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const handleRestart = () => {
    setIsRestarting(true);
    setRestartMessage('กำลังส่งสัญญาณรีสตาร์ทไปยังอุปกรณ์...');
    setTimeout(() => {
      setRestartMessage('รีสตาร์ทอุปกรณ์เรียบร้อยแล้ว!');
      setTimeout(() => {
        setIsRestarting(false);
        setRestartMessage('');
      }, 2000);
    }, 2500);
  };

  return (
    <div>
      {/* Back & Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button 
          onClick={onBack}
          style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#1E293B' }}
        >
          <ChevronLeft size={22} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>รายละเอียดอุปกรณ์</h2>
        <button 
          onClick={() => setShowEditModal(true)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}
          title="แก้ไขรายละเอียด"
        >
          <Edit3 size={18} />
        </button>
      </div>

      {/* 1. Device Illustration & Status Header Card */}
      <div className="card" style={{ textAlign: 'center', padding: '20px 16px', background: 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)' }}>
        {/* Cold Box Illustration Container */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          margin: '0 auto 12px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
        }}>
          <Box size={48} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>
          {device.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', marginTop: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: device.status === 'online' ? '#10B981' : '#EF4444' }}></span>
          <span style={{ color: device.status === 'online' ? '#10B981' : '#EF4444', fontWeight: 600 }}>{device.statusText}</span>
          <span style={{ color: '#94A3B8' }}>• อัปเดตล่าสุด {device.lastUpdate}</span>
        </div>
      </div>

      {/* 2. Device System Diagnostics Card */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>สถานะการทำงาน</span>
            <span style={{ fontWeight: 600, color: '#10B981' }}>{device.tempSensorStatus}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Battery size={16} color="#10B981" /> แบตเตอรี่
            </span>
            <span style={{ fontWeight: 600, color: '#1E293B' }}>{device.battery}%</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={16} color="#10B981" /> สัญญาณ Wi-Fi
            </span>
            <span style={{ fontWeight: 600, color: '#10B981' }}>{device.wifiSignal}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>เซนเซอร์อุณหภูมิ</span>
            <span style={{ fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ปกติ <CheckCircle2 size={16} color="#10B981" />
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>เซนเซอร์ความชื้น</span>
            <span style={{ fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ปกติ <CheckCircle2 size={16} color="#10B981" />
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>อุปกรณ์บันทึกข้อมูล</span>
            <span style={{ fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ปกติ <CheckCircle2 size={16} color="#10B981" />
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>เฟิร์มแวร์</span>
            <span style={{ fontWeight: 500, color: '#64748B' }}>{device.firmware}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>ตำแหน่งที่ตั้ง</span>
            <span style={{ fontWeight: 600, color: '#1E293B' }}>{device.location}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>หมายเหตุ</span>
            <span style={{ fontWeight: 500, color: '#94A3B8' }}>{device.notes}</span>
          </div>

        </div>
      </div>

      {/* Restart Toast Message */}
      {restartMessage && (
        <div style={{
          background: '#FEF3C7',
          color: '#D97706',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          {restartMessage}
        </div>
      )}

      {/* 3. Restart Device Button */}
      <button 
        className="btn-outline-danger"
        onClick={handleRestart}
        disabled={isRestarting}
      >
        <RefreshCw size={16} className={isRestarting ? "animate-spin" : ""} />
        {isRestarting ? 'กำลังรีสตาร์ท...' : 'รีสตาร์ทอุปกรณ์'}
      </button>

      {/* Edit Device Modal */}
      {showEditModal && (
        <EditDeviceModal
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          device={device}
          onSave={onUpdateDevice}
        />
      )}
    </div>
  );
}
