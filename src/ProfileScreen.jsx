import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { BADGES, calcBadgeXP, getTribeRank } from './badgeService';
import { getUserProfile, getUserChallengePoints } from './userService';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';

const GOAL_LABELS = {
  lose_weight: 'Lose Weight 🔥', build_muscle: 'Build Muscle 💪',
  endurance: 'Endurance 🏃', stress: 'Reduce Stress 🧘', energy: 'Boost Energy ⚡',
};
const LEVEL_LABELS = {
  beginner: 'Just Starting 🌱', moderate: 'Somewhat Active 🚶',
  fit: 'Pretty Fit 🏃', athlete: 'Very Athletic 🦅',
};
const FREQ_LABELS = {
  '2_3': '2–3× / week', '4_5': '4–5× / week', daily: 'Every day 🔥', flexible: 'Flexible 🎯',
};

export default function ProfileScreen({ user, earnedBadges, myHistory, challengeStats, onClose }) {
  const [profile, setProfile]                 = useState(null);
  const [visible, setVisible]                 = useState(false);
  const [challengePoints, setChallengePoints] = useState([]);
  const [showBreakdown, setShowBreakdown]     = useState(false);

  useEffect(() => {
    getUserProfile(user.uid).then(p => {
      setProfile(p);
      const ids = p?.joinedChallengeIds || [];
      if (ids.length) {
        getUserChallengePoints(user.uid, ids).then(setChallengePoints);
      }
    });
    setTimeout(() => setVisible(true), 40);
  }, [user.uid]);

  const badgeXP    = calcBadgeXP(earnedBadges);
  const rank       = getTribeRank(badgeXP);
  // Count days that have at least one activity (handles both old single-entry and new activities-array format)
  const daysActive = Object.values(myHistory).filter(e =>
    e?.activities ? e.activities.length > 0 : !!e?.type
  ).length;
  const onb        = profile?.onboarding;

  const totalChallengePoints = challengePoints.reduce((s, c) => s + (c.totalPoints || 0), 0);

  const rankedPct = rank.next
    ? Math.min(100, ((badgeXP - rank.min) / (rank.next.min - rank.min)) * 100)
    : 100;

  const memberYear = profile?.createdAt?.toDate?.()?.getFullYear?.() || new Date().getFullYear();

  const statsGrid = [
    { label: 'CHALLENGES JOINED',  value: profile?.stats?.challengesJoined ?? challengeStats.joined, icon: '🎯', color: ACCENT },
    { label: 'CHALLENGES STARTED', value: profile?.stats?.challengesOwned  ?? challengeStats.owned,  icon: '🏆', color: GOLD },
    { label: 'BADGES EARNED',      value: earnedBadges.size, icon: '⭐', color: '#A78BFA' },
    { label: 'TOTAL XP',           value: badgeXP,           icon: rank.icon, color: rank.color },
    {
      label: 'CHALLENGE PTS', value: totalChallengePoints, icon: '🏅', color: '#34D399',
      onClick: () => setShowBreakdown(true),
    },
    { label: 'DAYS ACTIVE', value: daysActive, icon: '📅', color: '#60A5FA' },
  ];

  const prefRows = [
    onb?.goal       && { label: 'GOAL',      value: GOAL_LABELS[onb.goal]      || onb.goal },
    onb?.level      && { label: 'LEVEL',     value: LEVEL_LABELS[onb.level]    || onb.level },
    onb?.frequency  && { label: 'FREQUENCY', value: FREQ_LABELS[onb.frequency] || onb.frequency },
    onb?.motivation && { label: 'DRIVEN BY', value: onb.motivation.replace('_', ' ').toUpperCase() },
  ].filter(Boolean);

  const earnedList = BADGES.filter(b => earnedBadges.has(b.id));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: '#080808',
      overflowY: 'auto',
      maxWidth: 430, margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity .3s ease, transform .3s ease',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
        padding: '48px 24px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>YOUR PROFILE</p>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#888', borderRadius: 20, width: 32, height: 32,
          fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>

      <div style={{ padding: '24px 24px 60px' }}>

        {/* Identity card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
          padding: '20px', borderRadius: 20,
          background: `linear-gradient(135deg, ${rank.color}12, rgba(255,255,255,0.02))`,
          border: `1px solid ${rank.color}33`,
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20, flexShrink: 0,
            background: `${rank.color}22`, border: `2px solid ${rank.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
            boxShadow: `0 0 24px ${rank.color}22`,
          }}>
            {rank.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName || user.email?.split('@')[0] || 'Tribe Member'}
            </h2>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              color: rank.color, background: `${rank.color}18`,
              border: `1px solid ${rank.color}33`, borderRadius: 6, padding: '3px 8px',
            }}>
              {rank.icon} {rank.label}
            </span>
            <p style={{ margin: '6px 0 0', fontSize: 10, color: '#444', fontFamily: 'monospace' }}>
              Member since {memberYear}
            </p>
          </div>
        </div>

        {/* Rank progress bar */}
        {rank.next && (
          <div style={{
            borderRadius: 16, padding: '14px 16px', marginBottom: 20,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                → {rank.next.icon} {rank.next.label}
              </span>
              <span style={{ fontSize: 11, color: rank.color, fontFamily: 'monospace', fontWeight: 700 }}>
                {badgeXP} / {rank.next.min} XP
              </span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5 }}>
              <div style={{
                height: '100%', borderRadius: 5,
                background: `linear-gradient(90deg, ${rank.color}, ${rank.next.color})`,
                width: `${rankedPct}%`, transition: 'width .8s ease',
              }} />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>STATS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {statsGrid.map(s => (
            <div key={s.label} onClick={s.onClick} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 16px',
              border: `1px solid ${s.onClick ? s.color + '44' : 'rgba(255,255,255,0.06)'}`,
              cursor: s.onClick ? 'pointer' : 'default',
              position: 'relative', transition: 'border-color .2s',
            }}>
              {s.onClick && (
                <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 11, color: s.color, opacity: 0.7, fontFamily: 'monospace' }}>→</span>
              )}
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>
                {s.value ?? 0}
              </div>
              <div style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 }}>
                {s.label}
              </div>
              {s.onClick && (
                <div style={{ fontSize: 8, color: s.color, fontFamily: 'monospace', marginTop: 4, opacity: 0.6 }}>
                  TAP FOR BREAKDOWN
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Badges showcase */}
        {earnedList.length > 0 && (
          <>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>
              BADGES ({earnedList.length})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {earnedList.map(b => (
                <div key={b.id} title={`${b.label} — ${b.desc}`} style={{
                  width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                  background: `${b.color}18`, border: `1.5px solid ${b.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, boxShadow: `0 0 12px ${b.color}22`,
                }}>
                  {b.icon}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preferences from onboarding */}
        {prefRows.length > 0 && (
          <>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>PREFERENCES</p>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '0 16px 4px', marginBottom: 24,
            }}>
              {prefRows.map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < prefRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{ fontSize: 9, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: '#ccc', fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Account info */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT</p>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '0 16px 4px',
        }}>
          {[
            { label: 'EMAIL',   value: user.email || '—' },
            { label: 'USER ID', value: (user.uid?.slice(0, 12) || '') + '…' },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{ fontSize: 9, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
              <span style={{ fontSize: 11, color: '#666', fontFamily: 'monospace' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut(auth)}
          style={{
            width: '100%', marginTop: 24, padding: '14px', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: '#666',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
            transition: 'all .2s',
          }}
        >
          Sign Out
        </button>

      </div>

      {/* ── Challenge points breakdown bottom sheet ── */}
      {showBreakdown && (
        <div
          onClick={() => setShowBreakdown(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 350,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 430,
              background: '#111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px 24px 0 0',
              padding: '20px 24px 52px',
              maxHeight: '72vh', overflowY: 'auto',
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

            {/* Sheet header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>PER CHALLENGE</p>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
                  Points Breakdown
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#34D399' }}>
                  {totalChallengePoints}
                </div>
                <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>TOTAL PTS</div>
              </div>
            </div>

            {challengePoints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
                <p style={{ margin: 0, fontSize: 14, color: '#555' }}>No challenge points yet</p>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#444' }}>
                  Log daily tasks inside a challenge to earn points
                </p>
              </div>
            ) : (
              <>
                {challengePoints
                  .slice()
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((c, i, arr) => (
                    <div key={c.challengeId} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                        background: `${c.color}22`, border: `1.5px solid ${c.color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, boxShadow: `0 0 10px ${c.color}22`,
                      }}>
                        {c.emoji}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace', marginTop: 3 }}>
                          {c.daysCompleted} day{c.daysCompleted !== 1 ? 's' : ''} logged
                          {c.currentStreak > 0 ? ` · ${c.currentStreak}🔥 streak` : ''}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: c.color }}>
                          {c.totalPoints}
                        </div>
                        <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>PTS</div>
                      </div>
                    </div>
                  ))
                }

                {/* Grand total row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 16, padding: '12px 16px', borderRadius: 14,
                  background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#888', fontFamily: 'monospace', letterSpacing: 0.5 }}>
                    TOTAL ACROSS ALL CHALLENGES
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#34D399' }}>
                    {totalChallengePoints}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
