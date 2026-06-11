import CreatorHostingApplicationCard from './CreatorHostingApplicationCard';
import CreatorChallengeTemplateDraftCard from './CreatorChallengeTemplateDraftCard';
import CreatorPlanningCopyKits from './CreatorPlanningCopyKits';
import CreatorProfileForm from './CreatorProfileForm';

export default function CreatorCoachMemberSection({
  creatorAnalytics,
  creatorBrandedPagePreviewCopy,
  creatorChallengeTemplateDraftCopy,
  creatorProfileCompletionCopy,
  creatorBio,
  creatorCtaUrl,
  creatorEnabled,
  creatorBrandedPageMessage,
  creatorHostingApplicationMessage,
  creatorHostingObjectionReplyCopy,
  creatorHostingOfferCopy,
  creatorIdentityVerificationPrepCopy,
  creatorLeaderboardSnapshotMessage,
  creatorLeaderboardPreviewCopy,
  creatorLeaderboardRankingReadinessCopy,
  creatorModerationReadinessCopy,
  creatorPaidHostingLaunchGateCopy,
  creatorPaidHostingLaunchGateMessage,
  creatorPayoutExceptionMessage,
  creatorPaidHostingHoldPlanCopy,
  creatorLaunchChallenge,
  creatorLaunchCopy,
  creatorLaunchLink,
  creatorMessage,
  creatorPrivateInviteCopy,
  creatorPrivateInviteLaunchMessage,
  creatorTemplateDraftMessage,
  creatorAgreementPrepCopy,
  creatorSupportHandoffCopy,
  creatorPaidHostingPolicyCopy,
  creatorPayoutOperationsDryRunCopy,
  creatorPayoutReconciliationCopy,
  creatorTaxWorkflowReadinessCopy,
  creatorPayoutExceptionResponseCopy,
  creatorPayoutSupportEscalationCopy,
  creatorPayoutProviderSetupCopy,
  creatorPayoutReadinessCopy,
  creatorRevenueShareInterest,
  creatorSpecialty,
  creatorTermsReadinessCopy,
  handleCreatorHostingApplication,
  handleCreatorBrandedPageSubmit,
  handleCreatorLeaderboardSnapshotSubmit,
  handleCreatorPrivateInviteLaunchSubmit,
  handleCreatorPaidHostingLaunchGateSubmit,
  handleCreatorPayoutExceptionReviewSubmit,
  handleCreatorTemplateDraftSubmit,
  handleCreatorSave,
  isSavingCreator,
  isSubmittingCreatorBrandedPage,
  isSubmittingCreatorHostingApplication,
  isSubmittingCreatorLeaderboardSnapshot,
  isSubmittingCreatorPrivateInviteLaunch,
  isSubmittingCreatorPaidHostingLaunchGate,
  isSubmittingCreatorPayoutExceptionReview,
  isSubmittingCreatorTemplateDraft,
  proActive,
  setCreatorBio,
  setCreatorCtaUrl,
  setCreatorSpecialty,
}) {
  return (
    <>
      <CreatorPlanningCopyKits
        creatorAnalytics={creatorAnalytics}
        creatorBrandedPagePreviewCopy={creatorBrandedPagePreviewCopy}
        creatorChallengeTemplateDraftCopy={creatorChallengeTemplateDraftCopy}
        creatorProfileCompletionCopy={creatorProfileCompletionCopy}
        creatorEnabled={creatorEnabled}
        creatorHostingObjectionReplyCopy={creatorHostingObjectionReplyCopy}
        creatorHostingOfferCopy={creatorHostingOfferCopy}
        creatorIdentityVerificationPrepCopy={creatorIdentityVerificationPrepCopy}
        creatorLeaderboardPreviewCopy={creatorLeaderboardPreviewCopy}
        creatorLeaderboardRankingReadinessCopy={creatorLeaderboardRankingReadinessCopy}
        creatorModerationReadinessCopy={creatorModerationReadinessCopy}
        creatorPaidHostingLaunchGateCopy={creatorPaidHostingLaunchGateCopy}
        creatorPaidHostingHoldPlanCopy={creatorPaidHostingHoldPlanCopy}
        creatorLaunchChallenge={creatorLaunchChallenge}
        creatorLaunchCopy={creatorLaunchCopy}
        creatorLaunchLink={creatorLaunchLink}
        creatorPrivateInviteCopy={creatorPrivateInviteCopy}
        creatorAgreementPrepCopy={creatorAgreementPrepCopy}
        creatorSupportHandoffCopy={creatorSupportHandoffCopy}
        creatorPaidHostingPolicyCopy={creatorPaidHostingPolicyCopy}
        creatorPayoutOperationsDryRunCopy={creatorPayoutOperationsDryRunCopy}
        creatorPayoutReconciliationCopy={creatorPayoutReconciliationCopy}
        creatorTaxWorkflowReadinessCopy={creatorTaxWorkflowReadinessCopy}
        creatorPayoutExceptionResponseCopy={creatorPayoutExceptionResponseCopy}
        creatorPayoutSupportEscalationCopy={creatorPayoutSupportEscalationCopy}
        creatorPayoutProviderSetupCopy={creatorPayoutProviderSetupCopy}
        creatorPayoutReadinessCopy={creatorPayoutReadinessCopy}
        creatorRevenueShareInterest={creatorRevenueShareInterest}
        creatorTermsReadinessCopy={creatorTermsReadinessCopy}
        proActive={proActive}
      />
      <CreatorHostingApplicationCard
        creatorEnabled={creatorEnabled}
        creatorHostingApplicationMessage={creatorHostingApplicationMessage}
        handleCreatorHostingApplication={handleCreatorHostingApplication}
        isSubmittingCreatorHostingApplication={isSubmittingCreatorHostingApplication}
        proActive={proActive}
      />
      <CreatorChallengeTemplateDraftCard
        creatorEnabled={creatorEnabled}
        creatorTemplateDraftMessage={creatorTemplateDraftMessage}
        handleCreatorTemplateDraftSubmit={handleCreatorTemplateDraftSubmit}
        isSubmittingCreatorTemplateDraft={isSubmittingCreatorTemplateDraft}
        proActive={proActive}
      />
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#60A5FA', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR BRANDED PAGE DRAFT</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save a Coach Host branded page draft for admin review. It stores creator profile, CTA, and hosted challenge summary only; no tracking pixels, payments, purchases, entitlements, revenue-share, or paid-hosting claims.
        </p>
        <button
          onClick={handleCreatorBrandedPageSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorBrandedPage}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#60A5FA', color: '#06111f', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorBrandedPage ? 'SAVING...' : 'SAVE PAGE DRAFT FOR REVIEW'}
        </button>
        {creatorBrandedPageMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorBrandedPageMessage}</p>
        )}
      </div>
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#FBBF24', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>PRIVATE CREATOR INVITE LAUNCH</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save an app-first private challenge invite launch for admin review. It records private challenge readiness only; no auto-messaging, link-open tracking, payments, purchases, entitlements, revenue-share, or paid-hosting claims.
        </p>
        <button
          onClick={handleCreatorPrivateInviteLaunchSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorPrivateInviteLaunch}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#FBBF24', color: '#1f1300', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorPrivateInviteLaunch ? 'SAVING...' : 'SAVE PRIVATE INVITE FOR REVIEW'}
        </button>
        {creatorPrivateInviteLaunchMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorPrivateInviteLaunchMessage}</p>
        )}
      </div>
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(244,114,182,0.07)', border: '1px solid rgba(244,114,182,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#F472B6', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR PAID HOSTING LAUNCH GATE EVIDENCE</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save first-party paid-hosting launch gate evidence for admin review. It checks profile, hosted reach, approved review records, and published creator surfaces only; paid hosting stays off with no contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
        </p>
        <button
          onClick={handleCreatorPaidHostingLaunchGateSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorPaidHostingLaunchGate}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#F472B6', color: '#220614', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorPaidHostingLaunchGate ? 'SAVING...' : 'SAVE LAUNCH GATE EVIDENCE'}
        </button>
        {creatorPaidHostingLaunchGateMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorPaidHostingLaunchGateMessage}</p>
        )}
      </div>
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,113,133,0.07)', border: '1px solid rgba(251,113,133,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#FB7185', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR PAYOUT EXCEPTION REVIEW RECORD</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save aggregate creatorPayoutExceptionReviews evidence for manual admin review. This does not resolve payout disputes, process refunds, collect tax forms, collect government IDs, collect bank details, collect payout details, access payout providers, create payout accounts, create payouts, move money, create purchases, write entitlements, give tax advice, bypass marketplace policy, promise earnings, expose private member logs, scrape messages, add tracking pixels, or imply paid creator hosting is live.
        </p>
        <button
          onClick={handleCreatorPayoutExceptionReviewSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorPayoutExceptionReview}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#FB7185', color: '#23060b', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorPayoutExceptionReview ? 'SAVING...' : 'SAVE PAYOUT EXCEPTION REVIEW'}
        </button>
        {creatorPayoutExceptionMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorPayoutExceptionMessage}</p>
        )}
      </div>
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR LEADERBOARD SNAPSHOT</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save an aggregate hosted-challenge leaderboard snapshot for admin review. It uses first-party challenge counts and total points only; no member identities, per-user logs, payouts, purchases, entitlements, tracking, or paid-hosting claims.
        </p>
        <button
          onClick={handleCreatorLeaderboardSnapshotSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorLeaderboardSnapshot}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#34D399', color: '#04130d', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorLeaderboardSnapshot ? 'SAVING...' : 'SAVE SNAPSHOT FOR REVIEW'}
        </button>
        {creatorLeaderboardSnapshotMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorLeaderboardSnapshotMessage}</p>
        )}
      </div>
      <CreatorProfileForm
        creatorBio={creatorBio}
        creatorCtaUrl={creatorCtaUrl}
        creatorMessage={creatorMessage}
        creatorSpecialty={creatorSpecialty}
        handleCreatorSave={handleCreatorSave}
        isSavingCreator={isSavingCreator}
        proActive={proActive}
        setCreatorBio={setCreatorBio}
        setCreatorCtaUrl={setCreatorCtaUrl}
        setCreatorSpecialty={setCreatorSpecialty}
      />
    </>
  );
}
