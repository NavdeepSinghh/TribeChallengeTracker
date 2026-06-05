import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, serverTimestamp, increment, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';
import { deriveChallengeBadgeStats } from './challengeStats';
import { canCreateChallengeTemplate } from './proFeatures';

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
export const CHALLENGE_TEMPLATES = [
  {
    id: 'weekly_reset',
    name: '7-Day Tribe Reset',
    emoji: '🚀',
    color: '#F97316',
    duration: 7,
    tagline: 'A campaign-ready week of movement, hydration, and accountability',
    difficulty: 'Beginner-friendly',
    campaignId: 'weekly-reset',
    campaignLabel: 'Weekly Campaign',
    campaignHashtag: '#RiseWithTheTribe',
    campaignCta: 'Tag @risewiththetribe with your Day 1 proof and invite one friend.',
    sponsorName: 'Tribe Partner Preview',
    sponsorLabel: 'Member Perk',
    sponsorPerk: 'Future partner rewards can attach to challenge campaigns without changing the core habit loop.',
    sponsorUrl: '',
    rules: [
      'Move for at least 20 minutes every day',
      'Drink 2 litres of water daily',
      'Log your activity in the app before bed',
      'Share one progress update and tag @risewiththetribe',
      'Invite one accountability partner before Day 3',
    ],
    tasks: [
      { id: 'move', label: '20+ minutes of movement', emoji: '🏃' },
      { id: 'water', label: '2 L of water', emoji: '💧' },
      { id: 'log', label: 'Logged activity in app', emoji: '📱' },
      { id: 'share', label: 'Shared or encouraged the tribe', emoji: '📣' },
    ],
    disclaimer: 'This challenge is designed for general accountability and is not medical advice. Adjust movement and hydration targets to your needs and consult a healthcare professional when appropriate.',
  },
  {
    id: 'comeback_week',
    name: 'Comeback Week',
    emoji: '⚡',
    color: '#34D399',
    duration: 7,
    tagline: 'Restart your streak without overthinking it',
    difficulty: 'Easy',
    campaignId: 'comeback-week',
    campaignLabel: 'Instagram Challenge',
    campaignHashtag: '#TribeComeback',
    campaignCta: 'Post your comeback win and tag @risewiththetribe to be featured.',
    rules: [
      'Complete one low-friction activity every day',
      'Keep the promise small enough that you cannot dodge it',
      'Log activity in the app daily',
      'Share your comeback moment once during the week',
    ],
    tasks: [
      { id: 'activity', label: 'Completed any activity', emoji: '✅' },
      { id: 'logged', label: 'Logged in the app', emoji: '📱' },
      { id: 'reflection', label: 'Noted one win', emoji: '📝' },
    ],
    disclaimer: 'This challenge is intended to rebuild consistency. Choose activity intensity that matches your current fitness level.',
  },
  {
    id: '75hard',
    name: '75 Hard',
    emoji: '🔥',
    color: '#FF6B35',
    duration: 75,
    tagline: 'The original mental toughness programme',
    difficulty: 'Extreme',
    rules: [
      'Two 45-minute workouts per day — one MUST be outdoors, regardless of weather',
      'Follow a structured diet with zero alcohol and zero cheat meals for all 75 days',
      'Drink 1 gallon (3.8 L) of water every day',
      'Read 10 pages of a non-fiction or self-development book (audiobooks do NOT count)',
      'Take a daily progress photo',
      'Miss ANY single task on ANY day → restart from Day 1, no exceptions',
    ],
    tasks: [
      { id: 'workout1', label: 'Workout 1 — 45 min', emoji: '💪' },
      { id: 'workout2', label: 'Outdoor workout — 45 min', emoji: '🌤' },
      { id: 'diet',     label: 'Followed diet, no alcohol', emoji: '🥗' },
      { id: 'water',    label: '1 gallon of water drunk', emoji: '💧' },
      { id: 'reading',  label: '10 pages read', emoji: '📚' },
      { id: 'photo',    label: 'Progress photo taken', emoji: '📸' },
    ],
    disclaimer: '75 Hard was created by Andy Frisella. It is intentionally extreme and is a mental toughness programme — NOT a fitness programme. The "restart from Day 1" rule is non-negotiable by design. Consult a physician before beginning. Rise With The Tribe is not affiliated with Andy Frisella or the official 75 Hard programme and makes no medical claims.',
  },
  {
    id: '75soft',
    name: '75 Soft',
    emoji: '🌊',
    color: '#60A5FA',
    duration: 75,
    tagline: 'Build lasting habits — no burnout, no restart',
    difficulty: 'Moderate',
    rules: [
      'One 45-minute workout per day (indoors or outdoors)',
      'Be mindful of food choices 90% of the time — one social meal per week allowed',
      'Drink 3 litres of water every day',
      'Read or listen to 10 minutes of personal development daily',
      'Meditate for at least 5 minutes daily',
      'No perfection required — missing a day does not reset your streak',
    ],
    tasks: [
      { id: 'workout',   label: 'Workout — 45 min', emoji: '💪' },
      { id: 'water',     label: '3 L of water drunk', emoji: '💧' },
      { id: 'diet',      label: 'Ate mindfully today', emoji: '🥗' },
      { id: 'reading',   label: '10 min personal development', emoji: '📚' },
      { id: 'meditate',  label: '5 min meditation', emoji: '🧘' },
    ],
    disclaimer: '75 Soft is a community-adapted programme inspired by 75 Hard. It is not an official programme and is not affiliated with Andy Frisella. Always consult a healthcare provider before starting any new fitness or nutrition regimen. Rise With The Tribe is not a medical provider and makes no health claims.',
  },
  {
    id: '30tribe',
    name: '30-Day Tribe',
    emoji: '⚡',
    color: '#34D399',
    duration: 30,
    tagline: 'A month of movement with your people',
    difficulty: 'Beginner-friendly',
    campaignId: '30-day-tribe',
    campaignLabel: 'Core Campaign',
    campaignHashtag: '#30DayTribe',
    campaignCta: 'Share your Day 1 and tag @risewiththetribe so the tribe can cheer you on.',
    rules: [
      'Complete at least one workout per day',
      'Log every activity in the app',
      'Any activity counts — run, walk, yoga, gym, swim, cycle',
      'Encourage at least one tribe member per week',
    ],
    tasks: [
      { id: 'workout', label: 'Completed a workout', emoji: '🏃' },
      { id: 'logged',  label: 'Logged activity in app', emoji: '📱' },
    ],
    disclaimer: 'This challenge is designed for all fitness levels. Rest days are at your own discretion — listen to your body. Rise With The Tribe is not a medical provider. Consult a healthcare professional before starting a new exercise programme.',
  },
  {
    id: 'premium_21_reset',
    name: '21-Day Reset Pack',
    emoji: '💎',
    color: '#A78BFA',
    duration: 21,
    tagline: 'A structured premium reset with movement, recovery, and accountability',
    difficulty: 'Structured',
    isPremium: true,
    packId: '21_day_reset',
    packLabel: 'Premium Pack',
    rules: [
      'Complete one intentional movement session each day',
      'Hit your hydration target and log it',
      'Complete one recovery or mindset task daily',
      'Share a weekly proof update with the tribe',
      'Invite one accountability partner before Day 5',
    ],
    tasks: [
      { id: 'movement', label: 'Intentional movement completed', emoji: '🏃' },
      { id: 'hydration', label: 'Hydration target hit', emoji: '💧' },
      { id: 'recovery', label: 'Recovery or mindset task', emoji: '🧘' },
      { id: 'proof', label: 'Progress proof logged', emoji: '📸' },
    ],
    dailyPrompts: [
      'What is the smallest win you can protect today?',
      'Send one accountability check-in before the day gets busy.',
      'Choose recovery with the same discipline as training.',
    ],
    disclaimer: 'This premium challenge pack is for accountability and habit formation. It is not medical advice. Adjust intensity to your needs and consult a healthcare professional when appropriate.',
  },
  {
    id: 'seasonal_summer_shred',
    name: '28-Day Summer Shred',
    emoji: '☀️',
    color: '#F59E0B',
    duration: 28,
    tagline: 'A premium seasonal push for training, nutrition consistency, and visible proof',
    difficulty: 'Intermediate',
    campaignId: 'summer-shred',
    campaignLabel: 'Seasonal Drop',
    campaignHashtag: '#TribeSummerShred',
    campaignCta: 'Share your weekly check-in and tag @risewiththetribe for the seasonal leaderboard.',
    isPremium: true,
    packId: 'summer_shred',
    packLabel: 'Seasonal Pack',
    rules: [
      'Complete one focused training session each day',
      'Log protein or balanced meal consistency',
      'Complete one recovery habit daily',
      'Share a weekly progress check-in',
      'Invite one accountability partner before Day 7',
    ],
    tasks: [
      { id: 'training', label: 'Focused training completed', emoji: '💪' },
      { id: 'nutrition', label: 'Nutrition target hit', emoji: '🥗' },
      { id: 'recovery', label: 'Recovery habit completed', emoji: '🧘' },
      { id: 'proof', label: 'Progress proof logged', emoji: '📸' },
    ],
    dailyPrompts: [
      'Post one honest progress proof, not a perfect one.',
      'Win the next meal, then win the next session.',
      'Check in with your accountability partner before you log off.',
    ],
    disclaimer: 'This seasonal challenge is for accountability and general fitness habit formation. It is not medical or nutrition advice. Adjust targets to your needs and consult a qualified professional when appropriate.',
  },
  {
    id: 'seasonal_winter_base',
    name: '14-Day Winter Base',
    emoji: '❄️',
    color: '#38BDF8',
    duration: 14,
    tagline: 'Build a steady base when motivation is low',
    difficulty: 'Beginner-friendly',
    campaignId: 'winter-base',
    campaignLabel: 'Seasonal Campaign',
    campaignHashtag: '#TribeWinterBase',
    campaignCta: 'Post your daily base-building win and tag @risewiththetribe.',
    rules: [
      'Move for at least 20 minutes daily',
      'Log one simple recovery action',
      'Complete one hydration check-in',
      'Encourage one tribe member during the challenge',
    ],
    tasks: [
      { id: 'move', label: '20+ minutes of movement', emoji: '🏃' },
      { id: 'recovery', label: 'Recovery action completed', emoji: '🧘' },
      { id: 'hydration', label: 'Hydration check-in', emoji: '💧' },
      { id: 'support', label: 'Encouraged the tribe', emoji: '📣' },
    ],
    disclaimer: 'This challenge is designed for general accountability. Choose activity intensity that matches your current fitness level.',
  },
  {
    id: 'custom',
    name: 'Custom Challenge',
    emoji: '🎯',
    color: '#A78BFA',
    duration: 30,
    tagline: 'Design your own tribe challenge',
    difficulty: 'You decide',
    rules: [],
    tasks: [],
    disclaimer: 'As challenge creator you are responsible for setting appropriate rules and guidelines. Ensure all participants are aware of any physical demands. Rise With The Tribe accepts no liability for participant injury or health outcomes.',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const genInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const getCampaignWeekNumber = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diffDays = Math.floor((date - start) / 86400000);
  return Math.floor((diffDays + start.getDay()) / 7) + 1;
};

export function getWeeklyCampaignPrompt(date = new Date()) {
  const campaignTemplates = CHALLENGE_TEMPLATES.filter(template => template.campaignId);
  const week = getCampaignWeekNumber(date);
  const template = campaignTemplates[(week - 1) % campaignTemplates.length] || CHALLENGE_TEMPLATES[0];
  return {
    week,
    templateId: template.id,
    campaignId: template.campaignId || template.id,
    label: template.campaignLabel || 'Weekly Campaign',
    name: template.name,
    hashtag: template.campaignHashtag || '#RiseWithTheTribe',
    cta: template.campaignCta || 'Tag @risewiththetribe and invite one accountability partner.',
    duration: template.duration,
    difficulty: template.difficulty,
  };
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────────────────────────
export async function searchPublicChallenges(term = '') {
  try {
    const snap = await getDocs(
      query(collection(db, 'challenges'), where('isPublic', '==', true))
    );
    // Exclude only explicitly cancelled challenges; treat missing status as active
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(c => c.status !== 'cancelled');
    if (!term.trim()) return all.slice(0, 30);
    const t = term.toLowerCase();
    return all.filter(c =>
      c.name?.toLowerCase().includes(t) ||
      c.tagline?.toLowerCase().includes(t) ||
      c.campaignHashtag?.toLowerCase().includes(t) ||
      c.campaignLabel?.toLowerCase().includes(t) ||
      c.creatorName?.toLowerCase().includes(t) ||
      c.creatorSpecialty?.toLowerCase().includes(t) ||
      c.creatorBio?.toLowerCase().includes(t)
    );
  } catch (e) {
    console.error('searchPublicChallenges error:', e);
    return [];
  }
}

export async function createChallenge(uid, template, customName, startDateStr, isPublic = true) {
  const ref  = doc(collection(db, 'challenges'));
  const end  = new Date(startDateStr);
  end.setDate(end.getDate() + template.duration);

  // Fetch creator info for denormalisation (admin queries don't need a join)
  const creatorSnap = await getDoc(doc(db, 'users', uid));
  const creator = creatorSnap.data() || {};
  const canCreatePrivate = creator?.entitlements?.pro?.active === true;
  if (!canCreateChallengeTemplate(creator, template)) {
    throw new Error('This challenge pack requires Tribe Pro or an active pack purchase.');
  }
  const effectiveIsPublic = isPublic || !canCreatePrivate;
  const creatorBrandingEnabled = canCreatePrivate && creator?.creatorProfile?.enabled === true;

  const data = {
    id:            ref.id,
    templateId:    template.id,
    name:          customName.trim() || template.name,
    emoji:         template.emoji,
    color:         template.color,
    duration:      template.duration,
    tagline:       template.tagline,
    difficulty:    template.difficulty,
    rules:         template.rules,
    tasks:         template.tasks,
    dailyPrompts:  template.dailyPrompts || [],
    disclaimer:    template.disclaimer,
    campaignId:    template.campaignId || '',
    campaignLabel: template.campaignLabel || '',
    campaignHashtag: template.campaignHashtag || '',
    campaignCta:   template.campaignCta || '',
    sponsorName:   template.sponsorName || '',
    sponsorLabel:  template.sponsorLabel || '',
    sponsorPerk:   template.sponsorPerk || '',
    sponsorUrl:    template.sponsorUrl || '',
    isPremium:     !!template.isPremium,
    packId:        template.packId || '',
    packLabel:     template.packLabel || '',
    createdBy:     uid,
    creatorName:   creator.displayName || '',
    creatorEmail:  creator.email || '',
    creatorSpecialty: creatorBrandingEnabled ? (creator.creatorProfile?.specialty || '') : '',
    creatorBio:    creatorBrandingEnabled ? (creator.creatorProfile?.bio || '') : '',
    creatorCtaUrl: creatorBrandingEnabled ? (creator.creatorProfile?.ctaUrl || '') : '',
    createdAt:     serverTimestamp(),
    startDate:     startDateStr,
    endDate:       end.toISOString().split('T')[0],
    inviteCode:    genInviteCode(),
    memberCount:   1,
    isPublic:       effectiveIsPublic,
    status:        'active',   // active | completed | cancelled
  };

  await setDoc(ref, data);
  await setDoc(doc(db, 'challenges', ref.id, 'members', uid), {
    uid,
    role:          'admin',
    displayName:   creator.displayName || '',
    profileImageData: creator.profileImageData || '',
    avatarEmoji:   creator.avatarEmoji || '✨',
    avatarColor:   creator.avatarColor || '#FFD700',
    profileFrameId: creator.cosmetics?.profileFrameId || 'none',
    instagramHandle: creator.instagramHandle || '',
    joinedAt:      serverTimestamp(),
    status:        'active',
    totalPoints:   0,
    currentStreak: 0,
    longestStreak: 0,
    daysCompleted: 0,
    lastLogDate:   null,
  });
  await updateDoc(doc(db, 'users', uid), {
    joinedChallengeIds:       arrayUnion(ref.id),
    'stats.challengesJoined': increment(1),
    'stats.challengesOwned':  increment(1),
  });

  return data;
}

export async function joinChallenge(uid, challengeId, referralUid = '') {
  const memberRef = doc(db, 'challenges', challengeId, 'members', uid);
  if ((await getDoc(memberRef)).exists()) return; // already joined

  const userSnap = await getDoc(doc(db, 'users', uid));
  const userData = userSnap.data() || {};
  const normalizedReferral = referralUid && referralUid !== uid ? referralUid : '';

  await setDoc(memberRef, {
    uid,
    role:          'member',
    displayName:   userData.displayName || '',
    profileImageData: userData.profileImageData || '',
    avatarEmoji:   userData.avatarEmoji || '✨',
    avatarColor:   userData.avatarColor || '#FFD700',
    profileFrameId: userData.cosmetics?.profileFrameId || 'none',
    instagramHandle: userData.instagramHandle || '',
    joinedAt:      serverTimestamp(),
    status:        'active',
    totalPoints:   0,
    currentStreak: 0,
    longestStreak: 0,
    daysCompleted: 0,
    lastLogDate:   null,
    referredBy:    normalizedReferral,
    referralSource: normalizedReferral ? 'invite_link' : '',
  });
  await setDoc(doc(db, 'challenges', challengeId), { memberCount: increment(1) }, { merge: true });
  await updateDoc(doc(db, 'users', uid), {
    joinedChallengeIds:       arrayUnion(challengeId),
    'stats.challengesJoined': increment(1),
  });
  if (normalizedReferral) {
    const referrerRef = doc(db, 'users', normalizedReferral);
    try {
      await updateDoc(referrerRef, {
        'stats.referralJoins': increment(1),
      });
    } catch {
      await setDoc(referrerRef, {
        stats: { referralJoins: increment(1) },
      }, { merge: true });
    }
  }
}

export async function isMember(uid, challengeId) {
  return (await getDoc(doc(db, 'challenges', challengeId, 'members', uid))).exists();
}

export async function getChallenge(challengeId) {
  const snap = await getDoc(doc(db, 'challenges', challengeId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getChallengeByInviteCode(code) {
  const snap = await getDocs(query(collection(db, 'challenges'), where('inviteCode', '==', code)));
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function getUserChallenges(ids = []) {
  if (!ids.length) return [];
  const results = await Promise.all(ids.map(getChallenge));
  return results.filter(Boolean);
}

export async function getUserChallengeBadgeStats(uid, challenges = []) {
  if (!uid || !challenges.length) return { completed: 0, top1: 0 };

  const entries = await Promise.all(challenges.map(async (challenge) => {
    if (!challenge?.id) return null;
    const [membersSnap, progressSnap] = await Promise.all([
      getDocs(collection(db, 'challenges', challenge.id, 'members')),
      getDocs(collection(db, 'challenges', challenge.id, 'members', uid, 'dailyLogs')),
    ]);
    return [
      challenge.id,
      membersSnap.docs.map(d => ({ uid: d.id, ...d.data() })),
      progressSnap.docs.reduce((acc, d) => ({ ...acc, [d.id]: d.data() }), {}),
    ];
  }));

  const membersByChallenge = {};
  const progressByChallenge = {};
  entries.filter(Boolean).forEach(([challengeId, members, progress]) => {
    membersByChallenge[challengeId] = members;
    progressByChallenge[challengeId] = progress;
  });

  return deriveChallengeBadgeStats({
    uid,
    challenges,
    membersByChallenge,
    progressByChallenge,
  });
}

/**
 * Removes a user from a challenge, handling three scenarios:
 *
 * 1. Regular member  → delete member doc, decrement counts, remove from user profile.
 * 2. Admin leaving, other members exist → auto-promote highest-points member to admin,
 *    then leave as above (also decrements challengesOwned for the leaving user).
 * 3. Admin is the only member → delete the challenge document entirely.
 *
 * Returns { deleted: true } when the whole challenge was removed, { deleted: false } otherwise.
 */
export async function leaveChallenge(uid, challengeId) {
  const challengeRef = doc(db, 'challenges', challengeId);
  const memberRef    = doc(db, 'challenges', challengeId, 'members', uid);

  const [challengeSnap, memberSnap] = await Promise.all([
    getDoc(challengeRef),
    getDoc(memberRef),
  ]);

  if (!challengeSnap.exists() || !memberSnap.exists()) return { deleted: false };

  const challenge = challengeSnap.data();
  const member    = memberSnap.data();
  const isAdmin   = member.role === 'admin';

  // ── Scenario 3: admin is the only member → delete the challenge ──────────
  if (isAdmin && (challenge.memberCount || 1) <= 1) {
    await deleteDoc(memberRef);
    await deleteDoc(challengeRef);
    await updateDoc(doc(db, 'users', uid), {
      joinedChallengeIds:       arrayRemove(challengeId),
      'stats.challengesJoined': increment(-1),
      'stats.challengesOwned':  increment(-1),
    });
    return { deleted: true };
  }

  // ── Scenario 2: admin leaving with other members → auto-promote ──────────
  if (isAdmin) {
    const membersSnap = await getDocs(
      collection(db, 'challenges', challengeId, 'members')
    );
    const others = membersSnap.docs
      .filter(d => d.id !== uid)
      .map(d => ({ uid: d.id, ...d.data() }))
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    if (others.length > 0) {
      const newAdmin = others[0];
      await updateDoc(
        doc(db, 'challenges', challengeId, 'members', newAdmin.uid),
        { role: 'admin' }
      );
      await updateDoc(challengeRef, {
        createdBy:   newAdmin.uid,
        creatorName: newAdmin.displayName || '',
      });
    }

    // Remove leaving admin from user profile (joined + owned)
    await updateDoc(doc(db, 'users', uid), {
      joinedChallengeIds:       arrayRemove(challengeId),
      'stats.challengesJoined': increment(-1),
      'stats.challengesOwned':  increment(-1),
    });
  } else {
    // ── Scenario 1: regular member ──────────────────────────────────────────
    await updateDoc(doc(db, 'users', uid), {
      joinedChallengeIds:       arrayRemove(challengeId),
      'stats.challengesJoined': increment(-1),
    });
  }

  // Common: remove member doc + decrement challenge member count
  await deleteDoc(memberRef);
  await updateDoc(challengeRef, { memberCount: increment(-1) });

  return { deleted: false };
}
