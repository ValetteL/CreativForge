// src/components/brief/BriefEditor.jsx
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Edit and regenerate prompt/brief fields.
 * @param {object} props - { initialBrief, onSave }
 */
export default function BriefEditor({ initialBrief, onSave }) {
  const [brief, setBrief] = useState(initialBrief);
  const [loadingField, setLoadingField] = useState(null);

  // Regenerate a single prompt field (calls backend)
  const regeneratePromptField = async (field) => {
    setLoadingField(`prompt.${field}`);
    try {
      const res = await fetch(`/api/prompt/regenerate-field`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          current: brief.prompt
        })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBrief(b => ({
        ...b,
        prompt: { ...b.prompt, [field]: data.value }
      }));
      toast.success("Field regenerated!");
    } catch {
      toast.error("Failed to regenerate field.");
    } finally {
      setLoadingField(null);
    }
  };

  // Save all changes (calls parent handler)
  const handleSave = (e) => {
    e.preventDefault();
    onSave(brief);
  };

  // Edit a brief/prompt field
  const updateField = (section, field, value) => {
    setBrief(b => section === "prompt"
      ? { ...b, prompt: { ...b.prompt, [field]: value } }
      : { ...b, [field]: value }
    );
  };

  return (
    <form onSubmit={handleSave} className="brief-editor">
      <h2>Prompt</h2>
      {["theme", "constraint", "format"].map(field => (
        <div key={field} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ minWidth: 90 }}>{field.charAt(0).toUpperCase() + field.slice(1)} :</label>
          <input
            value={brief.prompt?.[field] || ""}
            onChange={e => updateField("prompt", field, e.target.value)}
          />
          <button
            type="button"
            disabled={loadingField === `prompt.${field}`}
            onClick={() => regeneratePromptField(field)}
            style={{ fontSize: 20 }}
            aria-label={`Regenerate ${field}`}
          >{loadingField === `prompt.${field}` ? "..." : "🔁"}</button>
          <button
            type="button"
            disabled={loadingField === "prompt.all"}
            onClick={() => regeneratePromptField("all")}
            style={{ marginLeft: 10 }}
          >
            {loadingField === "prompt.all" ? "..." : "🔁 Regenerate all"}
          </button>
        </div>
      ))}

      <h2>Brief</h2>
      {["title", "objective", "audience", "platform"].map(field => (
        <div key={field} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ minWidth: 90 }}>{field.charAt(0).toUpperCase() + field.slice(1)} :</label>
          <input
            value={brief[field] || ""}
            onChange={e => updateField("brief", field, e.target.value)}
          />
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <button type="submit" className="button">
          Save changes
        </button>
      </div>
    </form>
  );
}
