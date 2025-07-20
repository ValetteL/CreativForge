import ExportBriefPdfButton from "../ExportBriefPdfButton";

export default function BriefCard({ brief, onEdit, onDelete }) {
  return (
    <div className="brief-card">
      <h3>{brief.title || "Sans titre"}</h3>
      <p>{brief.objective}</p>
      <p>{brief.audience}</p>
      <p>{brief.platform}</p>
      <button onClick={onEdit}>Modifier</button>
      <button onClick={onDelete}>Supprimer</button>
      <ExportBriefPdfButton briefId={brief.id} />
    </div>
  );
}
