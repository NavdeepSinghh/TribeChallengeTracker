import { REFERRAL_TIERS } from './profileEngagementConstants';

export {
  ACCENT,
  AVATAR_OPTIONS,
  FREQ_LABELS,
  GOAL_LABELS,
  GOLD,
  LEVEL_LABELS,
  POLICY_LINKS,
  PROFILE_FRAMES,
  reminderButtonStyle,
} from './profileThemeConstants';
export {
  BILLING_SUPPORT_ESCALATION_ITEMS,
  CANCELLATION_FEEDBACK_ITEMS,
  LAPSED_MEMBER_WINBACK_ITEMS,
  RENEWAL_RECOVERY_ITEMS,
  SANDBOX_PURCHASE_TEST_ITEMS,
  STORE_CATALOG,
  STORE_CREDENTIAL_SETUP_ITEMS,
  STORE_DEMO_ACCOUNT_ITEMS,
  STORE_LAUNCH_DRY_RUN_ITEMS,
  STORE_READINESS_ITEMS,
  STORE_REVIEW_PACK_ITEMS,
  STORE_TEST_PURCHASE_SESSION_PREP_ITEMS,
  STORE_TEST_EVIDENCE_CASES,
  SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS,
  SUPPORT_REFUND_READINESS_ITEMS,
} from './profileStoreConstants';
export {
  DM_KEYWORD_PROMPTS,
  FEATURE_CATEGORIES,
  FEATURE_CATEGORY_LABELS,
  FEATURE_STATUS_STYLES,
  INSTAGRAM_WEEKLY_PROMPTS,
  PROFILE_PARITY_CONTRACT_LABELS,
  PRO_BENEFITS,
  PRO_TRIAL_REASONS,
  REFERRAL_TIERS,
} from './profileEngagementConstants';

export const referralTierState = (count = 0) => {
  const achieved = [...REFERRAL_TIERS].reverse().find(tier => count >= tier.target) || null;
  const next = REFERRAL_TIERS.find(tier => count < tier.target) || null;
  const previousTarget = achieved?.target || 0;
  const progressBase = next ? next.target - previousTarget : 1;
  const progressValue = next ? count - previousTarget : 1;
  return {
    achieved,
    next,
    earnedCount: REFERRAL_TIERS.filter(tier => count >= tier.target).length,
    remainingToNext: next ? Math.max(0, next.target - count) : 0,
    ladderPct: Math.min(100, Math.max(0, (count / REFERRAL_TIERS[REFERRAL_TIERS.length - 1].target) * 100)),
    pct: next ? Math.min(100, Math.max(0, (progressValue / progressBase) * 100)) : 100,
  };
};
