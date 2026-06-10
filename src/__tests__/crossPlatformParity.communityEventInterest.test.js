const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  iosUserProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform community event interest parity source checks', () => {
  it('keeps Community Event Interest Kit wired on all platforms without ticket, merch, venue, payment, or tracking side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('COMMUNITY EVENT INTEREST KIT');
      expect(source).toContain('COMMUNITY EVENT INTEREST');
      expect(source).toContain('COPY EVENT INTEREST KIT');
      expect(source).toContain('communityEventInterestCopy');
      expect(source).toContain('Local meetup, merch, and finisher-moment validation');
      expect(source).toContain('first-party app signals');
      expect(source).toContain('Do not sell tickets');
      expect(source).toContain('collect payments');
      expect(source).toContain('create orders');
      expect(source).toContain('promise merch');
      expect(source).toContain('book venues');
      expect(source).toContain('create partner links');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('export private member data');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('scrape DMs');
    });
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
      expect(source).toContain('communityEventInterest');
      expect(source).toContain('local_meetup');
      expect(source).toContain('milestone_merch');
      expect(source).toContain('studio_popup');
      expect(source).toContain('finisher_moment');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('First-party event demand, no commerce');
      expect(source).toContain('TAP TO SAVE');
      expect(source).toContain('DEMAND');
    });
  });

  it('keeps Community Event Review Records wired on all platforms as manual evidence only', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('COMMUNITY EVENT REVIEW RECORD');
      expect(source).toContain('SAVE COMMUNITY EVENT REVIEW');
      expect(source).toContain('COMMUNITY EVENT REVIEW QUEUE');
      expect(source).toContain('APPROVED COMMUNITY EVENT REVIEWS');
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('createsTickets');
      expect(source).toContain('createsOrders');
      expect(source).toContain('collectsPayments');
      expect(source).toContain('booksVenues');
      expect(source).toContain('promisesMerch');
      expect(source).toContain('createsPartnerLinks');
      expect(source).toContain('createsPayouts');
      expect(source).toContain('writesEntitlements');
    });

    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('communityEventReviews');
    });

    [
      webUserService,
      iosChallengeService,
      androidRepository,
      androidModels,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('createsTickets');
      expect(source).toContain('createsOrders');
      expect(source).toContain('collectsPayments');
      expect(source).toContain('booksVenues');
      expect(source).toContain('promisesMerch');
      expect(source).toContain('createsPartnerLinks');
      expect(source).toContain('createsPayouts');
      expect(source).toContain('writesEntitlements');
    });

    expect(firestoreRules).toContain('match /communityEventReviews/{reviewId}');
  });

  it('keeps Community Event Review Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('COMMUNITY EVENT REVIEW DECISION REPLY KIT');
      expect(source).toContain('COPY EVENT REVIEW DECISION REPLIES');
      expect(source).toContain('communityEventReviewDecisionReplyCopy');
      expect(source).toContain('Community Event Review Decision Reply Kit');
      expect(source).toContain('APPROVED FOR EVENT LEARNING');
      expect(source).toContain('WAITING ON EVENT READINESS');
      expect(source).toContain('NOT READY FOR EVENT HANDOFF');
      expect(source).toContain('DECLINED FOR EVENT HANDOFF');
      expect(source).toContain('Do not sell tickets');
      expect(source).toContain('collect payments');
      expect(source).toContain('create orders');
      expect(source).toContain('promise merch');
      expect(source).toContain('book venues');
      expect(source).toContain('create partner links');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('export private member data');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('auto-message users');
      expect(source).toContain('pressure members');
    });
  });
});
