import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BriefCard from "../../components/brief/BriefCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [briefs, setBriefs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    fetch(`${API_BASE}/api/briefs`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => res.json())
      .then(setBriefs);
  }, [user, navigate]);

  const handleDelete = async (id) => {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    await fetch(`${API_BASE}/api/briefs/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    setBriefs(briefs.filter(brief => brief.id !== id));
  };

  return (
    <div>
      <h1>Mes briefs</h1>
      <button onClick={() => navigate("/")}>Nouveau brief</button>
      <div>
        {briefs.map(brief => (
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
