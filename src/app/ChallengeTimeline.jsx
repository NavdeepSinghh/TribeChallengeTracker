export default function ChallengeTimeline({ challengeStats = { joined: 0, owned: 0 }, challenges, setTab, windowStart }) {
  if (!challenges.length) return null;

  return (
    <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <p style={{ color: "#444", fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: 0 }}>ACTIVE CHALLENGES</p>
        <span style={{ color: "#555", fontSize: 9, fontWeight: 700, fontFamily: "monospace" }}>
          {challengeStats.joined} JOINED · {challengeStats.owned} STARTED
        </span>
      </div>
      {challenges.map(challenge => (
        <ChallengeTimelineRow key={challenge.id} challenge={challenge} windowStart={windowStart} />
      ))}
      <button
        onClick={() => setTab && setTab("challenges")}
        style={{
          width: "100%",
          marginTop: 2,
          padding: "10px 0 0",
          border: 0,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "transparent",
          color: "#FF6B35",
          cursor: "pointer",
          fontSize: 10,
          fontFamily: "monospace",
          fontWeight: 800,
          letterSpacing: 1,
          textAlign: "right",
        }}
      >
        VIEW CHALLENGES →
      </button>
    </div>
  );
}

function ChallengeTimelineRow({ challenge, windowStart }) {
  const challengeStart = new Date(challenge.startDate);
  challengeStart.setHours(0, 0, 0, 0);
  const challengeEnd = new Date(challenge.endDate);
  challengeEnd.setHours(23, 59, 59, 999);
  const daysLeft = Math.max(0, Math.ceil((challengeEnd - new Date()) / 86400000));
  const dayNum = Math.min(challenge.duration, Math.max(1, Math.floor((new Date() - challengeStart) / 86400000) + 1));
  const totalDays = 27;
  const barStartDay = Math.max(0, Math.floor((challengeStart - windowStart) / 86400000));
  const barEndDay = Math.min(totalDays, Math.floor((challengeEnd - windowStart) / 86400000));
  const leftPct = (barStartDay / totalDays) * 100;
  const widthPct = Math.max(2, ((barEndDay - barStartDay + 1) / totalDays) * 100);
  const todayPct = Math.min(100, Math.max(0, ((totalDays - barStartDay) / Math.max(1, barEndDay - barStartDay + 1)) * 100));

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#ccc" }}>
          {challenge.emoji} {challenge.name}
        </span>
        <span style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700 }}>
          DAY {dayNum}/{challenge.duration} · {daysLeft === 0 ? "ENDS TODAY" : `${daysLeft}d LEFT`}
        </span>
      </div>
      <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
        <div style={{
          position: "absolute", top: 0, height: "100%",
          left: `${leftPct}%`, width: `${widthPct}%`,
          background: `${challenge.color}55`, borderRadius: 3,
        }} />
        <div style={{
          position: "absolute", top: 0, height: "100%",
          left: `${leftPct}%`, width: `${(widthPct * todayPct) / 100}%`,
          background: challenge.color, borderRadius: 3,
          boxShadow: `0 0 6px ${challenge.color}88`,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 8, color: "#444", fontFamily: "monospace" }}>
          {new Date(challenge.startDate).toLocaleDateString("en", { day: "numeric", month: "short" })}
        </span>
        <span style={{ fontSize: 8, color: "#444", fontFamily: "monospace" }}>
          {new Date(challenge.endDate).toLocaleDateString("en", { day: "numeric", month: "short" })}
        </span>
      </div>
    </div>
  );
}
