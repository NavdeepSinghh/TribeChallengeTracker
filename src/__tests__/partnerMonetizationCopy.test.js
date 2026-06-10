import { buildPartnerMonetizationCopy } from '../profile/partnerMonetizationCopy';

describe('partner monetization copy contracts', () => {
  it('builds partner campaign, contract, perk fulfillment, and decision copy without tracking or fulfillment side effects', () => {
    const copy = buildPartnerMonetizationCopy({
      campaignPerformanceSummary: {
        memberReach: 21,
      },
      partnerCampaignApplicationReviewQueue: [{ id: 'partner-app-1' }],
      partnerDemandTotal: 8,
      partnerPerkHandoffAuditReviewQueue: [{ id: 'audit-1' }],
      approvedPartnerPerkHandoffAuditReviews: [{ id: 'audit-approved-1' }],
      partnerPerkClaimReviewQueue: [{ id: 'claim-1' }, { id: 'claim-2' }],
      referralJoins: 5,
      topPartnerPerk: {
        demand: 4,
        label: 'Gym drop-in',
        title: 'Local gym drop-in',
      },
    });

    expect(copy.partnerActivationCopy).toContain('Partner Campaign Activation Kit');
    expect(copy.partnerActivationCopy).toContain('Do not add partner links');
    expect(copy.partnerActivationCopy).toContain('tracking pixels');
    expect(copy.partnerTermsReadinessCopy).toContain('Partner Terms Readiness Kit');
    expect(copy.partnerTermsReadinessCopy).toContain('use aggregate first-party demand counts only');
    expect(copy.partnerTermsReadinessCopy).toContain('Do not add partner links');
    expect(copy.partnerContractReadinessCopy).toContain('Partner Contract Readiness Kit');
    expect(copy.partnerContractReadinessCopy).toContain('No third-party data sharing');
    expect(copy.partnerContractReadinessCopy).toContain('fulfillment promises');
    expect(copy.partnerPerkFulfillmentReadinessCopy).toContain('Partner Perk Fulfillment Readiness Kit');
    expect(copy.partnerPerkFulfillmentReadinessCopy).toContain('Open perk claims: 2');
    expect(copy.partnerPerkFulfillmentReadinessCopy).toContain('Do not create coupons');
    expect(copy.partnerPerkFulfillmentHandoffCopy).toContain('Partner Perk Fulfillment Handoff Kit');
    expect(copy.partnerPerkFulfillmentHandoffCopy).toContain('no-promise handoff note');
    expect(copy.partnerPerkHandoffAuditCopy).toContain('Partner Perk Handoff Audit Kit');
    expect(copy.partnerPerkHandoffAuditCopy).toContain('Record only aggregate support outcomes');
    expect(copy.partnerPerkHandoffAuditDecisionReplyCopy).toContain('Partner Perk Handoff Audit Decision Reply Kit');
    expect(copy.partnerPerkHandoffAuditDecisionReplyCopy).toContain('Open partner perk handoff audit records: 1');
    expect(copy.partnerPerkHandoffAuditDecisionReplyCopy).toContain('APPROVED FOR MANUAL HANDOFF');
    expect(copy.partnerPerkHandoffAuditDecisionReplyCopy).toContain('Do not create coupons');
    expect(copy.partnerPerkDecisionReplyCopy).toContain('Partner Perk Admin Decision Reply Kit');
    expect(copy.partnerPerkDecisionReplyCopy).toContain('WAITING ON PARTNER TERMS');
    expect(copy.partnerCampaignObjectionReplyCopy).toContain('Partner Campaign Objection Reply Kit');
    expect(copy.partnerCampaignObjectionReplyCopy).toContain('Do not claim partner campaigns are live');
    expect(copy.partnerCampaignObjectionReplyCopy).toContain('share third-party data');
    expect(copy.partnerCampaignDecisionReplyCopy).toContain('Partner Campaign Decision Reply Kit');
    expect(copy.partnerCampaignDecisionReplyCopy).toContain('Open partner-pilot applications: 1');
    expect(copy.partnerCampaignDecisionReplyCopy).toContain('Do not create partner links');
    expect(copy.partnerCampaignDecisionReplyCopy).toContain('pressure partners or members');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('Partner Campaign Retrospective Kit');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('Open partner-pilot applications: 1');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('Open perk claims: 2');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('aggregate-only post-pilot readback');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('Do not create partner links');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('third-party data exports');
    expect(copy.partnerCampaignRetrospectiveCopy).toContain('pressure partners or members');
  });
});
