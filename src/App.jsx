import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar';
import BottomNav from './components/BottomNav';
import DashboardView from './views/DashboardView';
import HistoryView from './views/HistoryView';
import AnalyticsView from './views/AnalyticsView';
import AlertsView from './views/AlertsView';
import DeviceDetailView from './views/DeviceDetailView';
import SettingsView from './views/SettingsView';
import ExportView from './views/ExportView';

import { telemetryService } from './services/telemetryService';
import { initialAlerts, telemetry24h } from './services/mockData';

export default function App() {
  const [devices, setDevices] = useState(telemetryService.getDevices());
  const [selectedDeviceId, setSelectedDeviceId] = useState('box-1');
  const [activeTab, setActiveTab] = useState('main'); // main, history, analytics, alerts, settings, deviceDetail, export
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);

  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  // Subscribe to live simulation updates
  useEffect(() => {
    telemetryService.toggleLiveSimulation(isLiveSimulating, (updatedDevices) => {
      setDevices([...updatedDevices]);
    });
    return () => telemetryService.toggleLiveSimulation(false);
  }, [isLiveSimulating]);

  const handleUpdateSettings = (deviceId, newSettings) => {
    const updated = telemetryService.updateDeviceSettings(deviceId, newSettings);
    setDevices([...telemetryService.getDevices()]);
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'main':
        return (
          <DashboardView
            device={currentDevice}
            telemetry24h={telemetry24h}
            onOpenDeviceDetail={() => setActiveTab('deviceDetail')}
            onNavigateTab={setActiveTab}
          />
        );
      case 'history':
        return (
          <HistoryView
            device={currentDevice}
            telemetry24h={telemetry24h}
            onOpenExport={() => setActiveTab('export')}
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return (
          <SettingsView
            device={currentDevice}
            onUpdateSettings={handleUpdateSettings}
            onOpenExport={() => setActiveTab('export')}
          />
        );
      case 'deviceDetail':
        return (
          <DeviceDetailView
            device={currentDevice}
            onBack={() => setActiveTab('main')}
          />
        );
      case 'export':
        return (
          <ExportView
            device={currentDevice}
            onBack={() => setActiveTab('history')}
          />
        );
      default:
        return (
          <DashboardView
            device={currentDevice}
            telemetry24h={telemetry24h}
            onOpenDeviceDetail={() => setActiveTab('deviceDetail')}
            onNavigateTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Top Header Bar (hide only on subviews like export & device detail if desired) */}
      {activeTab !== 'deviceDetail' && activeTab !== 'export' && (
        <HeaderBar
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={setSelectedDeviceId}
          alertCount={3}
          onOpenAlerts={() => setActiveTab('alerts')}
          isLiveSimulating={isLiveSimulating}
          onToggleLiveSim={setIsLiveSimulating}
          onOpenDeviceDetail={() => setActiveTab('deviceDetail')}
        />
      )}

      {/* Main View Area */}
      <main className="main-content">
        {renderCurrentView()}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unreadAlertsCount={3}
      />
    </div>
  );
}
