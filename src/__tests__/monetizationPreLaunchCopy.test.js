import { buildMonetizationPreLaunchCopyKits } from '../profile/monetizationPreLaunchCopyKits';
import { buildRevenueReadinessCopy } from '../profile/revenueReadinessCopy';

const campaignPerformanceSummary = {
  memberReach: 18,
};

const recommendedRevenuePath = {
  label: 'Tribe Pro',
  signal: 7,
};

describe('monetization prelaunch copy contracts', () => {
  it('builds prelaunch value kits without sales, ticket, payout, or entitlement side effects', () => {
    const copy = buildRevenueReadinessCopy({
      campaignPerformanceSummary,
      daysActive: 12,
      monetizationSignalTotal: 9,
      recommendedRevenuePath,
      referralJoins: 4,
      storeCatalog: [
        { id: 'com.risewiththetribe.pro.monthly', kind: 'subscription', cadence: 'monthly' },
        { id: 'com.risewiththetribe.pack.21_day_reset', kind: 'pack', packId: '21_day_reset' },
      ],
    });
    const kits = buildMonetizationPreLaunchCopyKits({
      ...copy,
      campaignPerformanceSummary,
      daysActive: 12,
      monetizationSignalTotal: 9,
      recommendedRevenuePath,
      referralJoins: 4,
      storePackCount: 1,
      storeSubscriptionCount: 1,
    });

    expect(kits.map(kit => kit.title)).toEqual([
      'PRICING TEST KIT',
      'FOUNDER MEMBER OFFER KIT',
      'COMMUNITY AMBASSADOR KIT',
      'COMMUNITY EVENT INTEREST KIT',
      'CUSTOMER VALUE CHECKLIST',
    ]);
    expect(copy.founderMemberOfferCopy).toContain('This is not a sale');
    expect(copy.founderMemberOfferCopy).toContain('Do not collect payment');
    expect(copy.communityAmbassadorCopy).toContain('Do not create commissions');
    expect(copy.communityAmbassadorCopy).toContain('affiliate links');
    expect(copy.communityEventInterestCopy).toContain('Do not sell tickets');
    expect(copy.communityEventInterestCopy).toContain('book venues');
    expect(copy.communityEventReviewDecisionReplyCopy).toContain('Community Event Review Decision Reply Kit');
    expect(copy.communityEventReviewDecisionReplyCopy).toContain('APPROVED FOR EVENT LEARNING');
    expect(copy.communityEventReviewDecisionReplyCopy).toContain('Do not sell tickets');
    expect(copy.customerValueChecklistCopy).toContain('Do not charge users');
    expect(copy.customerValueChecklistCopy).toContain('write entitlements');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('Customer Value Review Decision Reply Kit');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('APPROVED FOR VALUE LEARNING');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('Do not charge users');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('write entitlements');
    expect(kits[4]).toMatchObject({
      buttonLabel: 'COPY VALUE CHECKLIST',
      status: 'PRE-LAUNCH',
    });
  });
});
