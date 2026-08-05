import React, { useState } from 'react';
import { ChevronRight, Share2, Download, Trash2 } from 'lucide-react';
import EditSettingModal from '../components/EditSettingModal';
import EditDeviceModal from '../components/EditDeviceModal';
import ShareDeviceModal from '../components/ShareDeviceModal';

export default function SettingsView({ device, onUpdateSettings, onOpenExport }) {
  const [activeModal, setActiveModal] = useState(null); // 'highTempAlert', 'unit', 'editDevice', 'share', 'delete', etc.
  const [doorAlert, setDoorAlert] = useState(device.settings.doorAlert);
  const [saveToast, setSaveToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleToggleDoorAlert = () => {
    const nextVal = !doorAlert;
    setDoorAlert(nextVal);
    onUpdateSettings(device.id, { ...device.settings, doorAlert: nextVal });
    triggerToast('อัปเดตการตั้งค่าการแจ้งเตือนประตูแล้ว');
  };

  const handleSaveSetting = (settingKey, value) => {
    const updated = { ...device.settings, [settingKey]: value };
    onUpdateSettings(device.id, { settings: updated });
    triggerToast('บันทึกการตั้งค่าเรียบร้อยแล้ว');
  };

  const handleSaveDeviceDetails = (deviceId, newDetails) => {
    onUpdateSettings(deviceId, newDetails);
    triggerToast('อัปเดตข้อมูลอุปกรณ์เรียบร้อยแล้ว');
  };

  const handleDeleteDevice = () => {
    setDeleteConfirm(false);
    triggerToast('ลบอุปกรณ์เรียบร้อยแล้ว (กำลังกลับสู่หน้าหลัก)');
  };

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 2500);
  };

  const s = device.settings;

  return (
    <div>
      {/* View Title */}
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>ตั้งค่า</h2>

      {saveToast && (
        <div style={{
          background: '#D1FAE5',
          color: '#059669',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '14px',
          textAlign: 'center',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)'
        }}>
          {saveToast}
        </div>
      )}

      {/* 1. General Section */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
        ทั่วไป
      </div>
      <div className="card" style={{ padding: '4px 16px' }}>
        <div 
          onClick={() => setActiveModal('editDevice')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>ชื่ออุปกรณ์</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{device.name}</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => setActiveModal('unit')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>หน่วยวัด</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{s.unit}</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => setActiveModal('updateInterval')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>ช่วงเวลาการอัปเดตข้อมูล</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{s.updateInterval}</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* 2. Notifications & Thresholds Section */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
        การแจ้งเตือน
      </div>
      <div className="card" style={{ padding: '4px 16px' }}>
        <div 
          onClick={() => setActiveModal('highTempAlert')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>อุณหภูมิสูงเกิน</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{s.highTempAlert} °C</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => setActiveModal('lowTempAlert')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>อุณหภูมิต่ำเกิน</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{s.lowTempAlert} °C</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => setActiveModal('highHumiAlert')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>ความชื้นสูงเกิน</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{s.highHumiAlert} %RH</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => setActiveModal('lowHumiAlert')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B' }}>ความชื้นต่ำเกิน</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <span>{s.lowHumiAlert} %RH</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <span style={{ fontSize: '13px', color: '#1E293B' }}>การแจ้งเตือนเมื่อเปิดประตู</span>
          <div 
            onClick={handleToggleDoorAlert}
            style={{
              width: '44px',
              height: '24px',
              backgroundColor: doorAlert ? '#1E6BFF' : '#CBD5E1',
              borderRadius: '12px',
              padding: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: doorAlert ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
      </div>

      {/* 3. Other Settings Section */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
        อื่นๆ
      </div>
      <div className="card" style={{ padding: '4px 16px' }}>
        <div 
          onClick={() => setActiveModal('share')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={16} color="#64748B" /> แชร์อุปกรณ์
          </span>
          <ChevronRight size={16} color="#64748B" />
        </div>

        <div 
          onClick={onOpenExport}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} color="#64748B" /> ส่งออกข้อมูล
          </span>
          <ChevronRight size={16} color="#64748B" />
        </div>

        <div 
          onClick={() => setDeleteConfirm(true)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '13px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} color="#EF4444" /> ลบอุปกรณ์
          </span>
          <ChevronRight size={16} color="#EF4444" />
        </div>
      </div>

      {/* Dynamic Settings Edit Modal */}
      {['highTempAlert', 'lowTempAlert', 'highHumiAlert', 'lowHumiAlert', 'unit', 'updateInterval'].includes(activeModal) && (
        <EditSettingModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          settingType={activeModal}
          initialValue={s[activeModal]}
          onSave={handleSaveSetting}
        />
      )}

      {/* Edit Device Modal */}
      {activeModal === 'editDevice' && (
        <EditDeviceModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          device={device}
          onSave={handleSaveDeviceDetails}
        />
      )}

      {/* Share Device Modal */}
      {activeModal === 'share' && (
        <ShareDeviceModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          deviceName={device.name}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 110
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>ยืนยันการลบอุปกรณ์</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', marginBottom: '20px' }}>
              คุณแน่ใจหรือไม่ว่าต้องการลบ "{device.name}" ออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setDeleteConfirm(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', color: '#64748B', fontWeight: 600, cursor: 'pointer' }}
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleDeleteDevice}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                ลบอุปกรณ์
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
