import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import Alerts from './pages/Alerts';
import ReportForm from './pages/ReportForm';
import IntelligenceConsole from './pages/IntelligenceConsole';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/officer/*" element={<IntelligenceConsole />} />
      </Routes>
    </Router>
  );
}

export default App;
