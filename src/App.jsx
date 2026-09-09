import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
