const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform entitlement recovery review parity source checks', () => {
  it('keeps Entitlement Recovery Request wired across platforms without purchase side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('entitlementRecoveryRequests');
      expect(source).toContain('restore_sync_failed');
      expect(source).toContain('activePackCount');
      expect(source).toContain('open');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('waiting');
      expect(source).toContain('resolved');
      expect(source).toContain('closed');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('entitlementRecoveryRequests');
      expect(source).toContain('restore_sync_failed');
      expect(source).toContain('activePackCount');
      expect(source).toContain('open');
      expect(source).toContain('reviewNote');
      expect(source).toContain('waiting');
      expect(source).toContain('resolved');
      expect(source).toContain('closed');
    });
    expect(androidModels).toContain('EntitlementRecoveryRequest');
    expect(androidModels).toContain('activePackCount');
    expect(androidModels).toContain('restore_sync_failed');
    expect(androidModels).toContain('reviewNote');
    expect(androidViewModel).toContain('submitEntitlementRecoveryRequest');
    expect(androidViewModel).toContain('reviewEntitlementRecoveryRequest');
    expect(androidViewModel).toContain('entitlementRecoveryReviewQueue');
    expect(androidViewModel).toContain('activePackCount');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ENTITLEMENT RECOVERY REVIEW QUEUE');
      expect(source).toContain('Request entitlement review');
      expect(source).toContain('manual review');
      expect(source).toContain('Manual entitlement recovery review note');
      expect(source).toContain('WAIT');
      expect(source).toContain('RESOLVE');
      expect(source).toContain('CLOSE');
      expect(source).toContain('do not write entitlements');
      expect(source).toContain('process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('create purchases');
      expect(source).toContain('bypass marketplace policy');
    });
    expect(webUserService).toContain('requestEntitlementRecovery');
    expect(webUserService).toContain('reviewEntitlementRecoveryRequest');
    expect(iosChallengeService).toContain('submitEntitlementRecoveryRequest');
    expect(iosChallengeService).toContain('reviewEntitlementRecoveryRequest');
    expect(androidRepository).toContain('submitEntitlementRecoveryRequest');
  });
});
