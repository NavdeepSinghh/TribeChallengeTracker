export const ALL_FILTER_VALUE = "all";

export const WORKOUT_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const MUSCLE_LABELS = {
  chest: "Chest",
  core: "Core",
  front_delts: "Front delts",
  glutes: "Glutes",
  hamstrings: "Hamstrings",
  quads: "Quads",
  shoulders: "Shoulders",
  triceps: "Triceps",
};

export const EQUIPMENT_LABELS = {
  bodyweight: "Bodyweight",
  dumbbell: "Dumbbell",
  kettlebell: "Kettlebell",
};

function cleanString(value) {
  return String(value || "").trim();
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.map(item => cleanString(item)).filter(Boolean)
    : [];
}

function numberOrDefault(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cleanOptionalInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function cleanCoachingCues(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const title = cleanString(item.title);
      const body = cleanString(item.body || item.description);
      if (!title && !body) return null;
      const startPercent = Math.min(100, Math.max(0, numberOrDefault(item.startPercent ?? item.startFramePercent, index * 25)));
      const endPercent = Math.min(100, Math.max(startPercent, numberOrDefault(item.endPercent ?? item.endFramePercent, startPercent + 25)));
      const startFrame = cleanOptionalInt(item.startFrame);
      const endFrame = cleanOptionalInt(item.endFrame);
      return {
        id: cleanString(item.id) || `cue_${index + 1}`,
        phase: cleanString(item.phase) || `phase_${index + 1}`,
        title: title || body,
        body,
        startPercent,
        endPercent,
        ...(startFrame !== null && endFrame !== null && endFrame >= startFrame ? { startFrame, endFrame } : {}),
        focusMuscles: cleanList(item.focusMuscles),
        view: cleanString(item.view || "front"),
      };
    })
    .filter(Boolean);
}

function readTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
}

function cleanMediaManifest(value = {}) {
  return {
    preferredMotion: cleanString(value.preferredMotion || "lottie"),
    videoPath: cleanString(value.videoPath),
    posterPath: cleanString(value.posterPath),
    previewPath: cleanString(value.previewPath),
    styleVersion: cleanString(value.styleVersion),
    mediaVersion: Number(value.mediaVersion || 0),
    mediaHash: cleanString(value.mediaHash),
    durationMs: Number(value.durationMs || 0),
    frameRate: Number(value.frameRate || 0),
  };
}

export function mapExerciseDocument(id, data = {}) {
  const documentId = cleanString(id || data.id);
  return {
    id: documentId,
    slug: cleanString(data.slug || documentId.replace(/_/g, "-")),
    name: cleanString(data.name),
    status: cleanString(data.status || "draft"),
    version: Number(data.version || 1),
    primaryMuscles: cleanList(data.primaryMuscles),
    secondaryMuscles: cleanList(data.secondaryMuscles),
    equipment: cleanList(data.equipment),
    level: cleanString(data.level || "beginner"),
    movementPattern: cleanString(data.movementPattern),
    instructions: cleanList(data.instructions),
    formCues: cleanList(data.formCues),
    commonMistakes: cleanList(data.commonMistakes),
    coachingCues: cleanCoachingCues(data.coachingCues),
    substitutions: cleanList(data.substitutions),
    assetManifest: {
      lottiePath: cleanString(data.assetManifest?.lottiePath),
      thumbnailPath: cleanString(data.assetManifest?.thumbnailPath),
      muscleMapFrontPath: cleanString(data.assetManifest?.muscleMapFrontPath),
      muscleMapBackPath: cleanString(data.assetManifest?.muscleMapBackPath),
      assetVersion: Number(data.assetManifest?.assetVersion || 1),
      assetHash: cleanString(data.assetManifest?.assetHash),
    },
    mediaManifest: cleanMediaManifest(data.mediaManifest),
    updatedAt: readTimestamp(data.updatedAt),
    updatedBy: cleanString(data.updatedBy),
  };
}

export function selectExerciseMotionSource(exercise = {}) {
  const mediaManifest = exercise.mediaManifest || {};
  const videoPath = cleanString(mediaManifest.videoPath);
  const preferredMotion = cleanString(mediaManifest.preferredMotion || "lottie");
  if (preferredMotion === "video" && videoPath) {
    return {
      type: "video",
      path: videoPath,
      posterPath: cleanString(mediaManifest.posterPath),
      mediaHash: cleanString(mediaManifest.mediaHash),
      styleVersion: cleanString(mediaManifest.styleVersion),
    };
  }
  return {
    type: "lottie",
    path: cleanString(exercise.assetManifest?.lottiePath),
    posterPath: cleanString(exercise.assetManifest?.thumbnailPath),
    mediaHash: cleanString(exercise.assetManifest?.assetHash),
    styleVersion: "",
  };
}

export function buildExerciseCoachingCues(exercise = {}) {
  if (Array.isArray(exercise.coachingCues) && exercise.coachingCues.length > 0) {
    return exercise.coachingCues;
  }

  const source = [
    ...(exercise.formCues || []),
    ...(exercise.instructions || []),
  ].filter(Boolean);

  const fallbackTitles = [
    "Set your position",
    "Move with control",
    "Hold the target line",
    "Finish strong",
  ];

  return source.slice(0, 4).map((body, index) => {
    const startPercent = index === 0 ? 0 : index * 25;
    const endPercent = index === 3 ? 100 : startPercent + 25;
    return {
      id: `fallback_${index + 1}`,
      phase: ["setup", "lowering", "target", "finish"][index] || `phase_${index + 1}`,
      title: fallbackTitles[index] || `Cue ${index + 1}`,
      body,
      startPercent,
      endPercent,
      focusMuscles: index < 2 ? (exercise.primaryMuscles || []) : (exercise.secondaryMuscles || exercise.primaryMuscles || []),
      view: index === 1 ? "side" : "front",
    };
  });
}

export function normalizeWorkoutSearch(value) {
  return cleanString(value).toLowerCase();
}

export function getExerciseSearchText(exercise) {
  return [
    exercise.name,
    exercise.level,
    exercise.movementPattern,
    ...exercise.primaryMuscles,
    ...exercise.secondaryMuscles,
    ...exercise.equipment,
  ].join(" ").toLowerCase();
}

export function exerciseMatchesFilters(exercise, filters = {}) {
  const search = normalizeWorkoutSearch(filters.search);
  const muscle = filters.muscle || ALL_FILTER_VALUE;
  const equipment = filters.equipment || ALL_FILTER_VALUE;
  const level = filters.level || ALL_FILTER_VALUE;

  if (search && !getExerciseSearchText(exercise).includes(search)) return false;
  if (muscle !== ALL_FILTER_VALUE && !exercise.primaryMuscles.includes(muscle)) return false;
  if (equipment !== ALL_FILTER_VALUE && !exercise.equipment.includes(equipment)) return false;
  if (level !== ALL_FILTER_VALUE && exercise.level !== level) return false;
  return true;
}

export function filterExercises(exercises, filters = {}) {
  return [...exercises]
    .filter(exercise => exerciseMatchesFilters(exercise, filters))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function optionFromValue(value, labelLookup) {
  return {
    id: value,
    label: labelLookup[value] || value.split("_").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" "),
  };
}

export function buildExerciseFilterOptions(exercises = []) {
  const muscles = new Set();
  const equipment = new Set();

  exercises.forEach(exercise => {
    exercise.primaryMuscles.forEach(muscle => muscles.add(muscle));
    exercise.equipment.forEach(item => equipment.add(item));
  });

  return {
    muscles: [...muscles].sort().map(value => optionFromValue(value, MUSCLE_LABELS)),
    equipment: [...equipment].sort().map(value => optionFromValue(value, EQUIPMENT_LABELS)),
    levels: WORKOUT_LEVELS,
  };
}

export function selectBackendCatalogFilter(filters = {}) {
  if (filters.muscle && filters.muscle !== ALL_FILTER_VALUE) {
    return { type: "muscle", value: filters.muscle };
  }
  if (filters.equipment && filters.equipment !== ALL_FILTER_VALUE) {
    return { type: "equipment", value: filters.equipment };
  }
  if (filters.level && filters.level !== ALL_FILTER_VALUE) {
    return { type: "level", value: filters.level };
  }
  return { type: "all", value: ALL_FILTER_VALUE };
}
