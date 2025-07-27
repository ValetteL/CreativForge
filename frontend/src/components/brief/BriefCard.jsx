import ExportBriefPdfButton from "../ExportBriefPdfButton";
import { Link } from "react-router-dom";

export default function BriefCard({ brief, onEdit, onDelete, isDeleting }) {
  return (
    <div className="brief-card">
      <h3>{brief.title || "Sans titre"}</h3>
      <p>{brief.objective}</p>
      <p>{brief.audience}</p>
      <p>{brief.platform}</p>
      <Link to={`/briefs/${brief.id}/edit`} className="button">Edit</Link>
      <button onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Suppression..." : "Supprimer"}
      </button>
      <ExportBriefPdfButton briefId={brief.id} />
    </div>
  );
}
