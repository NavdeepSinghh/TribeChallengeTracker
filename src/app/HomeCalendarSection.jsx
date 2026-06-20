import { useMemo, useState } from "react";
import CalendarGrid from "./CalendarGrid";
import HomeActivityBreakdown from "./HomeActivityBreakdown";
import { ACTIVITY_TYPES, getEntryActivities } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function HomeCalendarSection({ actCounts, challengeStats, myChallenges, myHistory, setSelectedDay, setTab }) {
  const { theme } = useAppTheme();
  const [showHistory, setShowHistory] = useState(false);
  const historySummary = useMemo(() => {
    const entries = Object.values(myHistory || {});
    const activeDays = entries.filter(entry => getEntryActivities(entry).length > 0).length;
    const totalLogs = entries.reduce((sum, entry) => sum + getEntryActivities(entry).length, 0);
    const topActivity = ACTIVITY_TYPES
      .map(activity => ({ ...activity, count: actCounts?.[activity.id] || 0 }))
      .sort((a, b) => b.count - a.count)[0];

    return {
      activeDays,
      totalLogs,
      topActivity: topActivity?.count > 0 ? topActivity : null,
    };
  }, [actCounts, myHistory]);

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <div style={{
        background: theme.cardBg,
        borderRadius: 16,
        padding: 16,
        border: `1px solid ${theme.cardBorder}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: theme.mutedStrong, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 4px" }}>
              HISTORY
            </p>
            <h2 style={{ color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 18, lineHeight: 1.1, margin: 0 }}>
              {historySummary.activeDays} active day{historySummary.activeDays === 1 ? "" : "s"}
            </h2>
            <p style={{ color: theme.textSoft, fontSize: 12, lineHeight: 1.4, margin: "6px 0 0" }}>
              {historySummary.topActivity
                ? `${historySummary.topActivity.icon} ${historySummary.topActivity.label} leads with ${historySummary.topActivity.count} log${historySummary.topActivity.count === 1 ? "" : "s"}.`
                : "Your calendar and activity mix will build as you log."}
            </p>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              border: `1px solid ${theme.cardBorderStrong}`,
              borderRadius: 12,
              background: theme.cardBgStrong,
              color: "#FF6B35",
              cursor: "pointer",
              flexShrink: 0,
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 900,
              padding: "10px 11px",
              letterSpacing: 1,
            }}
          >
            VIEW
          </button>
        </div>
      </div>

      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 320,
            background: theme.overlayBg,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={event => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 430,
              maxHeight: "86vh",
              overflowY: "auto",
              background: theme.appBg,
              border: `1px solid ${theme.cardBorderStrong}`,
              borderRadius: "24px 24px 0 0",
              padding: "18px 20px 28px",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.32)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <div>
                <p style={{ color: theme.mutedStrong, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 4px" }}>
                  ACTIVITY HISTORY
                </p>
                <h2 style={{ color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 22, lineHeight: 1.1, margin: 0 }}>
                  Calendar & breakdown
                </h2>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  border: `1px solid ${theme.cardBorderStrong}`,
                  background: theme.cardBgStrong,
                  color: theme.mutedStrong,
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ background: theme.cardBg, borderRadius: 16, padding: 16, border: `1px solid ${theme.cardBorder}` }}>
              <CalendarGrid
                challengeStats={challengeStats}
                history={myHistory}
                challenges={myChallenges}
                includeChallengeTimeline={false}
                onDayClick={day => {
                  setShowHistory(false);
                  setSelectedDay(day);
                }}
                setTab={setTab}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {ACTIVITY_TYPES.map(activity => (
                  <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: activity.color }} />
                    <span style={{ fontSize: 9, color: theme.muted, fontFamily: "monospace" }}>{activity.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 20 }}>
              <HomeActivityBreakdown actCounts={actCounts} embedded />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
