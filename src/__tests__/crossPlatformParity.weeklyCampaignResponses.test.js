const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign response parity source checks', () => {
  it('keeps Instagram DM Keyword Kit wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
});
