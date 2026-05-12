
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import CategoryPage from './pages/CategoryPage';
import ProductsPage from './pages/ProductsPage';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';
import './styles/chatbot.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Inventory from './pages/admin/Inventory';


function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={<ProtectedRoute roles={["USER", "ADMIN"]}><UserHome /></ProtectedRoute>}
        />
        <Route
          path="/category/:id"
          element={<ProtectedRoute roles={["USER", "ADMIN"]}><CategoryPage /></ProtectedRoute>}
        />
        <Route
          path="/products"
          element={<ProtectedRoute roles={["USER", "ADMIN"]}><ProductsPage /></ProtectedRoute>}
        />
        <Route
          path="/cart"
          element={<ProtectedRoute roles={["USER", "ADMIN"]}><Cart /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute roles={["USER", "ADMIN"]}><Profile /></ProtectedRoute>}
        />
        {/* Admin dashboard and subpages */}
        <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {location.pathname === '/home' ? <Chatbot /> : null}
    </AuthProvider>
  );
}

export default App;
