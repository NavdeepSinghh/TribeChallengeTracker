import { buildPartnerPerksProps } from '../profile/buildPartnerPerksProps';

describe('partner perks section prop adapter', () => {
  it('groups member, admin, and partner-campaign application props without dropping handlers', () => {
    const model = {
      campaignPerformanceSummary: { memberReach: 12 },
      claimingPartnerPerkId: 'perk-1',
      copyText: jest.fn(),
      handlePartnerCampaignApplication: jest.fn(),
      handlePartnerCampaignApplicationReview: jest.fn(),
      handlePartnerPerkClaim: jest.fn(),
      handlePartnerPerkClaimReview: jest.fn(),
      handlePartnerPerkToggle: jest.fn(),
      isAdmin: true,
      isSavingPartnerPerks: false,
      isSubmittingPartnerCampaignApplication: true,
      partnerActivationCopy: 'activation',
      partnerCampaignApplicationMessage: 'submitted',
      partnerCampaignApplicationReviewNotes: { app1: 'note' },
      partnerCampaignApplicationReviewQueue: [{ id: 'app1' }],
      partnerCampaignApplicationSignalTotal: 3,
      partnerCampaignDecisionReplyCopy: 'campaign decision',
      partnerCampaignObjectionReplyCopy: 'objection',
      partnerContractReadinessCopy: 'contract',
      partnerDemandTotal: 5,
      partnerPerkClaimMessage: 'claim message',
      partnerPerkClaimReviewQueue: [{ id: 'claim1' }],
      partnerPerkClaims: [{ id: 'claim1' }],
      partnerPerkDecisionReplyCopy: 'perk decision',
      partnerPerkFulfillmentHandoffCopy: 'handoff',
      partnerPerkFulfillmentReadinessCopy: 'readiness',
      partnerPerkHandoffAuditCopy: 'audit',
      partnerPerkMessage: 'saved',
      partnerPerkReviewNotes: { claim1: 'note' },
      partnerPerkStats: { gym_drop_in: 2 },
      partnerPerkSummary: { gym_drop_in: 2 },
      partnerPitchCopy: 'pitch',
      partnerTermsReadinessCopy: 'terms',
      referralJoins: 4,
      reviewingPartnerCampaignApplicationId: 'app1',
      reviewingPartnerPerkClaimId: 'claim1',
      selectedPartnerPerkIds: ['gym_drop_in'],
      setPartnerCampaignApplicationReviewNotes: jest.fn(),
      setPartnerPerkReviewNotes: jest.fn(),
      topPartnerPerk: { id: 'gym_drop_in' },
    };

    const props = buildPartnerPerksProps(model);

    expect(props.memberProps).toEqual({
      selectedPartnerPerkIds: ['gym_drop_in'],
      partnerPerkStats: { gym_drop_in: 2 },
      isSavingPartnerPerks: false,
      onPartnerPerkToggle: model.handlePartnerPerkToggle,
      claimingPartnerPerkId: 'perk-1',
      onPartnerPerkClaim: model.handlePartnerPerkClaim,
      partnerPerkMessage: 'saved',
      partnerPerkClaimMessage: 'claim message',
      partnerPerkClaims: [{ id: 'claim1' }],
    });
    expect(props.adminProps).toMatchObject({
      partnerPerkSummary: { gym_drop_in: 2 },
      topPartnerPerk: { id: 'gym_drop_in' },
      partnerPitchCopy: 'pitch',
      partnerDemandTotal: 5,
      campaignPerformanceSummary: { memberReach: 12 },
      referralJoins: 4,
      partnerCampaignDecisionReplyCopy: 'campaign decision',
      copyText: model.copyText,
    });
    expect(props.adminProps.onPartnerPerkClaimReview).toBe(model.handlePartnerPerkClaimReview);
    expect(props.adminProps.onPartnerCampaignApplicationReview).toBe(model.handlePartnerCampaignApplicationReview);
    expect(props.applicationProps).toEqual({
      partnerCampaignApplicationSignalTotal: 3,
      onPartnerCampaignApplication: model.handlePartnerCampaignApplication,
      isSubmittingPartnerCampaignApplication: true,
      partnerCampaignApplicationMessage: 'submitted',
    });
    expect(props.onPartnerPerkToggle).toBe(props.memberProps.onPartnerPerkToggle);
    expect(props.partnerCampaignApplicationSignalTotal).toBe(props.applicationProps.partnerCampaignApplicationSignalTotal);
  });
});
