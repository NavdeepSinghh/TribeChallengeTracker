const fs = require('fs');
const path = require('path');

describe('cross-platform feature parity source checks', () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const webChallengeService = fs.readFileSync(path.resolve(repoRoot, 'src/challengeService.js'), 'utf8');
  const webChallengesTab = fs.readFileSync(path.resolve(repoRoot, 'src/ChallengesTab.jsx'), 'utf8');
  const iosChallengeModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Models/Challenge.swift'), 'utf8');
  const iosChallengeService = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Services/FirebaseService.swift'), 'utf8');
  const iosChallengeTracker = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/ChallengeTrackerView.swift'), 'utf8');
  const iosProfile = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/ProfileView.swift'), 'utf8');
  const iosUserProfile = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Models/UserProfile.swift'), 'utf8');
  const androidRepository = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/data/TribeRepository.kt'), 'utf8');
  const androidBilling = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/data/PlayBillingService.kt'), 'utf8');
  const androidApp = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt'), 'utf8');
  const iosProducts = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Models/UserProfile.swift'), 'utf8');
  const androidModels = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/model/Models.kt'), 'utf8');

  it('keeps monthly Pro report surfaces on iOS and Android', () => {
    ['monthlyReport', 'MONTH SCORE', '30D ACTIVE', '30D POINTS'].forEach((contract) => {
      expect(iosProfile).toContain(contract);
      expect(androidApp).toContain(contract);
    });
    expect(iosProfile).toContain('Share 30-Day Recap');
    expect(androidApp).toContain('SHARE 30-DAY RECAP');
    expect(iosProfile).toContain('monthlyRecapShareText');
    expect(androidApp).toContain('shareMonthlyRecap');
  });

  it('keeps Pro Value Snapshot wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRO VALUE SNAPSHOT');
      expect(source).toContain('Best fit:');
      expect(source).toContain('WEEK SCORE');
      expect(source).toContain('30D ACTIVE');
      expect(source).toContain('CHAL PTS');
      expect(source).toContain('VALUE PROOF STORY KIT');
      expect(source).toContain('COPY VALUE PROOF STORY');
      expect(source).toContain('valueProofStoryCopy');
      expect(source).toContain('Copy a progress-proof Story');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('export private history');
      expect(source).toContain('grant Pro');
      expect(source).toContain('STORY POSTING CHECKLIST KIT');
      expect(source).toContain('COPY STORY POSTING CHECKLIST');
      expect(source).toContain('storyPostingChecklistCopy');
      expect(source).toContain('Manual weekly Story sequence');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('share unreviewed submissions');
      expect(source).toContain('write referral state');
      expect(source).toContain('STREAK RESCUE PROMPT KIT');
      expect(source).toContain('COPY STREAK RESCUE PROMPT');
      expect(source).toContain('streakRescuePromptCopy');
      expect(source).toContain('Comeback copy after a missed day');
      expect(source).toContain('Do not award points');
      expect(source).toContain('spend recovery credits');
      expect(source).toContain('pressure users after missed days');
      expect(source).toContain('COMEBACK CHALLENGE INVITE KIT');
      expect(source).toContain('COPY COMEBACK CHALLENGE INVITE');
      expect(source).toContain('comebackChallengeInviteCopy');
      expect(source).toContain("Restart invite for this week's campaign");
      expect(source).toContain('Do not auto-message users');
      expect(source).toContain('create challenge joins');
      expect(source).toContain('write referral state');
    });
  });

  it('keeps Pro Trial Interest capture wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    [
      webProfile,
      webUserService,
      iosProfile,
      iosUserProfile,
      iosChallengeService,
      androidApp,
      androidModels,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('proTrialInterest');
    });
    [
      webProfile,
      webUserService,
      iosProfile,
      iosChallengeService,
      androidApp,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('reports');
      expect(source).toContain('challenge_packs');
      expect(source).toContain('creator_tools');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRO TRIAL INTEREST');
      expect(source).toContain('first-party demand signal');
    });
  });

  it('keeps Partner Perk Claim requests wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('partnerPerkClaims');
      expect(source).toContain('perkId');
      expect(source).toContain('perkLabel');
      expect(source).toContain('current');
      expect(source).toContain('target');
      expect(source).toContain('status');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('REQUEST PERK REVIEW');
      expect(source).toContain('PARTNER PERK CLAIM REVIEW QUEUE');
      expect(source).toContain('Partner perk claim sent for manual review');
      expect(source).toContain('do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('PartnerPerkClaim');
    expect(iosChallengeService).toContain('PartnerPerkClaim');
  });

  it('keeps Partner Perk Claim Status History wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    [
      webUserService,
      iosChallengeService,
    ].forEach((source) => {
      expect(source).toContain('getPartnerPerkClaims');
      expect(source).toContain('partnerPerkClaims');
    });
    expect(androidRepository).toContain('partnerPerkClaims');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Partner perk claim status');
      expect(source).toContain('Review-only claim history from partnerPerkClaims');
      expect(source).toContain('No partner perk claims yet');
      expect(source).toContain('do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('paid-access claims');
    });
  });

  it('keeps Partner Perk Fulfillment Readiness Kit wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK FULFILLMENT READINESS KIT');
      expect(source).toContain('COPY PERK FULFILLMENT KIT');
      expect(source).toContain('partnerPerkFulfillmentReadinessCopy');
      expect(source).toContain('Manual readiness checks');
      expect(source).toContain('Open perk claims');
      expect(source).toContain('Verify the claim was written from first-party eligibility progress only');
      expect(source).toContain('support owner');
      expect(source).toContain('destination safety');
      expect(source).toContain('Do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('fulfillment promises');
    });
  });

  it('keeps Partner Perk Admin Decision Reply Kit wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK DECISION REPLY KIT');
      expect(source).toContain('COPY PERK DECISION REPLIES');
      expect(source).toContain('partnerPerkDecisionReplyCopy');
      expect(source).toContain('Manual decision replies');
      expect(source).toContain('APPROVED FOR MANUAL FOLLOW-UP');
      expect(source).toContain('WAITING ON PARTNER TERMS');
      expect(source).toContain('NOT READY YET');
      expect(source).toContain('DECLINED FOR NOW');
      expect(source).toContain('eligibility proof');
      expect(source).toContain('destination safety');
      expect(source).toContain('Do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('fulfillment promises');
    });
  });

  it('keeps Partner Perk Claim Admin Review Updates wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('reviewPartnerPerkClaim');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Manual review note');
      expect(source).toContain('Review note:');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
      expect(source).toContain('eligibility proof');
      expect(source).toContain('destination safety');
      expect(source).toContain('without creating coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('reviewNote');
    expect(iosChallengeService).toContain('reviewNote');
  });

  it('keeps Partner Campaign Application Admin Review Updates wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('reviewPartnerCampaignApplication');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Manual campaign review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
      expect(source).toContain('partner terms');
      expect(source).toContain('destination safety');
      expect(source).toContain('without adding partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('reviewNote');
    expect(iosChallengeService).toContain('reviewNote');
  });

  it('keeps Creator Hosting Application Admin Review Updates wired on all platforms without fulfillment side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('reviewCreatorHostingApplication');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Manual creator review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
      expect(source).toContain('creator focus');
      expect(source).toContain('support readiness');
      expect(source).toContain('without creating contracts');
      expect(source).toContain('payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('reviewNote');
    expect(iosChallengeService).toContain('reviewNote');
  });

  it('keeps Pro Trial demand summary admin-only and aggregate on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('getProTrialInterestSummary');
      expect(source).toContain('proTrialInterest');
      expect(source).toContain('selectedIds');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Pro trial demand summary');
      expect(source).toContain('TRIAL LAUNCH KIT');
      expect(source).toContain('proTrialPitchCopy');
      expect(source).toContain('PRO TRIAL OBJECTION REPLY KIT');
      expect(source).toContain('COPY PRO TRIAL REPLIES');
      expect(source).toContain('proTrialObjectionReplyCopy');
      expect(source).toContain('Do not claim a store-backed trial is live');
      expect(source).toContain('quote unconfigured prices');
      expect(source).toContain('promise founder pricing');
    });
  });

  it('keeps Creator revenue-share demand summary admin-only and aggregate on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('getCreatorRevenueShareSummary');
      expect(source).toContain('revenueShareInterest');
      expect(source).toContain('branded');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('CREATOR DEMAND SUMMARY');
      expect(source).toContain('COPY CREATOR BETA COPY');
      expect(source).toContain('creatorRevenueSharePitchCopy');
    });
  });

  it('keeps Monetization Launch Board admin-only on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Monetization Launch Board');
      expect(source).toContain('monetizationLaunchCopy');
      expect(source).toContain('COPY LAUNCH BOARD COPY');
      expect(source).toContain('first-party monetization signals');
    });
  });

  it('keeps Revenue Pathway Planner wired on all platforms without paid or tracking side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('REVENUE PATHWAY PLANNER');
      expect(source).toContain('COPY REVENUE PATHWAY PLAN');
      expect(source).toContain('revenuePathwayPlannerCopy');
      expect(source).toContain('Recommended path');
      expect(source).toContain('Path signals');
      expect(source).toContain('Tribe Pro');
      expect(source).toContain('Paid Packs');
      expect(source).toContain('Creator Hosting');
      expect(source).toContain('Partner Campaign');
      expect(source).toContain('Do not add tracking pixels');
      expect(source).toContain('paid-access claims');
      expect(source).toContain('purchases, entitlements');
      expect(source).toContain('payout promises');
    });
  });

  it('keeps Pricing Test Kit wired on all platforms without purchase or discount side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PRICING TEST KIT');
      expect(source).toContain('COPY PRICING TEST KIT');
      expect(source).toContain('pricingTestKitCopy');
      expect(source).toContain('Products to configure before paid launch');
      expect(source).toContain('Do not quote unconfigured prices');
      expect(source).toContain('collect payments outside approved store flows');
      expect(source).toContain('grant purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('offer discounts');
      expect(source).toContain('claim paid access is live');
    });
  });

  it('keeps Founder Member Offer Kit wired on all platforms without sale or entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('FOUNDER MEMBER OFFER KIT');
      expect(source).toContain('COPY FOUNDER OFFER KIT');
      expect(source).toContain('founderMemberOfferCopy');
      expect(source).toContain('early tribe accountability access');
      expect(source).toContain('free challenge loop');
      expect(source).toContain('first-party interest');
      expect(source).toContain('This is not a sale');
      expect(source).toContain('lifetime deal');
      expect(source).toContain('purchase, entitlement, discount');
      expect(source).toContain('Do not collect payment');
      expect(source).toContain('promise founder pricing');
    });
  });

  it('keeps Community Ambassador Kit wired on all platforms without payout or affiliate side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('COMMUNITY AMBASSADOR KIT');
      expect(source).toContain('COPY AMBASSADOR KIT');
      expect(source).toContain('communityAmbassadorCopy');
      expect(source).toContain('invite one accountability partner');
      expect(source).toContain('free community loop');
      expect(source).toContain('community-recognition brief');
      expect(source).toContain('Do not create commissions');
      expect(source).toContain('payouts');
      expect(source).toContain('paid roles');
      expect(source).toContain('affiliate links');
      expect(source).toContain('partner tracking');
      expect(source).toContain('revenue-share promises');
    });
  });

  it('keeps Customer Value Checklist wired on all platforms without paid-access side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('CUSTOMER VALUE CHECKLIST');
      expect(source).toContain('COPY VALUE CHECKLIST');
      expect(source).toContain('customerValueChecklistCopy');
      expect(source).toContain('Charge only after value is visible');
      expect(source).toContain('free challenge loop must create visible consistency');
      expect(source).toContain('paid offer must add measurable accountability');
      expect(source).toContain('value-readiness brief');
      expect(source).toContain('Do not charge users');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('write entitlements');
      expect(source).toContain('promote paid features as live');
    });
  });

  it('keeps Store Launch Readiness admin-only on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webPurchaseService = fs.readFileSync(path.resolve(repoRoot, 'src/purchaseService.js'), 'utf8');
    expect(webPurchaseService).toContain('STORE_PRODUCTS');
    [iosProducts, androidModels].forEach((source) => {
      expect(source).toContain('StoreProducts');
      expect(source).toContain('com.risewiththetribe.pro.monthly');
      expect(source).toContain('com.risewiththetribe.pack.summer_shred');
    });
    expect(fs.readFileSync(path.resolve(repoRoot, 'src/proFeatures.js'), 'utf8')).toContain('com.risewiththetribe.pack.summer_shred');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Store Launch Readiness');
      expect(source).toContain('storeReadinessCopy');
      expect(source).toContain('COPY STORE LAUNCH CHECKLIST');
      expect(source).toContain('CREDENTIALS PENDING');
      expect(source).toContain('receipt-validation credentials');
    });
  });

  it('keeps Challenge Pack Launch Kit wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CHALLENGE PACK LAUNCH KIT');
      expect(source).toContain('COPY PACK LAUNCH COPY');
      expect(source).toContain('challengePackLaunchCopy');
      expect(source).toContain('Copy for paid-pack demand before store launch');
      expect(source).toContain('Store credentials and test purchases');
      expect(source).toContain('CHALLENGE PACK OBJECTION REPLY KIT');
      expect(source).toContain('COPY PACK REPLIES');
      expect(source).toContain('challengePackObjectionReplyCopy');
      expect(source).toContain('Do not claim challenge packs are live');
      expect(source).toContain('quote unconfigured prices');
      expect(source).toContain('unlock packs');
      expect(source).toContain('bypass marketplace policy');
    });
    [fs.readFileSync(path.resolve(repoRoot, 'src/proFeatures.js'), 'utf8'), iosProducts, androidModels].forEach((source) => {
      expect(source).toContain('com.risewiththetribe.pack.21_day_reset');
      expect(source).toContain('com.risewiththetribe.pack.summer_shred');
    });
  });

  it('keeps Campaign Performance Board admin-only and aggregate on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('getCampaignPerformanceSummary');
      expect(source).toContain('campaignId');
      expect(source).toContain('memberReach');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Campaign Performance Board');
      expect(source).toContain('campaignPerformanceCopy');
      expect(source).toContain('COPY CAMPAIGN BOARD COPY');
      expect(source).toContain('weekly campaign engine summary');
    });
  });

  it('keeps Weekly Campaign Scheduler wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webChallengeService, iosChallengeModel, androidModels].forEach((source) => {
      expect(source).toContain('getWeeklyCampaignPrompt');
      expect(source).toContain('campaignId');
    });
    [iosChallengeModel, androidModels].forEach((source) => {
      expect(source).toContain('WeeklyCampaignPrompt');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Weekly Campaign Scheduler');
      expect(source).toContain('campaignSchedulerCopy');
      expect(source).toContain('COPY WEEKLY CAMPAIGN COPY');
      expect(source).toContain('Creator/admin Instagram cadence prompt');
      expect(source).toContain('Weekly Campaign Launch Card Kit');
      expect(source).toContain('weeklyCampaignLaunchCardCopy');
      expect(source).toContain('COPY LAUNCH CARD KIT');
      expect(source).toContain('Shareable campaign card brief');
      expect(source).toContain('Card headline');
      expect(source).toContain('Design notes');
      expect(source).toContain('Caption draft');
      expect(source).toContain('Do not auto-post to Instagram');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('share user activity without consent');
      expect(source).toContain('Weekly Campaign Preflight Checklist');
      expect(source).toContain('weeklyCampaignPreflightCopy');
      expect(source).toContain('COPY CAMPAIGN PREFLIGHT');
      expect(source).toContain('Manual launch readiness before posting');
      expect(source).toContain('Preflight checks');
      expect(source).toContain('DM keyword replies for TRIBE, COMEBACK, PRO, and FEATURE');
      expect(source).toContain('Seven-day content calendar');
      expect(source).toContain('Feature submissions and user activity are shared only with consent and manual review');
      expect(source).toContain('first-party challenge joins');
      expect(source).toContain('Do not schedule posts');
      expect(source).toContain('auto-post to Instagram');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share user content without consent');
      expect(source).toContain('imply paid access is live');
      expect(source).toContain('Weekly Campaign Review Kit');
      expect(source).toContain('weeklyCampaignReviewCopy');
      expect(source).toContain('COPY CAMPAIGN REVIEW');
      expect(source).toContain('First-party weekly campaign review');
      expect(source).toContain('Review notes');
      expect(source).toContain('Share-card usage');
      expect(source).toContain('consent-cleared for Instagram review');
      expect(source).toContain('Do not create attribution records');
      expect(source).toContain('scrape or store Instagram DMs');
      expect(source).toContain('Weekly Campaign Storyboard Kit');
      expect(source).toContain('weeklyCampaignStoryboardCopy');
      expect(source).toContain('COPY STORYBOARD KIT');
      expect(source).toContain('Reels, Stories, and carousel outline');
      expect(source).toContain('Reel storyboard');
      expect(source).toContain('Story frames');
      expect(source).toContain('Carousel outline');
      expect(source).toContain('manual content storyboard only');
      expect(source).toContain('schedule posts from the app');
      expect(source).toContain('Weekly Campaign Experiment Brief Kit');
      expect(source).toContain('weeklyCampaignExperimentBriefCopy');
      expect(source).toContain('COPY EXPERIMENT BRIEF');
      expect(source).toContain('Manual experiment from weekly campaign signals');
      expect(source).toContain('Recommended experiment');
      expect(source).toContain('Experiment brief');
      expect(source).toContain('Measure only first-party app movement');
      expect(source).toContain('Do not create experiment records');
    });
  });

  it('keeps Instagram DM Keyword Kit wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Instagram DM Keyword Kit');
      expect(source).toContain('COPY DM KEYWORD REPLIES');
      expect(source).toContain('Manual replies for Reels, Stories, and community DMs');
      expect(source).toContain('dmKeywordCopy');
      ['TRIBE', 'COMEBACK', 'PRO', 'FEATURE'].forEach((keyword) => {
        expect(source).toContain(keyword);
      });
    });
  });

  it('keeps Weekly Campaign Comment Reply Kit wired on all platforms without automation side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Comment Reply Kit');
      expect(source).toContain('COPY COMMENT REPLIES');
      expect(source).toContain('weeklyCampaignCommentReplyCopy');
      expect(source).toContain('Manual public replies');
      expect(source).toContain('How do I join?');
      expect(source).toContain('I missed a day. Should I restart?');
      expect(source).toContain('Is Pro or a paid pack live?');
      expect(source).toContain('Can I be featured?');
      expect(source).toContain('Do not auto-reply');
      expect(source).toContain('scrape comments');
      expect(source).toContain('store inbound comments');
      expect(source).toContain('create attribution records');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share user content without consent');
      expect(source).toContain('imply paid access is live');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Story Poll Kit wired on all platforms without scraping or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Story Poll Kit');
      expect(source).toContain('COPY STORY POLLS');
      expect(source).toContain('weeklyCampaignStoryPollCopy');
      expect(source).toContain('Story sticker prompts');
      expect(source).toContain("Are you joining this week's challenge?");
      expect(source).toContain('What would help you show up today?');
      expect(source).toContain('What should we build next for the tribe?');
      expect(source).toContain('What is one thing making consistency hard this week?');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Instagram votes as app consent');
      expect(source).toContain('imply paid access is live');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Countdown Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Countdown Story Kit');
      expect(source).toContain('COPY COUNTDOWN STORIES');
      expect(source).toContain('weeklyCampaignCountdownStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: Countdown sticker');
      expect(source).toContain('Frame 3: Join CTA');
      expect(source).toContain('Sticker text');
      expect(source).toContain('What would make you show up on day one?');
      expect(source).toContain('Use visible Story engagement as directional content feedback only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story interactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Start-Day Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Start-Day Story Kit');
      expect(source).toContain('COPY START-DAY STORIES');
      expect(source).toContain('weeklyCampaignStartDayStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: It starts today');
      expect(source).toContain('Frame 4: Proof');
      expect(source).toContain('CTA sticker: Open Rise With The Tribe');
      expect(source).toContain('Use Story reactions as directional content feedback only');
      expect(source).toContain('first-party challenge joins');
      expect(source).toContain('saved activity logs');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Midweek Check-In Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Midweek Check-In Story Kit');
      expect(source).toContain('COPY MIDWEEK CHECK-IN');
      expect(source).toContain('weeklyCampaignMidweekCheckInStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: Midweek check-in');
      expect(source).toContain('Frame 2: Comeback lane');
      expect(source).toContain('Frame 4: App-first proof');
      expect(source).toContain("CTA sticker: Log today's session");
      expect(source).toContain('Use visible midweek reactions as directional content feedback only');
      expect(source).toContain('Confirm re-engagement with first-party saved activity logs');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Weekend Push Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Weekend Push Story Kit');
      expect(source).toContain('COPY WEEKEND PUSH');
      expect(source).toContain('weeklyCampaignWeekendPushStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: Weekend push');
      expect(source).toContain('Frame 2: Finish-line action');
      expect(source).toContain('Frame 4: Community proof');
      expect(source).toContain('CTA sticker: Save the weekend log');
      expect(source).toContain('Use visible weekend reactions as directional content feedback only');
      expect(source).toContain('Confirm finish-line momentum with first-party saved activity logs');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Completion Recap Story Kit wired on all platforms without scraping, attribution, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Completion Recap Story Kit');
      expect(source).toContain('COPY COMPLETION RECAP');
      expect(source).toContain('weeklyCampaignCompletionRecapStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: Weekly recap');
      expect(source).toContain('Frame 2: Celebrate effort');
      expect(source).toContain('Frame 3: Feature Me CTA');
      expect(source).toContain('CTA sticker: Submit Feature Me in the app');
      expect(source).toContain('Use completion reactions as directional content feedback only');
      expect(source).toContain('Confirm weekly recap lessons with first-party saved activity logs');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('share user wins without Feature Me consent');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Next-Week Teaser Story Kit wired on all platforms without scraping, attribution, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Next-Week Teaser Story Kit');
      expect(source).toContain('COPY NEXT-WEEK TEASER');
      expect(source).toContain('weeklyCampaignNextWeekTeaserStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: Next week is coming');
      expect(source).toContain('Frame 2: Choose the lane');
      expect(source).toContain('Frame 4: Signal check');
      expect(source).toContain('CTA sticker: Join inside the app');
      expect(source).toContain('Use teaser reactions as directional content feedback only');
      expect(source).toContain('Confirm next-week direction with first-party saved activity logs');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Partner Perk Teaser Story Kit wired on all platforms without partner, attribution, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Partner Perk Teaser Story Kit');
      expect(source).toContain('COPY PARTNER PERK TEASER');
      expect(source).toContain('weeklyCampaignPartnerPerkTeaserStoryCopy');
      expect(source).toContain('Partner Perk Poll');
      expect(source).toContain('Frame 1: Partner perk check');
      expect(source).toContain('Frame 2: Perk lanes');
      expect(source).toContain('Frame 4: Review boundary');
      expect(source).toContain('CTA sticker: Save partner interest in the app');
      expect(source).toContain('Use visible perk reactions as directional content feedback only');
      expect(source).toContain('Confirm partner direction with first-party saved partner interest');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('create affiliate links');
      expect(source).toContain('create partner payouts');
      expect(source).toContain('contact partners as if demand is validated');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('imply paid access or perks are live');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Poll Review Kit wired on all platforms without storage or attribution side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Poll Review Kit');
      expect(source).toContain('COPY POLL REVIEW');
      expect(source).toContain('weeklyCampaignPollReviewCopy');
      expect(source).toContain('Manual review prompts');
      expect(source).toContain('What Story option got the strongest visible response?');
      expect(source).toContain('Which first-party app signal should confirm the reaction');
      expect(source).toContain('Use Instagram poll reactions as directional creator feedback only');
      expect(source).toContain('Do not scrape Story responses');
      expect(source).toContain('store Instagram voter identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Instagram votes as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Live Q&A Kit wired on all platforms without off-platform identity or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Live Q&A Kit');
      expect(source).toContain('COPY LIVE Q&A');
      expect(source).toContain('weeklyCampaignLiveQaCopy');
      expect(source).toContain('Live setup');
      expect(source).toContain('Question lanes');
      expect(source).toContain('Close');
      expect(source).toContain('app-first actions');
      expect(source).toContain('Feature Me with consent');
      expect(source).toContain('paid packs, Pro, or creator hosting');
      expect(source).toContain('Do not auto-host');
      expect(source).toContain('record private replies');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Live questions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Live Recap Kit wired on all platforms without off-platform attribution or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Live Recap Kit');
      expect(source).toContain('COPY LIVE RECAP');
      expect(source).toContain('weeklyCampaignLiveRecapCopy');
      expect(source).toContain('Manual recap prompts');
      expect(source).toContain('What question came up more than once');
      expect(source).toContain('Which app-first action answered it best');
      expect(source).toContain('Which first-party signal should confirm momentum after the Live');
      expect(source).toContain('Public recap copy');
      expect(source).toContain('Use the Live as directional content feedback only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('record private replies');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Live questions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign FAQ Carousel Kit wired on all platforms without scraping, scheduling, or consent side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign FAQ Carousel Kit');
      expect(source).toContain('COPY FAQ CAROUSEL');
      expect(source).toContain('weeklyCampaignFaqCarouselCopy');
      expect(source).toContain('Carousel outline');
      expect(source).toContain('Slide 1');
      expect(source).toContain('Q: How do I join?');
      expect(source).toContain('Q: Are Pro, paid packs, or creator hosting live?');
      expect(source).toContain('Review note');
      expect(source).toContain('Use repeated questions as directional content input only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Instagram questions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Caption Bank Kit wired on all platforms without posting or tracking side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Caption Bank Kit');
      expect(source).toContain('COPY CAPTION BANK');
      expect(source).toContain('weeklyCampaignCaptionBankCopy');
      expect(source).toContain('Reel caption');
      expect(source).toContain('Carousel caption');
      expect(source).toContain('Story caption');
      expect(source).toContain('Pinned comment');
      expect(source).toContain('Use the Story Poll Kit and Poll Review Kit');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Collab Invite Kit wired on all platforms without messaging, payout, or contract side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Collab Invite Kit');
      expect(source).toContain('COPY COLLAB INVITE');
      expect(source).toContain('weeklyCampaignCollabInviteCopy');
      expect(source).toContain('Manual creator invite');
      expect(source).toContain('Collab post angle');
      expect(source).toContain('Story mention angle');
      expect(source).toContain('route them to Creator / Coach Mode');
      expect(source).toContain('Do not auto-message');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('promise revenue-share');
      expect(source).toContain('create affiliate links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('pressure creators');
    });
  });

  it('keeps Weekly Campaign Collab Follow-Up Kit wired on all platforms without paid creator side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Collab Follow-Up Kit');
      expect(source).toContain('COPY COLLAB FOLLOW-UP');
      expect(source).toContain('weeklyCampaignCollabFollowUpCopy');
      expect(source).toContain('If they say yes');
      expect(source).toContain('If they ask what to post');
      expect(source).toContain('If they ask about paid hosting');
      expect(source).toContain('If they are not ready');
      expect(source).toContain('Creator / Coach Mode review before paid hosting');
      expect(source).toContain('Do not auto-message');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('promise revenue-share');
      expect(source).toContain('create affiliate links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('pressure creators');
    });
  });

  it('keeps Weekly Campaign Collab Safety Checklist wired on all platforms without paid creator or privacy side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Collab Safety Checklist');
      expect(source).toContain('COPY COLLAB SAFETY');
      expect(source).toContain('weeklyCampaignCollabSafetyCopy');
      expect(source).toContain('Before posting');
      expect(source).toContain('Feature Me consent');
      expect(source).toContain('guaranteed outcome');
      expect(source).toContain('If deeper hosting comes up');
      expect(source).toContain('audience safety');
      expect(source).toContain('Keep private replies');
      expect(source).toContain('member activity out of shared collab notes');
      expect(source).toContain('Do not auto-message');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('promise revenue-share');
      expect(source).toContain('create affiliate links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure creators');
    });
  });

  it('keeps Weekly Campaign Collab Recap Kit wired on all platforms without attribution, payout, or privacy side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Collab Recap Kit');
      expect(source).toContain('COPY COLLAB RECAP');
      expect(source).toContain('weeklyCampaignCollabRecapCopy');
      expect(source).toContain('Manual recap prompts');
      expect(source).toContain('Which app signal moved after the post');
      expect(source).toContain('Public thank-you copy');
      expect(source).toContain('Decision note');
      expect(source).toContain('Use only first-party app movement');
      expect(source).toContain('consent-cleared submissions');
      expect(source).toContain('Do not scrape posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('promise revenue-share');
      expect(source).toContain('create affiliate links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure creators');
    });
  });

  it('keeps Weekly Campaign Collab Renewal Kit wired on all platforms without creator obligation or paid terms side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Collab Renewal Kit');
      expect(source).toContain('COPY COLLAB RENEWAL');
      expect(source).toContain('weeklyCampaignCollabRenewalCopy');
      expect(source).toContain('Repeat this collab if');
      expect(source).toContain('Pause this collab if');
      expect(source).toContain('Manual renewal reply');
      expect(source).toContain('Creator / Coach Mode review before paid hosting');
      expect(source).toContain('no-pressure collab');
      expect(source).toContain('support needs');
      expect(source).toContain('payout readiness');
      expect(source).toContain('Do not auto-message');
      expect(source).toContain('scrape posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('promise revenue-share');
      expect(source).toContain('create affiliate links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure creators');
    });
  });

  it('keeps Referral Launch Kit wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('REFERRAL LAUNCH KIT');
      expect(source).toContain('COPY REFERRAL LAUNCH COPY');
      expect(source).toContain('Copy a next-tier invite prompt');
      expect(source).toContain('referralLaunchCopy');
      expect(source).toContain('Current tribe momentum');
      expect(source).toContain('@risewiththetribe');
      expect(source).toContain('REFERRAL STORY SPRINT KIT');
      expect(source).toContain('COPY REFERRAL STORY SPRINT');
      expect(source).toContain('Story/Reel invite around your next tier');
      expect(source).toContain('referralStorySprintCopy');
      expect(source).toContain('Story sprint');
      expect(source).toContain('Reel hook');
      expect(source).toContain('REFERRAL REWARD SOCIAL PROOF KIT');
      expect(source).toContain('COPY REFERRAL SOCIAL PROOF');
      expect(source).toContain('Reward-tier celebration copy');
      expect(source).toContain('referralRewardSocialProofCopy');
      expect(source).toContain('Story caption');
      expect(source).toContain('Carousel beats');
      expect(source).toContain('Do not count link opens');
      expect(source).toContain('grant rewards');
      expect(source).toContain('write referral state');
      expect(source).toContain('claim fulfillment before admin review');
    });
  });

  it('keeps Instagram Content Calendar wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('INSTAGRAM CONTENT CALENDAR');
      expect(source).toContain('COPY CONTENT CALENDAR');
      expect(source).toContain('Seven-day creator/admin cadence');
      expect(source).toContain('instagramContentCalendarCopy');
      expect(source).toContain('SUNDAY COUNTDOWN');
      expect(source).toContain('FOUNDER NOTE');
      expect(source).toContain('@risewiththetribe');
    });
  });

  it('keeps Community Highlight and UGC Consent kits wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Community Highlight Roundup Kit');
      expect(source).toContain('COPY HIGHLIGHT ROUNDUP');
      expect(source).toContain('communityHighlightRoundupCopy');
      expect(source).toContain('Use featured submissions with consent only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule posts');
      expect(source).toContain('share unreviewed submissions');
      expect(source).toContain('UGC Consent Reminder Kit');
      expect(source).toContain('COPY UGC CONSENT REMINDER');
      expect(source).toContain('ugcConsentReminderCopy');
      expect(source).toContain('Confirm the member opted in through the Feature Me consent gate');
      expect(source).toContain('Avoid before/after, medical, weight-loss, or guaranteed outcome claims');
      expect(source).toContain('override consent');
      expect(source).toContain('edit member claims into outcomes');
    });
  });

  it('keeps paid pack product IDs in native store catalogs', () => {
    [
      'com.risewiththetribe.pack.21_day_reset',
      'com.risewiththetribe.pack.summer_shred',
    ].forEach((productId) => {
      expect(iosProducts).toContain(productId);
      expect(androidModels).toContain(productId);
    });
  });

  it('keeps creator-branded challenge fields on all platforms', () => {
    ['creatorSpecialty', 'creatorBio', 'creatorCtaUrl'].forEach((field) => {
      expect(webChallengeService).toContain(field);
      expect(webChallengesTab).toContain(field);
      expect(iosChallengeModel).toContain(field);
      expect(iosChallengeService).toContain(field);
      expect(iosChallengeTracker).toContain(field);
      expect(androidModels).toContain(field);
      expect(androidRepository).toContain(field);
      expect(androidApp).toContain(field);
    });
    expect(webChallengesTab).toContain('COACH HOST');
    expect(iosChallengeTracker).toContain('COACH HOST');
    expect(androidApp).toContain('COACH HOST');
  });

  it('keeps creator revenue-share readiness wired on all platforms', () => {
    [
      fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8'),
      fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8'),
      iosProfile,
      iosUserProfile,
      iosChallengeService,
      androidApp,
      androidModels,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('revenueShareInterest');
    });
    ['future revenue-share beta', 'PAID PACKS', 'READY'].forEach((label) => {
      expect(fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8')).toContain(label);
      expect(iosProfile).toContain(label);
      expect(androidApp).toContain(label);
    });
  });

  it('keeps Creator Launch Kit wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR LAUNCH KIT');
      expect(source).toContain('COPY CREATOR LAUNCH COPY');
      expect(source).toContain('Tag @risewiththetribe');
      expect(source).toContain('join=');
      expect(source).toContain('inviteCode');
    });
  });

  it('keeps Creator Hosting Offer Kit wired on all platforms without paid-hosting side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
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
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
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
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
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

  it('keeps Creator Hosting Objection Reply Kit wired on all platforms without paid-hosting side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR HOSTING OBJECTION REPLY KIT');
      expect(source).toContain('COPY CREATOR REPLIES');
      expect(source).toContain('creatorHostingObjectionReplyCopy');
      expect(source).toContain('Manual replies:');
      expect(source).toContain('Can creators earn money from hosted challenges yet?');
      expect(source).toContain('Do not claim paid creator hosting is live');
      expect(source).toContain('quote unconfigured prices');
      expect(source).toContain('collect payments');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('pressure creators');
    });
  });

  it('keeps Creator Hosting Application review wired across platforms without paid-hosting side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR HOSTING APPLICATION');
      expect(source).toContain('APPLY FOR HOSTED REVIEW');
      expect(source).toContain('creatorHostingApplications');
      expect(source).toContain('manual review');
      expect(source).toContain('CREATOR HOSTING APPLICATION REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('do not create contracts');
      expect(source).toContain('payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('paid-access claims');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('creatorHostingApplications');
      expect(source).toContain('hostedCount');
      expect(source).toContain('memberReach');
      expect(source).toContain('revenueReadyCount');
      expect(source).toContain('status');
      expect(source).toContain('open');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('CreatorHostingApplication');
    });
    expect(webProfile).toContain('submitCreatorHostingApplication');
    expect(webProfile).toContain('getCreatorHostingApplicationReviewQueue');
    expect(iosProfile).toContain('submitCreatorHostingReview');
    expect(iosChallengeService).toContain('getCreatorHostingApplicationReviewQueue');
    expect(androidViewModel).toContain('submitCreatorHostingApplication');
    expect(androidViewModel).toContain('creatorHostingApplicationReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.hostedCount >= 0');
  });

  it('keeps community highlights for featured submissions wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toMatch(/getFeaturedSubmissions|featuredSubmissions/);
      expect(source).toContain('featured');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source.toLowerCase()).toContain('community highlights');
      expect(source).toContain('COPY REPOST CAPTION');
      expect(source).toContain('COMMUNITY HIGHLIGHT ROUNDUP KIT');
      expect(source).toContain('COPY HIGHLIGHT ROUNDUP');
      expect(source).toContain('Weekly featured-win roundup copy');
      expect(source).toContain('communityHighlightRoundupCopy');
      expect(source).toContain('UGC CONSENT REMINDER KIT');
      expect(source).toContain('COPY UGC CONSENT REMINDER');
      expect(source).toContain('ugcConsentReminderCopy');
      expect(source).toContain('Manual repost safety checklist');
      expect(source).toContain('Feature Me consent gate');
      expect(source).toContain('override consent');
      expect(source).toContain('Use featured submissions with consent only');
      expect(source).toContain('share unreviewed submissions');
      expect(source).toContain('@risewiththetribe');
    });
    expect(iosProfile).toContain('getFeaturedSubmissions');
    expect(androidModels).toContain('reviewedAt');
  });

  it('keeps Instagram Weekly Prompt Kit wired on all platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Instagram Weekly Prompt Kit');
      expect(source).toContain('COPY INSTAGRAM PROMPT');
      expect(source).toContain('Tag @risewiththetribe');
      expect(source).toContain('WEEKLY CHALLENGE LAUNCH');
      expect(source).toContain('COMMUNITY WIN');
    });
  });

  it('keeps Partner Pitch Kit wired on all platforms without ad tracking behavior', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER PITCH KIT');
      expect(source).toContain('COPY PARTNER PITCH');
      expect(source).toContain('first-party');
      expect(source).toContain('without random ads or third-party tracking');
    });
  });

  it('keeps Partner Campaign Activation Kit wired on all platforms without tracking or purchase side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN ACTIVATION KIT');
      expect(source).toContain('COPY ACTIVATION KIT');
      expect(source).toContain('partnerActivationCopy');
      expect(source).toContain('Pilot theme');
      expect(source).toContain('Total first-party perk signals');
      expect(source).toContain('Campaign member reach');
      expect(source).toContain('Referral joins');
      expect(source).toContain('Do not add partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('purchases, entitlements');
    });
  });

  it('keeps Partner Terms Readiness Kit wired on all platforms without ad, payout, or data-sharing side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER TERMS READINESS KIT');
      expect(source).toContain('COPY PARTNER TERMS KIT');
      expect(source).toContain('partnerTermsReadinessCopy');
      expect(source).toContain('Partner fit');
      expect(source).toContain('Disclosure copy');
      expect(source).toContain('Data boundaries');
      expect(source).toContain('Destination review');
      expect(source).toContain('Reporting readiness');
      expect(source).toContain('Support handoff');
      expect(source).toContain('partner terms readiness brief only');
      expect(source).toContain('Do not add partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('third-party data sharing');
      expect(source).toContain('medical claims');
      expect(source).toContain('guaranteed outcomes');
      expect(source).toContain('paid-access claims');
    });
  });

  it('keeps Partner Contract Readiness Kit wired on all platforms without contract side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CONTRACT READINESS KIT');
      expect(source).toContain('COPY PARTNER CONTRACT KIT');
      expect(source).toContain('partnerContractReadinessCopy');
      expect(source).toContain('Contract checklist');
      expect(source).toContain('Partner identity');
      expect(source).toContain('support owner');
      expect(source).toContain('disclosure wording');
      expect(source).toContain('fulfillment scope');
      expect(source).toContain('refund boundaries');
      expect(source).toContain('data deletion/privacy escalation');
      expect(source).toContain('partner contract readiness brief only');
      expect(source).toContain('Do not create partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('commissions');
      expect(source).toContain('revenue-share');
      expect(source).toContain('discounts');
      expect(source).toContain('coupons');
      expect(source).toContain('third-party data sharing');
      expect(source).toContain('fulfillment promises');
    });
  });

  it('keeps Partner Campaign Objection Reply Kit wired on all platforms without sponsor monetization side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN OBJECTION REPLY KIT');
      expect(source).toContain('COPY PARTNER REPLIES');
      expect(source).toContain('partnerCampaignObjectionReplyCopy');
      expect(source).toContain('Manual replies:');
      expect(source).toContain('Are partner perks or sponsor campaigns live yet?');
      expect(source).toContain('Do not claim partner campaigns are live');
      expect(source).toContain('add partner links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('use ad targeting');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('create affiliate payouts');
      expect(source).toContain('create commissions');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('write entitlements');
      expect(source).toContain('share third-party data');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Partner Campaign Application review wired across platforms without partner monetization side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN APPLICATION');
      expect(source).toContain('APPLY FOR PARTNER PILOT REVIEW');
      expect(source).toContain('partnerCampaignApplications');
      expect(source).toContain('manual review');
      expect(source).toContain('PARTNER CAMPAIGN APPLICATION REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('do not add partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('paid-access claims');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('partnerCampaignApplications');
      expect(source).toContain('topPerkId');
      expect(source).toContain('topPerkLabel');
      expect(source).toContain('demandCount');
      expect(source).toContain('totalDemand');
      expect(source).toContain('campaignReach');
      expect(source).toContain('referralJoins');
      expect(source).toContain('status');
      expect(source).toContain('open');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('PartnerCampaignApplication');
    });
    expect(webProfile).toContain('submitPartnerCampaignApplication');
    expect(webProfile).toContain('getPartnerCampaignApplicationReviewQueue');
    expect(iosProfile).toContain('submitPartnerCampaignReview');
    expect(iosChallengeService).toContain('getPartnerCampaignApplicationReviewQueue');
    expect(androidViewModel).toContain('submitPartnerCampaignApplication');
    expect(androidViewModel).toContain('partnerCampaignApplicationReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.demandCount >= 0');
  });

  it('keeps premium pack accountability prompts wired on all platforms', () => {
    [
      webChallengeService,
      webChallengesTab,
      iosChallengeModel,
      iosChallengeService,
      iosChallengeTracker,
      androidModels,
      androidRepository,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('dailyPrompts');
    });

    [webChallengesTab, iosChallengeTracker, androidApp].forEach((source) => {
      expect(source).toContain('PACK ACCOUNTABILITY PROMPTS');
    });
  });

  it('keeps paid pack value preview visible on challenge templates', () => {
    const iosCreateChallenge = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreateChallengeView.swift'), 'utf8');
    [
      webChallengesTab,
      iosCreateChallenge,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PACK VALUE PREVIEW');
      expect(source).toContain('DAYS');
      expect(source).toContain('TASKS');
      expect(source).toContain('PROMPTS');
      expect(source).toContain('Unlock with Tribe Pro or this pack');
    });
  });

  it('keeps purchase sync and restore hooks visible across platforms', () => {
    expect(fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8')).toContain('Sync previous purchases');
    expect(iosProfile).toContain('Sync previous purchases');
    expect(androidApp).toContain('Sync previous purchases');
    expect(iosUserProfile).toContain('currentEntitlementPayloads');
    expect(androidBilling).toContain('queryOwnedPurchases');
    expect(iosUserProfile).toContain('verifyPurchase');
    expect(androidApp).toContain('verifyPurchasePayload');
  });

  it('keeps Store Credential Setup Kit wired across profile surfaces', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webPurchaseService = fs.readFileSync(path.resolve(repoRoot, 'src/purchaseService.js'), 'utf8');
    const functionsIndex = fs.readFileSync(path.resolve(repoRoot, 'functions/index.js'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE CREDENTIAL SETUP KIT');
      expect(source).toContain('COPY CREDENTIAL SETUP KIT');
      expect(source).toContain('CHECK VALIDATION READINESS');
      expect(source).toContain('App Store Connect');
      expect(source).toContain('Play Console');
      expect(source).toContain('Firebase Functions');
      expect(source).toContain('verifyPurchase');
      expect(source).toContain('Firestore entitlements');
    });
    [webPurchaseService, functionsIndex, iosUserProfile, androidApp].forEach((source) => {
      expect(source).toContain('getPurchaseValidationReadiness');
    });
    expect(functionsIndex).toContain('validationConfigured');
    expect(fs.readFileSync(path.resolve(repoRoot, 'functions/purchaseEntitlements.js'), 'utf8')).toContain('validation_configured');
    [webProfile, functionsIndex, iosUserProfile, androidApp].forEach((source) => {
      expect(source).toContain('No entitlements were changed');
    });
  });

  it('keeps Support Refund Readiness Kit wired without refund or entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT REFUND READINESS KIT');
      expect(source).toContain('COPY SUPPORT KIT');
      expect(source).toContain('supportRefundReadinessCopy');
      expect(source).toContain('restore purchases');
      expect(source).toContain('marketplace refunds');
      expect(source).toContain('missing entitlements');
      expect(source).toContain('support-readiness brief');
      expect(source).toContain('Do not process refunds in-app');
      expect(source).toContain('override App Store or Play refund policy');
      expect(source).toContain('write entitlements manually');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('promote paid access as live');
    });
  });

  it('keeps Paid Launch Decision Gate wired without payment or entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PAID LAUNCH DECISION GATE');
      expect(source).toContain('COPY LAUNCH DECISION');
      expect(source).toContain('paidLaunchDecisionCopy');
      expect(source).toContain('HOLD FOR STORE TESTS');
      expect(source).toContain('Product IDs in code');
      expect(source).toContain('Receipt-validation credentials confirmed');
      expect(source).toContain('Store test evidence recorded');
      expect(source).toContain('Store test evidence:');
      expect(source).toContain('storeTestEvidence');
      expect(source).toContain('Entitlement QA passed');
      expect(source).toContain('decision-support brief');
      expect(source).toContain('Do not flip paid access live');
      expect(source).toContain('write entitlements');
      expect(source).toContain('process payments');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('announce launch readiness');
    });
  });

  it('keeps Sandbox Purchase Test Plan wired without live charge or entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SANDBOX PURCHASE TEST PLAN');
      expect(source).toContain('COPY SANDBOX TEST PLAN');
      expect(source).toContain('sandboxPurchaseTestPlanCopy');
      expect(source).toContain('App Store sandbox');
      expect(source).toContain('Play license test');
      expect(source).toContain('restore');
      expect(source).toContain('verifyPurchase');
      expect(source).toContain('Firestore entitlement QA');
      expect(source).toContain('Negative QA');
      expect(source).toContain('manual sandbox QA plan only');
      expect(source).toContain('Do not run live charges');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('unlock entitlements from profile UI');
      expect(source).toContain('write fake purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('claim paid access is live');
    });
  });

  it('keeps Store Listing Copy Kit wired without paid-live or policy side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE LISTING COPY KIT');
      expect(source).toContain('COPY STORE LISTING');
      expect(source).toContain('storeListingCopy');
      expect(source).toContain('Fitness challenges, streaks, and accountability');
      expect(source).toContain('free challenge loop');
      expect(source).toContain('store-backed experiences');
      expect(source).toContain('store-listing planning copy');
      expect(source).toContain('Do not claim paid access is live');
      expect(source).toContain('advertise unconfigured prices');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('mention refunds outside marketplace policy');
      expect(source).toContain('unlock entitlements');
      expect(source).toContain('submit store copy that conflicts');
    });
  });

  it('keeps Store Review Submission Kit wired without reviewer or entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW SUBMISSION KIT');
      expect(source).toContain('COPY REVIEW NOTES');
      expect(source).toContain('storeReviewSubmissionCopy');
      expect(source).toContain('Reviewer notes and permission checklist');
      expect(source).toContain('Demo account checklist');
      expect(source).toContain('Permission explanations');
      expect(source).toContain('HealthKit on iOS and Health Connect on Android');
      expect(source).toContain('privacy policy, terms, and account/data deletion');
      expect(source).toContain('store-review planning copy');
      expect(source).toContain('Do not submit inaccurate permission claims');
      expect(source).toContain('provide personal user data in reviewer notes');
      expect(source).toContain('bypass marketplace purchase review');
      expect(source).toContain('claim medical or guaranteed fitness outcomes');
      expect(source).toContain('unlock paid access from client code');
      expect(source).toContain('mark the app ready for review');
    });
  });

  it('keeps Store Review Evidence Pack copy-only across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW EVIDENCE PACK');
      expect(source).toContain('COPY REVIEW EVIDENCE PACK');
      expect(source).toContain('storeReviewEvidencePackCopy');
      expect(source).toContain('Reviewer proof package from release checks');
      expect(source).toContain('Store test evidence:');
      expect(source).toContain('Policy and support links');
      expect(source).toContain('HealthKit / Health Connect explanations');
      expect(source).toContain('sandbox/license-test evidence status');
      expect(source).toContain('This is a reviewer evidence pack only');
      expect(source).toContain('Do not submit store review');
      expect(source).toContain('expose personal user data');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('mark paid access live');
      expect(source).toContain('claim review readiness');
    });
  });

  it('keeps policy and support links hosted and visible across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const privacyPage = fs.readFileSync(path.resolve(repoRoot, 'public/privacy.html'), 'utf8');
    const termsPage = fs.readFileSync(path.resolve(repoRoot, 'public/terms.html'), 'utf8');
    const supportPage = fs.readFileSync(path.resolve(repoRoot, 'public/support.html'), 'utf8');
    const deletionPage = fs.readFileSync(path.resolve(repoRoot, 'public/data-deletion.html'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('POLICY & SUPPORT');
      expect(source).toContain('Privacy Policy');
      expect(source).toContain('Terms of Use');
      expect(source).toContain('Support');
      expect(source).toContain('Data Deletion');
      expect(source).toContain('https://risewiththetribe.app/privacy.html');
      expect(source).toContain('https://risewiththetribe.app/terms.html');
      expect(source).toContain('https://risewiththetribe.app/support.html');
      expect(source).toContain('https://risewiththetribe.app/data-deletion.html');
      expect(source).toContain('account/data deletion resources');
    });
    expect(privacyPage).toContain('Privacy Policy');
    expect(privacyPage).toContain('We do not sell personal data');
    expect(termsPage).toContain('Terms of Use');
    expect(termsPage).toContain('not medical advice');
    expect(supportPage).toContain('support@risewiththetribe.app');
    expect(supportPage).toContain('Refund requests must follow the App Store or Google Play marketplace process');
    expect(deletionPage).toContain('Account and Data Deletion');
    expect(deletionPage).toContain('Data deletion request');
  });

  it('keeps Data Safety Disclosure Kit wired without privacy-label side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('DATA SAFETY DISCLOSURE KIT');
      expect(source).toContain('COPY DATA SAFETY');
      expect(source).toContain('dataSafetyDisclosureCopy');
      expect(source).toContain('App Privacy and Play Data Safety draft');
      expect(source).toContain('Firebase Authentication user id');
      expect(source).toContain('profile photo/avatar');
      expect(source).toContain('optional HealthKit / Health Connect imports');
      expect(source).toContain('feature-submission story and media');
      expect(source).toContain('purchase verification payload metadata');
      expect(source).toContain('does not sell personal data');
      expect(source).toContain('does not use random ad tracking');
      expect(source).toContain('data-safety planning copy');
      expect(source).toContain('Do not submit store privacy labels');
      expect(source).toContain('hide optional health/media collection');
      expect(source).toContain('claim third-party ad tracking exists');
      expect(source).toContain('omit purchase verification data');
    });
  });

  it('keeps account deletion request flow wired across platforms without destructive side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ACCOUNT DELETION REQUEST');
      expect(source).toContain('REQUEST ACCOUNT DELETION');
      expect(source).toContain('Deletion request recorded');
      expect(source).toContain('does not immediately delete your account');
      expect(source).toContain('marketplace refund policy');
      expect(source).toContain('ACCOUNT DELETION REVIEW QUEUE');
      expect(source).toContain('Admin-only support queue');
      expect(source).toContain('backend deletion work');
      expect(source).toContain('Manual account deletion review note');
      expect(source).toContain('VERIFIED');
      expect(source).toContain('CONTACTED');
      expect(source).toContain('BLOCKED');
      expect(source).toContain('CLOSED');
      expect(source).toContain('does not delete the account');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('accountDeletionRequests');
      expect(source).toContain('accountDeletionRequest');
      expect(source).toContain('status');
      expect(source).toContain('requested');
      expect(source).toContain('reviewAccountDeletionRequest');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('contacted');
      expect(source).toContain('verified');
      expect(source).toContain('blocked');
      expect(source).toContain('closed');
    });
    [iosUserProfile, androidModels].forEach((source) => {
      expect(source).toContain('AccountDeletionRequestStatus');
      expect(source).toContain('accountDeletionRequest');
    });
    expect(webProfile).toContain('requestAccountDeletion');
    expect(webProfile).toContain('getAccountDeletionReviewQueue');
    expect(webProfile).toContain('handleAccountDeletionReview');
    expect(iosProfile).toContain('submitAccountDeletionRequest');
    expect(iosProfile).toContain('submitAccountDeletionReview');
    expect(iosProfile).toContain('accountDeletionReviewQueue');
    expect(iosChallengeService).toContain('getAccountDeletionReviewQueue');
    expect(androidViewModel).toContain('requestAccountDeletion');
    expect(androidViewModel).toContain('reviewAccountDeletionRequest');
    expect(androidViewModel).toContain('accountDeletionReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.uid == request.auth.uid');
    expect(firestoreRules).toContain('affectedKeys().hasOnly(["accountDeletionRequest"])');
  });

  it('keeps support request flow wired across platforms without refund or entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT REQUEST');
      expect(source).toContain('SEND SUPPORT REQUEST');
      expect(source).toContain('supportRequests');
      expect(source).toContain('does not process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('change entitlements');
      expect(source).toContain('SUPPORT REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('do not resolve refunds');
      expect(source).toContain('Manual support review note');
      expect(source).toContain('WAIT');
      expect(source).toContain('RESOLVE');
      expect(source).toContain('CLOSE');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('supportRequests');
      expect(source).toContain('reviewSupportRequest');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('status');
      expect(source).toContain('open');
      expect(source).toContain('waiting');
      expect(source).toContain('resolved');
      expect(source).toContain('closed');
      expect(source).toContain('category');
      expect(source).toContain('message');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('SupportRequest');
    });
    expect(webProfile).toContain('submitSupportRequest');
    expect(webProfile).toContain('getSupportReviewQueue');
    expect(iosProfile).toContain('sendSupportRequest');
    expect(iosChallengeService).toContain('getSupportReviewQueue');
    expect(androidViewModel).toContain('submitSupportRequest');
    expect(androidViewModel).toContain('supportReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.status == "open"');
  });

  it('keeps referral reward claim flow wired across platforms without granting rewards client-side', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('REFERRAL REWARD CLAIM');
      expect(source).toContain('CLAIM REFERRAL REWARD');
      expect(source).toContain('referralRewardClaims');
      expect(source).toContain('request-only');
      expect(source).toContain('does not grant Pro');
      expect(source).toContain('entitlements');
      expect(source).toContain('discounts');
      expect(source).toContain('payouts');
      expect(source).toContain('REFERRAL REWARD REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('meaningful challenge joins');
      expect(source).toContain('Manual referral reward review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('referralRewardClaims');
      expect(source).toContain('reviewReferralRewardClaim');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('tierTarget');
      expect(source).toContain('referralJoins');
      expect(source).toContain('status');
      expect(source).toContain('open');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('ReferralRewardClaim');
      expect(source).toContain('reviewNote');
    });
    expect(webProfile).toContain('claimReferralReward');
    expect(webProfile).toContain('getReferralRewardReviewQueue');
    expect(webProfile).toContain('handleReferralRewardClaimReview');
    expect(iosProfile).toContain('submitReferralRewardClaim');
    expect(iosProfile).toContain('submitReferralRewardClaimReview');
    expect(iosChallengeService).toContain('getReferralRewardReviewQueue');
    expect(androidViewModel).toContain('claimReferralReward');
    expect(androidViewModel).toContain('reviewReferralRewardClaim');
    expect(androidViewModel).toContain('referralRewardReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.referralJoins >= request.resource.data.tierTarget');
  });

  it('keeps Launch Experiment Kit wired across admin and creator profile surfaces', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAUNCH EXPERIMENT KIT');
      expect(source).toContain('COPY EXPERIMENT BRIEF');
      expect(source).toContain('Pro Trial CTA');
      expect(source).toContain('Pack Drop Tease');
      expect(source).toContain('Referral Sprint');
      expect(source).toContain('Partner Perk Poll');
      expect(source).toContain('manual Instagram/app experiment');
      expect(source).toContain('do not add tracking pixels');
      expect(source).toContain('do not promote paid access as live');
    });
  });

  it('keeps Launch Experiment Scorecard wired across admin and creator profile surfaces', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAUNCH EXPERIMENT SCORECARD');
      expect(source).toContain('COPY EXPERIMENT SCORECARD');
      expect(source).toContain('First-party signal readout for the next test');
      expect(source).toContain('Demand signal');
      expect(source).toContain('Campaign reach');
      expect(source).toContain('Community loop');
      expect(source).toContain('manual planning score');
      expect(source).toContain('does not add tracking pixels');
      expect(source).toContain('does not grant or imply paid access');
    });
  });

  it('keeps Release QA Checklist wired across admin and creator profile surfaces', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('RELEASE QA CHECKLIST');
      expect(source).toContain('COPY RELEASE QA CHECKLIST');
      expect(source).toContain('Manual cross-platform guardrails before launch');
      expect(source).toContain('PRODUCT IDS');
      expect(source).toContain('STORE TESTS');
      expect(source).toContain('ENTITLEMENTS');
      expect(source).toContain('SOCIAL SHARE');
      expect(source).toContain('receipt-validation credentials');
      expect(source).toContain('feature parity docs');
      expect(source).toContain('Web, iOS, and Android');
    });
  });

  it('keeps Entitlement Recovery Request wired across platforms without purchase side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('entitlementRecoveryRequests');
      expect(source).toContain('restore_sync_failed');
      expect(source).toContain('activePackCount');
      expect(source).toContain('open');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('waiting');
      expect(source).toContain('resolved');
      expect(source).toContain('closed');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('entitlementRecoveryRequests');
      expect(source).toContain('restore_sync_failed');
      expect(source).toContain('activePackCount');
      expect(source).toContain('open');
      expect(source).toContain('reviewNote');
      expect(source).toContain('waiting');
      expect(source).toContain('resolved');
      expect(source).toContain('closed');
    });
    expect(androidModels).toContain('EntitlementRecoveryRequest');
    expect(androidModels).toContain('activePackCount');
    expect(androidModels).toContain('restore_sync_failed');
    expect(androidModels).toContain('reviewNote');
    expect(androidViewModel).toContain('submitEntitlementRecoveryRequest');
    expect(androidViewModel).toContain('reviewEntitlementRecoveryRequest');
    expect(androidViewModel).toContain('entitlementRecoveryReviewQueue');
    expect(androidViewModel).toContain('activePackCount');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ENTITLEMENT RECOVERY REVIEW QUEUE');
      expect(source).toContain('Request entitlement review');
      expect(source).toContain('manual review');
      expect(source).toContain('Manual entitlement recovery review note');
      expect(source).toContain('WAIT');
      expect(source).toContain('RESOLVE');
      expect(source).toContain('CLOSE');
      expect(source).toContain('do not write entitlements');
      expect(source).toContain('process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('create purchases');
      expect(source).toContain('bypass marketplace policy');
    });
    expect(webUserService).toContain('requestEntitlementRecovery');
    expect(webUserService).toContain('reviewEntitlementRecoveryRequest');
    expect(iosChallengeService).toContain('submitEntitlementRecoveryRequest');
    expect(iosChallengeService).toContain('reviewEntitlementRecoveryRequest');
    expect(androidRepository).toContain('submitEntitlementRecoveryRequest');
  });

  it('keeps Store Test Purchase Evidence Log admin-only without entitlement side effects', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('storeTestPurchaseEvidence');
      expect(source).toContain('sandbox_purchase');
      expect(source).toContain('restore_sync');
      expect(source).toContain('needs_review');
      expect(source).toContain('recorded');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('verified');
      expect(source).toContain('archived');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('storeTestPurchaseEvidence');
      expect(source).toContain('sandbox_purchase');
      expect(source).toContain('restore_sync');
      expect(source).toContain('needs_review');
      expect(source).toContain('recorded');
      expect(source).toContain('reviewNote');
      expect(source).toContain('verified');
      expect(source).toContain('archived');
    });
    [androidModels, androidViewModel].forEach((source) => {
      expect(source).toContain('StoreTestPurchaseEvidence');
      expect(source).toContain('reviewNote');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE TEST PURCHASE EVIDENCE LOG');
      expect(source).toContain('Sandbox and license-test proof before paid launch');
      expect(source).toContain('Manual store test evidence review note');
      expect(source).toContain('VERIFIED');
      expect(source).toContain('NEEDS REVIEW');
      expect(source).toContain('FAILED');
      expect(source).toContain('ARCHIVE');
      expect(source).toContain('must not write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('mark paid access live');
    });
    expect(webUserService).toContain('recordStoreTestPurchaseEvidence');
    expect(webUserService).toContain('reviewStoreTestPurchaseEvidence');
    expect(iosChallengeService).toContain('recordStoreTestPurchaseEvidence');
    expect(iosChallengeService).toContain('reviewStoreTestPurchaseEvidence');
    expect(androidRepository).toContain('recordStoreTestPurchaseEvidence');
    expect(androidRepository).toContain('reviewStoreTestPurchaseEvidence');
    expect(androidViewModel).toContain('reviewStoreTestPurchaseEvidence');
  });

  it('keeps Feature Submission Review Notes wired across platforms without auto-posting', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webUserService = fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Manual feature submission review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('FEATURED');
      expect(source).toContain('DECLINE');
      expect(source).toContain('Manual UGC/content review only');
      expect(source).toContain('do not auto-post');
      expect(source).toContain('override consent');
      expect(source).toContain('share unreviewed submissions');
    });
    [webUserService, iosChallengeService, androidRepository].forEach((source) => {
      expect(source).toContain('reviewFeatureSubmission');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('featured');
      expect(source).toContain('declined');
    });
    expect(androidModels).toContain('FeatureSubmission');
    expect(androidModels).toContain('reviewNote');
    expect(androidModels).toContain('reviewedBy');
    expect(androidModels).toContain('reviewedAt');
    expect(androidModels).toContain('featured');
    expect(androidViewModel).toContain('reviewFeatureSubmission');
    expect(androidViewModel).toContain('reviewNote');
    expect(firestoreRules).toContain('match /featureSubmissions/{submissionId}');
    expect(firestoreRules).toContain('consentToFeature == true');
    expect(firestoreRules).toContain('resource.data.status == "featured"');
    expect(firestoreRules).toContain('["pending", "approved", "featured", "declined"]');
  });

  it('keeps Subscription Management Guidance Kit marketplace-first across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUBSCRIPTION MANAGEMENT GUIDANCE KIT');
      expect(source).toContain('COPY SUBSCRIPTION GUIDANCE');
      expect(source).toContain('subscriptionManagementGuidanceCopy');
      expect(source).toContain('App Store and Play cancellation/support boundaries');
      expect(source).toContain('MARKETPLACE FIRST');
      expect(source).toContain('Apple ID subscriptions');
      expect(source).toContain('Google Play subscriptions');
      expect(source).toContain('Restore/sync in the app');
      expect(source).toContain('Do not cancel subscriptions in-app');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass App Store or Play policy');
    });
  });

  it('keeps Billing Support Escalation Kit marketplace-first across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('BILLING SUPPORT ESCALATION KIT');
      expect(source).toContain('COPY BILLING ESCALATION');
      expect(source).toContain('billingSupportEscalationCopy');
      expect(source).toContain('Wrong-account, renewal, charge, and entitlement triage');
      expect(source).toContain('failed renewal');
      expect(source).toContain('duplicate charge');
      expect(source).toContain('missing-entitlement cases');
      expect(source).toContain('Confirm the member is signed into the same Apple ID or Google Play account');
      expect(source).toContain('Route refund, cancellation, duplicate charge, chargeback, and payment-failure questions to marketplace support');
      expect(source).toContain('Do not cancel subscriptions in-app');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('override marketplace decisions');
      expect(source).toContain('collect payment details');
    });
  });

  it('keeps Renewal Recovery Kit restore-first across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('RENEWAL RECOVERY KIT');
      expect(source).toContain('COPY RENEWAL RECOVERY');
      expect(source).toContain('renewalRecoveryCopy');
      expect(source).toContain('Failed-renewal and lapsed-access support copy');
      expect(source).toContain('RESTORE FIRST');
      expect(source).toContain('grace period');
      expect(source).toContain('App Store or Google Play renewal/payment status');
      expect(source).toContain('restore/sync purchases in the app after marketplace renewal is fixed');
      expect(source).toContain('open entitlement recovery and attach support notes');
      expect(source).toContain('Do not retry charges in-app');
      expect(source).toContain('collect payment details');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('override marketplace renewal status');
    });
  });

  it('keeps Cancellation Feedback Kit learn-only across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CANCELLATION FEEDBACK KIT');
      expect(source).toContain('COPY CANCELLATION FEEDBACK');
      expect(source).toContain('cancellationFeedbackCopy');
      expect(source).toContain('Marketplace-safe churn learning prompts');
      expect(source).toContain('LEARN ONLY');
      expect(source).toContain('without obstructing the marketplace flow');
      expect(source).toContain('without storing payment details or marketplace account data');
      expect(source).toContain('first-party Pro interest');
      expect(source).toContain('Do not block cancellation');
      expect(source).toContain('retry charges in-app');
      expect(source).toContain('collect payment details');
      expect(source).toContain('offer unconfigured discounts');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('override marketplace subscription state');
      expect(source).toContain('pressure the member to stay');
    });
  });

  it('keeps Lapsed Member Winback Kit free-first across platforms', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAPSED MEMBER WINBACK KIT');
      expect(source).toContain('COPY LAPSED WINBACK');
      expect(source).toContain('lapsedMemberWinbackCopy');
      expect(source).toContain('Free comeback challenge and app-first return copy');
      expect(source).toContain('FREE FIRST');
      expect(source).toContain('Lead with a free comeback challenge');
      expect(source).toContain('streak rescue prompts');
      expect(source).toContain('Review first-party re-engagement signals only');
      expect(source).toContain('Do not auto-message users');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('offer unconfigured discounts');
      expect(source).toContain('retry charges');
      expect(source).toContain('collect payment details');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('pressure members to return');
    });
  });

  it('keeps Launch Retrospective Kit wired across admin and creator profile surfaces', () => {
    const webProfile = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAUNCH RETROSPECTIVE KIT');
      expect(source).toContain('COPY RETROSPECTIVE KIT');
      expect(source).toContain('Manual first-party review after a campaign push');
      expect(source).toContain('Experiment reviewed');
      expect(source).toContain('Planning score');
      expect(source).toContain('Referral joins');
      expect(source).toContain('challenge joins');
      expect(source).toContain('feature submissions');
      expect(source).toContain('does not add tracking pixels');
      expect(source).toContain('automated attribution');
      expect(source).toContain('paid-access changes');
    });
  });
});
