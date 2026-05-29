/**
 * healthService.js
 *
 * Wraps the `capacitor-health` plugin (Apple HealthKit on iOS,
 * Health Connect on Android) behind a simple async API.
 *
 * All calls are safe to make from web — they return sensible
 * defaults / throw clear errors when the native runtime isn't present.
 */

import { Capacitor } from '@capacitor/core';

// ── Lazy plugin handle ────────────────────────────────────────────────────────
let _Health = null;

async function plug() {
  if (_Health) return _Health;
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const { Health } = await import('capacitor-health');
    _Health = Health;
  } catch (e) {
    console.warn('[HealthService] Plugin failed to load:', e.message);
  }
  return _Health;
}

// ── Workout-type normalisation ────────────────────────────────────────────────
// Maps every string HealthKit / Health Connect can return to one of our
// 6 activity IDs: run · walk · cycle · swim · yoga · gym

const TYPE_MAP = {
  // — Running —
  running:                                              'run',
  run:                                                  'run',
  hkworkoutactivitytyperunning:                         'run',
  hkworkoutactivitytyperunningandwalking:               'run',
  // — Walking / Hiking —
  walking:                                              'walk',
  walk:                                                 'walk',
  hiking:                                               'walk',
  hkworkoutactivitytypewalking:                         'walk',
  hkworkoutactivitytypehiking:                          'walk',
  // — Cycling —
  cycling:                                              'cycle',
  biking:                                               'cycle',
  cycle:                                                'cycle',
  hkworkoutactivitytypecycling:                         'cycle',
  hkworkoutactivitytypeindoorcycling:                   'cycle',
  // — Swimming —
  swimming:                                             'swim',
  swim:                                                 'swim',
  hkworkoutactivitytypeswimming:                        'swim',
  hkworkoutactivitytypeswimmingandswimmingstroke:       'swim',
  // — Yoga / Mindfulness —
  yoga:                                                 'yoga',
  pilates:                                              'yoga',
  mindfulness:                                          'yoga',
  meditation:                                           'yoga',
  hkworkoutactivitytypeyoga:                            'yoga',
  hkworkoutactivitytypepilates:                         'yoga',
  hkworkoutactivitytypemindandbody:                     'yoga',
  // — Gym / Strength (everything else defaults here) —
  gym:                                                  'gym',
  strengthtraining:                                     'gym',
  traditionalstrengthtraining:                          'gym',
  functionalstrengthtraining:                           'gym',
  crossfit:                                             'gym',
  hiit:                                                 'gym',
  hkworkoutactivitytypetraditionalstrengthtraining:     'gym',
  hkworkoutactivitytypefunctionalstrengthtraining:      'gym',
  hkworkoutactivitytypecrossfit:                        'gym',
  hkworkoutactivitytypehighintensityintervaltraining:   'gym',
};

function normalizeType(raw) {
  if (!raw) return 'gym';
  // Strip spaces, dashes, underscores and lowercase for a stable lookup key
  const key = String(raw).toLowerCase().replace(/[\s\-_]/g, '');
  return TYPE_MAP[key] || 'gym';
}

// Activities whose primary metric is distance rather than duration
const DISTANCE_TYPES = new Set(['run', 'cycle', 'walk', 'swim']);

/**
 * Convert a raw Workout object returned by the plugin into a shape our
 * LogModal can consume directly.
 *
 * Plugin units:
 *   duration → seconds
 *   distance → metres
 *   calories → kcal
 */
function parseWorkout(w) {
  const type      = normalizeType(w.workoutType);
  const durMin    = Math.round((w.duration || 0) / 60);       // s → min
  const distKm    = +((w.distance || 0) / 1000).toFixed(2);   // m → km
  const usesDist  = DISTANCE_TYPES.has(type) && distKm >= 0.1;
  const value     = usesDist ? distKm : durMin;
  const unit      = usesDist ? 'km'   : 'min';
  const calories  = Math.round(w.calories || 0);

  return {
    type,
    value,
    unit,
    durMin,
    distKm,
    calories,
    source:    w.sourceName || 'Health',
    startTime: new Date(w.startDate),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns true when the native health SDK is accessible on this device.
 * Always false on web.
 */
export async function healthAvailable() {
  const h = await plug();
  if (!h) return false;
  try {
    const { available } = await h.isHealthAvailable();
    return !!available;
  } catch {
    return false;
  }
}

/**
 * Triggers the OS permission dialog for reading workouts, distance and calories.
 * On iOS the dialog only appears the first time; subsequent calls are silent.
 */
export async function requestHealthPerms() {
  const h = await plug();
  if (!h) throw new Error('Health APIs are only available on iOS and Android');
  await h.requestHealthPermissions({
    permissions: ['READ_WORKOUTS', 'READ_DISTANCE', 'READ_ACTIVE_CALORIES'],
  });
}

/**
 * Fetches all workouts recorded today (since midnight local time).
 * Returns an empty array if none are found.
 * Filters out very short sessions (< 5 min) to avoid noise.
 */
export async function getTodayWorkouts() {
  const h = await plug();
  if (!h) throw new Error('Health APIs are only available on iOS and Android');

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const { workouts = [] } = await h.queryWorkouts({
    startDate:        midnight.toISOString(),
    endDate:          new Date().toISOString(),
    includeHeartRate: false,
    includeRoute:     false,
    includeSteps:     false,
  });

  return workouts
    .map(parseWorkout)
    .filter(w => w.durMin >= 5 && w.value > 0);
}

/**
 * Convenience: opens the Health app settings so the user can adjust permissions.
 * iOS: opens Settings (HealthKit permissions are buried in the Health app).
 * Android: opens the Health Connect app.
 */
export async function openHealthSettings() {
  const h = await plug();
  if (!h) return;
  try {
    if (Capacitor.getPlatform() === 'ios') {
      await h.openAppleHealthSettings();
    } else {
      await h.openHealthConnectSettings();
    }
  } catch (e) {
    console.warn('[HealthService] Could not open settings:', e.message);
  }
}
