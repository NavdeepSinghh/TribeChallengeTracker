import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getTodayLog, logDay, getAllProgress,
  getMemberData, getChallengeLeaderboard, calcPoints,
} from './trackingService';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';

const AVATARS = ['🧡', '💚', '💜', '💙', '🩷', '💛', '🤍', '🖤'];
const avatar  = uid => AVATARS[(uid.charCodeAt(0) + (uid.charCodeAt(1) || 0)) % AVATARS.length];

const todayStr = () => new Date().toISOString().split('T')[0];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function dayNumber(joinedAt) {
  const joined = joinedAt?.toDate ? joinedAt.toDate() : new Date(joinedAt || Date.now());
  joined.setHours(0, 0, 0, 0);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((now - joined) / 86400000) + 1);
}

function buildCalendarDays(challenge, joinedAt, progress) {
  const start = joinedAt?.toDate ? joinedAt.toDate() : new Date(joinedAt || Date.now());
  start.setHours(0, 0, 0, 0);
  const today = todayStr();
  return Array.from({ length: challenge.duration }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      dateStr, dayNum: i + 1,
      log: progress[dateStr] || null,
      isToday: dateStr === today,
      isPast:  dateStr <  today,
    };
  });
}

// ─── TODAY TAB ────────────────────────────────────────────────────────────────
function TodayTab({ challenge, memberData, onLogged }) {
  const { user }                  = useAuth();
  const [checked, setChecked]     = useState(new Set());
  const [todayLog, setTodayLog]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    getTodayLog(user.uid, challenge.id).then(log => {
      if (log) {
        setTodayLog(log);
        setChecked(new Set(log.completedTasks));
      }
      setLoading(false);
    });
  }, [challenge.id, user.uid]);

  const toggle = (taskId) => {
    if (todayLog) return; // readonly after logging
    setChecked(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const handleLog = async () => {
    if (!checked.size || saving) return;
    setSaving(true);
    const result = await logDay(user.uid, challenge.id, [...checked], challenge.tasks.length);
    setTodayLog({ completedTasks: [...checked], points: result.points, allComplete: result.allComplete });
    setToast(`🎉 +${result.points} pts${result.allComplete ? ' · Full day!' : ''}${result.newStreak > 1 ? ` · 🔥 ${result.newStreak} streak` : ''}`);
    setTimeout(() => setToast(null), 3500);
    onLogged?.();
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading…</div>;

  const dayNum    = dayNumber(memberData?.joinedAt);
  const preview   = calcPoints(checked.size, challenge.tasks.length);
  const allDone   = todayLog?.allComplete;

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 40,
          padding: '10px 22px', color: '#fff', fontSize: 14, fontWeight: 700,
          zIndex: 300, whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}

      {/* Day header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
            DAY {dayNum} OF {challenge.duration}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
            {todayLog ? (allDone ? "Day complete! 🎉" : "Progress saved ✓") : "Today's Tasks"}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: ACCENT }}>
            {memberData?.currentStreak || 0}
          </div>
          <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>STREAK 🔥</div>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {challenge.tasks.map(task => {
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

      {/* Points preview */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '14px 18px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>TODAY'S POINTS</p>
          <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: GOLD }}>
            +{todayLog ? todayLog.points : preview}
          </p>
        </div>
        {!todayLog && checked.size === challenge.tasks.length && (
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
            {todayLog.completedTasks.length}/{challenge.tasks.length} tasks
          </div>
        )}
      </div>

      {/* CTA */}
      {!todayLog ? (
        <button onClick={handleLog} disabled={!checked.size || saving} style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none',
          background: checked.size
            ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})`
            : 'rgba(255,255,255,0.06)',
          color: checked.size ? '#000' : '#444',
          fontSize: 15, fontWeight: 800,
          cursor: checked.size ? 'pointer' : 'default',
          fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
          boxShadow: checked.size ? `0 4px 20px rgba(255,107,53,0.35)` : 'none',
          opacity: saving ? 0.7 : 1, transition: 'all .2s',
        }}>
          {saving ? '…' : `Log Day ${dayNum} → +${preview} pts`}
        </button>
      ) : (
        <div style={{
          textAlign: 'center', padding: '14px', borderRadius: 14,
          background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#34D399', fontWeight: 700 }}>
            ✅ Logged — see you tomorrow!
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
            Total so far: {(memberData?.totalPoints || 0) + (todayLog?.points || 0)} pts
          </p>
        </div>
      )}
    </div>
  );
}

// ─── LEADERBOARD TAB ──────────────────────────────────────────────────────────
function LeaderboardTab({ challenge, currentUid }) {
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getChallengeLeaderboard(challenge.id).then(m => { setMembers(m); setLoading(false); });
  }, [challenge.id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading…</div>;

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 16px' }}>
        {challenge.name.toUpperCase()} · {members.length} MEMBERS
      </p>

      {members.map((m, i) => {
        const isMe   = m.uid === currentUid;
        const rank   = i + 1;
        const medal  = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
        return (
          <div key={m.uid} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 16, marginBottom: 8,
            background: isMe
              ? 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.06))'
              : 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${isMe ? 'rgba(255,107,53,0.35)' : 'rgba(255,255,255,0.06)'}`,
          }}>
            <div style={{ fontSize: 20, width: 30, textAlign: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              {medal}
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              {avatar(m.uid)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: isMe ? GOLD : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isMe ? 'You' : (m.displayName || 'Member')}
                </span>
                {(m.currentStreak || 0) >= 3 && (
                  <span style={{ fontSize: 11 }} title={`${m.currentStreak} day streak`}>🔥</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>
                {m.daysCompleted || 0} days · {m.currentStreak || 0} streak
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank === 1 ? GOLD : '#fff' }}>
                {m.totalPoints || 0}
              </div>
              <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>PTS</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────
function ProgressTab({ challenge, memberData }) {
  const { user }              = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getAllProgress(user.uid, challenge.id).then(p => { setProgress(p); setLoading(false); });
  }, [challenge.id, user.uid]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading…</div>;

  const days = buildCalendarDays(challenge, memberData?.joinedAt, progress);

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

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'POINTS',   value: memberData?.totalPoints   || 0, color: GOLD  },
          { label: 'DAYS',     value: memberData?.daysCompleted || 0, color: '#34D399' },
          { label: 'BEST STK', value: memberData?.longestStreak || 0, color: ACCENT },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '14px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        {[
          { color: 'rgba(52,211,153,0.35)',  label: 'Full day' },
          { color: 'rgba(255,215,0,0.25)',   label: 'Partial' },
          { color: 'rgba(255,60,60,0.2)',    label: 'Missed' },
          { color: 'rgba(255,255,255,0.06)', label: 'Upcoming' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            <span style={{ fontSize: 9, color: '#555', fontFamily: 'monospace' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {days.map(day => (
          <div key={day.dateStr} title={`Day ${day.dayNum} · ${day.dateStr}${day.log ? ` · ${day.log.points}pts` : ''}`}
            style={{
              aspectRatio: '1', borderRadius: 8,
              background: dayColor(day),
              border: dayBorder(day),
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <span style={{ fontSize: 9, color: day.isToday ? '#fff' : '#555', fontFamily: 'monospace', fontWeight: day.isToday ? 700 : 400 }}>
              {day.dayNum}
            </span>
          </div>
        ))}
      </div>

      <p style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', textAlign: 'center', marginTop: 14 }}>
        {Object.keys(progress).length} of {challenge.duration} days logged
      </p>
    </div>
  );
}

// ─── MAIN TRACKER ─────────────────────────────────────────────────────────────
export default function ChallengeTrackerScreen({ challenge, onBack }) {
  const { user }                    = useAuth();
  const [innerTab, setInnerTab]     = useState('today');
  const [memberData, setMemberData] = useState(null);

  const loadMember = useCallback(() => {
    getMemberData(user.uid, challenge.id).then(setMemberData);
  }, [user.uid, challenge.id]);

  useEffect(() => { loadMember(); }, [loadMember]);

  const TABS = [
    { id: 'today',       label: 'Today',       icon: '📋' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'progress',    label: 'Progress',    icon: '📅' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'Space Grotesk', sans-serif", color: '#fff', maxWidth: 430, margin: '0 auto' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: '52px 20px 0', background: 'linear-gradient(180deg, #0f0f0f, #080808)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, padding: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← CHALLENGES
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${challenge.color}22`, border: `1.5px solid ${challenge.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {challenge.emoji}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>{challenge.name}</h2>
            <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>
              {challenge.duration} DAYS · {(memberData?.totalPoints || 0)} PTS TOTAL
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(t => (
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
      </div>

      {/* Tab content */}
      {innerTab === 'today' && (
        <TodayTab challenge={challenge} memberData={memberData} onLogged={loadMember} />
      )}
      {innerTab === 'leaderboard' && (
        <LeaderboardTab challenge={challenge} currentUid={user.uid} />
      )}
      {innerTab === 'progress' && (
        <ProgressTab challenge={challenge} memberData={memberData} />
      )}
    </div>
  );
}
