import { ACCENT } from './challengeTrackerTheme';

const tabs = [
  { id: 'today', label: 'Today', icon: '📋' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'progress', label: 'Progress', icon: '📅' },
];

export default function ChallengeTrackerTabNav({ innerTab, setInnerTab }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setInnerTab(t.id)} style={{
          flex: 1, background: 'none', border: 'none',
          borderBottom: `2px solid ${innerTab === t.id ? ACCENT : 'transparent'}`,
          color: innerTab === t.id ? '#fff' : '#555',
          cursor: 'pointer', padding: '10px 0', fontSize: 11,
          fontWeight: 700, fontFamily: 'monospace', letterSpacing: 0.5,
          transition: 'all .2s',
        }}>
          {t.icon} {t.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
