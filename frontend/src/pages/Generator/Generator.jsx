// Generator.jsx
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Generator.module.css";

export default function Generator() {
  // Access current user from context (if needed for future features)
  const { user } = useContext(AuthContext);

  // Controlled input for the user idea (default: empty string, not null)
  const [userPrompt, setUserPrompt] = useState("");
  // Stores the generated prompt from backend
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  // Stores the generated brief associated
  const [generatedBrief, setGeneratedBrief] = useState(null);
  // Loader state for button/spinner
  const [isLoading, setIsLoading] = useState(false);
  // State for the brief saving workflow
  const [isSaving, setIsSaving] = useState(false);    // True while API call in progress
  const [isSaved, setIsSaved] = useState(false);      // True if brief was successfully saved
  const [saveError, setSaveError] = useState(null);   // String: error message to display


  // Handles form submit: send prompt to backend, get prompt+brief back
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // POST request to API with userPrompt (string, not null)
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/prompt/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: userPrompt || "" })
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setGeneratedPrompt(data.prompt);
      setGeneratedBrief(data.brief);
    } catch {
      alert("Impossible de générer le prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBrief = async () => {
    if (!generatedBrief) return;
    setIsSaving(true);     // Start loading
    setSaveError(null);
    try {
      const token = user?.token;
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(generatedBrief)
      });
      if (res.status === 409) {
        // Brief already saved (conflict)
        setIsSaved(true);
        toast("Brief déjà sauvegardé.", { icon: "⚠️" });
        return;
      }
      if (!res.ok) throw new Error("Impossible de sauvegarder le brief.");
      // Successfully saved
      setIsSaved(true);
      toast.success("Brief sauvegardé !");
    } catch (err) {
      setSaveError("Erreur lors de la sauvegarde.");
      toast.error("Erreur lors de la sauvegarde du brief.");
    } finally {
      setIsSaving(false);   // End loading
    }
  };
  
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Générer un prompt créatif</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          value={userPrompt}
          onChange={e => setUserPrompt(e.target.value)}
          placeholder="Décrivez votre idée (optionnel)"
          className={styles.input}
        />
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Génération..." : "Générer"}
        </button>
      </form>
      {generatedPrompt && (
        <div className={styles.promptOutput}>
          <h3>Prompt généré :</h3>
          <div>{generatedPrompt.fullPrompt}</div>
          {generatedBrief && (
            <div className={styles.briefDetails}>
              <h4>Détails du brief :</h4>
              <div><b>Titre :</b> {generatedBrief.title}</div>
              <div><b>Objectif :</b> {generatedBrief.objective}</div>
              <div><b>Audience :</b> {generatedBrief.audience}</div>
              <div><b>Plateforme :</b> {generatedBrief.platform}</div>
              {user && !isSaved && (
                <button
                  className={styles.saveButton}
                  onClick={handleSaveBrief}
                  disabled={isSaving}
                >
                  {isSaving ? "Sauvegarde..." : "Sauvegarder ce brief"}
                </button>
              )}
              {isSaved && <span className={styles.savedTag}>Brief sauvegardé !</span>}
              {saveError && <span className={styles.saveError}>{saveError}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
