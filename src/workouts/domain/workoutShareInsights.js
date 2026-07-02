const UNSUPPORTED_CLAIM_PATTERN = /\b(cure|treat|diagnose|heal|rehab|therapy|injury|pain[- ]?free|guarantee|medical|doctor|clinical|prescribe)\b/i;

function cleanString(value, fallback = "", maxLength = 160) {
  return String(value || fallback).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function safeShareText(value, fallback = "") {
  const text = cleanString(value, fallback, 220);
  return UNSUPPORTED_CLAIM_PATTERN.test(text)
    ? fallback
    : text;
}

function roundedVolumeKg(value) {
  return Math.round(cleanNumber(value) / 100) * 100;
}

function shareDateLabel(dateStr = "") {
  const clean = cleanString(dateStr, "", 20);
  if (!/^\d{4}-\d{2}-\d{2}/.test(clean)) return "Recent";
  return clean.slice(5, 10);
}

export function buildWorkoutSummaryShareCard({ session = {}, profile = {} } = {}) {
  const exerciseNames = Array.isArray(session.exercises)
    ? session.exercises.map(exercise => cleanString(exercise.name || exercise.nameSnapshot)).filter(Boolean).slice(0, 4)
    : [];
  return {
    type: "workout_summary",
    title: safeShareText(session.name, "Workout complete"),
    subtitle: `${cleanNumber(session.exerciseCount, exerciseNames.length)} exercises · ${cleanNumber(session.durationMinutes)} min`,
    ownerDisplayName: safeShareText(profile.displayName, "Tribe member"),
    dateLabel: shareDateLabel(session.dateStr),
    metrics: [
      { label: "Volume", value: `${roundedVolumeKg(session.totalVolumeKg)} kg` },
      { label: "Points", value: `${cleanNumber(session.points)}` },
    ],
    highlights: exerciseNames,
    privacy: {
      previewOnly: true,
      requiresExplicitShare: true,
      excludes: ["private notes", "exact timestamps", "raw set log"],
    },
  };
}

export function buildMuscleVolumeShareCard({ aggregate = {}, profile = {} } = {}) {
  const muscles = Object.values(aggregate.muscles || {})
    .sort((left, right) => cleanNumber(right.volumeKg) - cleanNumber(left.volumeKg))
    .slice(0, 4)
    .map(muscle => ({
      label: cleanString(muscle.muscle, "muscle", 40).replace(/_/g, " "),
      value: `${roundedVolumeKg(muscle.volumeKg)} kg`,
    }));
  return {
    type: "muscle_volume",
    title: "Weekly muscle volume",
    subtitle: cleanString(aggregate.periodKey, "This week", 20),
    ownerDisplayName: safeShareText(profile.displayName, "Tribe member"),
    metrics: muscles,
    privacy: {
      previewOnly: true,
      requiresExplicitShare: true,
      roundedValues: true,
      excludes: ["source session ids", "raw set log"],
    },
  };
}

export function buildPersonalRecordShareCard({ pr = {}, exerciseName = "", profile = {} } = {}) {
  return {
    type: "personal_record",
    title: "New PR",
    subtitle: safeShareText(exerciseName || pr.exerciseId, "Exercise"),
    ownerDisplayName: safeShareText(profile.displayName, "Tribe member"),
    metrics: [
      { label: "Best weight", value: `${cleanNumber(pr.bestWeightKg)} kg` },
      { label: "Est. 1RM", value: `${cleanNumber(pr.bestEstimatedOneRepMaxKg)} kg` },
    ],
    privacy: {
      previewOnly: true,
      requiresExplicitShare: true,
      excludes: ["exact timestamp", "private notes"],
    },
  };
}

export function buildWorkoutShareCaption(card = {}) {
  const title = safeShareText(card.title, "Workout update");
  const subtitle = safeShareText(card.subtitle, "");
  return [
    `${title}${subtitle ? ` · ${subtitle}` : ""}`,
    "Logged with TribeLog.",
    "Built by the tribe, for the tribe.",
  ].join("\n");
}

export function publicWorkoutTrendScore(workout = {}, now = new Date()) {
  const copied = cleanNumber(workout.copiedCount);
  const reactions = Object.values(workout.reactionCounts || {}).reduce((sum, value) => sum + cleanNumber(value), 0);
  const publishedAt = workout.publishedAt?.toDate ? workout.publishedAt.toDate() : new Date(workout.publishedAt || workout.dateStr || 0);
  const ageHours = Number.isNaN(publishedAt.getTime())
    ? 168
    : Math.max(0, (now.getTime() - publishedAt.getTime()) / 3600000);
  const recency = Math.max(0, 24 - Math.min(24, ageHours));
  return Math.round((copied * 5) + (reactions * 2) + recency);
}

export function rankPublicWorkoutDiscovery(workouts = [], now = new Date()) {
  return [...workouts]
    .filter(workout => cleanString(workout.visibility) === "public")
    .map(workout => ({
      ...workout,
      trendScore: publicWorkoutTrendScore(workout, now),
    }))
    .sort((left, right) => right.trendScore - left.trendScore || cleanString(right.publishedAt).localeCompare(cleanString(left.publishedAt)));
}
