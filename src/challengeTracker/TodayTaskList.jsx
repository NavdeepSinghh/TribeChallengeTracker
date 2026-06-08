import { ACCENT } from './challengeTrackerTheme';

export default function TodayTaskList({ checked, tasks, todayLog, toggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
      {tasks.map(task => {
        const done = checked.has(task.id);
        return (
          <button key={task.id} onClick={() => toggle(task.id)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px', borderRadius: 14, cursor: todayLog ? 'default' : 'pointer',
            background: done ? `rgba(255,107,53,0.1)` : 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${done ? ACCENT : 'rgba(255,255,255,0.08)'}`,
            transition: 'all .2s', textAlign: 'left',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0,
              background: done ? ACCENT : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${done ? ACCENT : 'rgba(255,255,255,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, transition: 'all .2s',
            }}>
              {done ? '✓' : ''}
            </div>
            <span style={{ fontSize: 20 }}>{task.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: done ? '#fff' : '#aaa', flex: 1 }}>
              {task.label}
            </span>
            <span style={{ fontSize: 11, color: done ? ACCENT : '#444', fontFamily: 'monospace', fontWeight: 700, flexShrink: 0 }}>
              +{10}
            </span>
          </button>
        );
      })}
    </div>
  );
}
