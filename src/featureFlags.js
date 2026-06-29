export const FEATURE_FLAGS = {
  TRIBE_FEED_ENABLED: true,
  FOLLOW_FEATURE_ENABLED: true,
};

export const FOLLOW_FEATURE_BETA_UIDS = new Set([
  'M98xIszlUick0Zw9SJTbfIN1ho13',
  'wOkXIFQoTZPRccE1GWpdPGdco373',
]);

export function isFollowFeatureEnabledForUser(userOrUid) {
  const uid = typeof userOrUid === 'string' ? userOrUid : userOrUid?.uid;
  return FEATURE_FLAGS.FOLLOW_FEATURE_ENABLED || FOLLOW_FEATURE_BETA_UIDS.has(uid);
}
