// =============================================================================
// TideSense — Application Entry Point (main.tsx)
// =============================================================================
// This is the very first file that runs when the app loads in the browser.
//
// THE PROVIDER STACK:
// Notice how we wrap the app in multiple "providers":
//   <StrictMode>           ← Development warnings (removed in production)
//     <BrowserRouter>      ← Enables client-side URL routing
//       <AuthProvider>     ← Makes auth state available everywhere
//         <App />          ← The actual application
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
//
// This is a common React pattern. Each provider adds a "layer" of
// functionality. It's similar to middleware in FastAPI/Express — each
// layer wraps the next and adds capabilities.
//
// ORDER MATTERS:
//   - BrowserRouter must wrap AuthProvider because AuthProvider's children
//     (like Login page) use useNavigate(), which requires router context.
//   - AuthProvider must wrap App because App reads auth state.
// =============================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Global styles — Tailwind CSS directives + our custom theme
import './index.css';

// Auth context provider — manages user session globally
import { AuthProvider } from './context/AuthContext';

// The root App component that contains all routes and layout
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
