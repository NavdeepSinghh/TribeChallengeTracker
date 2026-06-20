const {
  fs,
  path,
  repoRoot,
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform store policy parity source checks', () => {
  it('keeps policy and support links hosted and visible across platforms', () => {
    const webProfile = readWebProfileContracts();
    const privacyPage = fs.readFileSync(path.resolve(repoRoot, 'public/privacy.html'), 'utf8');
    const termsPage = fs.readFileSync(path.resolve(repoRoot, 'public/terms.html'), 'utf8');
    const supportPage = fs.readFileSync(path.resolve(repoRoot, 'public/support.html'), 'utf8');
    const deletionPage = fs.readFileSync(path.resolve(repoRoot, 'public/data-deletion.html'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('POLICY & SUPPORT');
      expect(source).toContain('Privacy Policy');
      expect(source).toContain('Terms of Use');
      expect(source).toContain('Support');
      expect(source).toContain('Data Deletion');
      expect(source).toContain('https://tribechallengetracker.web.app/privacy.html');
      expect(source).toContain('https://tribechallengetracker.web.app/terms.html');
      expect(source).toContain('https://tribechallengetracker.web.app/support.html');
      expect(source).toContain('https://tribechallengetracker.web.app/data-deletion.html');
      expect(source).toContain('account/data deletion resources');
    });
    expect(privacyPage).toContain('Privacy Policy');
    expect(privacyPage).toContain('We do not sell personal data');
    expect(termsPage).toContain('Terms of Use');
    expect(termsPage).toContain('not medical advice');
    expect(supportPage).toContain('support@risewiththetribe.app');
    expect(supportPage).toContain('Refund requests must follow the App Store or Google Play marketplace process');
    expect(deletionPage).toContain('Account and Data Deletion');
    expect(deletionPage).toContain('Data deletion request');
  });

  it('keeps Data Safety Disclosure Kit wired without privacy-label side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('DATA SAFETY DISCLOSURE KIT');
      expect(source).toContain('COPY DATA SAFETY');
      expect(source).toContain('dataSafetyDisclosureCopy');
      expect(source).toContain('App Privacy and Play Data Safety draft');
      expect(source).toContain('Firebase Authentication user id');
      expect(source).toContain('profile photo/avatar');
      expect(source).toContain('optional HealthKit / Health Connect imports');
      expect(source).toContain('feature-submission story and media');
      expect(source).toContain('purchase verification payload metadata');
      expect(source).toContain('does not sell personal data');
      expect(source).toContain('does not use random ad tracking');
      expect(source).toContain('data-safety planning copy');
      expect(source).toContain('Do not submit store privacy labels');
      expect(source).toContain('hide optional health/media collection');
      expect(source).toContain('claim third-party ad tracking exists');
      expect(source).toContain('omit purchase verification data');
    });
  });
});
