export const PRO_FEATURES = {
  premiumAnalytics: 'premiumAnalytics',
  privateChallenges: 'privateChallenges',
  paidChallengePacks: 'paidChallengePacks',
};

export const V1_PAID_FEATURES_ENABLED = false;

export const STORE_PRODUCTS = {
  proMonthly: {
    id: 'com.risewiththetribe.pro.monthly',
    kind: 'subscription',
    entitlement: 'pro',
    cadence: 'monthly',
  },
  proYearly: {
    id: 'com.risewiththetribe.pro.yearly',
    kind: 'subscription',
    entitlement: 'pro',
    cadence: 'yearly',
  },
  reset21Pack: {
    id: 'com.risewiththetribe.pack.21_day_reset',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: '21_day_reset',
  },
  summerShredPack: {
    id: 'com.risewiththetribe.pack.summer_shred',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: 'summer_shred',
  },
  beginnerConsistencyPack: {
    id: 'com.risewiththetribe.pack.beginner_consistency',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: 'beginner_consistency',
  },
  discipline30Pack: {
    id: 'com.risewiththetribe.pack.discipline_30',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: 'discipline_30',
  },
  tribeMode75Pack: {
    id: 'com.risewiththetribe.pack.tribe_mode_75',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: 'tribe_mode_75',
  },
  comeback14Pack: {
    id: 'com.risewiththetribe.pack.comeback_14',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: 'comeback_14',
  },
  eventPrep21Pack: {
    id: 'com.risewiththetribe.pack.event_prep_21',
    kind: 'challengePack',
    entitlement: 'paidChallengePacks',
    packId: 'event_prep_21',
  },
};

export const STORE_PRODUCT_IDS = Object.values(STORE_PRODUCTS).map(product => product.id);

export function hasActivePro(profile) {
  if (!V1_PAID_FEATURES_ENABLED) return false;
  return profile?.entitlements?.pro?.active === true;
}

export function hasActiveChallengePack(profile, packId) {
  if (!V1_PAID_FEATURES_ENABLED) return false;
  if (!packId) return false;
  return profile?.entitlements?.packs?.[packId]?.active === true;
}

export function canCreateChallengeTemplate(profile, template) {
  if (!template?.isPremium) return true;
  if (!V1_PAID_FEATURES_ENABLED) return true;
  return hasActivePro(profile) || hasActiveChallengePack(profile, template.packId);
}

export function canUseProFeature(profile, featureId) {
  if (!featureId) return false;
  if (!V1_PAID_FEATURES_ENABLED) return false;
  return hasActivePro(profile);
}
