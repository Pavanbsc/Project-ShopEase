import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAddProduct from './pages/AdminAddProduct';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import AdminProducts from './pages/AdminProducts';
import AdminInventory from './pages/AdminInventory';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import AdminOrders from './pages/AdminOrders';
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
  const location = useLocation();

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
      <Route path="/category/:categorySlug" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/category/:categorySlug/:subcategorySlug" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/products/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/orders/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin-users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin-products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin-products/add" element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
      <Route path="/admin-orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin-inventory" element={<ProtectedRoute><AdminInventory /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {location.pathname === '/home' ? <Chatbot /> : null}
    </>
  );
}

export default App;
