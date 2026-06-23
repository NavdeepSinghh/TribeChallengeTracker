import ReferralRewardAdminReviewSection from './ReferralRewardAdminReviewSection';
import { ReferralCopyCard } from './ReferralRewardCards';
import ReferralRewardClaimPanel from './ReferralRewardClaimPanel';
import ReferralRewardCopyKits from './ReferralRewardCopyKits';
import ReferralRewardHandoffAuditReviewCard from './ReferralRewardHandoffAuditReviewCard';
import ReferralRewardProgressPanel from './ReferralRewardProgressPanel';

export default function ReferralRewardsSection({
  appInviteLink,
  appReferralSignups,
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
  referralRewardSupportEscalationCopy,
  referralRewardHandoffAuditDecisionReplyCopy,
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
          appInviteLink={appInviteLink}
          appReferralSignups={appReferralSignups}
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
          <ReferralCopyCard
            title="REFERRAL REWARD SUPPORT ESCALATION KIT"
            subtitle="Manual support routing before reward fulfillment"
            status="SUPPORT MAP"
            color="#F43F5E"
            metrics={[
              { label: 'OPEN', value: referralRewardReviewQueue.length },
              { label: 'AUDITS', value: referralRewardHandoffAuditReviewQueue.length },
              { label: 'JOINS', value: referralJoins },
            ]}
            body="Copy referral reward support routing for claim status, duplicate checks, privacy, recognition wording, and entitlement QA without granting Pro, payouts, discounts, purchases, affiliate rewards, or fulfillment."
            buttonLabel="COPY REFERRAL SUPPORT KIT"
            onCopy={() => copyText(referralRewardSupportEscalationCopy, 'Referral reward support escalation copied')}
          />
          <ReferralRewardHandoffAuditReviewCard
            approvedReferralRewardHandoffAuditReviews={approvedReferralRewardHandoffAuditReviews}
            copyText={copyText}
            isSubmittingReferralRewardHandoffAuditReview={isSubmittingReferralRewardHandoffAuditReview}
            onDecision={onReferralRewardHandoffAuditReviewDecision}
            onSubmit={onReferralRewardHandoffAuditReviewSubmit}
            referralRewardHandoffAuditDecisionReplyCopy={referralRewardHandoffAuditDecisionReplyCopy}
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
