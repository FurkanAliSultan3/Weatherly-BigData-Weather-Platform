import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import OfficerLayout from './layouts/OfficerLayout';

// Lazy load pages to avoid massive initial bundle
const PublicHome = React.lazy(() => import('./pages/public/PublicHome'));
const ReportingPage = React.lazy(() => import('./pages/public/ReportingPage'));
const AlertsPage = React.lazy(() => import('./pages/public/AlertsPage'));
const AboutPage = React.lazy(() => import('./pages/public/AboutPage'));
const IntelligenceConsole = React.lazy(() => import('./pages/officer/IntelligenceConsole'));
const VerificationCenter = React.lazy(() => import('./pages/officer/VerificationCenter'));
const ReportExplorer = React.lazy(() => import('./pages/officer/ReportExplorer'));
const AnalyticsDashboard = React.lazy(() => import('./pages/officer/AnalyticsDashboard'));
const AuditLog = React.lazy(() => import('./pages/officer/AuditLog'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 font-medium">Loading Intelligence...</span>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="report" element={<ReportingPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Officer Routes */}
          <Route path="/officer" element={<OfficerLayout />}>
            <Route path="console" element={<IntelligenceConsole />} />
            <Route path="verify" element={<VerificationCenter />} />
            <Route path="explorer" element={<ReportExplorer />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="audit" element={<AuditLog />} />
            <Route index element={<Navigate to="console" replace />} />
            <Route path="*" element={<Navigate to="console" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
