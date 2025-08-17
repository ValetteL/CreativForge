import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Guards a route using server-side session (no local token).
export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // While the app verifies session cookie with /api/auth/me
  if (loading) return <div style={{ padding: 24 }}>Checking session…</div>;

  // Not authenticated: redirect to /login and remember where we came from
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated: render the protected children
  return children;
}
