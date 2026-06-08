import { Capacitor } from '@capacitor/core';

let healthPlugin = null;

export async function getHealthPlugin() {
  if (healthPlugin) return healthPlugin;
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const { Health } = await import('capacitor-health');
    healthPlugin = Health;
  } catch (e) {
    console.warn('[HealthService] Plugin failed to load:', e.message);
  }
  return healthPlugin;
}

export function getHealthPlatform() {
  return Capacitor.getPlatform();
}
