import ChallengeTimeline from "./ChallengeTimeline";
import { formatDate, today } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function HomeChallengesSection({ challengeStats, myChallenges = [], setTab }) {
  const { theme } = useAppTheme();
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - 27);
  windowStart.setHours(0, 0, 0, 0);

  const activeChallenges = myChallenges.filter(challenge =>
    challenge.startDate <= formatDate(today) && challenge.endDate >= formatDate(windowStart)
  );

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <div style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 16,
        padding: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <p style={{ color: theme.mutedStrong, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 4px" }}>
              CHALLENGES
            </p>
            <h2 style={{ color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 18, lineHeight: 1.1, margin: 0 }}>
              {activeChallenges.length ? `${activeChallenges.length} active` : "No active challenges"}
            </h2>
          </div>
          <button
            onClick={() => setTab && setTab("challenges")}
            style={{
              border: `1px solid ${theme.cardBorderStrong}`,
              borderRadius: 12,
              background: theme.cardBgStrong,
              color: "#FF6B35",
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 900,
              padding: "9px 10px",
              letterSpacing: 1,
            }}
          >
            VIEW
          </button>
        </div>

        {activeChallenges.length ? (
          <ChallengeTimeline
            challengeStats={challengeStats}
            challenges={activeChallenges.slice(0, 3)}
            compact
            setTab={setTab}
            windowStart={windowStart}
          />
        ) : (
          <p style={{ color: theme.textSoft, fontSize: 12, lineHeight: 1.45, margin: "12px 0 0" }}>
            Join a challenge when you want structure. For now, just log today.
          </p>
        )}
      </div>
    </div>
  );
}
