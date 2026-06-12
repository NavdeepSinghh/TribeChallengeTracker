import { buildPartnerMonetizationCopy } from '../profile/partnerMonetizationCopy';

describe('partner monetization copy contracts', () => {
  it('builds partner campaign, contract, perk fulfillment, and decision copy without tracking or fulfillment side effects', () => {
    const copy = buildPartnerMonetizationCopy({
      campaignPerformanceSummary: {
        memberReach: 21,
      },
      partnerCampaignApplicationReviewQueue: [{ id: 'partner-app-1' }],
      partnerCampaignRetrospectiveReviewQueue: [{ id: 'retro-1' }],
      approvedPartnerCampaignRetrospectiveReviews: [{ id: 'retro-approved-1' }],
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
    expect(copy.partnerLegalPacketPrepCopy).toContain('Partner Legal Packet Prep Kit');
    expect(copy.partnerLegalPacketPrepCopy).toContain('Legal packet checklist');
    expect(copy.partnerLegalPacketPrepCopy).toContain('privacy review');
    expect(copy.partnerLegalPacketPrepCopy).toContain('marketplace policy');
    expect(copy.partnerLegalPacketPrepCopy).toContain('entitlement QA');
    expect(copy.partnerLegalPacketPrepCopy).toContain('aggregate-first');
    expect(copy.partnerLegalPacketPrepCopy).toContain('This is a manual partner legal packet prep kit only');
    expect(copy.partnerLegalPacketPrepCopy).toContain('Do not create partner links');
    expect(copy.partnerLegalPacketPrepCopy).toContain('tracking pixels');
    expect(copy.partnerLegalPacketPrepCopy).toContain('create coupons');
    expect(copy.partnerLegalPacketPrepCopy).toContain('create payouts');
    expect(copy.partnerLegalPacketPrepCopy).toContain('create affiliate rewards');
    expect(copy.partnerLegalPacketPrepCopy).toContain('collect payment details');
    expect(copy.partnerLegalPacketPrepCopy).toContain('create purchases');
    expect(copy.partnerLegalPacketPrepCopy).toContain('write entitlements');
    expect(copy.partnerLegalPacketPrepCopy).toContain('share third-party data');
    expect(copy.partnerLegalPacketPrepCopy).toContain('export per-user interest lists');
    expect(copy.partnerLegalPacketPrepCopy).toContain('promise fulfillment');
    expect(copy.partnerLegalPacketPrepCopy).toContain('imply partner campaigns are live');
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
    expect(copy.partnerPerkSupportEscalationCopy).toContain('Partner Perk Support Escalation Kit');
    expect(copy.partnerPerkSupportEscalationCopy).toContain('Partner perk support escalation checklist');
    expect(copy.partnerPerkSupportEscalationCopy).toContain('partner perk support escalation is not live fulfillment');
    expect(copy.partnerPerkSupportEscalationCopy).toContain('Do not provide live perk fulfillment');
    expect(copy.partnerPerkSupportEscalationCopy).toContain('create coupons');
    expect(copy.partnerPerkSupportEscalationCopy).toContain('write entitlements');
    expect(copy.partnerPerkDecisionReplyCopy).toContain('Partner Perk Admin Decision Reply Kit');
    expect(copy.partnerPerkDecisionReplyCopy).toContain('WAITING ON PARTNER TERMS');
    expect(copy.partnerCampaignObjectionReplyCopy).toContain('Partner Campaign Objection Reply Kit');
    expect(copy.partnerCampaignObjectionReplyCopy).toContain('Do not claim partner campaigns are live');
    expect(copy.partnerCampaignObjectionReplyCopy).toContain('share third-party data');
    expect(copy.partnerCampaignSupportEscalationCopy).toContain('Partner Campaign Support Escalation Kit');
    expect(copy.partnerCampaignSupportEscalationCopy).toContain('Partner campaign support escalation checklist');
    expect(copy.partnerCampaignSupportEscalationCopy).toContain('partner campaign support escalation is not a live sponsor campaign');
    expect(copy.partnerCampaignSupportEscalationCopy).toContain('Do not claim partner campaigns are live');
    expect(copy.partnerCampaignSupportEscalationCopy).toContain('create partner links');
    expect(copy.partnerCampaignSupportEscalationCopy).toContain('write entitlements');
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
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('Partner Campaign Retrospective Decision Reply Kit');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('Open partner campaign retrospective reviews: 1');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('Approved manual retrospective reviews: 1');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('APPROVED FOR MANUAL REPEAT REVIEW');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('WAITING ON RETROSPECTIVE EVIDENCE');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('NOT READY FOR PARTNER HANDOFF');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('DECLINED FOR PARTNER HANDOFF');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('Do not create partner links');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('tracking pixels');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('entitlements');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('process refunds');
    expect(copy.partnerCampaignRetrospectiveDecisionReplyCopy).toContain('pressure partners or members');
  });
});
