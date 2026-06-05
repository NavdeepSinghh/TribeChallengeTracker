import {
  doc, setDoc, getDoc, getDocs, updateDoc,
  serverTimestamp, collection, deleteField, addDoc, query, where,
} from 'firebase/firestore';
import { db } from './firebase';
import { sanitizePartnerPerkIds, summarizePartnerPerkInterest } from './partnerPerks';

// Called on every sign-in — creates the doc if new, leaves existing data intact
export async function createUserIfNew(user) {
  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || '',
      createdAt:   serverTimestamp(),
      avatarEmoji: '✨',
      avatarColor: '#FFD700',
      instagramHandle: '',
      entitlements: {
        pro: { active: false, source: 'none' },
      },
    });
    return;
  }
  const data = snap.data();

  // One-time migration: established accounts missing the onboardingDone flag
  if (!data.onboardingDone && !data.onboarding && (data.joinedChallengeIds?.length > 0 || data.stats?.challengesJoined > 0)) {
    await setDoc(ref, { onboardingDone: true }, { merge: true });
  }

  // One-time migration: flat literal-dot fields → proper nested stats
  // Old setDoc calls created top-level fields named literally "stats.challengesJoined"
  // (with a dot in the key name). updateDoc interprets dots as nested-path separators,
  // so this migrates the counts into the correct nested structure on first login.
  const flatJoined = data['stats.challengesJoined'];
  const flatOwned  = data['stats.challengesOwned'];
  if ((flatJoined != null || flatOwned != null) && !data.stats?.challengesJoined) {
    await updateDoc(ref, {
      'stats.challengesJoined': flatJoined || 0,
      'stats.challengesOwned':  flatOwned  || 0,
    });
  }
}

// Persists onboarding answers under users/{uid}
export async function saveOnboarding(uid, answers) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    onboarding: { ...answers, completedAt: serverTimestamp() },
    onboardingDone: true,
  }, { merge: true });
}

// Returns the full user profile document, or null if it doesn't exist
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function requestAccountDeletion(uid) {
  const profile = await getUserProfile(uid);
  const requestPayload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    status: 'requested',
    source: 'web',
    requestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const profileStatus = {
    status: 'requested',
    source: 'web',
    requestedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'accountDeletionRequests', uid), requestPayload, { merge: true });
  await setDoc(doc(db, 'users', uid), {
    accountDeletionRequest: profileStatus,
  }, { merge: true });
  return profileStatus;
}

export async function getAccountDeletionReviewQueue() {
  const snap = await getDocs(query(collection(db, 'accountDeletionRequests'), where('status', '==', 'requested')));
  return snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })).sort((a, b) => {
    const left = a.requestedAt?.toMillis?.() || 0;
    const right = b.requestedAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewAccountDeletionRequest(uid, { status, reviewNote = '', reviewedBy = 'admin' }) {
  const allowedStatuses = ['requested', 'contacted', 'verified', 'blocked', 'closed'];
  const cleanStatus = allowedStatuses.includes(status) ? status : 'contacted';
  const cleanNote = (reviewNote || '').trim().slice(0, 500);
  const cleanReviewer = (reviewedBy || 'admin').trim().slice(0, 120) || 'admin';
  const reviewStatus = {
    status: cleanStatus,
    source: 'admin',
    reviewedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, 'accountDeletionRequests', uid), {
    status: cleanStatus,
    reviewNote: cleanNote,
    reviewedBy: cleanReviewer,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'users', uid), {
    accountDeletionRequest: reviewStatus,
  }, { merge: true });
}

export async function submitSupportRequest(uid, { category = 'general', message = '' }) {
  const cleanMessage = (message || '').trim().slice(0, 1200);
  if (cleanMessage.length < 10) {
    throw new Error('Add a few more details before sending support.');
  }
  const cleanCategory = ['general', 'account', 'billing', 'bug', 'safety'].includes(category) ? category : 'general';
  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    category: cleanCategory,
    message: cleanMessage,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'supportRequests'), payload);
  return { id: docRef.id, ...payload };
}

export async function getSupportReviewQueue() {
  const snap = await getDocs(query(collection(db, 'supportRequests'), where('status', '==', 'open')));
  return snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewSupportRequest(requestId, {
  status = 'waiting',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const allowedStatuses = ['open', 'waiting', 'resolved', 'closed'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid support review status.');
  }
  await updateDoc(doc(db, 'supportRequests', requestId), {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function requestEntitlementRecovery(uid, {
  productCount = 0,
  proActive = false,
  packCount = 0,
  activePackCount = 0,
  reason = 'restore_sync_failed',
} = {}) {
  const cleanReason = ['restore_sync_failed', 'missing_pro', 'missing_pack', 'account_mismatch', 'billing_question'].includes(reason)
    ? reason
    : 'restore_sync_failed';
  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    productCount: Math.max(0, Number(productCount) || 0),
    proActive: !!proActive,
    packCount: Math.max(0, Number(packCount) || 0),
    activePackCount: Math.max(0, Number(activePackCount) || 0),
    reason: cleanReason,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'entitlementRecoveryRequests', uid), payload, { merge: true });
  return payload;
}

export async function getEntitlementRecoveryReviewQueue() {
  const snap = await getDocs(query(collection(db, 'entitlementRecoveryRequests'), where('status', '==', 'open')));
  return snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewEntitlementRecoveryRequest(requestId, {
  status = 'waiting',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const allowedStatuses = ['open', 'waiting', 'resolved', 'closed'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid entitlement recovery review status.');
  }
  await updateDoc(doc(db, 'entitlementRecoveryRequests', requestId), {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function recordStoreTestPurchaseEvidence(uid, {
  platform = 'ios',
  productId = '',
  testCase = 'sandbox_purchase',
  result = 'passed',
  evidenceNote = '',
} = {}) {
  const cleanPlatform = ['ios', 'android'].includes(platform) ? platform : 'ios';
  const cleanTestCase = ['sandbox_purchase', 'restore_sync', 'negative_validation', 'wrong_account'].includes(testCase)
    ? testCase
    : 'sandbox_purchase';
  const cleanResult = ['passed', 'needs_review', 'failed'].includes(result) ? result : 'needs_review';
  const cleanProductId = String(productId || '').trim().slice(0, 120);
  if (!cleanProductId) {
    throw new Error('Choose a product before recording store test evidence.');
  }
  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    platform: cleanPlatform,
    productId: cleanProductId,
    testCase: cleanTestCase,
    result: cleanResult,
    evidenceNote: String(evidenceNote || '').trim().slice(0, 500),
    status: 'recorded',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'storeTestPurchaseEvidence'), payload);
  return { id: docRef.id, ...payload };
}

export async function getStoreTestPurchaseEvidenceLog() {
  const snap = await getDocs(collection(db, 'storeTestPurchaseEvidence'));
  return snap.docs.map(evidenceDoc => ({
    id: evidenceDoc.id,
    ...evidenceDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewStoreTestPurchaseEvidence(evidenceId, {
  result = 'verified',
  status = 'reviewed',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const cleanResult = ['verified', 'needs_review', 'failed'].includes(result) ? result : 'needs_review';
  const cleanStatus = ['recorded', 'reviewed', 'archived'].includes(status) ? status : 'reviewed';
  await updateDoc(doc(db, 'storeTestPurchaseEvidence', evidenceId), {
    result: cleanResult,
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

const REFERRAL_REWARD_CLAIM_TIERS = [
  { target: 1, label: 'Connector', reward: 'Referral badge unlock' },
  { target: 5, label: 'Tribe Builder', reward: 'Builder badge + featured queue priority' },
  { target: 10, label: 'Community Captain', reward: 'Captain badge + leaderboard shoutout' },
  { target: 25, label: 'Founder Circle', reward: 'Future Pro trial / founder perk candidate' },
];

export async function claimReferralReward(uid, { tierTarget, referralJoins = 0 }) {
  const target = Number(tierTarget);
  const tier = REFERRAL_REWARD_CLAIM_TIERS.find(item => item.target === target);
  const joinCount = Number(referralJoins) || 0;
  if (!tier) throw new Error('Choose a valid referral reward tier.');
  if (joinCount < target) throw new Error('Referral tier is not unlocked yet.');

  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    referralJoins: joinCount,
    tierTarget: target,
    tierLabel: tier.label,
    reward: tier.reward,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'referralRewardClaims', `${uid}_${target}`), payload, { merge: true });
  return payload;
}

export async function getReferralRewardReviewQueue() {
  const snap = await getDocs(query(collection(db, 'referralRewardClaims'), where('status', '==', 'open')));
  return snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewReferralRewardClaim(claimId, {
  status = 'waiting',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const allowedStatuses = ['open', 'approved', 'waiting', 'not_ready', 'declined'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid referral reward review status.');
  }
  await updateDoc(doc(db, 'referralRewardClaims', claimId), {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveProfileAppearance(uid, { profileImageData, avatarEmoji, avatarColor }) {
  const payload = {
    avatarEmoji: avatarEmoji || '✨',
    avatarColor: avatarColor || '#FFD700',
    profileImageData: profileImageData || deleteField(),
  };
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, payload, { merge: true });

  const snap = await getDoc(userRef);
  const joinedChallengeIds = snap.data()?.joinedChallengeIds || [];
  await Promise.all(joinedChallengeIds.map(challengeId =>
    setDoc(doc(db, 'challenges', challengeId, 'members', uid), payload, { merge: true })
  ));
}

export async function saveProfileCosmetics(uid, { profileFrameId }) {
  const frameId = ['none', 'ember', 'gold', 'neon'].includes(profileFrameId) ? profileFrameId : 'none';
  const payload = {
    cosmetics: {
      profileFrameId: frameId,
      updatedAt: serverTimestamp(),
    },
  };
  const memberPayload = {
    profileFrameId: frameId,
  };
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, payload, { merge: true });

  const snap = await getDoc(userRef);
  const joinedChallengeIds = snap.data()?.joinedChallengeIds || [];
  await Promise.all(joinedChallengeIds.map(challengeId =>
    setDoc(doc(db, 'challenges', challengeId, 'members', uid), memberPayload, { merge: true })
  ));
  return payload.cosmetics;
}

export async function saveSocialProfile(uid, { instagramHandle }) {
  const normalized = (instagramHandle || '')
    .trim()
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .slice(0, 30);

  const payload = { instagramHandle: normalized };
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, payload, { merge: true });

  const snap = await getDoc(userRef);
  const joinedChallengeIds = snap.data()?.joinedChallengeIds || [];
  await Promise.all(joinedChallengeIds.map(challengeId =>
    setDoc(doc(db, 'challenges', challengeId, 'members', uid), payload, { merge: true })
  ));
  return normalized;
}

export async function saveCustomGoals(uid, goals) {
  const weeklyActiveDaysTarget = Math.min(7, Math.max(1, Number(goals.weeklyActiveDaysTarget) || 5));
  const weeklyPointsTarget = Math.min(10000, Math.max(50, Number(goals.weeklyPointsTarget) || 250));
  const streakTarget = Math.min(365, Math.max(1, Number(goals.streakTarget) || 30));
  const payload = {
    goals: {
      weeklyActiveDaysTarget,
      weeklyPointsTarget,
      streakTarget,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.goals;
}

export async function saveSharePreferences(uid, { templateId }) {
  const allowed = ['classic', 'gold', 'neon'];
  const cleanTemplateId = allowed.includes(templateId) ? templateId : 'classic';
  const payload = {
    sharePreferences: {
      templateId: cleanTemplateId,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.sharePreferences;
}

export async function saveCreatorProfile(uid, { enabled, specialty, bio, ctaUrl, revenueShareInterest }) {
  const cleanSpecialty = (specialty || '').trim().slice(0, 60);
  const cleanBio = (bio || '').trim().slice(0, 240);
  const cleanCtaUrl = (ctaUrl || '').trim().slice(0, 160);
  const payload = {
    creatorProfile: {
      enabled: Boolean(enabled),
      specialty: cleanSpecialty,
      bio: cleanBio,
      ctaUrl: cleanCtaUrl,
      revenueShareInterest: Boolean(revenueShareInterest),
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.creatorProfile;
}

export async function savePartnerPerkInterest(uid, selectedIds = []) {
  const cleanSelectedIds = sanitizePartnerPerkIds(selectedIds);
  const payload = {
    partnerPerkInterest: {
      selectedIds: cleanSelectedIds,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.partnerPerkInterest;
}

export async function saveProTrialInterest(uid, selectedIds = []) {
  const allowed = new Set(['reports', 'challenge_packs', 'creator_tools']);
  const cleanSelectedIds = [...new Set(selectedIds)].filter(id => allowed.has(id)).sort();
  const payload = {
    proTrialInterest: {
      selectedIds: cleanSelectedIds,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.proTrialInterest;
}

export async function getProTrialInterestSummary() {
  const allowed = new Set(['reports', 'challenge_packs', 'creator_tools']);
  const counts = { reports: 0, challenge_packs: 0, creator_tools: 0 };
  const snap = await getDocs(collection(db, 'users'));
  snap.docs.forEach(userDoc => {
    const selectedIds = userDoc.data()?.proTrialInterest?.selectedIds || [];
    selectedIds.forEach(id => {
      if (allowed.has(id)) counts[id] += 1;
    });
  });
  return counts;
}

export async function getCreatorRevenueShareSummary() {
  const snap = await getDocs(collection(db, 'users'));
  const counts = { enabled: 0, revenueShareInterest: 0, branded: 0 };
  snap.docs.forEach(userDoc => {
    const creatorProfile = userDoc.data()?.creatorProfile || {};
    if (creatorProfile.enabled) counts.enabled += 1;
    if (creatorProfile.revenueShareInterest) counts.revenueShareInterest += 1;
    if ((creatorProfile.specialty || '').trim() || (creatorProfile.bio || '').trim()) counts.branded += 1;
  });
  return counts;
}

export async function submitCreatorHostingApplication(uid, {
  hostedCount = 0,
  memberReach = 0,
  revenueReadyCount = 0,
  revenueShareInterest = false,
} = {}) {
  const profile = await getUserProfile(uid);
  const creatorProfile = profile?.creatorProfile || {};
  const cleanSpecialty = (creatorProfile.specialty || '').trim().slice(0, 60);
  const cleanBio = (creatorProfile.bio || '').trim().slice(0, 240);
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before applying for hosted review.');
  }
  if (!cleanSpecialty && !cleanBio) {
    throw new Error('Add creator specialty or bio before applying for hosted review.');
  }
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    specialty: cleanSpecialty,
    bio: cleanBio,
    ctaUrl: (creatorProfile.ctaUrl || '').trim().slice(0, 160),
    hostedCount: Number(hostedCount) || 0,
    memberReach: Number(memberReach) || 0,
    revenueReadyCount: Number(revenueReadyCount) || 0,
    revenueShareInterest: Boolean(revenueShareInterest || creatorProfile.revenueShareInterest),
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'creatorHostingApplications', uid), payload, { merge: true });
  return payload;
}

export async function getCreatorHostingApplicationReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorHostingApplications'), where('status', '==', 'open')));
  return snap.docs.map(applicationDoc => ({
    id: applicationDoc.id,
    ...applicationDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewCreatorHostingApplication(applicationId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanApplicationId = String(applicationId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanApplicationId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator hosting application status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'creatorHostingApplications', cleanApplicationId), payload);
  return payload;
}

export async function submitPartnerCampaignApplication(uid, {
  topPerkId = '',
  topPerkLabel = '',
  demandCount = 0,
  totalDemand = 0,
  campaignReach = 0,
  referralJoins = 0,
} = {}) {
  const profile = await getUserProfile(uid);
  const cleanPerkId = (topPerkId || '').trim().slice(0, 40);
  const cleanPerkLabel = (topPerkLabel || '').trim().slice(0, 80);
  if (!cleanPerkId || !cleanPerkLabel) {
    throw new Error('Save at least one partner perk signal before applying for a partner pilot review.');
  }
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    topPerkId: cleanPerkId,
    topPerkLabel: cleanPerkLabel,
    demandCount: Number(demandCount) || 0,
    totalDemand: Number(totalDemand) || 0,
    campaignReach: Number(campaignReach) || 0,
    referralJoins: Number(referralJoins) || 0,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'partnerCampaignApplications', uid), payload, { merge: true });
  return payload;
}

export async function getPartnerCampaignApplicationReviewQueue() {
  const snap = await getDocs(query(collection(db, 'partnerCampaignApplications'), where('status', '==', 'open')));
  return snap.docs.map(applicationDoc => ({
    id: applicationDoc.id,
    ...applicationDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewPartnerCampaignApplication(applicationId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanApplicationId = String(applicationId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanApplicationId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid partner campaign application status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'partnerCampaignApplications', cleanApplicationId), payload);
  return payload;
}

export async function claimPartnerPerk(uid, {
  perkId = '',
  perkLabel = '',
  perkTitle = '',
  current = 0,
  target = 0,
  requirement = '',
} = {}) {
  const profile = await getUserProfile(uid);
  const cleanPerkId = sanitizePartnerPerkIds([perkId])[0] || '';
  const cleanPerkLabel = String(perkLabel || '').trim().slice(0, 80);
  const cleanPerkTitle = String(perkTitle || '').trim().slice(0, 120);
  const cleanRequirement = String(requirement || '').trim().slice(0, 120);
  const currentValue = Math.max(0, Number(current) || 0);
  const targetValue = Math.max(1, Number(target) || 1);
  if (!cleanPerkId || !cleanPerkLabel) {
    throw new Error('Choose a valid partner perk before requesting review.');
  }
  if (currentValue < targetValue) {
    throw new Error('This partner perk is not eligible yet.');
  }
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    perkId: cleanPerkId,
    perkLabel: cleanPerkLabel,
    perkTitle: cleanPerkTitle,
    current: currentValue,
    target: targetValue,
    requirement: cleanRequirement,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'partnerPerkClaims', `${uid}_${cleanPerkId}`), payload, { merge: true });
  return payload;
}

export async function getPartnerPerkClaimReviewQueue() {
  const snap = await getDocs(query(collection(db, 'partnerPerkClaims'), where('status', '==', 'open')));
  return snap.docs.map(claimDoc => ({
    id: claimDoc.id,
    ...claimDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function getPartnerPerkClaims(uid) {
  const snap = await getDocs(query(collection(db, 'partnerPerkClaims'), where('uid', '==', uid)));
  return snap.docs.map(claimDoc => ({
    id: claimDoc.id,
    ...claimDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewPartnerPerkClaim(claimId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanClaimId = String(claimId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  const cleanReviewNote = String(reviewNote || '').trim().slice(0, 500);
  if (!cleanClaimId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid partner perk claim status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: cleanReviewNote,
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'partnerPerkClaims', cleanClaimId), payload);
  return payload;
}

export async function getCampaignPerformanceSummary() {
  const counts = {
    total: 0,
    active: 0,
    public: 0,
    premium: 0,
    seasonal: 0,
    memberReach: 0,
  };
  const snap = await getDocs(collection(db, 'challenges'));
  snap.docs.forEach(challengeDoc => {
    const challenge = challengeDoc.data() || {};
    if (!challenge.campaignId && !challenge.campaignLabel && !challenge.campaignHashtag) return;
    counts.total += 1;
    if ((challenge.status || 'active') === 'active') counts.active += 1;
    if (challenge.isPublic) counts.public += 1;
    if (challenge.isPremium) counts.premium += 1;
    const campaignText = `${challenge.campaignId || ''} ${challenge.campaignLabel || ''}`.toLowerCase();
    if (campaignText.includes('seasonal') || campaignText.includes('summer') || campaignText.includes('winter')) counts.seasonal += 1;
    counts.memberReach += Math.max(0, Number(challenge.memberCount) || 0);
  });
  return counts;
}

export async function getPartnerPerkInterestSummary() {
  const snap = await getDocs(collection(db, 'users'));
  return summarizePartnerPerkInterest(snap.docs.map(userDoc => userDoc.data()));
}

export async function submitFeatureSubmission(uid, { category, story, mediaImageData = '' }) {
  const profile = await getUserProfile(uid);
  const cleanCategory = (category || 'streak_win').trim() || 'streak_win';
  const cleanStory = (story || '').trim().slice(0, 900);
  if (cleanStory.length < 20) {
    throw new Error('Tell us a little more before submitting.');
  }
  await addDoc(collection(db, 'featureSubmissions'), {
    uid,
    displayName: profile?.displayName || '',
    email: profile?.email || '',
    instagramHandle: profile?.instagramHandle || '',
    profileImageData: profile?.profileImageData || '',
    avatarEmoji: profile?.avatarEmoji || '✨',
    avatarColor: profile?.avatarColor || '#FFD700',
    category: cleanCategory,
    story: cleanStory,
    mediaImageData: mediaImageData || '',
    mediaContentType: mediaImageData ? 'image/jpeg' : '',
    consentToFeature: true,
    status: 'pending',
    source: 'web',
    createdAt: serverTimestamp(),
  });
}

export async function getFeatureSubmissions(uid) {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('uid', '==', uid)));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const bt = b.createdAt?.toMillis?.() || 0;
      const at = a.createdAt?.toMillis?.() || 0;
      return bt - at;
    });
}

export async function getFeatureReviewQueue() {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('status', '==', 'pending')));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const bt = b.createdAt?.toMillis?.() || 0;
      const at = a.createdAt?.toMillis?.() || 0;
      return bt - at;
    });
}

export async function getFeaturedSubmissions() {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('status', '==', 'featured')));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const bt = b.reviewedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
      const at = a.reviewedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
      return bt - at;
    });
}

export async function reviewFeatureSubmission(submissionId, status, reviewerUid, reviewNote = '') {
  const allowed = new Set(['approved', 'featured', 'declined']);
  if (!allowed.has(status)) throw new Error('Invalid review status.');
  await setDoc(doc(db, 'featureSubmissions', submissionId), {
    status,
    reviewedBy: reviewerUid,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedAt: serverTimestamp(),
  }, { merge: true });
}

// ── Activity log persistence ───────────────────────────────────────────────────

// Saves one day's general activity to users/{uid}/activityLog/{dateStr}
export async function saveActivity(uid, dateStr, entry) {
  await setDoc(doc(db, 'users', uid, 'activityLog', dateStr), {
    ...entry,
    savedAt: serverTimestamp(),
  });
}

export async function saveStreakRecovery(uid, dateStr) {
  const ref = doc(db, 'users', uid, 'activityLog', dateStr);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};
  const activities = existing.activities || (existing.type ? [existing] : []);
  if (activities.some(activity => activity.id === `streak_recovery_${dateStr}` || activity.activityId === 'streak_recovery')) {
    return { ...(existing || {}), activities };
  }
  const nextActivities = [
    ...activities,
    {
      id: `streak_recovery_${dateStr}`,
      type: 'streak_recovery',
      activityId: 'streak_recovery',
      value: 1,
      note: 'Pro streak recovery credit',
      points: 0,
      loggedAt: dateStr,
    },
  ];
  const next = {
    activities: nextActivities,
    points: nextActivities.reduce((sum, activity) => sum + (activity.points || 0), 0),
    totalPoints: nextActivities.reduce((sum, activity) => sum + (activity.points || 0), 0),
    date: dateStr,
    recoveredByPro: true,
    savedAt: serverTimestamp(),
  };
  await setDoc(ref, next, { merge: true });
  await setDoc(doc(db, 'users', uid), {
    streakRecovery: {
      lastRecoveredDate: dateStr,
      updatedAt: serverTimestamp(),
    },
  }, { merge: true });
  return next;
}

// Loads the full activity log for a user, keyed by date string
export async function getActivityLog(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'activityLog'));
  return snap.docs.reduce((acc, d) => ({ ...acc, [d.id]: d.data() }), {});
}

// ── Per-challenge points ───────────────────────────────────────────────────────

// Returns [{ challengeId, name, emoji, color, totalPoints, daysCompleted, currentStreak }]
// for every challenge the user is a member of
export async function getUserChallengePoints(uid, challengeIds) {
  if (!challengeIds?.length) return [];
  const results = await Promise.all(
    challengeIds.map(async (id) => {
      const [memberSnap, challengeSnap] = await Promise.all([
        getDoc(doc(db, 'challenges', id, 'members', uid)),
        getDoc(doc(db, 'challenges', id)),
      ]);
      if (!memberSnap.exists() || !challengeSnap.exists()) return null;
      const m = memberSnap.data();
      const c = challengeSnap.data();
      return {
        challengeId:   id,
        name:          c.name   || 'Unknown Challenge',
        emoji:         c.emoji  || '🎯',
        color:         c.color  || '#FF6B35',
        totalPoints:   m.totalPoints   || 0,
        daysCompleted: m.daysCompleted || 0,
        currentStreak: m.currentStreak || 0,
      };
    })
  );
  return results.filter(Boolean);
}
