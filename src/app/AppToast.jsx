export default function AppToast({ toast }) {
  if (!toast) return null;

  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
      background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.2)", borderRadius: 40,
      padding: "10px 22px", color: "#fff", fontSize: 14, fontWeight: 700,
      zIndex: 200, whiteSpace: "nowrap", boxShadow: "0 4px 30px rgba(0,0,0,0.5)"
    }}>{toast}</div>
  );
}
