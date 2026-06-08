const dayColor = (day) => {
  if (!day.isPast && !day.isToday) return 'rgba(255,255,255,0.04)';
  if (!day.log) return day.isToday ? 'rgba(255,255,255,0.06)' : 'rgba(255,60,60,0.15)';
  if (day.log.allComplete) return 'rgba(52,211,153,0.25)';
  return 'rgba(255,215,0,0.2)';
};

const dayBorder = (day) => {
  if (day.isToday) return '1.5px solid rgba(255,255,255,0.3)';
  if (!day.log) return '1px solid rgba(255,255,255,0.06)';
  if (day.log.allComplete) return '1px solid rgba(52,211,153,0.4)';
  return '1px solid rgba(255,215,0,0.3)';
};

export default function ProgressCalendarGrid({ challenge, days }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
      {days.map(day => {
        const d = new Date(day.dateStr);
        const monthDay = d.getDate();
        const monthLabel = d.toLocaleDateString('en', { month: 'short' });
        const isFirstOfMonth = monthDay === 1;
        return (
          <div key={day.dateStr}
            title={`Day ${day.dayNum} · ${d.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}${day.log ? ` · ${day.log.points} pts` : ''}`}
            style={{
              aspectRatio: '1', borderRadius: 8, position: 'relative',
              background: dayColor(day),
              border: dayBorder(day),
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 1,
            }}>
            <span style={{ fontSize: 10, color: day.isToday ? '#fff' : '#666', fontFamily: 'monospace', fontWeight: day.isToday ? 900 : 500, lineHeight: 1 }}>
              {day.dayNum}
            </span>
            <span style={{ fontSize: 7, color: '#444', fontFamily: 'monospace', lineHeight: 1 }}>
              {isFirstOfMonth ? monthLabel : monthDay}
            </span>
            {day.isToday && (
              <div style={{
                position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: '50%',
                background: challenge.color,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
