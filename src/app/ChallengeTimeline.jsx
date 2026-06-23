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
  const MS_PER_DAY = 86400000;
  const challengeStart = new Date(challenge.startDate);
  challengeStart.setHours(0, 0, 0, 0);
  const challengeEnd = new Date(challenge.endDate);
  challengeEnd.setHours(23, 59, 59, 999);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const daysLeft = Math.max(0, Math.ceil((challengeEnd - today) / MS_PER_DAY));
  const dayNum = Math.min(challenge.duration, Math.max(1, Math.floor((today - challengeStart) / MS_PER_DAY) + 1));
  const totalSlots = 28;
  const rawStartSlot = Math.floor((challengeStart - windowStart) / MS_PER_DAY);
  const rawEndSlot = Math.floor((challengeEnd - windowStart) / MS_PER_DAY);
  const startSlot = Math.min(totalSlots - 1, Math.max(0, rawStartSlot));
  const endSlot = Math.min(totalSlots - 1, Math.max(0, rawEndSlot));
  const visibleSlots = Math.max(1, endSlot - startSlot + 1);
  const leftPct = (startSlot / totalSlots) * 100;
  const availablePct = Math.max(0, 100 - leftPct);
  const widthPct = Math.min(availablePct, Math.max(2, (visibleSlots / totalSlots) * 100));
  const visibleStart = challengeStart < windowStart ? windowStart : challengeStart;
  const elapsedVisibleSlots = Math.min(
    visibleSlots,
    Math.max(0, Math.floor((today - visibleStart) / MS_PER_DAY) + 1)
  );
  const todayPct = Math.min(100, Math.max(0, (elapsedVisibleSlots / visibleSlots) * 100));

  return (
    <div style={{ marginBottom: 14, minWidth: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 6, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: theme.textSoft, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {challenge.emoji} {challenge.name}
        </span>
        <span style={{ flex: "0 0 auto", fontSize: 9, color: theme.mutedStrong, fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>
          DAY {dayNum}/{challenge.duration} · {daysLeft === 0 ? "ENDS TODAY" : `${daysLeft}d LEFT`}
        </span>
      </div>
      <div style={{ position: "relative", height: 8, background: theme.progressTrack, borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, height: "100%",
          left: `${leftPct}%`, width: `${widthPct}%`,
          background: `${challenge.color}33`, borderRadius: 999,
        }} />
        <div style={{
          position: "absolute", top: 0, height: "100%",
          left: `${leftPct}%`, width: `${(widthPct * todayPct) / 100}%`,
          maxWidth: `${availablePct}%`,
          background: challenge.color, borderRadius: 999,
          boxShadow: `0 0 6px ${challenge.color}88`,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 5 }}>
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
