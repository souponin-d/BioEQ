import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { FormPage } from './pages/FormPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/form" element={<FormPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
