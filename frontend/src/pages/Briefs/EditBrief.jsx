import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EditBrief() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", objective: "", audience: "", platform: "" });
  const [prompts, setPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  // Fetch prompts
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/prompt`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setPrompts)
      .catch(() => setPrompts([]));
  }, [user.token]);

  // Fetch brief and init selectedPromptId
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setForm(data);
        setSelectedPromptId(data.promptId || null); // si promptId existe dans le brief
      })
      .catch(() => toast.error("Brief introuvable ou accès refusé."));
  }, [id, user.token]);

  async function handleUpdatePrompt(e) {
    e.preventDefault();
    if (!selectedPromptId) return;

    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief/${id}/prompt`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({ id: selectedPromptId })
    });
    if (!res.ok) {
      toast.error("Erreur lors de la mise à jour du prompt.");
      return;
    }
    toast.success("Prompt mis à jour !");
    // Optionnel : rafraîchir le brief
  }

  // ...le formulaire d’édition du brief...

  return (
    <div className="edit-brief-page">
      <h1>Modifier le brief</h1>

      {/* Formulaire d’édition du brief */}
      {/* ... */}

      {/* Formulaire pour modifier le prompt */}
      <form onSubmit={handleUpdatePrompt}>
        <label>
          Associer un prompt :
          <select
            value={selectedPromptId || ""}
            onChange={e => setSelectedPromptId(Number(e.target.value))}
            required
          >
            <option value="">Choisir un prompt</option>
            {prompts.map(p => (
              <option key={p.id} value={p.id}>
                {p.fullPrompt}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Mettre à jour le prompt</button>
      </form>
    </div>
  );
}
