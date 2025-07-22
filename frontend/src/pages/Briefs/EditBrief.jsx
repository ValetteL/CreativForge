import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BriefForm from "../../components/brief/BriefForm";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function EditBrief() {
  const { id } = useParams();
  const [brief, setBrief] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    fetch(`${API_BASE}/api/briefs/${id}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setBrief);
  }, [id, user.token]);

  const handleUpdate = async (updatedBrief) => {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    await fetch(`${API_BASE}/api/briefs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(updatedBrief),
    });
    navigate("/dashboard");
  };

  if (!brief) return <div>Chargement…</div>;

  return (
    <div>
      <h1>Modifier le brief</h1>
      <BriefForm brief={brief} onBriefGenerated={handleUpdate} />
    </div>
  );
}
