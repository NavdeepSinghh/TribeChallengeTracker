import { ACTIVITY_TYPES, today, formatDate, getEntryActivities } from "./activityModel";
import DayDetailEmptyState from "./DayDetailEmptyState";
import DayDetailHeader from "./DayDetailHeader";
import DayDetailLoggedSummary from "./DayDetailLoggedSummary";

export default function DayDetailSheet({ day, onClose, onDeleteActivity, onLogMore }) {
  const actMap = Object.fromEntries(ACTIVITY_TYPES.map(a => [a.id, a]));
  const acts = getEntryActivities(day.activity);
  const total = acts.reduce((s, a) => s + (a.points || 0), 0);
  const dateObj = new Date(day.date + "T12:00:00");
  const label = dateObj.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" });
  const isToday = day.date === formatDate(today);
  const isPast = day.date < formatDate(today);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111", borderRadius: "24px 24px 0 0",
        padding: "28px 24px 40px",
        boxShadow: "0 -10px 60px rgba(0,0,0,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        maxHeight: "75vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />

        <DayDetailHeader isPast={isPast} isToday={isToday} label={label} onClose={onClose} />

        {acts.length === 0 ? (
          <DayDetailEmptyState isPast={isPast} isToday={isToday} onLogMore={onLogMore} />
        ) : (
          <DayDetailLoggedSummary
            actMap={actMap}
            acts={acts}
            isPast={isPast}
            isToday={isToday}
            onDeleteActivity={onDeleteActivity}
            onLogMore={onLogMore}
            total={total}
          />
        )}
      </div>
    </div>
  );
}
