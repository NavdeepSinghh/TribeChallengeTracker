import {
  claimReferralReward,
  getReferralRewardReviewQueue,
  reviewReferralRewardClaim,
} from '../userService';
import { buildReferralRewardHandoffAuditReviewActionHandlers } from './referralRewardHandoffAuditReviewActionHandlers';

export default function useReferralRewardActions({
  approvedReferralRewardHandoffAuditReviews,
  isAdmin,
  isClaimingReferralReward,
  isSubmittingReferralRewardHandoffAuditReview,
  profile,
  referralJoins,
  referralRewardHandoffAuditReviewNotes,
  referralRewardReviewNotes,
  reviewingReferralRewardHandoffAuditReviewId,
  reviewingReferralRewardClaimId,
  setApprovedReferralRewardHandoffAuditReviews,
  setIsClaimingReferralReward,
  setIsSubmittingReferralRewardHandoffAuditReview,
  setReferralRewardHandoffAuditReviewMessage,
  setReferralRewardHandoffAuditReviewQueue,
  setReferralRewardClaimMessage,
  setReferralRewardReviewQueue,
  setReviewingReferralRewardHandoffAuditReviewId,
  setReviewingReferralRewardClaimId,
  unlockedReferralRewardTier,
  user,
}) {
  const handleReferralRewardClaim = async () => {
    if (isClaimingReferralReward) return;
    setReferralRewardClaimMessage('');
    if (!unlockedReferralRewardTier) {
      setReferralRewardClaimMessage('Invite one challenge member to unlock your first referral reward claim.');
      return;
    }
    setIsClaimingReferralReward(true);
    try {
      await claimReferralReward(user.uid, {
        tierTarget: unlockedReferralRewardTier.target,
        referralJoins,
      });
      setReferralRewardClaimMessage(`Referral reward claim sent for ${unlockedReferralRewardTier.label}. Admins will verify meaningful challenge joins before fulfillment.`);
      if (isAdmin) {
        getReferralRewardReviewQueue().then(setReferralRewardReviewQueue).catch(() => setReferralRewardReviewQueue([]));
      }
    } catch (err) {
      setReferralRewardClaimMessage(err?.message || 'Could not send referral reward claim.');
    } finally {
      setIsClaimingReferralReward(false);
    }
  };

  const handleReferralRewardClaimReview = async (claimId, status) => {
    if (reviewingReferralRewardClaimId) return;
    setReviewingReferralRewardClaimId(claimId);
    try {
      await reviewReferralRewardClaim(claimId, {
        status,
        reviewNote: referralRewardReviewNotes[claimId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setReferralRewardClaimMessage(`Referral reward claim marked ${status}. Manual review note saved without granting Pro, entitlements, discounts, payouts, purchases, or affiliate rewards.`);
      getReferralRewardReviewQueue().then(setReferralRewardReviewQueue).catch(() => setReferralRewardReviewQueue([]));
    } catch (err) {
      setReferralRewardClaimMessage(err?.message || 'Could not update referral reward review.');
    } finally {
      setReviewingReferralRewardClaimId('');
    }
  };

  const referralRewardHandoffAuditReviewHandlers = buildReferralRewardHandoffAuditReviewActionHandlers({
    approvedReferralRewardHandoffAuditReviews,
    isAdmin,
    isSubmittingReferralRewardHandoffAuditReview,
    profile,
    referralRewardHandoffAuditReviewNotes,
    reviewingReferralRewardHandoffAuditReviewId,
    setApprovedReferralRewardHandoffAuditReviews,
    setIsSubmittingReferralRewardHandoffAuditReview,
    setReferralRewardHandoffAuditReviewMessage,
    setReferralRewardHandoffAuditReviewQueue,
    setReviewingReferralRewardHandoffAuditReviewId,
    user,
  });

  return {
    handleReferralRewardClaim,
    handleReferralRewardClaimReview,
    ...referralRewardHandoffAuditReviewHandlers,
  };
}
