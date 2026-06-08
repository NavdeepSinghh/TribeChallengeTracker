import { buildReferralRewardCopy } from '../profile/referralCopy';

const baseInput = {
  currentStreak: 6,
  daysActive: 18,
  referralJoins: 4,
  referralRewardReviewQueue: [{ id: 'claim-1' }, { id: 'claim-2' }],
  referralState: {
    next: {
      label: 'Tribe Builder',
      target: 5,
    },
    remainingToNext: 1,
  },
  totalWinPoints: 420,
};

describe('referral reward copy contracts', () => {
  it('builds next-tier launch and story sprint copy from first-party referral progress only', () => {
    const copy = buildReferralRewardCopy({
      ...baseInput,
      unlockedReferralRewardTier: null,
    });

    expect(copy.referralLaunchCopy).toContain('Referral Launch Kit');
    expect(copy.referralLaunchCopy).toContain('Referral progress: 4/5 attributed challenge joins');
    expect(copy.referralLaunchCopy).toContain('completed joins, not link clicks');
    expect(copy.referralLaunchCopy).toContain('Do not count link opens');
    expect(copy.referralLaunchCopy).toContain('claim reward fulfillment before admin review');
    expect(copy.referralStorySprintCopy).toContain('Referral Story Sprint Kit');
    expect(copy.referralStorySprintCopy).toContain('I am 1 challenge join away from Tribe Builder.');
    expect(copy.referralStorySprintCopy).toContain('invite one accountability partner');
    expect(copy.referralStorySprintCopy).toContain('Do not count link opens');
    expect(copy.referralStorySprintCopy).toContain('unlock entitlements');
  });
});
