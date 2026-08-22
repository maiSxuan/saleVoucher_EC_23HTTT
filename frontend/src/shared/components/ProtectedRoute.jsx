import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAdminRole } from '../constants/admin-roles';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('ec_auth_token');
  const userStr = localStorage.getItem('user') || localStorage.getItem('ec_auth_user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRole = getAdminRole(user);
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
