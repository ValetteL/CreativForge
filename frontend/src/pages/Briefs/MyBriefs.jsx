import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import BriefCard from "../../components/brief/BriefCard";
import styles from "./MyBriefs.module.css";
import toast from "react-hot-toast";

export default function MyBriefs() {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const fetchBriefs = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await authFetch(`${API_BASE}/api/brief`);
        const data = await res.json();
        setBriefs(data);
      } catch (err) {
        setLoadError(err.message || "Impossible de charger vos briefs.");
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBriefs();
  }, [API_BASE]);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce brief ?")) return;
    setIsDeleting(id);
    try {
      await authFetch(`${API_BASE}/api/brief/${id}`, { method: "DELETE" });
      setBriefs((prev) => prev.filter((brief) => brief.id !== id));
      toast.success("Brief supprimé avec succès.");
    } catch {
      toast.error("Erreur lors de la suppression du brief.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) return <div className={styles.loading}>Chargement de vos briefs…</div>;
  if (loadError) return <div className={styles.error}>{loadError}</div>;

  return (
    <div className={styles.container}>
      <h2>Mes briefs</h2>
      {briefs.length === 0 ? (
        <div className={styles.message}>Aucun brief pour l’instant.</div>
      ) : (
        <div className={styles.list}>
          {briefs.map((brief) => (
            <BriefCard
              key={brief.id}
              brief={brief}
              onEdit={() => navigate(`/briefs/${brief.id}/edit`)}
              onDelete={() => handleDelete(brief.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
