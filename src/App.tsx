import { Navigate, Route, Routes } from 'react-router-dom';
import { FormPage } from './pages/FormPage';
import { LandingPage } from './pages/LandingPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/forms" element={<FormPage />} />
    <Route path="/form" element={<Navigate to="/forms" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
