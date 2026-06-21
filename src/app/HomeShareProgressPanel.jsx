import { SHARE_TEMPLATES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

const templateDescriptions = {
  classic: "Clean orange card",
  gold: "Warmer premium look",
  neon: "High-energy story look",
};

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
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: isDay ? "#B84418" : "#FFD700" }}>Share Your Progress</div>
            <div style={{ marginTop: 3, fontSize: 11, fontWeight: 600, color: theme.textSoft }}>
              Pick a card style, then choose where to share it.
            </div>
          </div>
          <span style={{ fontSize: 18 }}>📤</span>
        </div>
        <div style={{ margin: "0 0 8px", color: theme.muted, fontSize: 9, fontWeight: 900, fontFamily: "monospace", letterSpacing: 1 }}>
          CARD LOOK
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
                <span style={{ display: "block" }}>{locked ? "🔒 " : ""}{template.label}</span>
                <span style={{ display: "block", marginTop: 3, color: theme.muted, fontSize: 8, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>
                  {templateDescriptions[template.id] || "Share card style"}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ margin: "0 0 8px", color: theme.muted, fontSize: 9, fontWeight: 900, fontFamily: "monospace", letterSpacing: 1 }}>
          POST OR SEND
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Story", helper: "Instagram", target: "story" },
            { label: "Copy", helper: "Text only", target: "copy" },
            { label: "WhatsApp", helper: "Opens chat", target: "whatsapp" },
          ].map(share => (
            <button key={share.target} onClick={() => handleProgressShare(share.target)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 10,
              background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}`,
              color: theme.text, fontSize: 9, fontWeight: 700, fontFamily: "monospace",
              cursor: "pointer", letterSpacing: 0.3
            }}>
              <span style={{ display: "block" }}>{share.label}</span>
              <span style={{ display: "block", marginTop: 3, color: theme.muted, fontSize: 8, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>
                {share.helper}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
