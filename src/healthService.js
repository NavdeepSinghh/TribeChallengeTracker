/**
 * Wraps the capacitor-health plugin (Apple HealthKit on iOS, Health Connect on
 * Android) behind a small async API that is safe to call from web.
 */

import { getHealthPlatform, getHealthPlugin } from './healthPlugin';
import { parseWorkout } from './healthWorkoutParser';

export async function healthAvailable() {
  const h = await getHealthPlugin();
  if (!h) return false;
  try {
    const { available } = await h.isHealthAvailable();
    return !!available;
  } catch {
    return false;
  }
}

export async function requestHealthPerms() {
  const h = await getHealthPlugin();
  if (!h) throw new Error('Health APIs are only available on iOS and Android');
  await h.requestHealthPermissions({
    permissions: ['READ_WORKOUTS', 'READ_DISTANCE', 'READ_ACTIVE_CALORIES'],
  });
}

export async function getTodayWorkouts() {
  const h = await getHealthPlugin();
  if (!h) throw new Error('Health APIs are only available on iOS and Android');

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const { workouts = [] } = await h.queryWorkouts({
    startDate: midnight.toISOString(),
    endDate: new Date().toISOString(),
    includeHeartRate: false,
    includeRoute: false,
    includeSteps: false,
  });

  return workouts
    .map(parseWorkout)
    .filter(w => w.durMin >= 5 && w.value > 0);
}

export async function openHealthSettings() {
  const h = await getHealthPlugin();
  if (!h) return;
  try {
    if (getHealthPlatform() === 'ios') {
      await h.openAppleHealthSettings();
    } else {
      await h.openHealthConnectSettings();
    }
  } catch (e) {
    console.warn('[HealthService] Could not open settings:', e.message);
  }
}
