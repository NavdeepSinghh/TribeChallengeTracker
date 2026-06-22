export function getProfileInstagramHandle({ instagramHandle, profile }) {
  return profile?.instagramHandle || instagramHandle;
}

export function buildProfileShareBlobInput({
  daysActive,
  displayName,
  instagramHandle,
  periodLabel,
  points,
  profile,
  rank,
  sessions,
  streak,
  user,
  variant,
}) {
  return {
    displayName: displayName || profile?.displayName || user?.displayName || user?.email?.split('@')[0],
    totalPoints: points,
    streak,
    daysActive,
    sessions,
    rank,
    referralJoins: profile?.stats?.referralJoins || 0,
    instagramHandle,
    periodLabel,
    variant,
  };
}
