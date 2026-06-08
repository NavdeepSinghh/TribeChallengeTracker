import { ACTIVITY_TYPES, today, formatDate, getCalendarDays } from "./activityModel";
import CalendarDayCell from "./CalendarDayCell";
import ChallengeTimeline from "./ChallengeTimeline";

export default function CalendarGrid({ history, challenges = [], onDayClick }) {
  const days = getCalendarDays(history);
  const actMap = Object.fromEntries(ACTIVITY_TYPES.map(a => [a.id, a]));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - 27);
  windowStart.setHours(0, 0, 0, 0);

  const challengeStartMap = {};
  challenges.forEach(c => {
    if (c.startDate >= formatDate(windowStart) && c.startDate <= formatDate(today)) {
      challengeStartMap[c.startDate] = c;
    }
  });

  const activeChallenges = challenges.filter(c =>
    c.startDate <= formatDate(today) && c.endDate >= formatDate(windowStart)
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(w => (
          <div key={w} style={{ width: 36, textAlign: "center", fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 0.5, fontFamily: "monospace" }}>{w}</div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {week.map((d, di) => {
            const startChallenge = challengeStartMap[d.date];
            return (
              <CalendarDayCell
                key={di}
                actMap={actMap}
                challenge={startChallenge}
                day={d}
                onDayClick={onDayClick}
              />
            );
          })}
        </div>
      ))}

      <ChallengeTimeline challenges={activeChallenges} windowStart={windowStart} />
    </div>
  );
}
