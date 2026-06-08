const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign collab parity source checks', () => {
  it('keeps Weekly Campaign Collab Invite Kit wired on all platforms without messaging, payout, or contract side effects', () => {
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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
});
