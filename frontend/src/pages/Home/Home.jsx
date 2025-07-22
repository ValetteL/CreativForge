import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Bienvenue sur CreativForge</h1>
      <p className={styles.desc}>
        Génère des prompts créatifs, structure tes idées et conserve tes briefs.<br />
        <Link to="/generator" className={styles.cta}>Commencer</Link> ou{" "}
        <Link to="/login" className={styles.cta}>Se connecter</Link>
      </p>
    </div>
  );
}
