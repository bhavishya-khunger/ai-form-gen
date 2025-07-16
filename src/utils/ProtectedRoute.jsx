import { Navigate, Outlet } from 'react-router-dom';

// Helper function to check JWT validity
export function isTokenValid(token, token_expires_at) {
  if (!token) return false;
  if (!token_expires_at) return false;
  try {
    const expiresAt = new Date(token_expires_at).getTime();
    const now = Date.now();
    // Check if token expires within 2 hours (7200000 ms) from now
    if (expiresAt - now < 2 * 60 * 60 * 1000) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const token_expires_at = localStorage.getItem('token_expires_at'); 
  const isValid = isTokenValid(token, token_expires_at);

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}