import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import BriefForm from "../../components/brief/BriefForm";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EditBrief() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    objective: "",
    audience: "",
    platform: ""
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch existing brief
  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief/${id}`, {
      headers: { "Authorization": `Bearer ${user.token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setForm(data))
      .catch(() => setFetchError("Brief introuvable ou accès refusé."))
      .finally(() => setLoading(false));
  }, [id, user?.token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brief/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      toast.success("Brief modifié !");
      navigate("/my-briefs"); // ou dashboard selon UX souhaitée
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  };

  if (loading) return <div>Chargement…</div>;
  if (fetchError) return <div>{fetchError}</div>;

  return (
    <div className="edit-brief-page">
      <h1>Modifier le brief</h1>
      <form onSubmit={handleUpdate} style={{ maxWidth: 500, margin: "auto" }}>
        <label>Titre
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>Objectif
          <textarea name="objective" value={form.objective} onChange={handleChange} required />
        </label>
        <label>Audience
          <input name="audience" value={form.audience} onChange={handleChange} required />
        </label>
        <label>Plateforme
          <input name="platform" value={form.platform} onChange={handleChange} required />
        </label>
        <button type="submit" className="button">Enregistrer</button>
      </form>
    </div>
  );
}
