import { createContext, useEffect, useMemo, useState, useCallback } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // { email, name } or null
  const [loading, setLoading] = useState(true); // global auth loading

  // Fetch current session user from backend
  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  // Load session on first mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchMe();
      setLoading(false);
    })();
  }, [fetchMe]);

  // Start Google OAuth on the server (full redirect)
  const login = useCallback(() => {
    const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const returnUrl = window.location.origin + "/dashboard"; // change target if needed
    window.location.href = `${base}/api/auth/google/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }, []);

  // Logout via server, then clear local state
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  }, []);

  // Helper for API calls that need credentials and 401 handling
  const authFetch = useCallback(async (input, init = {}) => {
    const res = await fetch(input, {
      credentials: "include",
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    });
    // If the cookie expired, reflect it in UI state
    if (res.status === 401) {
      setUser(null);
    }
    return res;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    refresh: fetchMe,
    authFetch,
  }), [user, loading, login, logout, fetchMe, authFetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
