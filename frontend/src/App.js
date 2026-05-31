// App.js - Root component with routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';

// Pages
import HomePage        from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import MyBookingsPage  from './pages/MyBookingsPage';
import AdminDashboard  from './pages/AdminDashboard';

// ─── Protected Route (logged-in users only) ───────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// ─── Admin Route (admin role only) ────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  if (!isLoggedIn)          return <Navigate to="/login"   replace />;
  if (user?.role !== 'admin') return <Navigate to="/"      replace />;
  return children;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <>
    <Navbar />
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1a1a26', color: '#fff', border: '1px solid #2a2a3a' },
      }}
    />
    <Routes>
      {/* Public */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/movies/:id" element={<MovieDetailPage />} />
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />

      {/* Private */}
      <Route path="/my-bookings" element={
        <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
      }/>

      {/* Admin only */}
      <Route path="/admin" element={
        <AdminRoute><AdminDashboard /></AdminRoute>
      }/>
    </Routes>
  </>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
