import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditSettingModal({ isOpen, onClose, settingType, initialValue, onSave }) {
  const [val, setVal] = useState(initialValue);

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue, isOpen]);

  const getTitle = () => {
    switch (settingType) {
      case 'highTempAlert': return 'ตั้งค่าอุณหภูมิสูงเกิน';
      case 'lowTempAlert': return 'ตั้งค่าอุณหภูมิต่ำเกิน';
      case 'highHumiAlert': return 'ตั้งค่าความชื้นสูงเกิน';
      case 'lowHumiAlert': return 'ตั้งค่าความชื้นต่ำเกิน';
      case 'unit': return 'เลือกหน่วยวัด';
      case 'updateInterval': return 'เลือกรอบการอัปเดตข้อมูล';
      default: return 'แก้ไขการตั้งค่า';
    }
  };

  const handleSave = () => {
    onSave(settingType, val);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div style={{ padding: '8px 0' }}>
        {/* Numerical Threshold Inputs */}
        {['highTempAlert', 'lowTempAlert', 'highHumiAlert', 'lowHumiAlert'].includes(settingType) && (
          <div>
            <label style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              ระบุค่าขีดจำกัดสำหรับการแจ้งเตือน:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(Number(e.target.value))}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1E293B',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#64748B' }}>
                {settingType.includes('Temp') ? '°C' : '%RH'}
              </span>
            </div>
          </div>
        )}

        {/* Unit Picker */}
        {settingType === 'unit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {['°C / %RH', '°F / %RH'].map((unitOpt) => (
              <div
                key={unitOpt}
                onClick={() => setVal(unitOpt)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: val === unitOpt ? '2px solid #1E6BFF' : '1px solid #E2E8F0',
                  background: val === unitOpt ? '#EBF2FF' : '#FFFFFF',
                  color: val === unitOpt ? '#1E6BFF' : '#1E293B',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{unitOpt}</span>
                {val === unitOpt && <span style={{ color: '#1E6BFF' }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* Interval Picker */}
        {settingType === 'updateInterval' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {['30 วินาที', '1 นาที', '5 นาที', '15 นาที', '30 นาที'].map((intervalOpt) => (
              <div
                key={intervalOpt}
                onClick={() => setVal(intervalOpt)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: val === intervalOpt ? '2px solid #1E6BFF' : '1px solid #E2E8F0',
                  background: val === intervalOpt ? '#EBF2FF' : '#FFFFFF',
                  color: val === intervalOpt ? '#1E6BFF' : '#1E293B',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{intervalOpt}</span>
                {val === intervalOpt && <span style={{ color: '#1E6BFF' }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button className="btn-primary" onClick={handleSave}>
          บันทึกข้อมูล
        </button>
      </div>
    </Modal>
  );
}
