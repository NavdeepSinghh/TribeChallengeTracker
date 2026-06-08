import { formatDate, getEntryActivities, today } from "./activityModel";

export default function CalendarDayCell({
  actMap,
  challenge,
  day,
  onDayClick,
}) {
  const entry = day.activity;
  const acts = getEntryActivities(entry);
  const firstAct = acts[0] || null;
  const activityInfo = firstAct ? actMap[firstAct.type] : null;
  const count = acts.length;
  const isToday = day.date === formatDate(today);
  const totalDayPts = acts.reduce((sum, activity) => sum + (activity.points || 0), 0);
  const tip = count === 0 ? day.date
    : acts.map(activity => `${actMap[activity.type]?.icon} ${activity.value}${actMap[activity.type]?.unit}`).join(" · ")
      + ` · ${totalDayPts} pts`;
  const clickable = !!(firstAct || day.date <= formatDate(today));

  return (
    <div title={tip}
      onClick={() => onDayClick && clickable && onDayClick(day)}
      style={{
        width: 36, height: 36, borderRadius: 8, position: "relative",
        background: firstAct ? `${activityInfo?.color}33` : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${isToday ? "#fff" : firstAct ? activityInfo?.color : "rgba(255,255,255,0.06)"}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: clickable ? "pointer" : "default", transition: "all .2s",
        boxShadow: firstAct ? `0 0 8px ${activityInfo?.color}44` : "none",
      }}>
      <span style={{ fontSize: 14 }}>{firstAct ? activityInfo?.icon : ""}</span>
      <span style={{ fontSize: 8, color: "#666", fontFamily: "monospace" }}>{day.day}</span>
      {count > 1 && (
        <div style={{
          position: "absolute", top: -5, right: -5,
          width: 14, height: 14, borderRadius: "50%",
          background: "#FF6B35", border: "2px solid #080808",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, fontWeight: 900, color: "#fff", fontFamily: "monospace", lineHeight: 1,
        }}>{count}</div>
      )}
      {challenge && (
        <div title={`${challenge.name} started`} style={{
          position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
          width: 6, height: 6, borderRadius: "50%",
          background: challenge.color,
          border: "1.5px solid #080808",
          boxShadow: `0 0 4px ${challenge.color}`,
        }} />
      )}
    </div>
  );
}
