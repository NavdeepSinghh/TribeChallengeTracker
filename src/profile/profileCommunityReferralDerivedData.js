import {
  FEATURE_CATEGORY_LABELS,
  REFERRAL_TIERS,
  referralTierState,
} from './profileConstants';
import { buildCommunityHighlightCopy } from './communityHighlightCopy';
import { buildReferralRewardCopy } from './referralCopy';

export function buildProfileCommunityReferralDerivedData({
  currentStreak,
  daysActive,
  featureReviewQueue,
  featuredSubmissions,
  profile,
  approvedReferralRewardHandoffAuditReviews,
  referralRewardHandoffAuditReviewQueue,
  referralRewardReviewQueue,
  totalWinPoints,
  weeklyCampaignPrompt,
}) {
  const referralJoins = profile?.stats?.referralJoins || 0;
  const referralState = referralTierState(referralJoins);
  const unlockedReferralRewardTier = [...REFERRAL_TIERS].reverse().find(tier => referralJoins >= tier.target) || null;
  const {
    referralLaunchCopy,
    referralStorySprintCopy,
    referralRewardSocialProofCopy,
    referralRewardDecisionReplyCopy,
    referralRewardSupportEscalationCopy,
    referralRewardHandoffAuditDecisionReplyCopy,
  } = buildReferralRewardCopy({
    referralState,
    referralJoins,
    totalWinPoints,
    currentStreak,
    daysActive,
    unlockedReferralRewardTier,
    approvedReferralRewardHandoffAuditReviews,
    referralRewardHandoffAuditReviewQueue,
    referralRewardReviewQueue,
  });
  const communityHighlightRoundupItems = featuredSubmissions.slice(0, 4);
  const {
    communityHighlightRoundupCopy,
    ugcConsentReminderCopy,
  } = buildCommunityHighlightCopy({
    communityHighlightRoundupItems,
    featureReviewQueue,
    weeklyCampaignPrompt,
    featureCategoryLabels: FEATURE_CATEGORY_LABELS,
  });

  return {
    communityHighlightRoundupCopy,
    communityHighlightRoundupItems,
    referralJoins,
    referralLaunchCopy,
    referralRewardDecisionReplyCopy,
    referralRewardSupportEscalationCopy,
    referralRewardHandoffAuditDecisionReplyCopy,
    referralRewardSocialProofCopy,
    referralState,
    referralStorySprintCopy,
    ugcConsentReminderCopy,
    unlockedReferralRewardTier,
  };
}
