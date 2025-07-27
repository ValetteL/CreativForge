// src/pages/Briefs/EditBrief.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BriefEditor from "../../components/brief/BriefEditor";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

/**
 * EditBrief page for editing and saving a brief with granular prompt control.
 */
export default function EditBrief() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load brief (and prompt) on mount
  useEffect(() => {
    if (!user?.token) return;
    fetch(`/api/brief/${id}`, {
      headers: { "Authorization": `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setBrief)
      .catch(() => toast.error("Error loading brief"))
      .finally(() => setLoading(false));
  }, [id, user?.token]);

  // Save handler passed to BriefEditor
  const handleSave = async (updatedBrief) => {
    try {
      const res = await fetch(`/api/brief/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedBrief)
      });
      if (!res.ok) throw new Error();
      toast.success("Brief saved!");
      navigate("/my-briefs");
    } catch {
      toast.error("Error saving brief.");
    }
  };

  if (loading || !brief) return <div>Loading…</div>;
  return <BriefEditor initialBrief={brief} onSave={handleSave} />;
}
