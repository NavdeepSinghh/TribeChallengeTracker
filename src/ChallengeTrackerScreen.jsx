import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getTodayLog, logDay, getAllProgress,
  getMemberData, getChallengeLeaderboard, calcPoints,
} from './trackingService';
import { leaveChallenge } from './challengeService';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';

const AVATARS = ['🧡', '💚', '💜', '💙', '🩷', '💛', '🤍', '🖤'];
const avatar  = uid => AVATARS[(uid.charCodeAt(0) + (uid.charCodeAt(1) || 0)) % AVATARS.length];

// Timezone-safe local date string: YYYY-MM-DD
const localDateStr = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const todayStr = () => localDateStr();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function dayNumber(challengeStartDate) {
  // Day number based on challenge startDate string, e.g. '2026-05-25'
  const [y, mo, d] = challengeStartDate.split('-').map(Number);
  const start = new Date(y, mo - 1, d);           // local midnight
  const now   = new Date(); now.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((now - start) / 86400000) + 1);
}

function buildCalendarDays(challenge, _joinedAt, progress) {
  // Build from challenge.startDate so every member sees the same grid
  const [y, mo, d] = challenge.startDate.split('-').map(Number);
  const today = todayStr();
  return Array.from({ length: challenge.duration }, (_, i) => {
    const date    = new Date(y, mo - 1, d + i);   // local date arithmetic
    const dateStr = localDateStr(date);
    return {
      dateStr, dayNum: i + 1,
      log:     progress[dateStr] || null,
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

  const dayNum    = dayNumber(challenge.startDate);
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

  // Parse dates as local midnight to avoid UTC offset shifting day by 1
  const [sy, sm, sd] = challenge.startDate.split('-').map(Number);
  const [ey, em, ed] = challenge.endDate.split('-').map(Number);
  const startDate  = new Date(sy, sm - 1, sd);
  const endDate    = new Date(ey, em - 1, ed);
  const todayMid   = new Date(); todayMid.setHours(0, 0, 0, 0);
  const daysLeft   = Math.max(0, Math.ceil((endDate - todayMid) / 86400000));
  const dayNum     = Math.min(challenge.duration, Math.max(1, Math.floor((todayMid - startDate) / 86400000) + 1));
  const pctDone    = Math.round((dayNum / challenge.duration) * 100);

  const fmtDate = (d) => d.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ padding: '20px 20px 100px' }}>

      {/* Challenge date context banner */}
      <div style={{
        marginBottom: 20, padding: '14px 16px', borderRadius: 14,
        background: `${challenge.color}0d`, border: `1px solid ${challenge.color}33`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>STARTED</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#ccc' }}>{fmtDate(startDate)}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>TODAY</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: challenge.color }}>
              DAY {dayNum}
            </p>
            <p style={{ margin: '1px 0 0', fontSize: 9, color: '#555', fontFamily: 'monospace' }}>OF {challenge.duration}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 2px', fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>ENDS</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#ccc' }}>{fmtDate(endDate)}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            width: `${pctDone}%`,
            background: `linear-gradient(90deg, ${challenge.color}88, ${challenge.color})`,
            boxShadow: `0 0 8px ${challenge.color}66`,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 9, color: '#555', fontFamily: 'monospace', textAlign: 'right' }}>
          {daysLeft === 0 ? 'CHALLENGE ENDS TODAY' : `${daysLeft} DAYS REMAINING`}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
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
      <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
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

      {/* Calendar grid — shows day number + actual date */}
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
              {/* Today indicator dot */}
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

      <p style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', textAlign: 'center', marginTop: 14 }}>
        {Object.keys(progress).length} of {challenge.duration} days logged
      </p>
    </div>
  );
}

// ─── LEAVE CONFIRMATION DIALOG ────────────────────────────────────────────────
function LeaveDialog({ challenge, memberData, onConfirm, onCancel, leaving }) {
  const isAdmin      = memberData?.role === 'admin';
  const isOnlyMember = (challenge.memberCount || 1) <= 1;

  let title, body, confirmLabel, confirmColor;

  if (isAdmin && isOnlyMember) {
    title        = 'Delete this challenge?';
    body         = 'You\'re the only member. Leaving will permanently delete this challenge and all its data. This cannot be undone.';
    confirmLabel = '🗑 Delete Challenge';
    confirmColor = '#ef4444';
  } else if (isAdmin) {
    title        = 'Leave as admin?';
    body         = 'You\'re the admin. The highest-scoring member will automatically be promoted to admin. Your points and streak in this challenge will be removed.';
    confirmLabel = '🚪 Leave & Promote';
    confirmColor = '#FF6B35';
  } else {
    title        = 'Leave this challenge?';
    body         = 'Your points, streak, and progress in this challenge will be removed. You can rejoin later but will start from scratch.';
    confirmLabel = '🚪 Leave Challenge';
    confirmColor = '#FF6B35';
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 0 0',
    }}>
      <div style={{
        width: '100%', maxWidth: 430,
        background: '#161616', borderRadius: '24px 24px 0 0',
        border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none',
        padding: '28px 24px 44px',
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', margin: '0 auto 24px' }} />

        <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 28px', fontSize: 13, color: '#888', lineHeight: 1.6 }}>
          {body}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onConfirm}
            disabled={leaving}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              background: leaving ? 'rgba(255,255,255,0.07)' : confirmColor,
              color: '#fff', fontSize: 15, fontWeight: 800, cursor: leaving ? 'default' : 'pointer',
              fontFamily: "'Syne', sans-serif", letterSpacing: 0.3,
              opacity: leaving ? 0.7 : 1, transition: 'all .2s',
            }}
          >
            {leaving ? '…' : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={leaving}
            style={{
              width: '100%', padding: '13px', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.09)', background: 'none',
              color: '#888', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN TRACKER ─────────────────────────────────────────────────────────────
export default function ChallengeTrackerScreen({ challenge, onBack, onLeft }) {
  const { user }                          = useAuth();
  const [innerTab, setInnerTab]           = useState('today');
  const [memberData, setMemberData]       = useState(null);
  const [showLeaveDialog, setShowLeave]   = useState(false);
  const [leaving, setLeaving]             = useState(false);

  const loadMember = useCallback(() => {
    getMemberData(user.uid, challenge.id).then(setMemberData);
  }, [user.uid, challenge.id]);

  useEffect(() => { loadMember(); }, [loadMember]);

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await leaveChallenge(user.uid, challenge.id);
      onLeft?.();   // refresh parent list + stats
      onBack();     // navigate back to challenges list
    } catch (e) {
      console.error('[Leave]', e);
      setLeaving(false);
      setShowLeave(false);
    }
  };

  const TABS = [
    { id: 'today',       label: 'Today',       icon: '📋' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'progress',    label: 'Progress',    icon: '📅' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'Space Grotesk', sans-serif", color: '#fff', maxWidth: 430, margin: '0 auto' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Leave confirmation sheet */}
      {showLeaveDialog && memberData && (
        <LeaveDialog
          challenge={challenge}
          memberData={memberData}
          leaving={leaving}
          onConfirm={handleLeave}
          onCancel={() => setShowLeave(false)}
        />
      )}

      {/* Header */}
      <div style={{ padding: '52px 20px 0', background: 'linear-gradient(180deg, #0f0f0f, #080808)' }}>
        {/* Back + Leave row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            ← CHALLENGES
          </button>
          <button
            onClick={() => setShowLeave(true)}
            style={{
              background: 'none', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
              color: 'rgba(239,68,68,0.7)', fontSize: 11,
              fontFamily: 'monospace', fontWeight: 700, letterSpacing: 0.5,
              transition: 'all .2s',
            }}
          >
            LEAVE
          </button>
        </div>

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
