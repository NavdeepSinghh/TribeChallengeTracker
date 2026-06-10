const {
  fs,
  path,
  repoRoot,
  webChallengeService,
  webChallengesTab,
  iosChallengeModel,
  iosChallengeService,
  iosChallengeTracker,
  iosProfile,
  iosUserProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');


describe('cross-platform creator hosting parity source checks', () => {
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
      readWebProfileContracts(),
      readWebUserServiceContracts(),
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
      expect(readWebProfileContracts()).toContain(label);
      expect(iosProfile).toContain(label);
      expect(androidApp).toContain(label);
    });
  });

  it('keeps Creator Launch Kit wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR LAUNCH KIT');
      expect(source).toContain('COPY CREATOR LAUNCH COPY');
      expect(source).toContain('Tag @risewiththetribe');
      expect(source).toContain('join=');
      expect(source).toContain('inviteCode');
    });
  });

  it('keeps Creator Branded Page Preview Kit wired on all platforms without page, tracking, or paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR BRANDED PAGE PREVIEW KIT');
      expect(source).toContain('COPY BRANDED PAGE KIT');
      expect(source).toContain('Coach Host page preview before promotion');
      expect(source).toContain('Coach Host block');
      expect(source).toContain('creator specialty, bio, and CTA link');
      expect(source).toContain('challenge name, tagline, rules, and daily prompts');
      expect(source).toContain('Feature Me wins only through the app');
      expect(source).toContain('creator branded page preview kit only');
      expect(source).toContain('Do not create branded page records');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export private member activity');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid hosting is live');
    });
  });

  it('keeps Creator Challenge Template Draft Kit wired on all platforms without template, tracking, or paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR CHALLENGE TEMPLATE DRAFT KIT');
      expect(source).toContain('COPY TEMPLATE DRAFT KIT');
      expect(source).toContain('Reusable hosted challenge template planning');
      expect(source).toContain('Creator template draft checklist');
      expect(source).toContain('challenge promise, audience, duration, rules, daily prompts');
      expect(source).toContain('reusable for free hosted challenges first');
      expect(source).toContain('first-party app joins, logs, referrals, and Feature Me submissions');
      expect(source).toContain('no medical claims, no guaranteed outcomes');
      expect(source).toContain('creator hosting review before discussing creator terms or payouts');
      expect(source).toContain('creator challenge template draft kit only');
      expect(source).toContain('Do not create template records');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('create partner links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export private member activity');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid hosting is live');
    });
  });

  it('keeps reviewable Creator Challenge Template Draft records wired on all platforms without publishing or paid side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserServices = readWebUserServiceContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR TEMPLATE DRAFT RECORD');
      expect(source).toContain('SAVE TEMPLATE DRAFT FOR REVIEW');
      expect(source).toContain('creatorChallengeTemplateDrafts');
      expect(source).toContain('manual admin review');
      expect(source).toContain('does not publish templates');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('expose private member activity');
      expect(source).toContain('CREATOR TEMPLATE DRAFT REVIEW QUEUE');
    });
    [webUserServices, iosChallengeService, androidRepository].forEach((source) => {
      expect(source).toContain('creatorChallengeTemplateDrafts');
      expect(source).toContain('submitCreatorChallengeTemplateDraft');
      expect(source).toContain('getCreatorChallengeTemplateDraftReviewQueue');
      expect(source).toContain('reviewCreatorChallengeTemplateDraft');
      expect(source).toContain('candidateChallengeName');
      expect(source).toContain('activeHostedCount');
      expect(source).toContain('revenueReadyCount');
      expect(source).toContain('status');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('updatedAt');
    });
  });

  it('keeps published Creator Challenge Template catalog wired on all platforms without paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserServices = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PUBLISHED CREATOR TEMPLATE CATALOG');
      expect(source).toContain('creatorChallengeTemplates');
      expect(source).toContain('free-first');
      expect(source).toContain('do not create contracts');
      expect(source).toContain('payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('tracking');
      expect(source).toContain('paid-hosting claims');
    });
    [webUserServices, iosChallengeService, androidRepository].forEach((source) => {
      expect(source).toContain('creatorChallengeTemplates');
      expect(source).toContain('getPublishedCreatorChallengeTemplates');
      expect(source).toContain('published');
      expect(source).toContain('isPublic');
      expect(source).toContain('isPremium');
      expect(source).toContain('source');
      expect(source).toContain('creator_template_draft');
      expect(source).toContain('publishedAt');
      expect(source).toContain('publishedBy');
    });
    expect(firestoreRules).toContain('match /creatorChallengeTemplateDrafts/{draftId}');
    expect(firestoreRules).toContain('match /creatorChallengeTemplates/{templateId}');
    expect(firestoreRules).toContain('request.resource.data.isPremium == false');
    expect(firestoreRules).toContain('["open", "approved", "published", "waiting", "not_ready", "declined"]');
  });

  it('lets published Creator Challenge Templates feed the create picker without paid-hosting side effects', () => {
    const iosCreateChallenge = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreateChallengeView.swift'), 'utf8');
    const androidModelsAndCreate = `${androidModels}\n${androidApp}`;

    [webChallengesTab, iosCreateChallenge, androidModelsAndCreate].forEach((source) => {
      expect(source).toContain('PUBLISHED CREATOR TEMPLATES');
      expect(source).toContain('creatorChallengeTemplates');
      expect(source).toContain('FREE-FIRST');
      expect(source).toContain('REVIEWED TEMPLATE');
      expect(source).toContain('No paid hosting, revenue-share, or partner tracking is attached');
    });
    [webChallengeService, iosChallengeModel, iosChallengeService, androidModels, androidRepository].forEach((source) => {
      expect(source).toContain('templateSource');
      expect(source).toContain('creatorTemplateId');
      expect(source).toContain('creatorTemplateDraftId');
      expect(source).toContain('creatorTemplateOwnerUid');
      expect(source).toContain('creatorTemplateOwnerName');
    });
    [webChallengesTab, iosCreateChallenge, androidModelsAndCreate].forEach((source) => {
      expect(source).toContain('isPremium');
      expect(source).toContain('false');
    });
  });

  it('keeps Creator Leaderboard Preview Kit wired on all platforms without records, private exports, or paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR LEADERBOARD PREVIEW KIT');
      expect(source).toContain('COPY LEADERBOARD PREVIEW KIT');
      expect(source).toContain('First-party creator ranking readiness');
      expect(source).toContain('Leaderboard preview checklist');
      expect(source).toContain('first-party hosted challenge movement');
      expect(source).toContain('active members, logged sessions, challenge points, referrals');
      expect(source).toContain('consent-cleared Feature Me submissions');
      expect(source).toContain('aggregate-first');
      expect(source).toContain('member disputes, privacy concerns, and safety flags');
      expect(source).toContain('creator leaderboard preview kit only');
      expect(source).toContain('Do not create leaderboard records');
      expect(source).toContain('expose private member activity');
      expect(source).toContain('export per-user logs');
      expect(source).toContain('create contracts');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('create payouts');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid hosting is live');
    });
  });

  it('keeps reviewable Creator Leaderboard Snapshots aggregate-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR LEADERBOARD SNAPSHOT');
      expect(source).toContain('SAVE SNAPSHOT FOR REVIEW');
      expect(source).toContain('aggregate hosted-challenge movement');
      expect(source).toContain('member identities');
      expect(source).toContain('per-user logs');
      expect(source).toContain('paid-hosting claims');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR LEADERBOARD SNAPSHOT REVIEW QUEUE');
      expect(source).toContain('PUBLISHED CREATOR LEADERBOARD SNAPSHOTS');
      expect(source).toContain('creatorLeaderboardSnapshots');
      expect(source).toContain('PUBLISH');
      expect(source).toContain('NOT READY');
    });
    [webUserService, iosChallengeService, androidModels, androidRepository].forEach((source) => {
      expect(source).toContain('CreatorLeaderboardSnapshot');
      expect(source).toContain('hostedChallengeCount');
      expect(source).toContain('activeHostedChallengeCount');
      expect(source).toContain('memberReach');
      expect(source).toContain('aggregatePoints');
      expect(source).toContain('topChallengeAggregatePoints');
      expect(source).toContain('isPublic');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('creatorLeaderboardSnapshots');
      expect(source).toContain('published');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    expect(firestoreRules).toContain('match /creatorLeaderboardSnapshots/{snapshotId}');
    expect(firestoreRules).toContain('request.resource.data.isPublic == false');
    expect(firestoreRules).toContain('request.resource.data.keys().hasAll(["uid", "hostedChallengeCount", "memberReach", "aggregatePoints", "topChallengeName", "status", "isPublic"])');
  });

  it('keeps Private Creator Invite Kit wired on all platforms without invite or paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRIVATE CREATOR INVITE KIT');
      expect(source).toContain('COPY PRIVATE INVITE KIT');
      expect(source).toContain('Private challenge links before paid hosting');
      expect(source).toContain('private Pro Coach Mode challenge');
      expect(source).toContain('use the app invite link only');
      expect(source).toContain('first-party challenge joins');
      expect(source).toContain('creator hosting review');
      expect(source).toContain('private creator invite kit only');
      expect(source).toContain('Do not auto-message');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('count link opens');
      expect(source).toContain('export private member activity');
      expect(source).toContain('create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('grant paid access');
      expect(source).toContain('promise earnings');
      expect(source).toContain('imply paid hosting is live');
    });
  });

  it('keeps Creator Hosting Application review wired across platforms without paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
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
});
