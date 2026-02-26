import { Navigate, Route, Routes } from 'react-router-dom';
import { FormPage } from './pages/FormPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudyPage } from './pages/StudyPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/forms" element={<FormPage />} />
    <Route path="/form" element={<Navigate to="/forms" replace />} />
    <Route path="/study/:id" element={<StudyPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
