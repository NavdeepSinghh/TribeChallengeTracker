import CalendarGrid from "./CalendarGrid";
import { ACTIVITY_TYPES } from "./activityModel";

export default function HomeCalendarSection({ challengeStats, myChallenges, myHistory, setSelectedDay, setTab }) {
  return (
    <div style={{ padding: "0 20px 24px" }}>
      <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>28-DAY CALENDAR</p>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
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
              <span style={{ fontSize: 9, color: "#555", fontFamily: "monospace" }}>{activity.icon}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
