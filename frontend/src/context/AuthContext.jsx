import { createContext, useEffect, useState } from "react";

// AuthContext provides current user object and loading state for auth
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // User object (token, profile...)
  const [loading, setLoading] = useState(true); // Is authentication check in progress?

  // Load user from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // Standard login/logout (replace with real logic as needed)
  const login = (userObj) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
