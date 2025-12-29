import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// 1. BLOCK ORGANIZERS/ADMINS from User Pages
// If an Organizer tries to go to Home (/), send them to Admin Dashboard
export const UserOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (user && (user.role === 'ROLE_ORGANIZER' || user.role === 'ROLE_ADMIN')) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// 2. BLOCK USERS/GUESTS from Admin Pages
// If a User/Guest tries to go to Admin, send them to Login (or Home)
export const AdminOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user || (user.role !== 'ROLE_ORGANIZER' && user.role !== 'ROLE_ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};