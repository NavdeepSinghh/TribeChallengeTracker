const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform creator hosting reply parity source checks', () => {
  it('keeps Creator Hosting Objection Reply Kit wired on all platforms without paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
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

  it('keeps Creator Hosting Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR HOSTING DECISION REPLY KIT');
      expect(source).toContain('COPY CREATOR DECISION REPLIES');
      expect(source).toContain('creatorHostingDecisionReplyCopy');
      expect(source).toContain('Manual admin replies for hosted-review outcomes');
      expect(source).toContain('APPROVED FOR MANUAL FOLLOW-UP');
      expect(source).toContain('WAITING ON READINESS');
      expect(source).toContain('NOT READY YET');
      expect(source).toContain('DECLINED FOR NOW');
      expect(source).toContain('Do not create contracts');
      expect(source).toContain('create payouts');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('grant paid access');
      expect(source).toContain('promise earnings');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('export private member activity');
      expect(source).toContain('pressure creators');
    });
  });
});
