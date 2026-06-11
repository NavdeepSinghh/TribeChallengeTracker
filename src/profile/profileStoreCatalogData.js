import { hasActiveChallengePack, hasActivePro } from '../proFeatures';
import {
  STORE_CATALOG,
  STORE_TEST_EVIDENCE_CASES,
} from './profileConstants';

export function buildProfileStoreCatalogData(profile) {
  const storeSubscriptionCount = STORE_CATALOG.filter(product => product.kind === 'subscription').length;
  const storePackCount = STORE_CATALOG.filter(product => product.kind === 'challengePack').length;
  const proActive = hasActivePro(profile);
  const proSource = profile?.entitlements?.pro?.source || 'not configured';
  const isPackUnlocked = product => proActive || hasActiveChallengePack(profile, product.packId);
  const challengePackTitle = product => ({
    '21_day_reset': '21-Day Reset Pack',
    summer_shred: '28-Day Summer Shred',
    beginner_consistency: 'Beginner Consistency Plan',
    discipline_30: '30-Day Discipline Challenge',
    tribe_mode_75: '75-Day Tribe Mode',
    comeback_14: '14-Day Comeback Sprint',
  }[product.packId] || product.packId || product.id);
  const subscriptionProducts = STORE_CATALOG.filter(product => product.kind === 'subscription');
  const challengePackProducts = STORE_CATALOG.filter(product => product.kind === 'challengePack');
  const activeChallengePackCount = challengePackProducts.filter(isPackUnlocked).length;
  const storeTestEvidenceCases = STORE_TEST_EVIDENCE_CASES.map(test => {
    const product = test.productKind === 'subscription' ? subscriptionProducts[0] : challengePackProducts[0];
    return { ...test, productId: product?.id || '' };
  });

  return {
    activeChallengePackCount,
    challengePackProducts,
    challengePackTitle,
    isPackUnlocked,
    proActive,
    proSource,
    storeCatalog: STORE_CATALOG,
    storePackCount,
    storeSubscriptionCount,
    storeTestEvidenceCases,
  };
}
