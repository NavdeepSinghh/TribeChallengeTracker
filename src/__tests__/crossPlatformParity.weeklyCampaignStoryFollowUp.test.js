const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign story follow-up parity source checks', () => {
  it('keeps Weekly Campaign Midweek Check-In Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
});
