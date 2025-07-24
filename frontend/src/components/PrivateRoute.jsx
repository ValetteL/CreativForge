import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Protects routes from unauthenticated access, handles loading
export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading authentication...</div>;
  if (!user?.token) return <Navigate to="/login" replace />;

  return children;
}
