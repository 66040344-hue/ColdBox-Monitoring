import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditDeviceModal({ isOpen, onClose, device, onSave }) {
  const [name, setName] = useState(device?.name || '');
  const [location, setLocation] = useState(device?.location || '');
  const [notes, setNotes] = useState(device?.notes || '');

  useEffect(() => {
    if (device) {
      setName(device.name);
      setLocation(device.location);
      setNotes(device.notes);
    }
  }, [device, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(device.id, { name, location, notes });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แก้ไขรายละเอียดอุปกรณ์">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            ชื่อกล่องเก็บความเย็น
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              color: '#1E293B',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            ตำแหน่งที่ตั้ง
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              color: '#1E293B',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            หมายเหตุ
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              color: '#1E293B',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
          บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </Modal>
  );
}
