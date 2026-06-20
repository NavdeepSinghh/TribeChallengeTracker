import CalendarGrid from "./CalendarGrid";
import { ACTIVITY_TYPES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function HomeCalendarSection({ challengeStats, myChallenges, myHistory, setSelectedDay, setTab }) {
  const { theme } = useAppTheme();

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <p style={{ color: theme.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>28-DAY CALENDAR</p>
      <div style={{ background: theme.cardBg, borderRadius: 16, padding: 16, border: `1px solid ${theme.cardBorder}` }}>
        <CalendarGrid
          challengeStats={challengeStats}
          history={myHistory}
          challenges={myChallenges}
          onDayClick={setSelectedDay}
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
    </div>
  );
}
