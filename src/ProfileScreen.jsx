import { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { BADGES, calcBadgeXP, getTribeRank } from './badgeService';
import { getUserProfile, getUserChallengePoints, saveProfileAppearance } from './userService';
import { cancelDailyReminder, getDailyReminderLabel, setDailyReminder } from './reminderService';

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

const AVATAR_OPTIONS = [
  ['🔥', '#FF6B35'], ['⚡', '#FFD700'], ['💪', '#F59E0B'], ['🌱', '#34D399'],
  ['🏃', '#34D399'], ['🧘', '#A78BFA'], ['🚴', '#60A5FA'], ['🏊', '#38BDF8'],
  ['👑', '#C084FC'], ['💎', '#38BDF8'], ['🌈', '#C084FC'], ['✨', '#FFD700'],
];

const reminderButtonStyle = (background, color) => ({
  border: 'none',
  borderRadius: 12,
  background,
  color,
  fontSize: 12,
  fontWeight: 800,
  padding: '10px 8px',
  cursor: 'pointer',
});

async function resizeImageToBase64(file, maxDimension = 384, quality = 0.68) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  let currentQuality = quality;
  let base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  while (base64.length > 700000 && currentQuality > 0.35) {
    currentQuality -= 0.1;
    base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  }
  return base64;
}

export default function ProfileScreen({ user, earnedBadges, myHistory, challengeStats, onProfileUpdated, onClose }) {
  const [profile, setProfile]                 = useState(null);
  const [visible, setVisible]                 = useState(false);
  const [challengePoints, setChallengePoints] = useState([]);
  const [showBreakdown, setShowBreakdown]     = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [appearanceError, setAppearanceError] = useState('');
  const [reminderLabel, setReminderLabel] = useState(getDailyReminderLabel());
  const [reminderError, setReminderError] = useState('');
  const fileInputRef = useRef(`profile-photo-${user.uid}`);

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
  const avatarEmoji = profile?.avatarEmoji || rank.icon;
  const avatarColor = profile?.avatarColor || rank.color;
  const profileImageSrc = profile?.profileImageData ? `data:image/jpeg;base64,${profile.profileImageData}` : null;

  const persistAppearance = async ({ profileImageData = profile?.profileImageData, avatarEmoji: emoji = avatarEmoji, avatarColor: color = avatarColor }) => {
    setIsSavingAppearance(true);
    setAppearanceError('');
    try {
      await saveProfileAppearance(user.uid, { profileImageData, avatarEmoji: emoji, avatarColor: color });
      const nextProfile = {
        ...(profile || {}),
        profileImageData: profileImageData || null,
        avatarEmoji: emoji,
        avatarColor: color,
      };
      setProfile(p => ({
        ...(p || {}),
        profileImageData: profileImageData || null,
        avatarEmoji: emoji,
        avatarColor: color,
      }));
      onProfileUpdated?.(nextProfile);
    } catch (err) {
      setAppearanceError(err?.message || 'Could not save profile appearance.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  const handlePhotoUpload = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsSavingAppearance(true);
    setAppearanceError('');
    try {
      const profileImageData = await resizeImageToBase64(file);
      if (profileImageData.length > 900000) {
        throw new Error('Photo is too large. Try a smaller image.');
      }
      await saveProfileAppearance(user.uid, {
        profileImageData,
        avatarEmoji,
        avatarColor,
      });
      setProfile(p => ({ ...(p || {}), profileImageData, avatarEmoji, avatarColor }));
      onProfileUpdated?.({ ...(profile || {}), profileImageData, avatarEmoji, avatarColor });
    } catch (err) {
      setAppearanceError(err?.message || 'Could not upload that photo.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

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

  const handleReminder = async (hour, minute) => {
    setReminderError('');
    try {
      const label = await setDailyReminder(hour, minute);
      setReminderLabel(label);
    } catch (err) {
      setReminderError(err?.message || 'Could not set reminder.');
    }
  };

  const disableReminder = () => {
    cancelDailyReminder();
    setReminderLabel(getDailyReminderLabel());
    setReminderError('');
  };

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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
          <input
            id={fileInputRef.current}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
          />
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setShowAvatarPicker(true)}
              title="Edit profile picture"
              style={{
                width: 68, height: 68, borderRadius: 20,
                background: `${avatarColor}22`, border: `2px solid ${avatarColor}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
                boxShadow: `0 0 24px ${avatarColor}22`,
                overflow: 'hidden', cursor: 'pointer', padding: 0,
              }}
            >
              {profileImageSrc ? (
                <img src={profileImageSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : avatarEmoji}
            </button>
            <label
              htmlFor={fileInputRef.current}
              title="Upload photo"
              style={{
                position: 'absolute', right: -5, bottom: -5,
                width: 26, height: 26, borderRadius: 999,
                border: '1px solid rgba(0,0,0,0.25)', background: ACCENT,
                color: '#111', fontSize: 12, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              📷
            </label>
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
          {isSavingAppearance && (
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${ACCENT}55`, borderTopColor: ACCENT,
              animation: 'spin .8s linear infinite',
            }} />
          )}
        </div>
        {appearanceError && (
          <div style={{
            margin: '-8px 0 18px', padding: '10px 12px',
            borderRadius: 12, border: '1px solid rgba(255,107,53,0.28)',
            background: 'rgba(255,107,53,0.08)', color: '#ffb199',
            fontSize: 12, fontWeight: 700,
          }}>
            {appearanceError}
          </div>
        )}

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

        {/* Daily reminder */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>DAILY REMINDER</p>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: 16, marginBottom: 24,
        }}>
          <div style={{ fontSize: 16, color: '#fff', fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
            {reminderLabel === 'Off' ? 'Reminders are off' : `Reminder set for ${reminderLabel}`}
          </div>
          <div style={{ fontSize: 12, color: '#777', lineHeight: 1.45, marginBottom: 12 }}>
            Browser reminders work while the web app is open. Use the mobile apps for background reminders.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <button onClick={() => handleReminder(8, 0)} style={reminderButtonStyle(ACCENT, '#111')}>Morning</button>
            <button onClick={() => handleReminder(20, 0)} style={reminderButtonStyle(GOLD, '#111')}>Evening</button>
            <button onClick={disableReminder} style={reminderButtonStyle('rgba(255,255,255,0.07)', '#fff')}>Off</button>
          </div>
          {reminderError && (
            <div style={{ marginTop: 10, color: '#ffb199', fontSize: 11, fontWeight: 700 }}>
              {reminderError}
            </div>
          )}
        </div>

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

      {/* ── Avatar picker bottom sheet ── */}
      {showAvatarPicker && (
        <div
          onClick={() => setShowAvatarPicker(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 340,
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
              padding: '20px 24px calc(28px + env(safe-area-inset-bottom))',
              maxHeight: 'calc(100dvh - 20px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>CREATE AVATAR</p>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
                  Choose Your Look
                </h3>
              </div>
              <button onClick={() => setShowAvatarPicker(false)} style={{
                width: 32, height: 32, borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
                color: '#777', cursor: 'pointer', fontSize: 18,
              }}>×</button>
            </div>

            <label
              htmlFor={fileInputRef.current}
              style={{
                width: '100%', minHeight: 46, marginBottom: 16,
                borderRadius: 14, border: `1px solid ${ACCENT}55`,
                background: `${ACCENT}18`, color: ACCENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}
            >
              <span>📷</span>
              Upload Photo
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {AVATAR_OPTIONS.map(([emoji, color]) => (
                <button
                  key={`${emoji}-${color}`}
                  onClick={() => {
                    persistAppearance({ profileImageData: null, avatarEmoji: emoji, avatarColor: color });
                    setShowAvatarPicker(false);
                  }}
                  style={{
                    border: `1.5px solid ${color}55`, borderRadius: 18,
                    background: `${color}22`, height: 70,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 5, cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{emoji}</span>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: color }} />
                </button>
              ))}
            </div>

            {profileImageSrc && (
              <button
                onClick={() => {
                  persistAppearance({ profileImageData: null, avatarEmoji, avatarColor });
                  setShowAvatarPicker(false);
                }}
                style={{
                  width: '100%', marginTop: 16, padding: '12px',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)', color: '#888',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Remove Uploaded Photo
              </button>
            )}
          </div>
        </div>
      )}

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
