import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';

// -- Layout Components --
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';


// -- Page Components --
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BeachDetails from './pages/BeachDetails';
import Alerts from './pages/Alerts';
import AlertDetail from './pages/AlertDetail';
import Report from './pages/Report';
import Profile from './pages/Profile';
import AuthorityDashboard from './pages/AuthorityDashboard';
import NotFound from './pages/NotFound';

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F3E8D9' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#A67C5A', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#6B4F3E' }}>Loading Kinaara...</p>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES — No layout */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ROUTES WITH LAYOUT */}
      <Route path="/dashboard" element={<Layout><Home /></Layout>} />
      <Route path="/beaches" element={<Layout><Home /></Layout>} />
      <Route path="/beaches/:id" element={<Layout><BeachDetails /></Layout>} />
      <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
      <Route path="/alerts/:id" element={<Layout><AlertDetail /></Layout>} />

      {/* PROTECTED ROUTES WITH LAYOUT */}
      <Route path="/report" element={<Layout><Report /></Layout>} />
      <Route
        path="/profile"
        element={
          <Layout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Layout>
        }
      />

      {/* AUTHORITY ROUTES WITH LAYOUT */}
      <Route
        path="/authority"
        element={
          <Layout>
            <ProtectedRoute requiredRole="AUTHORITY">
              <AuthorityDashboard />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/authority/reports"
        element={
          <Layout>
            <ProtectedRoute requiredRole="AUTHORITY">
              <AuthorityDashboard />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/authority/alerts"
        element={
          <Layout>
            <ProtectedRoute requiredRole="AUTHORITY">
              <AuthorityDashboard />
            </ProtectedRoute>
          </Layout>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
