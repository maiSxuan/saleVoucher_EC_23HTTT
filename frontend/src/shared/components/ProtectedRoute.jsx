import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('ec_auth_token');
  const userStr = localStorage.getItem('user') || localStorage.getItem('ec_auth_user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRole = user.vai_tro_he_thong || user.role || user.vai_tro;
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole) && !allowedRoles.includes(user.role)) {
      return <Navigate to="/forbidden" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
