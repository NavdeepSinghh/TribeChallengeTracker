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
    expect(copy.creatorPayoutReadinessCopy).toContain('Creator Payout Readiness Kit');
    expect(copy.creatorPayoutReadinessCopy).toContain('Do not create payouts');
    expect(copy.creatorPayoutReadinessCopy).toContain('collect tax details');
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
