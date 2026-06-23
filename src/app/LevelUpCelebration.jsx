import { levelUpShareText, makeLevelUpShareImageBlob } from "./levelUpShare";

export default function LevelUpCelebration({ levelUp, onDismiss, onLogMore }) {
  if (!levelUp?.rank) return null;
  const { rank, previousRank, rankScore, streak, daysActive } = levelUp;

  const share = async () => {
    const text = levelUpShareText(levelUp);
    try {
      const blob = await makeLevelUpShareImageBlob(levelUp);
      const file = new File([blob], `tribelog-${rank.id || "level"}-level-up.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text, files: [file] });
        return;
      }
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard?.writeText(text);
    } catch (error) {
      await navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 320,
      background: "rgba(0,0,0,0.82)",
      display: "grid",
      placeItems: "center",
      padding: 22,
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes tribe-level-confetti {
          0% { transform: translate3d(0, -80px, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(0, 112vh, 0) rotate(760deg); opacity: 0.08; }
        }
        @keyframes tribe-level-pop {
          0% { transform: scale(.82); opacity: 0; }
          70% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {Array.from({ length: 54 }).map((_, i) => (
        <span key={i} style={{
          position: "absolute",
          top: -80,
          left: `${(i * 47) % 100}%`,
          width: 7 + (i % 4) * 3,
          height: 12 + (i % 5) * 4,
          borderRadius: 4,
          background: [rank.color, "#FF6B35", "#FFD700", "#34D399", "#60A5FA"][i % 5],
          animation: `tribe-level-confetti ${1.8 + (i % 6) * 0.16}s ease-out ${((i % 11) * 0.035)}s both`,
        }} />
      ))}
      <div style={{
        width: "100%",
        maxWidth: 380,
        padding: 24,
        borderRadius: 28,
        background: "linear-gradient(160deg, #15110C 0%, #0B0B0B 62%, #08120E 100%)",
        border: `1px solid ${rank.color}55`,
        boxShadow: `0 24px 70px rgba(0,0,0,0.55), 0 0 80px ${rank.color}22`,
        textAlign: "center",
        animation: "tribe-level-pop .38s ease-out both",
      }}>
        <p style={{ margin: "0 0 12px", fontFamily: "monospace", fontSize: 11, color: rank.color, letterSpacing: 2, fontWeight: 900 }}>
          LEVEL UP
        </p>
        <div style={{ fontSize: 64, marginBottom: 6 }}>{rank.icon}</div>
        <h2 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 30, color: "#fff" }}>
          {rank.label}
        </h2>
        <p style={{ margin: "8px 0 18px", color: "#BDBDBD", fontWeight: 800, lineHeight: 1.35 }}>
          {previousRank?.label ? `You moved up from ${previousRank.label}.` : "You reached a new Tribe status."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
          {[
            ["SCORE", rankScore || 0, rank.color],
            ["STREAK", `${streak || 0}d`, "#FF6B35"],
            ["ACTIVE", daysActive || 0, "#34D399"],
          ].map(([label, value, color]) => (
            <div key={label} style={{
              borderRadius: 15,
              padding: "12px 6px",
              background: `${color}16`,
              border: `1px solid ${color}44`,
            }}>
              <div style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18 }}>{value}</div>
              <div style={{ color: "#777", fontFamily: "monospace", fontWeight: 900, fontSize: 9 }}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={share} style={{
          width: "100%",
          border: 0,
          borderRadius: 17,
          padding: "14px 16px",
          background: rank.color,
          color: "#090909",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 15,
          cursor: "pointer",
        }}>
          Share level card
        </button>
        <button onClick={onLogMore} style={{
          width: "100%",
          marginTop: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 17,
          padding: "13px 16px",
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          fontWeight: 900,
          cursor: "pointer",
        }}>
          Log another activity
        </button>
        <button onClick={onDismiss} style={{
          marginTop: 12,
          border: 0,
          background: "transparent",
          color: "#FF6B35",
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: 900,
          cursor: "pointer",
        }}>
          DONE
        </button>
      </div>
    </div>
  );
}
