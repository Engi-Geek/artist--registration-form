import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_authenticated', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToForm={handleBackToForm}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onBackToForm={handleBackToForm}
    />
  );
};
