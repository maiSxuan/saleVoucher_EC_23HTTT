import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  // Development bypass: Mock authentication for testing
  if (import.meta.env.MODE === 'development') {
    if (!localStorage.getItem('user')) {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ role: 'Admin', ho_ten: 'Admin Test' }));
    }
    return <Outlet />;
  }

  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/forbidden" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
