import ReferralRewardDecisionReplyKit from './ReferralRewardDecisionReplyKit';
import ReferralRewardReviewQueue from './ReferralRewardReviewQueue';

export default function ReferralRewardAdminReviewSection({
  referralJoins,
  referralRewardReviewQueue,
  referralRewardReviewNotes,
  setReferralRewardReviewNotes,
  reviewingReferralRewardClaimId,
  onReferralRewardClaimReview,
  referralRewardDecisionReplyCopy,
  unlockedReferralRewardTier,
  copyText,
}) {
  return (
    <>
      <ReferralRewardReviewQueue
        onReferralRewardClaimReview={onReferralRewardClaimReview}
        referralRewardReviewNotes={referralRewardReviewNotes}
        referralRewardReviewQueue={referralRewardReviewQueue}
        reviewingReferralRewardClaimId={reviewingReferralRewardClaimId}
        setReferralRewardReviewNotes={setReferralRewardReviewNotes}
      />
      <ReferralRewardDecisionReplyKit
        copyText={copyText}
        referralJoins={referralJoins}
        referralRewardDecisionReplyCopy={referralRewardDecisionReplyCopy}
        referralRewardReviewQueue={referralRewardReviewQueue}
        unlockedReferralRewardTier={unlockedReferralRewardTier}
      />
    </>
  );
}
