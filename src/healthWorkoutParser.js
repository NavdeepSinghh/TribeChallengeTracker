const TYPE_MAP = {
  running: 'run',
  run: 'run',
  hkworkoutactivitytyperunning: 'run',
  hkworkoutactivitytyperunningandwalking: 'run',
  walking: 'walk',
  walk: 'walk',
  hiking: 'walk',
  hkworkoutactivitytypewalking: 'walk',
  hkworkoutactivitytypehiking: 'walk',
  cycling: 'cycle',
  biking: 'cycle',
  cycle: 'cycle',
  hkworkoutactivitytypecycling: 'cycle',
  hkworkoutactivitytypeindoorcycling: 'cycle',
  swimming: 'swim',
  swim: 'swim',
  hkworkoutactivitytypeswimming: 'swim',
  hkworkoutactivitytypeswimmingandswimmingstroke: 'swim',
  yoga: 'yoga',
  pilates: 'yoga',
  mindfulness: 'yoga',
  meditation: 'yoga',
  hkworkoutactivitytypeyoga: 'yoga',
  hkworkoutactivitytypepilates: 'yoga',
  hkworkoutactivitytypemindandbody: 'yoga',
  gym: 'gym',
  strengthtraining: 'gym',
  traditionalstrengthtraining: 'gym',
  functionalstrengthtraining: 'gym',
  crossfit: 'gym',
  hiit: 'gym',
  hkworkoutactivitytypetraditionalstrengthtraining: 'gym',
  hkworkoutactivitytypefunctionalstrengthtraining: 'gym',
  hkworkoutactivitytypecrossfit: 'gym',
  hkworkoutactivitytypehighintensityintervaltraining: 'gym',
};

const DISTANCE_TYPES = new Set(['run', 'cycle', 'walk', 'swim']);

export function normalizeWorkoutType(raw) {
  if (!raw) return 'gym';
  const key = String(raw).toLowerCase().replace(/[\s\-_]/g, '');
  return TYPE_MAP[key] || 'gym';
}

export function parseWorkout(w) {
  const type = normalizeWorkoutType(w.workoutType);
  const durMin = Math.round((w.duration || 0) / 60);
  const distKm = +((w.distance || 0) / 1000).toFixed(2);
  const usesDist = DISTANCE_TYPES.has(type) && distKm >= 0.1;
  const value = usesDist ? distKm : durMin;
  const unit = usesDist ? 'km' : 'min';
  const calories = Math.round(w.calories || 0);

  return {
    type,
    value,
    unit,
    durMin,
    distKm,
    calories,
    source: w.sourceName || 'Health',
    startTime: new Date(w.startDate),
  };
}
