import { readFileSync } from 'fs';
import { join } from 'path';

import { buildMonetizationSummaryCopy } from '../profile/monetizationSummaryCopy';
import { buildProfileStoreDerivedResult } from '../profile/profileStoreDerivedResult';
import { buildTribeProValueDemandProps } from '../profile/tribeProValueDemandProps';

describe('web Pro trial support escalation copy', () => {
  it('builds a copy-only support escalation kit without paid-access side effects', () => {
    const copy = buildMonetizationSummaryCopy({
      topProTrialReason: { label: 'Reports', demand: 4 },
      proTrialDemandTotal: 7,
      weeklyCampaignPrompt: { name: 'Reset Week', hashtag: '#ResetWeek' },
      creatorRevenueShareTotal: 0,
      creatorRevenueShareSummary: {},
      partnerDemandTotal: 0,
      monetizationSignalTotal: 7,
      storeCatalog: [{ id: 'tribe.pro.monthly' }, { id: 'tribe.pro.annual' }],
      storeSubscriptionCount: 2,
      storePackCount: 0,
    });

    expect(copy.proTrialSupportEscalationCopy).toContain('Pro Trial Support Escalation Kit');
    expect(copy.proTrialSupportEscalationCopy).toContain('First-party Pro trial signals: 7');
    expect(copy.proTrialSupportEscalationCopy).toContain('Top Pro trial interest: Reports');
    expect(copy.proTrialSupportEscalationCopy).toContain('Support escalation checklist');
    expect(copy.proTrialSupportEscalationCopy).toContain('Store setup owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('Value proof owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('Support owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('QA owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('not a trial start');
    expect(copy.proTrialSupportEscalationCopy).toContain('not a purchase');
    expect(copy.proTrialSupportEscalationCopy).toContain('not a Pro grant');
    expect(copy.proTrialSupportEscalationCopy).toContain('not entitlement approval');
    expect(copy.proTrialSupportEscalationCopy).toContain('not refund approval');
    expect(copy.proTrialSupportEscalationCopy).toContain('not paid-access launch approval');
    expect(copy.proTrialSupportEscalationCopy).toContain('Do not start trials');
    expect(copy.proTrialSupportEscalationCopy).toContain('create purchases');
    expect(copy.proTrialSupportEscalationCopy).toContain('grant Pro');
    expect(copy.proTrialSupportEscalationCopy).toContain('write entitlements');
    expect(copy.proTrialSupportEscalationCopy).toContain('unlock paid access');
    expect(copy.proTrialSupportEscalationCopy).toContain('collect payment details');
    expect(copy.proTrialSupportEscalationCopy).toContain('offer discounts');
    expect(copy.proTrialSupportEscalationCopy).toContain('process refunds');
    expect(copy.proTrialSupportEscalationCopy).toContain('claim store-backed trials are live');
    expect(copy.proTrialSupportEscalationCopy).toContain('auto-message users');
    expect(copy.proTrialSupportEscalationCopy).toContain('scrape/store DMs');
    expect(copy.proTrialSupportEscalationCopy).toContain('add tracking pixels');
    expect(copy.proTrialLaunchQaCopy).toContain('Pro Trial Launch QA Kit');
    expect(copy.proTrialLaunchQaCopy).toContain('Products in code: tribe.pro.monthly, tribe.pro.annual');
    expect(copy.proTrialLaunchQaCopy).toContain('Launch QA checklist');
    expect(copy.proTrialLaunchQaCopy).toContain('Store QA');
    expect(copy.proTrialLaunchQaCopy).toContain('Entitlement QA');
    expect(copy.proTrialLaunchQaCopy).toContain('Support QA');
    expect(copy.proTrialLaunchQaCopy).toContain('Copy QA');
    expect(copy.proTrialLaunchQaCopy).toContain('not a trial start');
    expect(copy.proTrialLaunchQaCopy).toContain('not a purchase');
    expect(copy.proTrialLaunchQaCopy).toContain('not a Pro grant');
    expect(copy.proTrialLaunchQaCopy).toContain('not paid-access launch approval');
    expect(copy.proTrialLaunchQaCopy).toContain('not store-review approval');
    expect(copy.proTrialLaunchQaCopy).toContain('Do not start trials');
    expect(copy.proTrialLaunchQaCopy).toContain('create purchases');
    expect(copy.proTrialLaunchQaCopy).toContain('grant Pro');
    expect(copy.proTrialLaunchQaCopy).toContain('write entitlements');
    expect(copy.proTrialLaunchQaCopy).toContain('submit store review');
    expect(copy.proTrialLaunchQaCopy).toContain('auto-message users');
    expect(copy.proTrialLaunchQaCopy).toContain('scrape/store DMs');
    expect(copy.proTrialLaunchQaCopy).toContain('add tracking pixels');
  });

  it('renders the web admin support card as copy-only', () => {
    const source = readFileSync(
      join(__dirname, '../profile/ProTrialAdminSummary.jsx'),
      'utf8',
    );

    expect(source).toContain('PRO TRIAL SUPPORT ESCALATION KIT');
    expect(source).toContain('COPY PRO TRIAL SUPPORT KIT');
    expect(source).toContain('proTrialSupportEscalationCopy');
    expect(source).toContain('Route store setup, value proof, support coverage');
    expect(source).toContain('without starting trials, purchases, Pro grants, or paid-access changes');
    expect(source).toContain('PRO TRIAL LAUNCH QA KIT');
    expect(source).toContain('COPY PRO TRIAL LAUNCH QA');
    expect(source).toContain('proTrialLaunchQaCopy');
    expect(source).toContain('Check store setup, entitlement writes, support routing, and launch copy');
  });

  it('keeps support and launch QA copy routed through the Profile value-demand props', () => {
    const storeDerived = buildProfileStoreDerivedResult({
      storeCatalogData: {
        activeChallengePackCount: 0,
        challengePackProducts: [],
        challengePackTitle: () => 'Pack',
        isPackUnlocked: () => false,
        proActive: false,
        proSource: 'none',
        storeCatalog: [{ id: 'tribe.pro.monthly' }],
        storePackCount: 0,
        storeSubscriptionCount: 1,
        storeTestEvidenceCases: [],
      },
      storeMonetizationData: {
        creatorRevenueSharePitchCopy: 'creator pitch',
        monetizationLaunchCopy: 'launch board',
        proTrialObjectionReplyCopy: 'objection copy',
        proTrialPitchCopy: 'pitch copy',
        proTrialLaunchQaCopy: 'launch qa copy',
        proTrialSupportEscalationCopy: 'support escalation copy',
        recommendedRevenuePath: { label: 'Pro' },
        revenuePathways: [],
        storeReadinessCopy: 'store readiness',
      },
      storeReadinessData: {
        storeCredentialSetupCopy: 'credential setup',
        supportRefundReadinessCopy: 'refund readiness',
        subscriptionManagementGuidanceCopy: 'subscription guidance',
        paidLaunchDecisionCopy: 'paid launch',
        paidLaunchDecisionReplyCopy: 'paid launch reply',
        paidLaunchDecisionStatus: 'hold',
        storeTestEvidenceDecisionReplyCopy: 'evidence reply',
      },
      storeReviewSupportData: {},
    });

    const props = buildTribeProValueDemandProps({
      ...storeDerived,
      communityHighlightRoundupItems: [],
      copyText: jest.fn(),
      approvedProTrialReviews: [],
      handleProTrialReasonToggle: jest.fn(),
      handleProTrialReviewDecision: jest.fn(),
      handleProTrialReviewSubmit: jest.fn(),
      isAdmin: true,
      isSavingProTrialInterest: false,
      isSubmittingProTrialReview: false,
      monthlyRecap: {},
      proTrialDemandTotal: 0,
      proTrialMessage: '',
      proTrialReviewMessage: '',
      proTrialReviewNotes: {},
      proTrialReviewQueue: [],
      proTrialSummary: {},
      proValueNextAction: 'Save interest',
      selectedProTrialReasonIds: [],
      setProTrialReviewNotes: jest.fn(),
      storyPostingChecklistCopy: 'story checklist',
      reviewingProTrialReviewId: null,
      topProTrialReason: null,
      totalChallengePoints: 0,
      valueProofStoryCopy: 'value proof',
      weeklyReport: {},
    });

    expect(storeDerived.proTrialLaunchQaCopy).toBe('launch qa copy');
    expect(storeDerived.proTrialSupportEscalationCopy).toBe('support escalation copy');
    expect(props.proTrialLaunchQaCopy).toBe('launch qa copy');
    expect(props.proTrialSupportEscalationCopy).toBe('support escalation copy');
  });
});
