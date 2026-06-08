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

describe('referral reward social proof copy contracts', () => {
  it('builds unlocked-tier social proof without reward, payout, entitlement, or fulfillment side effects', () => {
    const copy = buildReferralRewardCopy({
      ...baseInput,
      referralJoins: 5,
      unlockedReferralRewardTier: {
        label: 'Tribe Builder',
        reward: 'Recognition badge',
      },
    });

    expect(copy.referralRewardSocialProofCopy).toContain('Referral Reward Social Proof Kit');
    expect(copy.referralRewardSocialProofCopy).toContain('Unlocked tier: Tribe Builder');
    expect(copy.referralRewardSocialProofCopy).toContain('Recognition angle: Recognition badge');
    expect(copy.referralRewardSocialProofCopy).toContain('Do not grant rewards');
    expect(copy.referralRewardSocialProofCopy).toContain('write referral state');
    expect(copy.referralRewardSocialProofCopy).toContain('create payouts');
    expect(copy.referralRewardSocialProofCopy).toContain('claim fulfillment before admin review');
  });
});
