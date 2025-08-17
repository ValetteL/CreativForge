import { useState } from "react";
import { authFetch } from "@/utils/authFetch";
import styles from "./generator.module.css";

export default function Generator() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [brief, setBrief] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const onGenerate = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/api/ai/generate`, {
        method: "POST",
        body: JSON.stringify({ prompt: value }),
      });
      const data = await res.json();
      // Expecting { idea, brief } from backend (as we discussed)
      setIdea(data.idea || "");
      setBrief(data.brief || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ... UI using styles
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Générer une idée créative</h2>
      <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className={styles.form}>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Décrivez votre idée (optionnel)"
        />
        <button type="submit" disabled={loading} className={styles.primaryBtn}>
          {loading ? "Génération..." : "Générer"}
        </button>
      </form>

      {idea && (
        <div className={styles.output}>
          <h3 className={styles.subtitle}>Idée</h3>
          <p style={{ margin: 0 }}>{idea}</p>
        </div>
      )}
      {brief && (
        <div className={styles.output}>
          <h3 className={styles.subtitle}>Brief</h3>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{brief}</p>
        </div>
      )}
    </div>
  );
}
