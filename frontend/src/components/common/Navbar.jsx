import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.link}>Accueil</Link>

      {user && (
        <>
          <Link to="/generator" className={styles.link}>Génération</Link>
          <Link to="/dashboard" className={styles.link}>Tableau de bord</Link>
          <Link to="/my-briefs" className={styles.link}>Mes briefs</Link>
        </>
      )}

      <span className={styles.right}>
        {user ? (
          <>
            <span className={styles.email}>{user.email}</span>
            <button onClick={handleLogout} className={styles.button}>Déconnexion</button>
          </>
        ) : (
          <button
            onClick={login}
            disabled={loading}
            className={styles.button}
            title="Sign in with Google"
          >
            Connexion
          </button>
        )}
      </span>
    </nav>
  );
}
