const {
  fs,
  path,
  repoRoot,
  iosProfile,
  iosChallengeService,
  androidApp,
  androidModels,
  androidRepository,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform creator hosting readiness parity source checks', () => {
  it('keeps Creator Hosting Offer Kit wired on all platforms without paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR HOSTING OFFER KIT');
      expect(source).toContain('COPY HOSTING OFFER KIT');
      expect(source).toContain('Future paid-hosting planning brief');
      expect(source).toContain('creatorHostingOfferCopy');
      expect(source).toContain('Revenue-ready signals');
      expect(source).toContain('paid-hosting policy');
      expect(source).toContain('payout operations');
      expect(source).toContain('Firestore entitlement QA');
      expect(source).toContain('does not create a contract');
      expect(source).toContain('paid-access claim');
    });
  });

  it('keeps Creator Terms Readiness Kit wired on all platforms without payout or contract side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR TERMS READINESS KIT');
      expect(source).toContain('COPY CREATOR TERMS KIT');
      expect(source).toContain('creatorTermsReadinessCopy');
      expect(source).toContain('Responsibilities before paid hosting');
      expect(source).toContain('Creator responsibilities');
      expect(source).toContain('Content moderation');
      expect(source).toContain('Payout readiness');
      expect(source).toContain('Marketplace alignment');
      expect(source).toContain('Support handoff');
      expect(source).toContain('creator terms readiness brief only');
      expect(source).toContain('Do not create contracts');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('process payments');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Readiness Kit wired on all platforms without payout side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT READINESS KIT');
      expect(source).toContain('COPY CREATOR PAYOUT KIT');
      expect(source).toContain('creatorPayoutReadinessCopy');
      expect(source).toContain('Payout operations before revenue-share');
      expect(source).toContain('Payout readiness checklist');
      expect(source).toContain('payout provider');
      expect(source).toContain('tax collection');
      expect(source).toContain('identity verification');
      expect(source).toContain('refund responsibility');
      expect(source).toContain('creator payout readiness brief only');
      expect(source).toContain('Do not create payouts');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('process payments');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Provider Setup Kit wired on all platforms without provider or tax collection side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT PROVIDER SETUP KIT');
      expect(source).toContain('COPY PAYOUT SETUP KIT');
      expect(source).toContain('creatorPayoutProviderSetupCopy');
      expect(source).toContain('Provider setup before payout onboarding');
      expect(source).toContain('Provider setup checklist');
      expect(source).toContain('payout providers');
      expect(source).toContain('country coverage');
      expect(source).toContain('tax form support');
      expect(source).toContain('finance reconciliation');
      expect(source).toContain('marketplace boundaries');
      expect(source).toContain('payout onboarding is not live');
      expect(source).toContain('Firestore profile records');
      expect(source).toContain('creator payout provider setup kit only');
      expect(source).toContain('Do not create payout accounts');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Operations Dry-Run Kit wired on all platforms without live payout side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT OPERATIONS DRY-RUN KIT');
      expect(source).toContain('COPY PAYOUT DRY-RUN KIT');
      expect(source).toContain('creatorPayoutOperationsDryRunCopy');
      expect(source).toContain('Zero-money payout rehearsal before launch');
      expect(source).toContain('Operations dry-run checklist');
      expect(source).toContain('zero-money payout rehearsal');
      expect(source).toContain('mock creator eligibility');
      expect(source).toContain('mock payout event');
      expect(source).toContain('mock refund adjustment');
      expect(source).toContain('mock finance reconciliation notes');
      expect(source).toContain('real payout onboarding');
      expect(source).toContain('store-test evidence');
      expect(source).toContain('Firestore profile records');
      expect(source).toContain('creator payout operations dry-run kit only');
      expect(source).toContain('Do not create payout accounts');
      expect(source).toContain('access payout providers');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('move money');
      expect(source).toContain('process payments');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Reconciliation Kit wired on all platforms without payout or private-log side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT RECONCILIATION KIT');
      expect(source).toContain('COPY PAYOUT RECONCILIATION KIT');
      expect(source).toContain('creatorPayoutReconciliationCopy');
      expect(source).toContain('Mock payout evidence matching before launch');
      expect(source).toContain('Payout reconciliation checklist');
      expect(source).toContain('mock payout events');
      expect(source).toContain('store-test evidence');
      expect(source).toContain('refund adjustments');
      expect(source).toContain('entitlement QA');
      expect(source).toContain('finance reconciliation notes');
      expect(source).toContain('private member logs');
      expect(source).toContain('payout reconciliation is not live');
      expect(source).toContain('hold-plan review');
      expect(source).toContain('creator payout reconciliation kit only');
      expect(source).toContain('Do not create payout accounts');
      expect(source).toContain('access payout providers');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('move money');
      expect(source).toContain('process payments');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
      expect(source).toContain('expose private member logs');
      expect(source).toContain('scrape or store messages');
    });
  });

  it('keeps Creator Tax Workflow Readiness Kit wired on all platforms without tax collection side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR TAX WORKFLOW READINESS KIT');
      expect(source).toContain('COPY TAX WORKFLOW KIT');
      expect(source).toContain('creatorTaxWorkflowReadinessCopy');
      expect(source).toContain('Tax workflow review before payout onboarding');
      expect(source).toContain('Tax workflow readiness checklist');
      expect(source).toContain('tax workflow owner');
      expect(source).toContain('payout-provider tax form path');
      expect(source).toContain('country coverage');
      expect(source).toContain('withholding review');
      expect(source).toContain('finance export process');
      expect(source).toContain('tax onboarding is not live');
      expect(source).toContain('Firestore profile records');
      expect(source).toContain('tax-advisor workflows');
      expect(source).toContain('creator tax workflow readiness kit only');
      expect(source).toContain('Do not collect tax details');
      expect(source).toContain('collect tax forms');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('verify identities');
      expect(source).toContain('create payout accounts');
      expect(source).toContain('access payout providers');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('give tax advice');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Exception Response Kit wired on all platforms without dispute or payout side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT EXCEPTION RESPONSE KIT');
      expect(source).toContain('COPY PAYOUT EXCEPTION KIT');
      expect(source).toContain('creatorPayoutExceptionResponseCopy');
      expect(source).toContain('Manual exception replies before payout processing');
      expect(source).toContain('Payout exception response checklist');
      expect(source).toContain('mismatched store-test evidence');
      expect(source).toContain('refund dispute');
      expect(source).toContain('entitlement gap');
      expect(source).toContain('tax workflow gap');
      expect(source).toContain('provider setup gap');
      expect(source).toContain('support escalation');
      expect(source).toContain('creator eligibility question');
      expect(source).toContain('payout exception review is not live payout processing');
      expect(source).toContain('creator payout exception response kit only');
      expect(source).toContain('Do not resolve payout disputes');
      expect(source).toContain('process refunds');
      expect(source).toContain('collect tax details');
      expect(source).toContain('collect tax forms');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('verify identities');
      expect(source).toContain('create payout accounts');
      expect(source).toContain('access payout providers');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('move money');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('give tax advice');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
      expect(source).toContain('expose private member logs');
      expect(source).toContain('scrape or store messages');
    });
  });

  it('keeps Creator Payout Support Escalation Kit wired on all platforms without live support or payout side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT SUPPORT ESCALATION KIT');
      expect(source).toContain('COPY PAYOUT SUPPORT KIT');
      expect(source).toContain('creatorPayoutSupportEscalationCopy');
      expect(source).toContain('Support owner routing before payout support');
      expect(source).toContain('Payout support escalation checklist');
      expect(source).toContain('creator support');
      expect(source).toContain('member support');
      expect(source).toContain('finance');
      expect(source).toContain('marketplace support');
      expect(source).toContain('legal/tax');
      expect(source).toContain('payout provider setup');
      expect(source).toContain('entitlement QA');
      expect(source).toContain('payout support escalation is not live payout support');
      expect(source).toContain('creator payout support escalation kit only');
      expect(source).toContain('Do not provide live payout support');
      expect(source).toContain('resolve payout disputes');
      expect(source).toContain('process refunds');
      expect(source).toContain('collect tax details');
      expect(source).toContain('collect tax forms');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('verify identities');
      expect(source).toContain('create payout accounts');
      expect(source).toContain('access payout providers');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('move money');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('give tax advice');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
      expect(source).toContain('expose private member logs');
      expect(source).toContain('scrape or store messages');
    });
  });

  it('keeps Creator Identity Verification Prep Kit wired on all platforms without client-side verification side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR IDENTITY VERIFICATION PREP KIT');
      expect(source).toContain('COPY IDENTITY PREP KIT');
      expect(source).toContain('creatorIdentityVerificationPrepCopy');
      expect(source).toContain('Identity and brand checks before paid hosting');
      expect(source).toContain('Identity verification prep checklist');
      expect(source).toContain('content ownership');
      expect(source).toContain('brand permission');
      expect(source).toContain('support owner');
      expect(source).toContain('moderation owner');
      expect(source).toContain('creator identity verification prep kit only');
      expect(source).toContain('Do not verify identities from client code');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps Creator Moderation Readiness Kit wired on all platforms without moderation side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR MODERATION READINESS KIT');
      expect(source).toContain('COPY MODERATION KIT');
      expect(source).toContain('creatorModerationReadinessCopy');
      expect(source).toContain('Safety and takedown checks before paid hosting');
      expect(source).toContain('Moderation readiness checklist');
      expect(source).toContain('creator conduct rules');
      expect(source).toContain('member safety rules');
      expect(source).toContain('takedown');
      expect(source).toContain('support handoff');
      expect(source).toContain('claim-safety');
      expect(source).toContain('creator moderation readiness kit only');
      expect(source).toContain('Do not auto-moderate');
      expect(source).toContain('auto-message');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('export private member activity');
      expect(source).toContain('expose private member data');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps Creator Paid Hosting Launch Gate Kit wired on all platforms without launch side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAID HOSTING LAUNCH GATE KIT');
      expect(source).toContain('COPY CREATOR LAUNCH GATE');
      expect(source).toContain('creatorPaidHostingLaunchGateCopy');
      expect(source).toContain('Go/no-go checks before paid hosting');
      expect(source).toContain('Launch gate checks');
      expect(source).toContain('store-test evidence');
      expect(source).toContain('Gate result: keep paid creator hosting in review');
      expect(source).toContain('creator paid hosting launch gate kit only');
      expect(source).toContain('Do not approve paid hosting');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect signatures');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('grant paid access');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('submit store review');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps reviewable Creator Paid Hosting Launch Gate Evidence wired on all platforms without paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAID HOSTING LAUNCH GATE EVIDENCE');
      expect(source).toContain('SAVE LAUNCH GATE EVIDENCE');
      expect(source).toContain('creatorPaidHostingLaunchGateReviews');
      expect(source).toContain('Paid hosting');
      expect(source).toContain('contracts');
      expect(source).toContain('payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAID HOSTING LAUNCH GATE REVIEW QUEUE');
      expect(source).toContain('APPROVED PAID HOSTING LAUNCH GATE EVIDENCE');
      expect(source).toContain('APPROVE');
      expect(source).toContain('NOT READY');
    });
    [webUserService, iosChallengeService, androidModels, androidRepository].forEach((source) => {
      expect(source).toContain('CreatorPaidHostingLaunchGate');
      expect(source).toContain('profileReady');
      expect(source).toContain('revenueReadyCount');
      expect(source).toContain('hostingApplicationStatus');
      expect(source).toContain('publishedTemplateCount');
      expect(source).toContain('approvedPrivateInviteLaunchCount');
      expect(source).toContain('launchGateReady');
      expect(source).toContain('isPaidHostingLive');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('creatorPaidHostingLaunchGateReviews');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    expect(firestoreRules).toContain('match /creatorPaidHostingLaunchGateReviews/{gateId}');
    expect(firestoreRules).toContain('request.resource.data.isPaidHostingLive == false');
    expect(firestoreRules).toContain('request.resource.data.keys().hasAll(["uid", "profileReady", "hostedChallengeCount", "revenueReadyCount", "hostingApplicationStatus", "launchGateReady", "status", "isPaidHostingLive"])');
  });

  it('keeps Creator Paid Hosting Launch Gate Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAID HOSTING LAUNCH GATE DECISION REPLY KIT');
      expect(source).toContain('Creator Paid Hosting Launch Gate Decision Reply Kit');
      expect(source).toContain('COPY LAUNCH GATE DECISION REPLIES');
      expect(source).toContain('APPROVED FOR MANUAL PAID-HOSTING READINESS REVIEW');
      expect(source).toContain('WAITING ON LAUNCH GATE READINESS');
      expect(source).toContain('NOT READY FOR PAID-HOSTING HANDOFF');
      expect(source).toContain('DECLINED FOR PAID-HOSTING HANDOFF');
      expect(source).toContain('Do not approve paid hosting');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect signatures');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('verify identities');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('grant paid access');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('submit store review');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('auto-message users');
      expect(source).toContain('pressure creators or members');
    });
  });

  it('keeps Creator Paid Hosting Hold Plan Kit wired on all platforms without launch side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAID HOSTING HOLD PLAN KIT');
      expect(source).toContain('COPY CREATOR HOLD PLAN');
      expect(source).toContain('creatorPaidHostingHoldPlanCopy');
      expect(source).toContain('Pause criteria when the launch gate fails');
      expect(source).toContain('Hold plan triggers');
      expect(source).toContain('Keep the creator in free hosted challenge mode');
      expect(source).toContain('creator paid hosting hold plan kit only');
      expect(source).toContain('Do not approve paid hosting');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect signatures');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('grant paid access');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('submit store review');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Exception Review Records manual across platforms without dispute or payout side effects', () => {
    const webProfile = readWebProfileContracts();
    const webServices = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT EXCEPTION REVIEW RECORD');
      expect(source).toContain('CREATOR PAYOUT EXCEPTION REVIEW QUEUE');
      expect(source).toContain('APPROVED CREATOR PAYOUT EXCEPTION REVIEWS');
      expect(source).toContain('SAVE PAYOUT EXCEPTION REVIEW');
      expect(source).toContain('creatorPayoutExceptionReviews');
      expect(source).toContain('dispute');
      expect(source).toContain('refund');
      expect(source).toContain('tax');
      expect(source).toContain('bank');
      expect(source).toContain('payout provider');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('marketplace bypass');
    });
    [webProfile, webServices, iosProfile, iosChallengeService, androidApp, androidRepository].forEach((source) => {
      expect(source).toContain('submitCreatorPayoutExceptionReview');
      expect(source).toContain('reviewCreatorPayoutExceptionReview');
    });
    [webServices, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('creatorPayoutExceptionReviews');
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('aggregateOnly');
      expect(source).toContain('resolvesPayoutDisputes');
      expect(source).toContain('processesRefunds');
      expect(source).toContain('collectsTaxDetails');
      expect(source).toContain('collectsTaxForms');
      expect(source).toContain('collectsGovernmentIds');
      expect(source).toContain('collectsBankDetails');
      expect(source).toContain('collectsPayoutDetails');
      expect(source).toContain('verifiesIdentities');
      expect(source).toContain('createsPayoutAccounts');
      expect(source).toContain('accessesPayoutProviders');
      expect(source).toContain('storesProviderCredentials');
      expect(source).toContain('storesTaxForms');
      expect(source).toContain('createsContracts');
      expect(source).toContain('collectsSignatures');
      expect(source).toContain('startsRevenueShare');
      expect(source).toContain('createsPayouts');
      expect(source).toContain('movesMoney');
      expect(source).toContain('processesPayments');
      expect(source).toContain('createsPurchases');
      expect(source).toContain('writesEntitlements');
      expect(source).toContain('givesTaxAdvice');
      expect(source).toContain('bypassesMarketplacePolicy');
      expect(source).toContain('promisesEarnings');
      expect(source).toContain('impliesPaidCreatorHostingLive');
      expect(source).toContain('exposesPrivateMemberLogs');
      expect(source).toContain('scrapesMessages');
      expect(source).toContain('storesMessages');
      expect(source).toContain('hasTrackingPixels');
      expect(source).toContain('pressuresCreators');
    });
    [webServices, iosChallengeService, androidModels, androidRepository].forEach((source) => {
      expect(source).toContain('CreatorPayoutExceptionReview');
      expect(source).toContain('hostingApplicationStatus');
      expect(source).toContain('approvedLaunchGateCount');
      expect(source).toContain('storeEvidenceCount');
      expect(source).toContain('entitlementRecoveryCount');
      expect(source).toContain('supportCount');
      expect(source).toContain('paidLaunchDecisionCount');
      expect(source).toContain('exceptionScore');
      expect(source).toContain('exceptionScoreLabel');
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('aggregateOnly');
      expect(source).toContain('createsPayouts');
      expect(source).toContain('writesEntitlements');
    });
    expect(firestoreRules).toContain('match /creatorPayoutExceptionReviews/{reviewId}');
    expect(firestoreRules).toContain('request.resource.data.resolvesPayoutDisputes == false');
    expect(firestoreRules).toContain('request.resource.data.createsPayouts == false');
    expect(firestoreRules).toContain('request.resource.data.writesEntitlements == false');
  });

  it('keeps Creator Payout Exception Review Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT EXCEPTION REVIEW DECISION REPLY KIT');
      expect(source).toContain('Creator Payout Exception Review Decision Reply Kit');
      expect(source).toContain('approved, waiting, not-ready, and declined replies');
      expect(source).toContain('APPROVED FOR MANUAL PAYOUT READINESS REVIEW');
      expect(source).toContain('WAITING ON PAYOUT READINESS');
      expect(source).toContain('NOT READY FOR PAYOUT HANDOFF');
      expect(source).toContain('DECLINED FOR PAYOUT HANDOFF');
      expect(source).toContain('COPY PAYOUT EXCEPTION DECISION REPLIES');
      expect(source).toContain('Do not resolve payout disputes');
      expect(source).toContain('process refunds');
      expect(source).toContain('collect tax details');
      expect(source).toContain('collect tax forms');
      expect(source).toContain('collect government IDs');
      expect(source).toContain('collect bank details');
      expect(source).toContain('collect payout details');
      expect(source).toContain('verify identities');
      expect(source).toContain('create payout accounts');
      expect(source).toContain('access payout providers');
      expect(source).toContain('store provider credentials');
      expect(source).toContain('store tax forms');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect signatures');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('move money');
      expect(source).toContain('process payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('give tax advice');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid creator hosting is live');
      expect(source).toContain('expose private member logs');
      expect(source).toContain('scrape/store messages');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('auto-message users');
      expect(source).toContain('pressure creators');
    });
  });
});
