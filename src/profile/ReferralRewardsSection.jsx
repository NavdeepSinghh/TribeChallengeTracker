import ReferralRewardAdminReviewSection from './ReferralRewardAdminReviewSection';
import ReferralRewardClaimPanel from './ReferralRewardClaimPanel';
import ReferralRewardCopyKits from './ReferralRewardCopyKits';
import ReferralRewardHandoffAuditReviewCard from './ReferralRewardHandoffAuditReviewCard';
import ReferralRewardProgressPanel from './ReferralRewardProgressPanel';

export default function ReferralRewardsSection({
  approvedReferralRewardHandoffAuditReviews,
  referralState,
  referralJoins,
  referralLaunchCopy,
  referralStorySprintCopy,
  referralRewardSocialProofCopy,
  unlockedReferralRewardTier,
  onReferralRewardClaim,
  isClaimingReferralReward,
  referralRewardClaimMessage,
  referralRewardHandoffAuditReviewMessage,
  referralRewardHandoffAuditReviewNotes,
  referralRewardHandoffAuditReviewQueue,
  isAdmin,
  isSubmittingReferralRewardHandoffAuditReview,
  referralRewardReviewQueue,
  referralRewardReviewNotes,
  reviewingReferralRewardHandoffAuditReviewId,
  setReferralRewardReviewNotes,
  setReferralRewardHandoffAuditReviewNotes,
  reviewingReferralRewardClaimId,
  onReferralRewardClaimReview,
  onReferralRewardHandoffAuditReviewDecision,
  onReferralRewardHandoffAuditReviewSubmit,
  referralRewardDecisionReplyCopy,
  copyText,
}) {
  return (
    <>
      <ReferralRewardCopyKits
        copyText={copyText}
        referralJoins={referralJoins}
        referralLaunchCopy={referralLaunchCopy}
        referralRewardSocialProofCopy={referralRewardSocialProofCopy}
        referralState={referralState}
        referralStorySprintCopy={referralStorySprintCopy}
        unlockedReferralRewardTier={unlockedReferralRewardTier}
      />

      <div style={{
        borderRadius: 16, padding: 16, marginBottom: 20,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <ReferralRewardProgressPanel
          referralJoins={referralJoins}
          referralState={referralState}
        />
        <ReferralRewardClaimPanel
          isClaimingReferralReward={isClaimingReferralReward}
          onReferralRewardClaim={onReferralRewardClaim}
          referralRewardClaimMessage={referralRewardClaimMessage}
          unlockedReferralRewardTier={unlockedReferralRewardTier}
        />
      </div>

      {isAdmin && (
        <>
          <ReferralRewardAdminReviewSection
            referralJoins={referralJoins}
            referralRewardReviewQueue={referralRewardReviewQueue}
            referralRewardReviewNotes={referralRewardReviewNotes}
            setReferralRewardReviewNotes={setReferralRewardReviewNotes}
            reviewingReferralRewardClaimId={reviewingReferralRewardClaimId}
            onReferralRewardClaimReview={onReferralRewardClaimReview}
            referralRewardDecisionReplyCopy={referralRewardDecisionReplyCopy}
            unlockedReferralRewardTier={unlockedReferralRewardTier}
            copyText={copyText}
          />
          <ReferralRewardHandoffAuditReviewCard
            approvedReferralRewardHandoffAuditReviews={approvedReferralRewardHandoffAuditReviews}
            isSubmittingReferralRewardHandoffAuditReview={isSubmittingReferralRewardHandoffAuditReview}
            onDecision={onReferralRewardHandoffAuditReviewDecision}
            onSubmit={onReferralRewardHandoffAuditReviewSubmit}
            referralRewardHandoffAuditReviewMessage={referralRewardHandoffAuditReviewMessage}
            referralRewardHandoffAuditReviewNotes={referralRewardHandoffAuditReviewNotes}
            referralRewardHandoffAuditReviewQueue={referralRewardHandoffAuditReviewQueue}
            reviewingReferralRewardHandoffAuditReviewId={reviewingReferralRewardHandoffAuditReviewId}
            setReferralRewardHandoffAuditReviewNotes={setReferralRewardHandoffAuditReviewNotes}
          />
        </>
      )}
    </>
  );
}
