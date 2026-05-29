import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, serverTimestamp, increment, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
export const CHALLENGE_TEMPLATES = [
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

// ─── SERVICE FUNCTIONS ────────────────────────────────────────────────────────
export async function searchPublicChallenges(term = '') {
  const snap = await getDocs(
    query(collection(db, 'challenges'), where('isPublic', '==', true))
  );
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(c => c.status === 'active');
  if (!term.trim()) return all.slice(0, 30);
  const t = term.toLowerCase();
  return all.filter(c =>
    c.name?.toLowerCase().includes(t) ||
    c.tagline?.toLowerCase().includes(t) ||
    c.creatorName?.toLowerCase().includes(t)
  );
}

export async function createChallenge(uid, template, customName, startDateStr, isPublic = true) {
  const ref  = doc(collection(db, 'challenges'));
  const end  = new Date(startDateStr);
  end.setDate(end.getDate() + template.duration);

  // Fetch creator info for denormalisation (admin queries don't need a join)
  const creatorSnap = await getDoc(doc(db, 'users', uid));
  const creator = creatorSnap.data() || {};

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
    disclaimer:    template.disclaimer,
    createdBy:     uid,
    creatorName:   creator.displayName || '',
    creatorEmail:  creator.email || '',
    createdAt:     serverTimestamp(),
    startDate:     startDateStr,
    endDate:       end.toISOString().split('T')[0],
    inviteCode:    genInviteCode(),
    memberCount:   1,
    isPublic,
    status:        'active',   // active | completed | cancelled
  };

  await setDoc(ref, data);
  await setDoc(doc(db, 'challenges', ref.id, 'members', uid), {
    uid,
    role:          'admin',
    displayName:   creator.displayName || '',
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

export async function joinChallenge(uid, challengeId) {
  const memberRef = doc(db, 'challenges', challengeId, 'members', uid);
  if ((await getDoc(memberRef)).exists()) return; // already joined

  const userSnap = await getDoc(doc(db, 'users', uid));
  const userData = userSnap.data() || {};

  await setDoc(memberRef, {
    uid,
    role:          'member',
    displayName:   userData.displayName || '',
    joinedAt:      serverTimestamp(),
    status:        'active',
    totalPoints:   0,
    currentStreak: 0,
    longestStreak: 0,
    daysCompleted: 0,
    lastLogDate:   null,
  });
  await setDoc(doc(db, 'challenges', challengeId), { memberCount: increment(1) }, { merge: true });
  await updateDoc(doc(db, 'users', uid), {
    joinedChallengeIds:       arrayUnion(challengeId),
    'stats.challengesJoined': increment(1),
  });
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
