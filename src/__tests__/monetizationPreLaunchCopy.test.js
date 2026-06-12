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
    expect(copy.communityEventSupportEscalationCopy).toContain('Community Event Support Escalation Kit');
    expect(copy.communityEventSupportEscalationCopy).toContain('Support escalation checklist');
    expect(copy.communityEventSupportEscalationCopy).toContain('not ticket sales');
    expect(copy.communityEventSupportEscalationCopy).toContain('not a venue booking');
    expect(copy.communityEventSupportEscalationCopy).toContain('not merch fulfillment');
    expect(copy.communityEventSupportEscalationCopy).toContain('not entitlement approval');
    expect(copy.communityEventSupportEscalationCopy).toContain('first-party and support-safe');
    expect(copy.communityEventSupportEscalationCopy).toContain('Do not sell tickets');
    expect(copy.communityEventSupportEscalationCopy).toContain('collect payments');
    expect(copy.communityEventSupportEscalationCopy).toContain('book venues');
    expect(copy.communityEventSupportEscalationCopy).toContain('create partner links');
    expect(copy.communityEventSupportEscalationCopy).toContain('create payouts');
    expect(copy.communityEventSupportEscalationCopy).toContain('write entitlements');
    expect(copy.communityEventSupportEscalationCopy).toContain('export per-user event interest lists');
    expect(copy.communityEventSupportEscalationCopy).toContain('add tracking pixels');
    expect(copy.communityEventSupportEscalationCopy).toContain('auto-message users');
    expect(copy.communityEventSupportEscalationCopy).toContain('promise event fulfillment');
    expect(copy.customerValueChecklistCopy).toContain('Do not charge users');
    expect(copy.customerValueChecklistCopy).toContain('write entitlements');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('Customer Value Review Decision Reply Kit');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('APPROVED FOR VALUE LEARNING');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('Do not charge users');
    expect(copy.customerValueReviewDecisionReplyCopy).toContain('write entitlements');
    expect(copy.customerValueSupportEscalationCopy).toContain('Customer Value Support Escalation Kit');
    expect(copy.customerValueSupportEscalationCopy).toContain('Support escalation checklist');
    expect(copy.customerValueSupportEscalationCopy).toContain('not a charge');
    expect(copy.customerValueSupportEscalationCopy).toContain('not paid-access unlock');
    expect(copy.customerValueSupportEscalationCopy).toContain('not entitlement approval');
    expect(copy.customerValueSupportEscalationCopy).toContain('first-party and support-safe');
    expect(copy.customerValueSupportEscalationCopy).toContain('Do not charge users');
    expect(copy.customerValueSupportEscalationCopy).toContain('unlock paid access');
    expect(copy.customerValueSupportEscalationCopy).toContain('create discounts');
    expect(copy.customerValueSupportEscalationCopy).toContain('collect payment details');
    expect(copy.customerValueSupportEscalationCopy).toContain('create purchases');
    expect(copy.customerValueSupportEscalationCopy).toContain('write entitlements');
    expect(copy.customerValueSupportEscalationCopy).toContain('process refunds');
    expect(copy.customerValueSupportEscalationCopy).toContain('promote paid features as live');
    expect(copy.customerValueSupportEscalationCopy).toContain('export per-user paid-interest lists');
    expect(copy.customerValueSupportEscalationCopy).toContain('add tracking pixels');
    expect(copy.customerValueSupportEscalationCopy).toContain('auto-message users');
    expect(kits[4]).toMatchObject({
      buttonLabel: 'COPY VALUE CHECKLIST',
      status: 'PRE-LAUNCH',
    });
  });
});
