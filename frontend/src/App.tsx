import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import BookPage from './pages/BookPage';
import VisitorStats from './pages/VisitorStats';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LandingPage from './pages/LandingPage';
import AboutContact from './pages/AboutContact';
import CookieConsent from './components/Legal/CookieConsent';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  // Redirect to dashboard if already logged in
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
  useEffect(() => {
    // Track visitor
    const trackVisitor = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.get(`${apiUrl}/stats/track`);
      } catch (err) {
        console.error('Visitor tracking failed', err);
      }
    };
    trackVisitor();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about" element={<AboutContact />} />
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/book/:id" 
            element={
              <ProtectedRoute>
                <BookPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/stats" element={<VisitorStats />} />
        </Routes>
        <CookieConsent />
      </AuthProvider>
    </Router>
  );
}

export default App;
