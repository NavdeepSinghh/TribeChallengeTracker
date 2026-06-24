import { GOLD } from './challengeTrackerTheme';

export default function TodayPointsCard({ checked, preview, tasks, todayLog }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '14px 18px', marginBottom: 20,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>TODAY'S CHALLENGE PTS</p>
        <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: GOLD }}>
          +{todayLog ? todayLog.points : preview}
        </p>
      </div>
      {!todayLog && checked.size === tasks.length && (
        <div style={{
          fontSize: 11, color: '#34D399', fontFamily: 'monospace', fontWeight: 700,
          background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
          borderRadius: 8, padding: '5px 10px',
        }}>
          +{20} BONUS
        </div>
      )}
      {todayLog && (
        <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
          {todayLog.completedTasks.length}/{tasks.length} tasks
        </div>
      )}
    </div>
  );
}
