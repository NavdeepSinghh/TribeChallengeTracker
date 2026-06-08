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

describe('referral reward decision copy contracts', () => {
  it('builds manual decision replies without writing referral state or granting rewards', () => {
    const copy = buildReferralRewardCopy({
      ...baseInput,
      unlockedReferralRewardTier: {
        label: 'Tribe Builder',
        reward: 'Recognition badge',
      },
    });

    expect(copy.referralRewardDecisionReplyCopy).toContain('Referral Reward Decision Reply Kit');
    expect(copy.referralRewardDecisionReplyCopy).toContain('Open referral reward claims: 2');
    expect(copy.referralRewardDecisionReplyCopy).toContain('APPROVED FOR MANUAL RECOGNITION');
    expect(copy.referralRewardDecisionReplyCopy).toContain('WAITING ON REVIEW');
    expect(copy.referralRewardDecisionReplyCopy).toContain('NOT READY YET');
    expect(copy.referralRewardDecisionReplyCopy).toContain('DECLINED FOR NOW');
    expect(copy.referralRewardDecisionReplyCopy).toContain('Do not grant Pro');
    expect(copy.referralRewardDecisionReplyCopy).toContain('write entitlements');
    expect(copy.referralRewardDecisionReplyCopy).toContain('write referral state');
    expect(copy.referralRewardDecisionReplyCopy).toContain('add tracking pixels');
    expect(copy.referralRewardDecisionReplyCopy).toContain('auto-message users');
  });
});
