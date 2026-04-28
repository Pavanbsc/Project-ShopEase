import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import AdminDashboard from './pages/AdminDashboard';
import CategoryPage from './pages/CategoryPage';
import ProductsPage from './pages/ProductsPage';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import { isUserLoggedIn, getLoggedInUser } from './services/api';
import Chatbot from './components/Chatbot';
import './styles/chatbot.css';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/login', { replace: true });
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return isUserLoggedIn() ? children : null;
}

function App() {
  const [loginState, setLoginState] = useState(isUserLoggedIn());

  useEffect(() => {
    // Check if user is already logged in on app mount
    const isLoggedIn = isUserLoggedIn();
    setLoginState(isLoggedIn);
    if (isLoggedIn) {
      const user = getLoggedInUser();
      console.log('User already logged in:', user?.email);
    }
  }, []);

  // Monitor auth state changes
  useEffect(() => {
    const handleStorageChange = () => {
      setLoginState(isUserLoggedIn());
    };

    const handleAuthStateChange = () => {
      setLoginState(isUserLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  return (
    <>
      <Routes>
      <Route path="/" element={loginState ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={loginState ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={loginState ? <Navigate to="/home" replace /> : <Register />} />
      <Route path="/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
      <Route path="/category/:id" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
