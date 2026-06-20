import { ACTIVITY_TYPES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function LogActivityForm({
  actInfo,
  note,
  setNote,
  setType,
  type,
  value,
  setValue,
}) {
  const { theme } = useAppTheme();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        {ACTIVITY_TYPES.map(a => (
          <button key={a.id} onClick={() => setType(a.id)} style={{
            padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${type === a.id ? a.color : theme.cardBorder}`,
            background: type === a.id ? `${a.color}22` : theme.cardBg,
            color: theme.text, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            fontSize: 10, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
            boxShadow: type === a.id ? `0 0 12px ${a.color}44` : "none", transition: "all .2s",
          }}>
            <span style={{ fontSize: 20 }}>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", display: "block", marginBottom: 6 }}>
          {actInfo?.unit.toUpperCase()} / AMOUNT
        </label>
        <input value={value} onChange={e => setValue(e.target.value)} type="number" placeholder={`e.g. ${actInfo?.id === "run" ? "5.2" : "45"}`}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${theme.inputBorder}`, background: theme.inputBg, color: theme.text, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", outline: "none" }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", display: "block", marginBottom: 6 }}>NOTE (optional)</label>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="How'd it feel?"
          style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${theme.inputBorder}`, background: theme.inputBg, color: theme.text, fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", outline: "none" }} />
      </div>
    </>
  );
}
