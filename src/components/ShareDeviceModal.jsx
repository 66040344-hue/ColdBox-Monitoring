import React, { useState } from 'react';
import Modal from './Modal';
import { Copy, Check, QrCode, Mail, Share2 } from 'lucide-react';

export default function ShareDeviceModal({ isOpen, onClose, deviceName }) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const shareUrl = `https://smartfarm.app/coldbox/share/${encodeURIComponent(deviceName || 'box-1')}?key=xyz890`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteEmail('');
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แชร์การเข้าถึงอุปกรณ์">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Share Link Copy */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            ลิงก์แชร์ดูข้อมูลเรียลไทม์
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                color: '#64748B',
                background: '#F8FAFC'
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#10B981' : '#1E6BFF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
          </div>
        </div>

        {/* QR Code Illustration */}
        <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
          <div style={{
            width: '110px',
            height: '110px',
            background: 'white',
            border: '2px solid #E2E8F0',
            borderRadius: '8px',
            margin: '0 auto 8px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <QrCode size={80} color="#1E293B" />
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>สแกน QR Code เพื่อเข้าถึงบนสมาร์ตโฟนเครื่องอื่น</span>
        </div>

        {/* Email invite form */}
        <form onSubmit={handleSendInvite}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            เชิญสมาชิกร่วมดูแล (อีเมล)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="example@farm.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#1E293B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {inviteSent ? 'ส่งแล้ว!' : 'ส่งคำเชิญ'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
