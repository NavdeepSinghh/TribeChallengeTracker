const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign follow-up parity source checks', () => {
  it('keeps Weekly Campaign Retention Follow-Up Kit wired on all platforms without messaging, attribution, or purchase side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Retention Follow-Up Kit');
      expect(source).toContain('COPY RETENTION FOLLOW-UP');
      expect(source).toContain('weeklyCampaignRetentionFollowUpCopy');
      expect(source).toContain('WeeklyCampaignCopyKitCard');
      expect(source).toContain('Manual follow-up lanes');
      expect(source).toContain('Active members');
      expect(source).toContain('Comeback members');
      expect(source).toContain('Feature-ready members');
      expect(source).toContain('Support-risk members');
      expect(source).toContain('Use first-party app movement only');
      expect(source).toContain('saved Pro interest');
      expect(source).toContain('saved creator interest');
      expect(source).toContain('saved partner interest');
      expect(source).toContain('Do not auto-message users');
      expect(source).toContain('scrape posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('offer discounts');
      expect(source).toContain('collect payment details');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('imply paid access is live');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure members');
    });
  });

  it('keeps Weekly Campaign Re-Invite Kit wired on all platforms without referral, messaging, or purchase side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Re-Invite Kit');
      expect(source).toContain('COPY RE-INVITE KIT');
      expect(source).toContain('weeklyCampaignReInviteCopy');
      expect(source).toContain('WeeklyCampaignCopyKitCard');
      expect(source).toContain('Manual re-invite lanes');
      expect(source).toContain('Active finishers');
      expect(source).toContain('Comeback members');
      expect(source).toContain('Feature-ready members');
      expect(source).toContain('Referral-curious members');
      expect(source).toContain('Support-risk members');
      expect(source).toContain('meaningful challenge joins count');
      expect(source).toContain('Use first-party app movement only');
      expect(source).toContain('Do not auto-message users');
      expect(source).toContain('count link opens');
      expect(source).toContain('grant rewards');
      expect(source).toContain('write referral state');
      expect(source).toContain('create payouts');
      expect(source).toContain('create affiliate rewards');
      expect(source).toContain('unlock entitlements');
      expect(source).toContain('offer discounts');
      expect(source).toContain('collect payment details');
      expect(source).toContain('create purchases');
      expect(source).toContain('scrape posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('imply paid access is live');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure members');
    });
  });
});
