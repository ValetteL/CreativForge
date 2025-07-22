// src/pages/MyBriefs.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import BriefCard from "../../components/brief/BriefCard";
import styles from "./MyBriefs.module.css";
import toast from "react-hot-toast";

export default function MyBriefs() {
  const { currentUser } = useContext(AuthContext);
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const fetchBriefs = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief`, {
          headers: { Authorization: `Bearer ${currentUser?.token}` }
        });
        if (res.status === 401) throw new Error("Session expirée ou non connecté.");
        if (!res.ok) throw new Error("Erreur lors du chargement.");
        const data = await res.json();
        setBriefs(data);
      } catch (err) {
        setLoadError(err.message || "Impossible de charger vos briefs.");
        toast.error(loadError);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser) fetchBriefs();
  }, [currentUser]);

  if (!currentUser) {
    return <div className={styles.message}>Veuillez vous connecter pour voir vos briefs.</div>;
  }

  if (isLoading) return <div className={styles.loading}>Chargement de vos briefs…</div>;
  if (loadError) return <div className={styles.error}>{loadError}</div>;

  return (
    <div className={styles.container}>
      <h2>Mes briefs</h2>
      {briefs.length === 0 ? (
        <div className={styles.message}>Aucun brief pour l’instant.</div>
      ) : (
        <div className={styles.list}>
          {briefs.map(brief => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      )}
    </div>
  );
}
