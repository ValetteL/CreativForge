import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.link}>Accueil</Link>
      {user && (
        <>
          <Link to="/generator" className={styles.link}>Génération</Link>
          {user && (
            <Link to="/dashboard" className={styles.link}>
              Tableau de bord
            </Link>
          )}
          {user && (
            <Link to="/my-briefs" className={styles.link}>
              Mes briefs
            </Link>
          )}
        </>
      )}
      <span className={styles.right}>
        {user ? (
          <>
            <span className={styles.email}>{user.email}</span>
            <button onClick={handleLogout} className={styles.button}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login" className={styles.link}>Connexion</Link>
        )}
      </span>
    </nav>
  );
}
