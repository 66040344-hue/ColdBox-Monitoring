import React from 'react';
import Modal from './Modal';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ScoreDetailModal({ isOpen, onClose, score, scoreLabel }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="รายละเอียด Cold Box Score">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ textAlign: 'center', background: '#ECFDF5', padding: '16px', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#059669' }}>{score}%</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#047857' }}>ระดับประสิทธิภาพ: {scoreLabel}</div>
          <div style={{ fontSize: '11px', color: '#065F46', marginTop: '4px' }}>คำนวณจากเสถียรภาพอุณหภูมิและความชื้นตลอด 24 ชั่วโมง</div>
        </div>

        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>องค์ประกอบการคำนวณคะแนน</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10B981" /> ควบคุมอุณหภูมิอยู่ในช่วงปลอดภัย (2-8°C)
            </span>
            <strong style={{ color: '#10B981' }}>98% (23.5 ชม.)</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10B981" /> ควบคุมความชื้นอยู่ในช่วงเหมาะสม (50-70%)
            </span>
            <strong style={{ color: '#10B981' }}>95% (22.8 ชม.)</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="#F59E0B" /> การเปิดประตูและความเสถียรของเซนเซอร์
            </span>
            <strong style={{ color: '#F59E0B' }}>หัก 4 คะแนน</strong>
          </div>
        </div>
      </div>
    </Modal>
  );
}
