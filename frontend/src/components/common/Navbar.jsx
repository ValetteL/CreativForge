import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.link}>Accueil</Link>
      {currentUser && (
        <>
          <Link to="/generator" className={styles.link}>Génération</Link>
          {currentUser && (
            <Link to="/my-briefs" className={styles.link}>
              Mes briefs
            </Link>
          )}
        </>
      )}
      <span className={styles.right}>
        {currentUser ? (
          <>
            <span className={styles.email}>{currentUser.email}</span>
            <button onClick={handleLogout} className={styles.button}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login" className={styles.link}>Connexion</Link>
        )}
      </span>
    </nav>
  );
}
