const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign recap story parity source checks', () => {
  it('keeps Weekly Campaign Completion Recap Story Kit wired on all platforms without scraping, attribution, or consent side effects', () => {
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
});
