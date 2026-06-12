import { buildCreatorHostingCopy } from '../profile/creatorHostingCopy';

describe('creator hosting copy contracts', () => {
  it('builds creator hosting planning, terms, payout, objection, and decision copy without paid-hosting side effects', () => {
    const copy = buildCreatorHostingCopy({
      creatorAnalytics: {
        hosted: 2,
        members: 14,
        revenueReady: 1,
      },
      creatorBio: 'Strength and consistency coach.',
      creatorHostingApplicationReviewQueue: [{ id: 'creator-app-1' }],
      creatorOwnedChallenges: [
        {
          inviteCode: 'RESET7',
          name: 'Seven Day Reset',
          startDate: '2026-06-10',
          tagline: 'Show up honestly.',
        },
      ],
      creatorRevenueShareInterest: true,
      creatorSpecialty: 'Strength accountability',
      userId: 'coach-1',
    });

    expect(copy.creatorLaunchLink).toContain('join=RESET7');
    expect(copy.creatorLaunchLink).toContain('ref=coach-1');
    expect(copy.creatorProfileCompletionCopy).toContain('Creator Profile Completion Kit');
    expect(copy.creatorProfileCompletionCopy).toContain('Profile completion checklist');
    expect(copy.creatorProfileCompletionCopy).toContain('Coach Host block');
    expect(copy.creatorProfileCompletionCopy).toContain('Do not create contracts');
    expect(copy.creatorProfileCompletionCopy).toContain('collect payout details');
    expect(copy.creatorBrandedPagePreviewCopy).toContain('Creator Branded Page Preview Kit');
    expect(copy.creatorBrandedPagePreviewCopy).toContain('Coach Host block');
    expect(copy.creatorBrandedPagePreviewCopy).toContain('creator specialty, bio, and CTA link');
    expect(copy.creatorBrandedPagePreviewCopy).toContain('first-party');
    expect(copy.creatorBrandedPagePreviewCopy).toContain('Do not create branded page records');
    expect(copy.creatorBrandedPagePreviewCopy).toContain('add tracking pixels');
    expect(copy.creatorChallengeTemplateDraftCopy).toContain('Creator Challenge Template Draft Kit');
    expect(copy.creatorChallengeTemplateDraftCopy).toContain('Creator template draft checklist');
    expect(copy.creatorChallengeTemplateDraftCopy).toContain('duration, rules, daily prompts');
    expect(copy.creatorChallengeTemplateDraftCopy).toContain('reusable for free hosted challenges first');
    expect(copy.creatorChallengeTemplateDraftCopy).toContain('Do not create template records');
    expect(copy.creatorChallengeTemplateDraftCopy).toContain('create partner links');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('Creator Leaderboard Preview Kit');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('Leaderboard preview checklist');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('first-party hosted challenge movement');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('active members, logged sessions, challenge points, referrals');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('consent-cleared Feature Me submissions');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('Do not create leaderboard records');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('export per-user logs');
    expect(copy.creatorLeaderboardPreviewCopy).toContain('imply paid hosting is live');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('Creator Leaderboard Ranking Readiness Kit');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('Ranking readiness checklist');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('aggregate ranking inputs');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('tie-break rules');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('identity-safe and aggregate-only');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('Do not create leaderboard records');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('publish rankings');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('approve paid hosting');
    expect(copy.creatorLeaderboardRankingReadinessCopy).toContain('write entitlements');
    expect(copy.creatorPrivateInviteCopy).toContain('Private Creator Invite Kit');
    expect(copy.creatorPrivateInviteCopy).toContain('private Pro Coach Mode challenge');
    expect(copy.creatorPrivateInviteCopy).toContain('first-party challenge joins');
    expect(copy.creatorPrivateInviteCopy).toContain('Do not auto-message');
    expect(copy.creatorPrivateInviteCopy).toContain('count link opens');
    expect(copy.creatorPrivateInviteCopy).toContain('write entitlements');
    expect(copy.creatorHostingOfferCopy).toContain('Creator Hosting Offer Kit');
    expect(copy.creatorHostingOfferCopy).toContain('does not create a contract, payout, purchase, entitlement, or paid-access claim');
    expect(copy.creatorTermsReadinessCopy).toContain('Creator Terms Readiness Kit');
    expect(copy.creatorTermsReadinessCopy).toContain('Do not create contracts');
    expect(copy.creatorTermsReadinessCopy).toContain('start revenue-share');
    expect(copy.creatorAgreementPrepCopy).toContain('Creator Agreement Prep Kit');
    expect(copy.creatorAgreementPrepCopy).toContain('Agreement prep checklist');
    expect(copy.creatorAgreementPrepCopy).toContain('support owner');
    expect(copy.creatorAgreementPrepCopy).toContain('Do not create contracts');
    expect(copy.creatorAgreementPrepCopy).toContain('collect signatures');
    expect(copy.creatorSupportHandoffCopy).toContain('Creator Support Handoff Kit');
    expect(copy.creatorSupportHandoffCopy).toContain('Support handoff checklist');
    expect(copy.creatorSupportHandoffCopy).toContain('app support owner');
    expect(copy.creatorSupportHandoffCopy).toContain('Do not process refunds');
    expect(copy.creatorSupportHandoffCopy).toContain('expose private member data');
    expect(copy.creatorPaidHostingPolicyCopy).toContain('Creator Paid Hosting Policy Kit');
    expect(copy.creatorPaidHostingPolicyCopy).toContain('Paid-hosting policy checklist');
    expect(copy.creatorPaidHostingPolicyCopy).toContain('marketplace alignment');
    expect(copy.creatorPaidHostingPolicyCopy).toContain('Do not approve paid hosting');
    expect(copy.creatorPaidHostingPolicyCopy).toContain('write entitlements');
    expect(copy.creatorLegalPacketPrepCopy).toContain('Creator Legal Packet Prep Kit');
    expect(copy.creatorLegalPacketPrepCopy).toContain('Legal packet checklist');
    expect(copy.creatorLegalPacketPrepCopy).toContain('legal review');
    expect(copy.creatorLegalPacketPrepCopy).toContain('marketplace policy');
    expect(copy.creatorLegalPacketPrepCopy).toContain('entitlement QA');
    expect(copy.creatorLegalPacketPrepCopy).toContain('This is a creator legal packet prep kit only');
    expect(copy.creatorLegalPacketPrepCopy).toContain('Do not create contracts');
    expect(copy.creatorLegalPacketPrepCopy).toContain('collect signatures');
    expect(copy.creatorLegalPacketPrepCopy).toContain('collect payout details');
    expect(copy.creatorLegalPacketPrepCopy).toContain('collect tax details');
    expect(copy.creatorLegalPacketPrepCopy).toContain('create payout accounts');
    expect(copy.creatorLegalPacketPrepCopy).toContain('start revenue-share');
    expect(copy.creatorLegalPacketPrepCopy).toContain('create purchases');
    expect(copy.creatorLegalPacketPrepCopy).toContain('write entitlements');
    expect(copy.creatorLegalPacketPrepCopy).toContain('grant paid access');
    expect(copy.creatorLegalPacketPrepCopy).toContain('submit store review');
    expect(copy.creatorLegalPacketPrepCopy).toContain('imply paid creator hosting is live');
    expect(copy.creatorIdentityVerificationPrepCopy).toContain('Creator Identity Verification Prep Kit');
    expect(copy.creatorIdentityVerificationPrepCopy).toContain('Do not verify identities from client code');
    expect(copy.creatorIdentityVerificationPrepCopy).toContain('collect government IDs');
    expect(copy.creatorModerationReadinessCopy).toContain('Creator Moderation Readiness Kit');
    expect(copy.creatorModerationReadinessCopy).toContain('Do not auto-moderate');
    expect(copy.creatorModerationReadinessCopy).toContain('export private member activity');
    expect(copy.creatorPaidHostingLaunchGateCopy).toContain('Creator Paid Hosting Launch Gate Kit');
    expect(copy.creatorPaidHostingLaunchGateCopy).toContain('Gate result: keep paid creator hosting in review');
    expect(copy.creatorPaidHostingLaunchGateCopy).toContain('Do not approve paid hosting');
    expect(copy.creatorPaidHostingHoldPlanCopy).toContain('Creator Paid Hosting Hold Plan Kit');
    expect(copy.creatorPaidHostingHoldPlanCopy).toContain('Hold plan triggers');
    expect(copy.creatorPaidHostingHoldPlanCopy).toContain('Keep the creator in free hosted challenge mode');
    expect(copy.creatorPaidHostingHoldPlanCopy).toContain('Do not approve paid hosting');
    expect(copy.creatorPaidHostingHoldPlanCopy).toContain('grant paid access');
    expect(copy.creatorPayoutReadinessCopy).toContain('Creator Payout Readiness Kit');
    expect(copy.creatorPayoutReadinessCopy).toContain('Do not create payouts');
    expect(copy.creatorPayoutReadinessCopy).toContain('collect tax details');
    expect(copy.creatorPayoutProviderSetupCopy).toContain('Creator Payout Provider Setup Kit');
    expect(copy.creatorPayoutProviderSetupCopy).toContain('Provider setup checklist');
    expect(copy.creatorPayoutProviderSetupCopy).toContain('Do not create payout accounts');
    expect(copy.creatorPayoutProviderSetupCopy).toContain('collect bank details');
    expect(copy.creatorPayoutProviderSetupCopy).toContain('store provider credentials');
    expect(copy.creatorPayoutOperationsDryRunCopy).toContain('Creator Payout Operations Dry-Run Kit');
    expect(copy.creatorPayoutOperationsDryRunCopy).toContain('Operations dry-run checklist');
    expect(copy.creatorPayoutOperationsDryRunCopy).toContain('zero-money payout rehearsal');
    expect(copy.creatorPayoutOperationsDryRunCopy).toContain('Do not create payout accounts');
    expect(copy.creatorPayoutOperationsDryRunCopy).toContain('access payout providers');
    expect(copy.creatorPayoutOperationsDryRunCopy).toContain('move money');
    expect(copy.creatorPayoutReconciliationCopy).toContain('Creator Payout Reconciliation Kit');
    expect(copy.creatorPayoutReconciliationCopy).toContain('Payout reconciliation checklist');
    expect(copy.creatorPayoutReconciliationCopy).toContain('mock payout events');
    expect(copy.creatorPayoutReconciliationCopy).toContain('store-test evidence');
    expect(copy.creatorPayoutReconciliationCopy).toContain('Do not create payout accounts');
    expect(copy.creatorPayoutReconciliationCopy).toContain('expose private member logs');
    expect(copy.creatorTaxWorkflowReadinessCopy).toContain('Creator Tax Workflow Readiness Kit');
    expect(copy.creatorTaxWorkflowReadinessCopy).toContain('Tax workflow readiness checklist');
    expect(copy.creatorTaxWorkflowReadinessCopy).toContain('tax onboarding is not live');
    expect(copy.creatorTaxWorkflowReadinessCopy).toContain('Do not collect tax details');
    expect(copy.creatorTaxWorkflowReadinessCopy).toContain('give tax advice');
    expect(copy.creatorTaxWorkflowReadinessCopy).toContain('store tax forms');
    expect(copy.creatorPayoutExceptionResponseCopy).toContain('Creator Payout Exception Response Kit');
    expect(copy.creatorPayoutExceptionResponseCopy).toContain('Payout exception response checklist');
    expect(copy.creatorPayoutExceptionResponseCopy).toContain('payout exception review is not live payout processing');
    expect(copy.creatorPayoutExceptionResponseCopy).toContain('Do not resolve payout disputes');
    expect(copy.creatorPayoutExceptionResponseCopy).toContain('process refunds');
    expect(copy.creatorPayoutExceptionResponseCopy).toContain('write entitlements');
    expect(copy.creatorPayoutSupportEscalationCopy).toContain('Creator Payout Support Escalation Kit');
    expect(copy.creatorPayoutSupportEscalationCopy).toContain('Payout support escalation checklist');
    expect(copy.creatorPayoutSupportEscalationCopy).toContain('payout support escalation is not live payout support');
    expect(copy.creatorPayoutSupportEscalationCopy).toContain('Do not provide live payout support');
    expect(copy.creatorPayoutSupportEscalationCopy).toContain('process refunds');
    expect(copy.creatorPayoutSupportEscalationCopy).toContain('write entitlements');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('Creator Payout Support Readiness Script Kit');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('Manual payout support readiness script');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('payout support is not live');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('creator terms');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('payout provider setup');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('tax workflow');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('store-test evidence');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('entitlement QA');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('Capture only first-party support context');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('This payout support readiness script is copy-only');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('Do not provide live payout support');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('collect tax forms');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('create payout accounts');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('start revenue-share');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('create payouts');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('write entitlements');
    expect(copy.creatorPayoutSupportReadinessScriptCopy).toContain('auto-message creators');
    expect(copy.creatorHostingObjectionReplyCopy).toContain('Creator Hosting Objection Reply Kit');
    expect(copy.creatorHostingObjectionReplyCopy).toContain('Do not claim paid creator hosting is live');
    expect(copy.creatorHostingObjectionReplyCopy).toContain('store inbound DMs');
    expect(copy.creatorHostingDecisionReplyCopy).toContain('Creator Hosting Decision Reply Kit');
    expect(copy.creatorHostingDecisionReplyCopy).toContain('Open hosted-review applications: 1');
    expect(copy.creatorHostingDecisionReplyCopy).toContain('APPROVED FOR MANUAL FOLLOW-UP');
    expect(copy.creatorHostingDecisionReplyCopy).toContain('Do not create contracts');
    expect(copy.creatorHostingDecisionReplyCopy).toContain('export private member activity');
  });
});
