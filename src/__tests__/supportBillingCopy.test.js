import { buildSupportDecisionCopy } from '../profile/supportDecisionCopy';

describe('support and billing copy contracts', () => {
  it('builds support and account deletion decision replies without destructive or marketplace side effects', () => {
    const copy = buildSupportDecisionCopy({
      accountDeletionReviewQueue: [{ id: 'delete-1' }],
      profile: {
        accountDeletionRequest: {
          status: 'requested',
        },
      },
      supportCategory: 'billing',
      supportReviewQueue: [{ id: 'support-1' }, { id: 'support-2' }],
      userEmail: 'member@example.com',
    });

    expect(copy.supportDecisionReplyCopy).toContain('Support Decision Reply Kit');
    expect(copy.supportDecisionReplyCopy).toContain('Open support requests: 2');
    expect(copy.supportDecisionReplyCopy).toContain('ESCALATE TO MARKETPLACE SUPPORT');
    expect(copy.supportDecisionReplyCopy).toContain('Do not process refunds');
    expect(copy.supportDecisionReplyCopy).toContain('cancel subscriptions');
    expect(copy.supportDecisionReplyCopy).toContain('write entitlements');
    expect(copy.supportDecisionReplyCopy).toContain('auto-message users');
    expect(copy.accountDeletionDecisionReplyCopy).toContain('Account Deletion Decision Reply Kit');
    expect(copy.accountDeletionDecisionReplyCopy).toContain('Open deletion requests: 1');
    expect(copy.accountDeletionDecisionReplyCopy).toContain('VERIFIED FOR SUPPORT FOLLOW-UP');
    expect(copy.accountDeletionDecisionReplyCopy).toContain('Do not delete Firebase Auth accounts');
    expect(copy.accountDeletionDecisionReplyCopy).toContain('erase purchase records');
    expect(copy.accountDeletionDecisionReplyCopy).toContain('process refunds');
  });
});
