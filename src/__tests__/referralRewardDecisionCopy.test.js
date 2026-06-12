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
    expect(copy.referralRewardSupportEscalationCopy).toContain('Referral Reward Support Escalation Kit');
    expect(copy.referralRewardSupportEscalationCopy).toContain('Support escalation checklist');
    expect(copy.referralRewardSupportEscalationCopy).toContain('Open referral reward claims: 2');
    expect(copy.referralRewardSupportEscalationCopy).toContain('not live fulfillment');
    expect(copy.referralRewardSupportEscalationCopy).toContain('not a Pro grant');
    expect(copy.referralRewardSupportEscalationCopy).toContain('not entitlement approval');
    expect(copy.referralRewardSupportEscalationCopy).toContain('first-party and support-safe');
    expect(copy.referralRewardSupportEscalationCopy).toContain('Do not grant Pro');
    expect(copy.referralRewardSupportEscalationCopy).toContain('write entitlements');
    expect(copy.referralRewardSupportEscalationCopy).toContain('create payouts');
    expect(copy.referralRewardSupportEscalationCopy).toContain('create purchases');
    expect(copy.referralRewardSupportEscalationCopy).toContain('create affiliate rewards');
    expect(copy.referralRewardSupportEscalationCopy).toContain('write referral state');
    expect(copy.referralRewardSupportEscalationCopy).toContain('count link opens');
    expect(copy.referralRewardSupportEscalationCopy).toContain('claim fulfillment');
    expect(copy.referralRewardSupportEscalationCopy).toContain('export per-user invite lists');
    expect(copy.referralRewardSupportEscalationCopy).toContain('add tracking pixels');
    expect(copy.referralRewardSupportEscalationCopy).toContain('auto-message users');
  });
});
