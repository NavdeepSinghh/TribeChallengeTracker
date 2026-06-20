import { SHARE_TEMPLATES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function HomeShareProgressPanel({
  handleProgressShare,
  handleShareTemplateSelect,
  hasActivePro,
  savingShareTemplate,
  shareTemplateId,
}) {
  const { resolvedMode, theme } = useAppTheme();
  const isDay = resolvedMode === "day";

  return (
    <div style={{ padding: "0 20px" }}>
      <div style={{
        borderRadius: 18, padding: 20,
        background: isDay ? "linear-gradient(135deg, rgba(255,107,53,0.14), rgba(255,255,255,0.94))" : "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.08))",
        border: `1px solid ${isDay ? "rgba(255,107,53,0.28)" : "rgba(255,107,53,0.2)"}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: isDay ? "#B84418" : "#FFD700" }}>Share Your Progress</span>
          <span style={{ fontSize: 18 }}>📤</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          {SHARE_TEMPLATES.map(template => {
            const locked = template.pro && !hasActivePro;
            const active = shareTemplateId === template.id;
            return (
              <button
                key={template.id}
                onClick={() => handleShareTemplateSelect(template.id)}
                disabled={savingShareTemplate}
                style={{
                  padding: "8px 6px",
                  borderRadius: 10,
                  background: active ? "rgba(255,215,0,0.18)" : theme.cardBgStrong,
                  border: active ? "1px solid rgba(190,118,0,0.55)" : `1px solid ${theme.cardBorder}`,
                  color: locked ? theme.muted : theme.text,
                  fontSize: 9,
                  fontWeight: 900,
                  fontFamily: "monospace",
                  cursor: savingShareTemplate ? "default" : "pointer",
                }}
              >
                {locked ? "🔒 " : ""}{template.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Instagram Story", target: "story" },
            { label: "Copy", target: "copy" },
            { label: "WhatsApp", target: "whatsapp" },
          ].map(share => (
            <button key={share.target} onClick={() => handleProgressShare(share.target)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 10,
              background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}`,
              color: theme.text, fontSize: 9, fontWeight: 700, fontFamily: "monospace",
              cursor: "pointer", letterSpacing: 0.3
            }}>{share.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
