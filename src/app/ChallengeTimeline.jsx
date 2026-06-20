import { useAppTheme } from "./AppThemeContext";

export default function ChallengeTimeline({ challengeStats = { joined: 0, owned: 0 }, challenges, compact = false, setTab, windowStart }) {
  const { theme } = useAppTheme();
  if (!challenges.length) return null;

  return (
    <div style={{ marginTop: compact ? 12 : 16, borderTop: compact ? "none" : `1px solid ${theme.divider}`, paddingTop: compact ? 0 : 14 }}>
      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <p style={{ color: theme.muted, fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: 0 }}>ACTIVE CHALLENGES</p>
          <span style={{ color: theme.mutedStrong, fontSize: 9, fontWeight: 700, fontFamily: "monospace" }}>
            {challengeStats.joined} JOINED · {challengeStats.owned} STARTED
          </span>
        </div>
      )}
      {challenges.map(challenge => (
        <ChallengeTimelineRow key={challenge.id} challenge={challenge} theme={theme} windowStart={windowStart} />
      ))}
      <button
        onClick={() => setTab && setTab("challenges")}
        style={{
          width: "100%",
          marginTop: 2,
          padding: "10px 0 0",
          border: 0,
          borderTop: `1px solid ${theme.divider}`,
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

function ChallengeTimelineRow({ challenge, theme, windowStart }) {
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
        <span style={{ fontSize: 11, fontWeight: 700, color: theme.textSoft }}>
          {challenge.emoji} {challenge.name}
        </span>
        <span style={{ fontSize: 9, color: theme.muted, fontFamily: "monospace", fontWeight: 700 }}>
          DAY {dayNum}/{challenge.duration} · {daysLeft === 0 ? "ENDS TODAY" : `${daysLeft}d LEFT`}
        </span>
      </div>
      <div style={{ position: "relative", height: 6, background: theme.cardBorder, borderRadius: 3 }}>
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
        <span style={{ fontSize: 8, color: theme.muted, fontFamily: "monospace" }}>
          {new Date(challenge.startDate).toLocaleDateString("en", { day: "numeric", month: "short" })}
        </span>
        <span style={{ fontSize: 8, color: theme.muted, fontFamily: "monospace" }}>
          {new Date(challenge.endDate).toLocaleDateString("en", { day: "numeric", month: "short" })}
        </span>
      </div>
    </div>
  );
}
