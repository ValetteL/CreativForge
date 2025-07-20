import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// Restricts access to authenticated users only
export default function PrivateRoute({ children }) {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) return <Navigate to="/login" />;
  return children;
}
