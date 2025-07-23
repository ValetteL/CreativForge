import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BriefForm from "../../components/brief/BriefForm";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EditBrief() {
  const { id } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.token) return;
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    setLoading(true);

      console.log("EditBrief mounted", id);
    fetch(`${API_BASE}/api/briefs/${id}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then(setBrief)
      .catch(() => {
        setFetchError("Brief introuvable ou accès refusé.");
        setBrief(null);
      })
      .finally(() => setLoading(false));
  }, [id, user?.token]);

  const handleUpdate = async (updatedBrief) => {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    try {
      const res = await fetch(`${API_BASE}/api/briefs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedBrief),
      });
      if (!res.ok) throw new Error();
      toast.success("Brief modifié !");
      navigate("/dashboard"); // ou "/mes-briefs"
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  };

  if (loading) return <div>Chargement…</div>;
  if (fetchError) return <div>{fetchError}</div>;

  return (
    <div>
      <h1>Modifier le brief</h1>
      <BriefForm brief={brief} onBriefGenerated={handleUpdate} />
    </div>
  );
}
