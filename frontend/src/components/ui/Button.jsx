export default function Button({ children, loading, disabled, ...props }) {
  return (
    <button
      className="app-btn"
      disabled={disabled || loading}
      {...props}
      style={{
        padding: "0.6em 1.3em",
        borderRadius: 8,
        border: "none",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #db00ff, #3800af)",
        color: "#fff",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        position: "relative",
        ...props.style
      }}
    >
      {loading ? (
        <span style={{ marginRight: 8, verticalAlign: "middle" }}>
          <span className="spinner" style={{
            border: "3px solid #fff",
            borderTop: "3px solid #db00ff",
            borderRadius: "50%",
            width: 18, height: 18,
            display: "inline-block", animation: "spin 1s linear infinite"
          }} />
        </span>
      ) : null}
      {children}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}
