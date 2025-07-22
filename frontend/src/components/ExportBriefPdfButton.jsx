import React, { useState } from "react";
import toast from "react-hot-toast";
import styles from "./ExportBriefPdfButton.module.css";

export default function ExportBriefPdfButton({ briefId }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPdf = async () => {
    setIsLoading(true);
    const token = JSON.parse(localStorage.getItem("currentUser"))?.token;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/export/brief/pdf/${briefId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `creative-brief-${briefId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF exporté !");
    } catch {
      toast.error("Impossible d'exporter le PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleExportPdf} disabled={isLoading} className={styles.button}>
      {isLoading ? "Export en cours..." : "Exporter le PDF"}
    </button>
  );
}
