import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { About } from '@/pages/About';
import { ComplianceReports } from '@/pages/ComplianceReports';
import { MessagingSupport } from '@/pages/MessagingSupport';
import { Integrations } from '@/pages/Integrations';
import { UserProfile } from '@/pages/UserProfile';
import { NotFound } from '@/components/NotFound';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="reports" element={<ComplianceReports />} />
          <Route path="support" element={<MessagingSupport />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};