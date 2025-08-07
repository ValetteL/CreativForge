import { useState } from "react";
import { computeFullPrompt } from "../utils/prompt";

/**
 * Handles all logic for prompt and brief generation and regeneration.
 * Provides full "single source of truth" state for prompt and brief.
 */
export default function usePromptGenerator() {
  const [prompt, setPrompt] = useState(null);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState({});
  
  // Generate prompt + brief (initial or global regen)
<<<<<<< HEAD
  async function generatePrompt(userTheme = null) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: userTheme })
=======
  async function generatePrompt(userPrompt = null) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt })
>>>>>>> 6331484 (features : refactorisation architecture, intégration full-stack génération IA (FastAPI/Ollama), Dockerisation en cours)
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setPrompt({ ...data.prompt, fullPrompt: computeFullPrompt(data.prompt) });
      setBrief(data.brief);
    } finally {
      setLoading(false);
    }
  }

  // Regenerate a single prompt field (granular)
  async function regeneratePromptField(field) {
    setRegenLoading(l => ({ ...l, [field]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/prompt/regenerate-field`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, prompt })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Update that field and recompute fullPrompt
      setPrompt(prev =>
        prev
          ? { ...prev, [field]: data.value, fullPrompt: computeFullPrompt({ ...prev, [field]: data.value }) }
          : prev
      );
    } finally {
      setRegenLoading(l => ({ ...l, [field]: false }));
    }
  }

  // Regenerate a single brief field (granular)
  async function regenerateBriefField(field) {
    setRegenLoading(l => ({ ...l, [`brief_${field}`]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief/regenerate-field`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, prompt })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBrief(prev => prev ? { ...prev, [field]: data.value } : prev);
    } finally {
      setRegenLoading(l => ({ ...l, [`brief_${field}`]: false }));
    }
  }

  return {
    prompt,
    brief,
    loading,
    regenLoading,
    generatePrompt,
    regeneratePromptField,
    regenerateBriefField,
    setPrompt, // exposed for advanced use
    setBrief
  };
}
