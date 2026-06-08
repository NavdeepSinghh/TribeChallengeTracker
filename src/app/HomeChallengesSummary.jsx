export default function HomeChallengesSummary({ challengeStats, setTab }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>YOUR CHALLENGES</p>
      <button onClick={() => setTab("challenges")} style={{
        width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,53,0.2)",
        borderRadius: 16, padding: "16px 20px", cursor: "pointer", textAlign: "left",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "JOINED", value: challengeStats.joined },
            { label: "STARTED", value: challengeStats.owned },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#FF6B35" }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <span style={{ color: "#FF6B35", fontSize: 14, fontFamily: "monospace", fontWeight: 700 }}>VIEW →</span>
      </button>
    </div>
  );
}
