export const FOLLOW_PROFILE_VISIBILITY = Object.freeze({
  PUBLIC: 'public',
  FOLLOWERS: 'followers',
  PRIVATE: 'private',
});

export const ROUTINE_VISIBILITY = Object.freeze({
  PUBLIC: 'public',
  FOLLOWERS: 'followers',
  PRIVATE: 'private',
});

export const DEFAULT_FOLLOW_PROFILE_VISIBILITY = FOLLOW_PROFILE_VISIBILITY.PUBLIC;
export const DEFAULT_ROUTINE_VISIBILITY = ROUTINE_VISIBILITY.PRIVATE;

const VISIBILITY_VALUES = new Set(Object.values(FOLLOW_PROFILE_VISIBILITY));
const ROUTINE_VISIBILITY_VALUES = new Set(Object.values(ROUTINE_VISIBILITY));

export function normalizeVisibility(value, fallback = DEFAULT_FOLLOW_PROFILE_VISIBILITY) {
  return VISIBILITY_VALUES.has(value) ? value : fallback;
}

export function normalizeRoutineVisibility(value, fallback = DEFAULT_ROUTINE_VISIBILITY) {
  return ROUTINE_VISIBILITY_VALUES.has(value) ? value : fallback;
}

export function normalizeBio(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 160);
}

export function normalizePublicDisplayName(profile = {}) {
  const fallback = profile.email ? String(profile.email).split('@')[0] : 'Tribe Member';
  return String(profile.displayName || fallback || 'Tribe Member').trim().slice(0, 60) || 'Tribe Member';
}

function safeNumber(value) {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? Math.round(next) : 0;
}

export function buildPublicProfilePayload(uid, profile = {}, settings = {}) {
  const followProfile = profile.followProfile || {};
  const stats = profile.stats || {};
  const profileVisibility = normalizeVisibility(
    settings.profileVisibility ?? followProfile.profileVisibility,
    DEFAULT_FOLLOW_PROFILE_VISIBILITY
  );
  const routineDefaultVisibility = normalizeRoutineVisibility(
    settings.routineDefaultVisibility ?? followProfile.routineDefaultVisibility,
    DEFAULT_ROUTINE_VISIBILITY
  );

  return {
    uid,
    displayName: normalizePublicDisplayName(profile),
    avatarEmoji: profile.avatarEmoji || '✨',
    avatarColor: profile.avatarColor || '#FFD700',
    bio: normalizeBio(settings.bio ?? followProfile.bio),
    profileVisibility,
    routineDefaultVisibility,
    currentStreak: safeNumber(profile.currentStreak ?? stats.currentStreak),
    totalPoints: safeNumber(profile.totalPoints ?? stats.totalPoints),
    badgeXp: safeNumber(profile.badgeXp ?? stats.badgeXp),
    followersCount: safeNumber(followProfile.followersCount),
    followingCount: safeNumber(followProfile.followingCount),
  };
}

export function shouldShowDiscoverProfile(profile, currentUid) {
  return Boolean(
    profile?.uid
    && profile.uid !== currentUid
    && profile.profileVisibility === FOLLOW_PROFILE_VISIBILITY.PUBLIC
  );
}

function cleanText(value, fallback = '') {
  return String(value || fallback).trim().replace(/\s+/g, ' ');
}

function safePositiveNumber(value, digits = 2) {
  const next = Number(value);
  if (!Number.isFinite(next) || next < 0) return 0;
  const multiplier = 10 ** digits;
  return Math.round(next * multiplier) / multiplier;
}

function cleanExercise(exercise = {}) {
  const sets = Array.isArray(exercise.sets)
    ? exercise.sets
        .map(set => ({
          reps: safePositiveNumber(set.reps, 0),
          weightKg: safePositiveNumber(set.weightKg, 2),
        }))
        .filter(set => set.reps > 0)
    : [];

  return {
    name: cleanText(exercise.name, 'Exercise').slice(0, 80),
    focus: cleanText(exercise.focus).slice(0, 120),
    repRange: cleanText(exercise.repRange).slice(0, 40),
    setRange: cleanText(exercise.setRange).slice(0, 40),
    tip: cleanText(exercise.tip).slice(0, 160),
    sets,
  };
}

function sessionType(value) {
  return ['gym', 'run', 'swim', 'yoga'].includes(value) ? value : 'gym';
}

export function buildPublicRoutinePayload(uid, profile = {}, session = {}, settings = {}) {
  const type = sessionType(session.type);
  const visibility = normalizeRoutineVisibility(
    settings.visibility ?? session.routineVisibility ?? profile.followProfile?.routineDefaultVisibility,
    DEFAULT_ROUTINE_VISIBILITY
  );
  const exercises = Array.isArray(session.exercises)
    ? session.exercises.map(cleanExercise).filter(exercise => exercise.sets.length > 0 || exercise.name)
    : [];

  return {
    ownerUid: uid,
    ownerDisplayName: normalizePublicDisplayName(profile),
    ownerAvatarEmoji: profile.avatarEmoji || '✨',
    ownerAvatarColor: profile.avatarColor || '#FFD700',
    sourceSessionId: session.id || null,
    visibility,
    type,
    planName: cleanText(session.planName, type === 'gym' ? 'Strength session' : `${type} session`).slice(0, 80),
    dateStr: cleanText(session.dateStr).slice(0, 20),
    intensity: cleanText(session.intensity).slice(0, 40),
    exercises,
    exerciseCount: safePositiveNumber(session.exerciseCount || exercises.length, 0),
    totalVolumeKg: safePositiveNumber(session.totalVolumeKg, 1),
    bestWeightKg: safePositiveNumber(session.bestWeightKg, 1),
    distanceKm: safePositiveNumber(session.distanceKm, 2),
    distanceMeters: safePositiveNumber(session.distanceMeters, 0),
    durationMinutes: safePositiveNumber(session.durationMinutes, 0),
    paceSecondsPerKm: safePositiveNumber(session.paceSecondsPerKm, 0),
    paceSecondsPer100m: safePositiveNumber(session.paceSecondsPer100m, 0),
    style: cleanText(session.style).slice(0, 60),
    location: cleanText(session.location).slice(0, 60),
  };
}

export function shouldShowRoutine(routine, currentUid, options = {}) {
  if (!routine?.ownerUid || routine.ownerUid === currentUid) return false;
  if (routine.visibility === ROUTINE_VISIBILITY.PUBLIC) return true;
  return routine.visibility === ROUTINE_VISIBILITY.FOLLOWERS && options.isFollowingOwner === true;
}
