import { WATCH_OPTIONS, syncHintText } from "../platformService";

export default function WearableIdleSyncOptions({ handleSync }) {
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {WATCH_OPTIONS.map(w => (
          w.isActive ? (
            <button key={w.id} onClick={handleSync} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
              border: "1px solid rgba(255,107,53,0.45)",
              background: "rgba(255,107,53,0.1)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              transition: "all .2s",
              boxShadow: "0 0 10px rgba(255,107,53,0.2)",
            }}>
              <span style={{ fontSize: 20 }}>{w.icon}</span>
              <span style={{ fontSize: 9, color: "#FF6B35", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{w.label}</span>
              <span style={{ fontSize: 8, color: "#FF6B3599", fontFamily: "monospace" }}>TAP TO SYNC</span>
            </button>
          ) : (
            <div key={w.id} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 20, opacity: 0.25 }}>{w.icon}</span>
              <span style={{ fontSize: 9, color: "#444", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{w.label}</span>
              <span style={{
                fontSize: 8, color: "#444", fontFamily: "monospace",
                background: "rgba(255,255,255,0.04)", padding: "1px 6px", borderRadius: 4,
              }}>{w.platformLabel} only</span>
            </div>
          )
        ))}
      </div>
      {syncHintText && (
        <p style={{ color: "#444", fontSize: 10, margin: 0, fontFamily: "monospace" }}>
          {syncHintText}
        </p>
      )}
    </>
  );
}
