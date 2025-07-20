import { useState } from "react";

export default function BriefForm({ onBriefGenerated, brief }) {
  // Pour anticiper : champ texte où l'utilisateur peut donner une idée (ex: un début de thème)
  const [prompt, setPrompt] = useState(brief ? brief.prompt : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    try {
      const res = await fetch(`${API_BASE}/api/prompt/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ici tu anticipes l'avenir : pour l'instant, prompt peut être vide
        body: JSON.stringify({ theme: prompt })
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      onBriefGenerated(data);
    } catch (err) {
      alert("Impossible de générer le prompt");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Décrivez votre idée (optionnel)…"
      />
      <button type="submit">Générer</button>
    </form>
  );
}
