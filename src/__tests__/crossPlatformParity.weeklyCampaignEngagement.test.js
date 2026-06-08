const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign engagement parity source checks', () => {
  it('keeps Weekly Campaign Poll Review Kit wired on all platforms without storage or attribution side effects', () => {
    const webProfile = readWebProfileContracts();
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

});
