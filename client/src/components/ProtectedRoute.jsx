import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken } from '../utils/auth.js';

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getAuthToken();
  if (!token) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

