import { useEffect } from "react";

export default function BadgeUnlockOverlay({ badge, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3800);
    return () => clearTimeout(t);
  }, [badge.id]);

  return (
    <div onClick={onDismiss} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 32,
    }}>
      <div style={{ textAlign: "center", maxWidth: 300 }}>
        <p style={{ margin: "0 0 20px", fontSize: 10, color: badge.color, fontFamily: "monospace", letterSpacing: 3, fontWeight: 700 }}>✦ BADGE UNLOCKED ✦</p>
        <div style={{
          width: 114, height: 114, borderRadius: 34, margin: "0 auto 22px",
          background: `${badge.color}18`,
          border: `2px solid ${badge.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 58,
          boxShadow: `0 0 60px ${badge.color}55, 0 0 120px ${badge.color}22`,
        }}>
          {badge.icon}
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#fff" }}>
          {badge.label}
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "#888", lineHeight: 1.5 }}>{badge.desc}</p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "9px 20px", borderRadius: 24,
          background: `${badge.color}22`, border: `1px solid ${badge.color}55`,
        }}>
          <span style={{ fontSize: 15 }}>⭐</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: badge.color, fontFamily: "monospace", letterSpacing: 0.5 }}>+{badge.xp} XP EARNED</span>
        </div>
        <p style={{ margin: "18px 0 0", fontSize: 10, color: "#333", fontFamily: "monospace", letterSpacing: 1 }}>TAP TO CONTINUE</p>
      </div>
    </div>
  );
}
