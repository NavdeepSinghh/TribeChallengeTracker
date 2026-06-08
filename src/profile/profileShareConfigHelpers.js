export function getProfileInstagramHandle({ instagramHandle, profile }) {
  return profile?.instagramHandle || instagramHandle;
}

export function buildProfileShareBlobInput({
  daysActive,
  displayName,
  instagramHandle,
  points,
  profile,
  rank,
  streak,
  user,
}) {
  return {
    displayName: displayName || profile?.displayName || user?.displayName || user?.email?.split('@')[0],
    totalPoints: points,
    streak,
    daysActive,
    rank,
    referralJoins: profile?.stats?.referralJoins || 0,
    instagramHandle,
  };
}
