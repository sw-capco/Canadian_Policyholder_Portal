import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FileClaim from './pages/FileClaim.jsx';
import Profile from './pages/Profile.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import SignIn from './pages/SignIn.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/file-claim" element={<FileClaim />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
