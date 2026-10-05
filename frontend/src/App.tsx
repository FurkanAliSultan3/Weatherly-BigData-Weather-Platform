import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import OfficerLayout from './layouts/OfficerLayout';
import PublicHome from './pages/public/PublicHome';
import ReportingPage from './pages/public/ReportingPage';
import AlertsPage from './pages/public/AlertsPage';
import BroadcastSafeZones from './pages/public/BroadcastSafeZones';
import AboutPage from './pages/public/AboutPage';
import IntelligenceConsole from './pages/officer/IntelligenceConsole';
import VerificationCenter from './pages/officer/VerificationCenter';
import ReportExplorer from './pages/officer/ReportExplorer';
import AnalyticsDashboard from './pages/officer/AnalyticsDashboard';
import AuditLog from './pages/officer/AuditLog';
import LiveIntelligenceMap from './pages/officer/LiveIntelligenceMap';
import DataSources from './pages/officer/DataSources';
import BroadcastManagement from './pages/officer/BroadcastManagement';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<PublicHome />} />
        <Route path="report" element={<ReportingPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="safe-zones" element={<BroadcastSafeZones />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="officer/login" element={<Navigate to="/officer/console" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="/officer" element={<OfficerLayout />}>
        <Route path="console" element={<IntelligenceConsole />} />
        <Route path="map" element={<LiveIntelligenceMap />} />
        <Route path="verification" element={<VerificationCenter />} />
        <Route path="verify" element={<VerificationCenter />} />
        <Route path="explorer" element={<ReportExplorer />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="sources" element={<DataSources />} />
        <Route path="broadcast" element={<BroadcastManagement />} />
        <Route path="audit" element={<AuditLog />} />
        <Route index element={<Navigate to="console" replace />} />
        <Route path="*" element={<Navigate to="console" replace />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
