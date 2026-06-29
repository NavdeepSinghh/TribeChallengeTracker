import { useEffect, useState } from 'react';
import {
  fetchPublicRoutinesForProfile,
  followUser,
  getFollowStatus,
  unfollowUser,
} from '../userServices/followService';
import { useAppTheme } from './AppThemeContext';

export default function PublicProfileSheet({ currentUser, onClose, onUseRoutine, profile }) {
  const { resolvedMode, theme } = useAppTheme();
  const isDay = resolvedMode === 'day';
  const [routines, setRoutines] = useState([]);
  const [followStatus, setFollowStatus] = useState('none');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadProfileDetails() {
      if (!profile?.uid || !currentUser?.uid) return;
      setIsLoading(true);
      setMessage('');
      try {
        const [status, publicRoutines] = await Promise.all([
          getFollowStatus(currentUser.uid, profile.uid),
          fetchPublicRoutinesForProfile(profile.uid, currentUser.uid),
        ]);
        if (!cancelled) {
          setFollowStatus(status);
          setRoutines(publicRoutines);
        }
      } catch (error) {
        if (!cancelled) setMessage('Could not load this profile yet.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfileDetails();
    return () => { cancelled = true; };
  }, [currentUser?.uid, profile?.uid]);

  async function toggleFollow() {
    if (!currentUser?.uid || !profile?.uid) return;
    const nextStatus = followStatus === 'following' ? 'none' : 'following';
    const previousStatus = followStatus;
    setFollowStatus(nextStatus);
    setMessage('');
    try {
      if (previousStatus === 'following') {
        await unfollowUser(currentUser.uid, profile.uid);
      } else {
        await followUser(currentUser.uid, profile);
      }
    } catch (error) {
      setFollowStatus(previousStatus);
      setMessage(error.message || 'Could not update follow status.');
    }
  }

  if (!profile) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: 'rgba(0,0,0,0.58)',
      display: 'grid',
      placeItems: 'end center',
      padding: '20px 14px max(env(safe-area-inset-bottom), 18px)',
    }}>
      <div style={{
        width: 'min(680px, 100%)',
        maxHeight: '88vh',
        overflow: 'auto',
        borderRadius: 22,
        background: theme.bg,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        padding: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: profile.avatarColor || '#FFD700',
            fontSize: 28,
            flex: '0 0 auto',
          }}>
            {profile.avatarEmoji || '✨'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 4px', color: theme.mutedStrong, fontSize: 10, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1 }}>
              PUBLIC PROFILE
            </p>
            <h3 style={{ margin: 0, color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 950 }}>
              {profile.displayName || 'Tribe Member'}
            </h3>
            <p style={{ margin: '6px 0 0', color: theme.textSoft, fontSize: 12, lineHeight: 1.4 }}>
              🔥 {profile.currentStreak || 0} day streak
              {profile.bio ? ` · ${profile.bio}` : ''}
            </p>
          </div>
          <button onClick={onClose} style={circleButtonStyle(theme)}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          <ProfileStat label="TRIBE SCORE" value={profile.totalPoints || 0} color="#FFD700" theme={theme} />
          <ProfileStat label="BADGE XP" value={profile.badgeXp || 0} color="#FF6B35" theme={theme} />
          <ProfileStat label="ROUTINES" value={routines.length} color="#34D399" theme={theme} />
        </div>

        <button
          type="button"
          onClick={toggleFollow}
          disabled={followStatus === 'self'}
          style={{
            width: '100%',
            border: `1px solid ${followStatus === 'following' ? theme.cardBorder : 'transparent'}`,
            borderRadius: 14,
            padding: '13px 12px',
            background: followStatus === 'following' ? theme.cardBgStrong : 'linear-gradient(135deg, #FF6B35, #FFD700)',
            color: followStatus === 'following' ? theme.text : '#111',
            fontSize: 13,
            fontWeight: 950,
            cursor: followStatus === 'self' ? 'default' : 'pointer',
            marginBottom: 16,
          }}
        >
          {followStatus === 'following' ? 'Following' : 'Follow'}
        </button>

        <p style={{ margin: '0 0 8px', color: theme.mutedStrong, fontSize: 10, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1 }}>
          SHARED ROUTINES
        </p>
        {message && (
          <p style={{ margin: '0 0 10px', color: '#FF6B35', fontSize: 12, fontWeight: 800 }}>{message}</p>
        )}
        {isLoading ? (
          <div style={emptyStateStyle(theme, isDay)}>Loading routines...</div>
        ) : routines.length === 0 ? (
          <div style={emptyStateStyle(theme, isDay)}>No public routines shared yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {routines.map(routine => (
              <RoutineCard
                key={routine.id}
                onUse={() => onUseRoutine?.(routine)}
                routine={routine}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoutineCard({ onUse, routine, theme }) {
  return (
    <div style={{
      border: `1px solid ${theme.cardBorder}`,
      background: theme.cardBgStrong,
      borderRadius: 14,
      padding: 12,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 23 }}>{typeIcon(routine.type)}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, color: theme.text, fontSize: 14, fontWeight: 950, fontFamily: "'Syne', sans-serif" }}>
            {routine.planName || 'Shared routine'}
          </p>
          <p style={{ margin: '4px 0 0', color: theme.textSoft, fontSize: 12, lineHeight: 1.35 }}>
            {routineSummary(routine)}
          </p>
        </div>
        <button type="button" onClick={onUse} style={copyButtonStyle(theme)}>
          Use
        </button>
      </div>
    </div>
  );
}

function ProfileStat({ color, label, theme, value }) {
  return (
    <div style={{ padding: '11px 9px', borderRadius: 12, background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}` }}>
      <p style={{ margin: '0 0 4px', color, fontSize: 17, fontWeight: 950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
      <p style={{ margin: 0, color: theme.mutedStrong, fontSize: 8, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 0.5 }}>{label}</p>
    </div>
  );
}

function circleButtonStyle(theme) {
  return {
    border: `1px solid ${theme.cardBorder}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 999,
    width: 38,
    height: 38,
    fontSize: 18,
    cursor: 'pointer',
  };
}

function copyButtonStyle(theme) {
  return {
    border: 'none',
    borderRadius: 999,
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #FF6B35, #FFD700)',
    color: '#111',
    fontSize: 11,
    fontWeight: 950,
    cursor: 'pointer',
  };
}

function emptyStateStyle(theme, isDay) {
  return {
    padding: 16,
    borderRadius: 14,
    background: isDay ? '#F8F5EF' : 'rgba(255,255,255,0.04)',
    color: theme.textSoft,
    fontSize: 12,
    lineHeight: 1.45,
  };
}

function typeIcon(type) {
  if (type === 'run') return '🏃';
  if (type === 'swim') return '🏊';
  if (type === 'yoga') return '🧘';
  return '💪';
}

function routineSummary(routine) {
  if (routine.type === 'gym') {
    const exerciseCount = routine.exerciseCount || routine.exercises?.length || 0;
    return `${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'} · ${Math.round(routine.totalVolumeKg || 0)} kg volume`;
  }
  if (routine.type === 'run') {
    return `${trimNumber(routine.distanceKm || 0)} km · ${Math.round(routine.durationMinutes || 0)} min`;
  }
  if (routine.type === 'swim') {
    const meters = Number(routine.distanceMeters) || (Number(routine.distanceKm) || 0) * 1000;
    return `${meters >= 1000 ? `${trimNumber(meters / 1000)} km` : `${Math.round(meters)} m`} · ${Math.round(routine.durationMinutes || 0)} min`;
  }
  return `${routine.style || 'Yoga'} · ${Math.round(routine.durationMinutes || 0)} min`;
}

function trimNumber(value) {
  return Number(value || 0).toFixed(1).replace(/\.0$/, '');
}
