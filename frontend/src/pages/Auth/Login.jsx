import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    const credential = credentialResponse.credential; // id_token Google
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential })
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      login({ ...data.user, token: data.token }); // Stocke le JWT
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (err) {
      setError("Connexion Google impossible. Essayez à nouveau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Connexion</h1>
      {isLoading && <div className={styles.loading}>Connexion en cours…</div>}
      {error && <div className={styles.error}>{error}</div>}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError("Erreur Google.")}
        width="300"
      />
    </div>
  );
}
