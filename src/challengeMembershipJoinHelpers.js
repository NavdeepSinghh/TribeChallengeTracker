import {
  serverTimestamp,
} from 'firebase/firestore';

export function normalizeChallengeReferralUid(uid, referralUid = '') {
  return referralUid && referralUid !== uid ? referralUid : '';
}

export function buildChallengeMemberRecord({
  includeReferralFields = false,
  referralUid = '',
  role = 'member',
  uid,
  userData = {},
}) {
  const normalizedReferral = normalizeChallengeReferralUid(uid, referralUid);

  const record = {
    uid,
    role,
    displayName: userData.displayName || '',
    profileImageData: userData.profileImageData || '',
    avatarEmoji: userData.avatarEmoji || '✨',
    avatarColor: userData.avatarColor || '#FFD700',
    profileFrameId: userData.cosmetics?.profileFrameId || 'none',
    instagramHandle: userData.instagramHandle || '',
    joinedAt: serverTimestamp(),
    status: 'active',
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    daysCompleted: 0,
    lastLogDate: null,
  };

  if (includeReferralFields) {
    return {
      ...record,
      referredBy: normalizedReferral,
      referralSource: normalizedReferral ? 'invite_link' : '',
    };
  }

  return record;
}

export async function recordReferralChallengeJoin(referralUid) {
  if (!referralUid) return;
  // Referral counts are updated by the Firebase backend when a challenge
  // member record with referredBy is created. Client-side writes would require
  // one user to edit another user's profile, which Firestore rules block.
}
