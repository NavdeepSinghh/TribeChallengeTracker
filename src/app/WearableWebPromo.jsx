import { WATCH_OPTIONS } from "../platformService";

export default function WearableWebPromo() {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {WATCH_OPTIONS.map(w => (
          <div key={w.id} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 20, opacity: 0.3 }}>{w.icon}</span>
            <span style={{ fontSize: 9, color: "#555", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{w.label}</span>
            <span style={{
              fontSize: 8, color: "#444", fontFamily: "monospace",
              background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4,
            }}>{w.platformLabel}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 10, background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.15)" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>📱</span>
        <div>
          <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: "#FF6B35" }}>Available on iOS &amp; Android</p>
          <p style={{ margin: 0, fontSize: 10, color: "#666", lineHeight: 1.5 }}>
            The mobile app imports workouts and steps from Apple Health (iPhone) and Health Connect (Android) after permission. It is optional and not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
