import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Callback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      // Optionnel : décoder le token si tu veux plus de détails
      login({ token });
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [search, login, navigate]);

  return <div>Connexion…</div>;
}
