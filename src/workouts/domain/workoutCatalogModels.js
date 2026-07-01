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

function readTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
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
    substitutions: cleanList(data.substitutions),
    assetManifest: {
      lottiePath: cleanString(data.assetManifest?.lottiePath),
      thumbnailPath: cleanString(data.assetManifest?.thumbnailPath),
      muscleMapFrontPath: cleanString(data.assetManifest?.muscleMapFrontPath),
      muscleMapBackPath: cleanString(data.assetManifest?.muscleMapBackPath),
      assetVersion: Number(data.assetManifest?.assetVersion || 1),
      assetHash: cleanString(data.assetManifest?.assetHash),
    },
    updatedAt: readTimestamp(data.updatedAt),
    updatedBy: cleanString(data.updatedBy),
  };
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
