import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BriefCard from "../../components/brief/BriefCard";
import { authFetch } from "../../utils/authFetch";

// Dashboard shows latest briefs for the connected user.
// Uses cookie session (no token in headers).
export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [briefs, setBriefs] = useState([]);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    // Wait for auth check to finish
    if (loading) return;

    // If not authenticated, go to login
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch briefs for the current user
    (async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/brief`);
        const data = await res.json();
        setBriefs(data);
      } catch (err) {
        console.error("Error fetching briefs:", err);
      }
    })();
  }, [user, loading, navigate, API_BASE]);

  const handleDelete = async (id) => {
    try {
      await authFetch(`${API_BASE}/api/brief/${id}`, { method: "DELETE" });
      setBriefs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting brief:", err);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Checking session…</div>;

  return (
    <div>
      <h1>Mes briefs</h1>
      <button onClick={() => navigate("/generator")}>Nouveau brief</button>
      <div>
        {briefs.map((brief) => (
          <BriefCard
            key={brief.id}
            brief={brief}
            onEdit={() => navigate(`/briefs/${brief.id}/edit`)}
            onDelete={() => handleDelete(brief.id)}
          />
        ))}
      </div>
    </div>
  );
}
