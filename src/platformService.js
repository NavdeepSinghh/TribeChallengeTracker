/**
 * platformService.js
 *
 * Single source of truth for runtime platform detection.
 * Import these constants anywhere instead of calling Capacitor directly.
 *
 * Values are computed once at module-load time — they never change
 * within a session, so there's no need for React state or effects.
 */

import { Capacitor } from '@capacitor/core';

// ── Core platform ─────────────────────────────────────────────────────────────
export const platform  = Capacitor.getPlatform();   // 'ios' | 'android' | 'web'
export const isNative  = Capacitor.isNativePlatform();
export const isIOS     = platform === 'ios';
export const isAndroid = platform === 'android';
export const isWeb     = platform === 'web';

// ── Health / wearable sync ────────────────────────────────────────────────────
/** True only when the health SDK is accessible (native iOS or Android). */
export const canSyncHealth = isNative;

/** Name of the health data store on this platform, or null on web. */
export const healthAppName = isIOS ? 'Apple Health' : isAndroid ? 'Health Connect' : null;

/**
 * Watch options shown in the Log Activity modal.
 * Each option knows whether it is interactive on the current platform.
 */
export const WATCH_OPTIONS = [
  {
    id:              'apple',
    label:           'Apple Watch',
    icon:            '⌚',
    platformLabel:   'iOS',
    isActive:        isIOS,      // tappable and triggers sync on iOS only
  },
  {
    id:              'galaxy',
    label:           'Galaxy Watch',
    icon:            '⌚',
    platformLabel:   'Android',
    isActive:        isAndroid,  // tappable and triggers sync on Android only
  },
];

/**
 * Human-readable description of what the sync button will do,
 * used as helper text below the watch buttons.
 */
export const syncHintText = isIOS
  ? 'Tap Apple Watch to import today\'s workouts from Apple Health'
  : isAndroid
    ? 'Tap Galaxy Watch to import today\'s workouts from Health Connect'
    : null; // not shown on web
