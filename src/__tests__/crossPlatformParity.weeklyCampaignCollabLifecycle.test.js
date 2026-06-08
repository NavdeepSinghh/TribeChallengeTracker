const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign collab lifecycle parity source checks', () => {
  it('keeps Weekly Campaign Collab Recap Kit wired on all platforms without attribution, payout, or privacy side effects', () => {
    const webProfile = readWebProfileContracts();
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
    const webProfile = readWebProfileContracts();
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

  it('keeps Weekly Campaign collab and retention cards decomposed through shared copy-card renderers', () => {
    const webProfile = readWebProfileContracts();

    expect(webProfile).toContain('weeklyCampaignCollabCopyCards');
    expect(webProfile).toContain('weeklyCampaignCollabCopyCards.map');
    expect(webProfile).toContain('WeeklyCampaignCopyKitCard key={card.title}');

    expect(iosProfile).toContain('weeklyCampaignCollabCopyKitsSection');
    expect(iosProfile).toContain('WeeklyCampaignCopyKitCard(');

    expect(androidApp).toContain('WeeklyCampaignCopyKit(');
    expect(androidApp).toContain('WeeklyCampaignCopyKitCard(');
  });
});
