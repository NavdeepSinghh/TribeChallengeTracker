export default function WearableSyncError({ handleSync, setSyncState, syncError }) {
  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>{syncError}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setSyncState("idle")} style={{
          flex: 1, padding: "7px", borderRadius: 8,
          background: "none", border: "1px solid rgba(255,255,255,0.07)",
          color: "#555", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
        }}>← Back</button>
        <button onClick={handleSync} style={{
          flex: 1, padding: "7px", borderRadius: 8,
          background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
          color: "#FF6B35", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
        }}>Retry</button>
      </div>
    </div>
  );
}
