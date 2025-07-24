export default function Loader({ message = "Loading..." }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px"
    }}>
      <span className="spinner" style={{
        border: "4px solid #333",
        borderTop: "4px solid #db00ff",
        borderRadius: "50%",
        width: 32, height: 32, marginRight: 10, animation: "spin 0.8s linear infinite"
      }} />
      <span>{message}</span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
