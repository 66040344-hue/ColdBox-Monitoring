import React, { useState } from 'react';
import { ChevronLeft, Download, CheckCircle2, FileText, CheckSquare, Square } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function ExportView({ device, onBack }) {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [selectedData, setSelectedData] = useState({
    temp: true,
    humi: true,
    dailySummary: true,
    alerts: true
  });
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const toggleCheckbox = (key) => {
    setSelectedData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    // Generate real CSV download
    telemetryService.generateCSV(device.id, {
      period: selectedPeriod,
      format: selectedFormat,
      dataFields: selectedData
    });

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  return (
    <div>
      {/* Back & Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button 
          onClick={onBack}
          style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#1E293B' }}
        >
          <ChevronLeft size={22} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>ส่งออกข้อมูล</h2>
      </div>

      {/* Download Toast Notification */}
      {downloadSuccess && (
        <div style={{
          background: '#D1FAE5',
          color: '#059669',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          ดาวน์โหลดไฟล์เรียบร้อยแล้ว!
        </div>
      )}

      {/* 1. Time Period Selector */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
        ช่วงเวลา
      </div>
      <div className="card" style={{ padding: '8px 16px', marginBottom: '16px' }}>
        {[
          { id: 'today', label: 'วันนี้', sub: '6 พ.ค. 2567' },
          { id: 'yesterday', label: 'เมื่อวาน', sub: '5 พ.ค. 2567' },
          { id: '7d', label: '7 วันที่ผ่านมา', sub: '30 เม.ย. - 6 พ.ค. 2567' },
          { id: '30d', label: '30 วันที่ผ่านมา', sub: '7 เม.ย. - 6 พ.ค. 2567' },
          { id: 'custom', label: 'กำหนดเอง', sub: 'เลือกช่วงเวลา' }
        ].map(item => {
          const isSelected = selectedPeriod === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedPeriod(item.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #F1F5F9',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: isSelected ? '600' : '400', color: '#1E293B' }}>
                {item.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{item.sub}</span>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: isSelected ? '5px solid #1E6BFF' : '2px solid #CBD5E1',
                  backgroundColor: 'white'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. File Format Selector */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
        รูปแบบไฟล์
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'csv', label: 'CSV' },
          { id: 'xlsx', label: 'Excel (XLSX)' },
          { id: 'pdf', label: 'PDF' }
        ].map(fmt => {
          const isSelected = selectedFormat === fmt.id;
          return (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              style={{
                border: isSelected ? '2px solid #1E6BFF' : '1px solid #E2E8F0',
                background: isSelected ? '#EBF2FF' : '#FFFFFF',
                color: isSelected ? '#1E6BFF' : '#64748B',
                fontWeight: isSelected ? '700' : '500',
                borderRadius: '10px',
                padding: '10px 0',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {fmt.label}
            </button>
          );
        })}
      </div>

      {/* 3. Data Content Checkboxes */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
        ข้อมูลที่ต้องการส่งออก
      </div>
      <div className="card" style={{ padding: '8px 16px', marginBottom: '20px' }}>
        {[
          { key: 'temp', label: 'ข้อมูลอุณหภูมิ' },
          { key: 'humi', label: 'ข้อมูลความชื้น' },
          { key: 'dailySummary', label: 'สรุปค่าเฉลี่ยรายวัน' },
          { key: 'alerts', label: 'เหตุการณ์แจ้งเตือน' }
        ].map(dataItem => {
          const isChecked = selectedData[dataItem.key];
          return (
            <div
              key={dataItem.key}
              onClick={() => toggleCheckbox(dataItem.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                borderBottom: '1px solid #F1F5F9',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#1E293B'
              }}
            >
              {isChecked ? (
                <div style={{ width: '18px', height: '18px', borderRadius: '4px', backgroundColor: '#1E6BFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </div>
              ) : (
                <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid #CBD5E1' }} />
              )}
              <span>{dataItem.label}</span>
            </div>
          );
        })}
      </div>

      {/* 4. Action Export Button */}
      <button className="btn-primary" onClick={handleExport}>
        <Download size={18} />
        ส่งออกข้อมูล
      </button>
    </div>
  );
}
