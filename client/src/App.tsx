import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import DocumentList from './components/documents/DocumentList';
import DocumentUpload from './components/documents/DocumentUpload';
import BBBEEScorecard from './components/reports/BBBEEScorecard';
import TicketList from './components/tickets/TicketList';
import TicketForm from './components/tickets/TicketForm';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/documents"
            element={
              <div className="space-y-8">
                <DocumentUpload onSubmitSuccess={() => {}} />
                <DocumentList />
              </div>
            }
          />
          <Route path="/reports" element={<BBBEEScorecard />} />
          <Route
            path="/support"
            element={
              <div className="space-y-8">
                <TicketForm onSubmitSuccess={() => {}} />
                <TicketList />
              </div>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App; 