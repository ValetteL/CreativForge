import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const { login, user, loading } = useAuth();
  const location = useLocation();

  // Compute the desired return URL (default: /dashboard)
  const desired = location.state?.from?.pathname
    ? window.location.origin + location.state.from.pathname
    : window.location.origin + "/dashboard";

  const handleClick = () => {
    toast("Redirecting to Google…");
    // login() will build the backend URL; we pass desired target
    const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    window.location.href = `${base}/api/auth/google/login?returnUrl=${encodeURIComponent(desired)}`;
  };

  // If already authenticated (e.g., user came back with a valid cookie), offer a quick link
  if (!loading && user) {
    return (
      <div style={{ margin: "2rem auto", textAlign: "center" }}>
        <h2>You are already signed in</h2>
        <a href={desired}>Continue</a>
      </div>
    );
  }

  return (
    <div style={{ margin: "2rem auto", textAlign: "center" }}>
      <h2>Sign in with Google</h2>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading…" : "Continue with Google"}
      </button>
    </div>
  );
}
