export default function HomeLogActivityButton({ setShowLog }) {
  return (
    <div style={{ padding: "0 20px 24px" }}>
      <button onClick={() => setShowLog(true)} style={{
        width: "100%", padding: "16px", borderRadius: 18,
        background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)",
        border: "none", color: "#000", fontSize: 16, fontWeight: 800,
        cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        boxShadow: "0 4px 30px rgba(255,107,53,0.4)", display: "flex",
        alignItems: "center", justifyContent: "center", gap: 10
      }}>
        <span style={{ fontSize: 22 }}>➕</span> Log Today's Activity
      </button>
    </div>
  );
}
