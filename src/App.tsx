// =============================================================================
// TideSense — Root Application Component (App.tsx)
// =============================================================================
// Now refactored to use AuthContext instead of managing auth state locally.
//
// BEFORE (Phase 1): App.tsx had useState for user, token, login handlers.
// AFTER (Phase 2):  Auth state lives in AuthContext. App.tsx just reads it.
//
// This means ANY component in the tree can call useAuth() to get the current
// user, check if they're logged in, or trigger login/logout — without having
// to pass props through every intermediate component.
//
// WHAT THIS FILE DOES NOW:
//   1. Reads auth state from AuthContext via useAuth()
//   2. Shows a loading spinner while auth is being verified
//   3. Renders the Navbar (with auth-aware props)
//   4. Defines all routes (public, protected, authority)
// =============================================================================

import { Routes, Route, Navigate } from 'react-router-dom';

// Auth context hook — replaces all the local useState/useCallback we had before
import { useAuth } from './context/AuthContext';

// -- Layout Components --
import Navbar from './components/Navbar';

// -- Page Components --
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

// =============================================================================
// PROTECTED ROUTE COMPONENT
// =============================================================================
// Guards routes that require authentication or a specific role.
//
// ANALOGY: FastAPI dependency injection:
//   async def get_current_user(token = Depends(oauth2_scheme)):
//       if not token: raise HTTPException(401)
//       return decode_token(token)
//
//   async def require_authority(user = Depends(get_current_user)):
//       if user.role != "AUTHORITY": raise HTTPException(403)
//
// React equivalent: wrap the page component in <ProtectedRoute>
// and it either renders the page or redirects.
// =============================================================================
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

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================
export default function App() {
  // Read auth state from context — no more local useState needed!
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // ---------------------------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------------------------
  // While AuthProvider is verifying the stored JWT token (GET /api/auth/me),
  // show a loading spinner. This prevents:
  //   1. A flash of "not logged in" content
  //   2. Protected route redirects firing before we know the auth state
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07111F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading Kinaara...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Layout + Routes
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07111F]">
      {/* Global Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        userName={user?.name}
        onLogout={logout}
      />

      {/* Main content area */}
      <main
        className="w-full px-4 sm:px-6 py-6"
        style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <Routes>
          {/* =================================================================
            PUBLIC ROUTES — No login required
            ================================================================= */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/beaches" element={<Home />} />
          <Route path="/beaches/:id" element={<BeachDetails />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<AlertDetail />} />

          {/* =================================================================
            PROTECTED ROUTES — User login required
            ================================================================= */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* =================================================================
            AUTHORITY ROUTES — Authority role required
            ================================================================= */}
          <Route
            path="/authority"
            element={
              <ProtectedRoute requiredRole="AUTHORITY">
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/reports"
            element={
              <ProtectedRoute requiredRole="AUTHORITY">
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/alerts"
            element={
              <ProtectedRoute requiredRole="AUTHORITY">
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all — styled 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
