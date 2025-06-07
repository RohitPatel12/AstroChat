import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/HomePage';
import Horoscopes from './components/Horoscope';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Routes>
      {/* Redirect root path to /login */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
 
      <Route path='/register' element={<RegisterPage />} />

      <Route
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
    <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
