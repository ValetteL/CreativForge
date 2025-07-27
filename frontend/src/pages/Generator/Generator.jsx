import usePromptGenerator from "../../hooks/usePromptGenerator";
import { useState } from "react";
import BriefField from "../../components/brief/BriefField";
import toast from "react-hot-toast";

export default function Generator() {
  const {
    prompt, brief, loading, regenLoading,
    generatePrompt, regeneratePromptField, regenerateBriefField
  } = usePromptGenerator();
  const [userTheme, setUserTheme] = useState("");

  // Handles prompt generation (whole prompt)
  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await generatePrompt(userTheme);
      toast.success("Prompt généré !");
    } catch {
      toast.error("Impossible de générer le prompt.");
    }
  };

  return (
    <div className="generator-page">
      <h2>Générer un prompt créatif</h2>
      <form onSubmit={handleGenerate}>
        <input
          value={userTheme}
          onChange={e => setUserTheme(e.target.value)}
          placeholder="Décrivez votre idée (optionnel)"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Génération..." : "Générer"}
        </button>
      </form>

      {prompt && (
        <div className="prompt-output">
          <h3>Prompt généré :</h3>
          <PromptField label="Format" value={prompt.format} onRegenerate={() => regeneratePromptField("format")} loading={regenLoading.format} />
          <PromptField label="Thème" value={prompt.theme} onRegenerate={() => regeneratePromptField("theme")} loading={regenLoading.theme} />
          <PromptField label="Contrainte" value={prompt.constraint} onRegenerate={() => regeneratePromptField("constraint")} loading={regenLoading.constraint} />
          <div style={{ marginTop: 16, color: "#5fd26d" }}>
            <b>Prompt final :</b> {prompt.fullPrompt}
          </div>
        </div>
      )}

      {brief && (
        <div className="brief-output">
          <h3>Brief associé</h3>
          <BriefField label="Titre" value={brief.title} onRegenerate={() => regenerateBriefField("title")} loading={regenLoading.brief_title} />
          <BriefField label="Objectif" value={brief.objective} onRegenerate={() => regenerateBriefField("objective")} loading={regenLoading.brief_objective} />
          <BriefField label="Audience" value={brief.audience} onRegenerate={() => regenerateBriefField("audience")} loading={regenLoading.brief_audience} />
          <BriefField label="Plateforme" value={brief.platform} onRegenerate={() => regenerateBriefField("platform")} loading={regenLoading.brief_platform} />
        </div>
      )}
    </div>
  );
}

// Minimal pro field component
function PromptField({ label, value, onRegenerate, loading }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <b>{label} :</b> <span>{value}</span>
      <button onClick={onRegenerate} disabled={loading} className="button button-small" style={{ marginLeft: 10 }}>
        {loading ? "..." : "Régénérer"}
      </button>
    </div>
  );
}
