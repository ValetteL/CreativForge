import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BriefEditor from "../../components/brief/BriefEditor";
import { authFetch } from "../../utils/authFetch";
import toast from "react-hot-toast";

export default function EditBrief() {
  const { id } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/brief/${id}`);
        const data = await res.json();
        setBrief(data);
      } catch {
        toast.error("Erreur lors du chargement du brief.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, API_BASE]);

  const handleSave = async (updatedBrief) => {
    try {
      const res = await authFetch(`${API_BASE}/api/brief/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedBrief),
      });
      if (!res.ok) throw new Error();
      toast.success("Brief sauvegardé !");
      navigate("/my-briefs");
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    }
  };

  if (loading || !brief) return <div>Chargement…</div>;
  return <BriefEditor initialBrief={brief} onSave={handleSave} />;
}
