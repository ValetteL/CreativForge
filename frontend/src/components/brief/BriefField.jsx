import styles from "./BriefField.module.css";

/**
 * Reusable component for editing or regenerating a single brief field.
 */
export default function BriefField({ label, value, onRegenerate, loading }) {
  return (
    <div className={styles.field}>
      <b>{label} :</b> <span>{value}</span>
      <button onClick={onRegenerate} disabled={loading} className="button button-small" style={{ marginLeft: 10 }}>
        {loading ? "..." : "Régénérer"}
      </button>
    </div>
  );
}
