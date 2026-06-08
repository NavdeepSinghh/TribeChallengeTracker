import { isAndroid } from "../platformService";

export default function WearableUnavailable({ openHealthSettings, setSyncState }) {
  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>
        {isAndroid
          ? "Health Connect isn't installed on this device. Get it from the Play Store to enable sync."
          : "Health data isn't available. Check your Health app permissions in Settings."}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setSyncState("idle")} style={{
          flex: 1, padding: "7px", borderRadius: 8,
          background: "none", border: "1px solid rgba(255,255,255,0.07)",
          color: "#555", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
        }}>← Back</button>
        {isAndroid && (
          <button onClick={openHealthSettings} style={{
            flex: 1, padding: "7px", borderRadius: 8,
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
            color: "#34D399", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
          }}>Open Settings</button>
        )}
      </div>
    </div>
  );
}
