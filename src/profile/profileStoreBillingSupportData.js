import {
  BILLING_SUPPORT_ESCALATION_ITEMS,
} from './profileConstants';
import { buildStoreBillingSupportCopy } from './storeBillingSupportCopy';

export function buildProfileStoreBillingSupportData({
  activeChallengePackCount,
  challengePackCount,
  entitlementRecoveryReviewCount,
  proActive,
  storeCatalog,
  storePackCount,
  storeSubscriptionCount,
  storeTestEvidenceSummary,
  validationReadinessConfirmed,
}) {
  return buildStoreBillingSupportCopy({
    billingSupportEscalationItems: BILLING_SUPPORT_ESCALATION_ITEMS,
    storeCatalog,
    storeSubscriptionCount,
    storePackCount,
    storeTestEvidenceSummary,
    entitlementRecoveryReviewCount,
    validationReadinessConfirmed,
    proActive,
    activeChallengePackCount,
    challengePackCount,
  });
}
