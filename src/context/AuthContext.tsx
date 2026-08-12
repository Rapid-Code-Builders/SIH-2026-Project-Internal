// =============================================================================
// TideSense Authentication Context (AuthContext.tsx)
// =============================================================================
//
// WHAT IS A CONTEXT?
// In backend terms, think of React Context as a "global session state" that
// any component in the tree can read — without passing props through every
// intermediate component. It solves the same problem as:
//   - Flask's `g` object or `session`
//   - FastAPI's dependency injection with `Depends(get_current_user)`
//   - Django's `request.user` available in every view
//
// WITHOUT Context, you'd need to pass `user`, `token`, `isAuthenticated`,
// `login()`, and `logout()` as props from App → Navbar → every child → etc.
// This is called "prop drilling" and it gets messy fast.
//
// WITH Context, any component anywhere in the tree can do:
//   const { user, login, logout } = useAuth();
// ...just like how any FastAPI endpoint can do:
//   current_user = Depends(get_current_user)
//
// HOW IT WORKS:
//   1. createContext() creates a "container" for shared data
//   2. AuthProvider wraps the app and provides the actual values
//   3. useAuth() is a custom hook that reads from the container
//
// LIFECYCLE:
//   App loads → AuthProvider mounts → checks localStorage for saved token
//   → if token exists, calls GET /api/auth/me to verify it
//   → sets user state accordingly → renders children
// =============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import { getCurrentUser } from '../services/api';
import type { User } from '../types';

// =============================================================================
// STEP 1: Define the shape of the context
// =============================================================================
// This interface describes ALL the values that will be available to any
// component that calls useAuth(). Think of it as the "API contract"
// for the auth system.
// =============================================================================
interface AuthContextType {
  user: User | null;                    // Current logged-in user, or null
  token: string | null;                 // JWT token, or null
  isAuthenticated: boolean;             // Shortcut: is the user logged in?
  isLoading: boolean;                   // Are we still checking the token?
  login: (token: string, user: User) => void;   // Save auth state after login
  logout: () => void;                   // Clear auth state
}

// =============================================================================
// STEP 2: Create the context with default values
// =============================================================================
// createContext() creates the "container". The default values here are only
// used if a component tries to read the context WITHOUT being wrapped in
// an AuthProvider — which shouldn't happen in our app.
// =============================================================================
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// =============================================================================
// STEP 3: Create the Provider component
// =============================================================================
// The Provider is a wrapper component that holds the actual state and makes
// it available to all children. In our app, it wraps everything in main.tsx:
//
//   <AuthProvider>
//     <App />        ← everything inside can call useAuth()
//   </AuthProvider>
//
// ANALOGY: This is like FastAPI's startup event that initializes the
// database connection pool. It runs once, sets up shared resources,
// and makes them available to all request handlers.
// =============================================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  // ---- State variables ----
  // useState stores reactive data. When these change, React re-renders
  // any component that reads them via useAuth().

  const [user, setUser] = useState<User | null>(null);

  // Initialize token from localStorage — this persists across page refreshes.
  // localStorage.getItem() returns null if the key doesn't exist.
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  // Loading flag — true while we're verifying the stored token on app startup.
  // This prevents a flash of "not logged in" content.
  const [isLoading, setIsLoading] = useState(true);

  // Derived boolean — cleaner than checking user !== null everywhere
  const isAuthenticated = !!user && !!token;

  // ---------------------------------------------------------------------------
  // EFFECT: Verify stored token on mount / token change
  // ---------------------------------------------------------------------------
  // useEffect runs AFTER the component renders. The dependency array [token]
  // means this effect re-runs whenever `token` changes.
  //
  // ANALOGY: This is like a FastAPI middleware that runs on every request
  // to validate the Authorization header:
  //   if token: verify(token) → set user
  //   else: user = None (anonymous)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Call the backend to verify the token is still valid
        // GET /api/auth/me → returns { user: { id, name, email, role } }
        const data = await getCurrentUser();
        setUser(data.user as User);
      } catch {
        // Token is expired, invalid, or backend is unreachable
        // Clean up and treat as anonymous visitor
        console.warn('Stored token is invalid, clearing auth state.');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        // Whether success or failure, we're done loading
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token]);

  // ---------------------------------------------------------------------------
  // LOGIN: Save auth credentials
  // ---------------------------------------------------------------------------
  // Called after a successful POST /api/auth/login or POST /api/auth/register.
  // Saves the JWT to localStorage (persists across refreshes) and updates state.
  //
  // useCallback memoizes the function so it maintains the same reference
  // across re-renders. This is a performance optimization — components that
  // receive this function as a prop won't re-render unnecessarily.
  // Think of it like Python's @functools.lru_cache but for function identity.
  // ---------------------------------------------------------------------------
  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  // ---------------------------------------------------------------------------
  // LOGOUT: Clear auth credentials
  // ---------------------------------------------------------------------------
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER: Provide the context values to all children
  // ---------------------------------------------------------------------------
  // AuthContext.Provider makes { user, token, isAuthenticated, ... } available
  // to any descendant component that calls useAuth().
  //
  // The 'value' prop is the actual data being shared. Every time one of these
  // state variables changes, all consuming components automatically re-render.
  // ---------------------------------------------------------------------------
  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// STEP 4: Custom hook for consuming the context
// =============================================================================
// This is a convenience wrapper. Instead of writing:
//   const context = useContext(AuthContext);
// ...in every component, they just write:
//   const { user, login, logout } = useAuth();
//
// ANALOGY: This is like creating a helper function in your backend:
//   def get_current_user(request) -> User:
//       return request.state.user
// =============================================================================
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // Safety check — if someone uses useAuth() outside of <AuthProvider>,
  // throw a clear error instead of getting cryptic "undefined" bugs.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
