import React from 'react';
import { Home, LineChart, BarChart2, Bell, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, onChangeTab, unreadAlertsCount }) {
  const navItems = [
    { id: 'main', label: 'หน้าหลัก', icon: Home },
    { id: 'history', label: 'ประวัติ', icon: LineChart },
    { id: 'analytics', label: 'วิเคราะห์', icon: BarChart2 },
    { id: 'alerts', label: 'แจ้งเตือน', icon: Bell, badge: unreadAlertsCount },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} color={isActive ? '#1E6BFF' : '#64748B'} />
              {item.badge > 0 && (
                <span className="nav-badge" style={{ top: '-4px', right: '-8px' }}>
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
