import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/HomePage';
import Horoscopes from './components/Horoscope';

function App() {
  return (
    <Routes>
      {/* Redirect root path to /login */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
 
      <Route path='/register' element={<RegisterPage />} />

      // <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
        }
        />
      
        

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
