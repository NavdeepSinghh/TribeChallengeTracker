import { useEffect, useMemo, useState } from 'react';
import {
  fetchDiscoverProfiles,
  followUser,
  getFollowStatus,
  unfollowUser,
} from '../userServices/followService';
import { useAppTheme } from './AppThemeContext';
import PublicProfileSheet from './PublicProfileSheet';

export default function FollowDiscoverySection({ onUseRoutine, user }) {
  const { resolvedMode, theme } = useAppTheme();
  const isDay = resolvedMode === 'day';
  const [profiles, setProfiles] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProfiles() {
      if (!user?.uid) return;
      setIsLoading(true);
      setMessage('');
      try {
        const nextProfiles = await fetchDiscoverProfiles(user.uid);
        const statuses = await Promise.all(nextProfiles.map(profile => getFollowStatus(user.uid, profile.uid)));
        if (!cancelled) {
          setProfiles(nextProfiles);
          setFollowingIds(new Set(nextProfiles.filter((_, index) => statuses[index] === 'following').map(profile => profile.uid)));
        }
      } catch (error) {
        if (!cancelled) setMessage('Discover is not available yet. Check Firestore rules/indexes before enabling this flag.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfiles();
    return () => { cancelled = true; };
  }, [user?.uid]);

  const emptyCopy = useMemo(() => (
    isLoading ? 'Loading public profiles...' : 'No public profiles yet. Publish your profile from Settings to seed Discover.'
  ), [isLoading]);

  async function toggleFollow(profile) {
    if (!user?.uid || !profile?.uid) return;
    const nextFollowing = new Set(followingIds);
    const isFollowing = nextFollowing.has(profile.uid);
    setMessage('');
    try {
      if (isFollowing) {
        nextFollowing.delete(profile.uid);
        setFollowingIds(nextFollowing);
        await unfollowUser(user.uid, profile.uid);
        return;
      }
      nextFollowing.add(profile.uid);
      setFollowingIds(nextFollowing);
      await followUser(user.uid, profile);
    } catch (error) {
      const reverted = new Set(followingIds);
      setFollowingIds(reverted);
      setMessage(error.message || 'Could not update follow status.');
    }
  }

  return (
    <section style={{
      padding: 18,
      borderRadius: 18,
      background: isDay ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${theme.cardBorder}`,
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: '0 0 5px', color: theme.mutedStrong, fontSize: 10, fontWeight: 900, letterSpacing: 1.4, fontFamily: 'monospace' }}>DISCOVER BETA</p>
          <h3 style={{ margin: 0, color: theme.text, fontSize: 18, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>People to follow</h3>
        </div>
        <span style={{ color: '#FF6B35', fontSize: 18 }}>↗</span>
      </div>
      <p style={{ margin: '0 0 14px', color: theme.textSoft, fontSize: 12, lineHeight: 1.45 }}>
        Follow public profiles to learn from their streaks, open shared routines, and copy one into your own workout draft.
      </p>

      {profiles.length === 0 ? (
        <div style={{
          padding: 16,
          borderRadius: 14,
          background: isDay ? '#F8F5EF' : 'rgba(255,255,255,0.04)',
          color: theme.textSoft,
          fontSize: 12,
          lineHeight: 1.45,
        }}>
          {message || emptyCopy}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profiles.map(profile => {
            const isFollowing = followingIds.has(profile.uid);
            return (
              <div key={profile.uid} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 14,
                background: isDay ? '#F8F5EF' : 'rgba(0,0,0,0.22)',
                border: `1px solid ${theme.cardBorder}`,
              }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: profile.avatarColor || '#FFD700',
                  fontSize: 21,
                  flex: '0 0 auto',
                }}>
                  {profile.avatarEmoji || '✨'}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ color: theme.text, fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile.displayName || 'Tribe Member'}
                  </div>
                  <div style={{ color: theme.textSoft, fontSize: 11, lineHeight: 1.35 }}>
                    🔥 {profile.currentStreak || 0} day streak
                    {profile.bio ? ` · ${profile.bio}` : ''}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(profile)}
                  style={{
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: 999,
                    padding: '8px 11px',
                    background: theme.cardBg,
                    color: theme.text,
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => toggleFollow(profile)}
                  style={{
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 12px',
                    background: isFollowing ? theme.cardBg : 'linear-gradient(135deg, #FF6B35, #FFD700)',
                    color: isFollowing ? theme.text : '#111',
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer',
                    borderColor: theme.cardBorder,
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {selectedProfile && (
        <PublicProfileSheet
          currentUser={user}
          onClose={() => setSelectedProfile(null)}
          onUseRoutine={(routine) => {
            onUseRoutine?.(routine);
            setSelectedProfile(null);
          }}
          profile={selectedProfile}
        />
      )}
    </section>
  );
}
