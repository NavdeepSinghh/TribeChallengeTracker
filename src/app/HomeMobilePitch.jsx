import { isWeb } from "../platformService";

export default function HomeMobilePitch() {
  if (!isWeb) return null;

  return (
    <div style={{ padding: "16px 20px 0" }}>
      <div style={{
        borderRadius: 16, padding: "14px 16px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", gap: 14, alignItems: "center",
      }}>
        <span style={{ fontSize: 30, flexShrink: 0 }}>📱</span>
        <div>
          <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: "#666" }}>More on the mobile app</p>
          <p style={{ margin: 0, fontSize: 11, color: "#444", lineHeight: 1.5 }}>
            Auto-sync from <span style={{ color: "#666" }}>Apple Watch</span> &amp; <span style={{ color: "#666" }}>Galaxy Watch</span>, push notifications for challenges and more — iOS &amp; Android coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
