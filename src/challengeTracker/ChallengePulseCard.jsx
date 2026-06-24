import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../AuthContext';
import { getAllProgress } from '../trackingService';
import { buildChallengePulse } from './challengePulse';
import { ACCENT, GOLD } from './challengeTrackerTheme';

export default function ChallengePulseCard({ challenge, memberData, progress: providedProgress = null }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(providedProgress || {});
  const [loading, setLoading] = useState(!providedProgress);

  useEffect(() => {
    if (providedProgress) {
      setProgress(providedProgress);
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    getAllProgress(user.uid, challenge.id).then(result => {
      if (!active) return;
      setProgress(result || {});
      setLoading(false);
    });
    return () => { active = false; };
  }, [challenge.id, providedProgress, user.uid]);

  const pulse = useMemo(
    () => buildChallengePulse({ challenge, tasks: challenge.tasks, progress, memberData }),
    [challenge, memberData, progress]
  );

  const tracks = pulse.focus.length ? pulse.focus.join(' · ') : 'daily challenge habits';

  return (
    <div style={{
      margin: '14px 20px 0',
      padding: 16,
      borderRadius: 18,
      background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.06))',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ color: '#888', fontSize: 10, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            CHALLENGE PULSE
          </div>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, marginTop: 3 }}>
            {pulse.hasLogs ? 'What you have built here' : `Tracks ${tracks}`}
          </div>
        </div>
        <div style={{ color: ACCENT, fontSize: 20 }}>⚡</div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[0, 1, 2, 3].map(item => (
            <div key={item} style={{ height: 66, borderRadius: 14, background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : pulse.metrics.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
          {pulse.metrics.map(metric => (
            <div key={`${metric.label}-${metric.value}`} style={{
              minHeight: 76,
              padding: '10px 8px',
              borderRadius: 14,
              background: 'rgba(0,0,0,0.22)',
              border: '1px solid rgba(255,255,255,0.07)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, lineHeight: 1 }}>{metric.icon}</div>
              <div style={{ color: metric.id === 'points' ? GOLD : '#fff', fontSize: 17, fontWeight: 900, fontFamily: "'Syne', sans-serif", marginTop: 4 }}>
                {metric.value}
              </div>
              <div style={{ color: '#666', fontSize: 8, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 0.4, marginTop: 2 }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, color: '#777', fontSize: 12, lineHeight: 1.5 }}>
          Log this challenge once and this card will turn your checklist into simple totals.
        </p>
      )}
    </div>
  );
}
