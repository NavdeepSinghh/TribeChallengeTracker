import { buildEngagementCopy } from '../profile/engagementCopy';

const recommendedRevenuePath = {
  label: 'Tribe Pro',
  signal: 7,
};

const weeklyCampaignPrompt = {
  cta: 'Log one honest session today.',
  hashtag: '#TribeReset',
  name: 'Seven Day Reset',
};

describe('engagement copy contracts', () => {
  it('builds social proof and comeback copy without posting, tracking, purchase, or recovery side effects', () => {
    const copy = buildEngagementCopy({
      activeChallengePackCount: 0,
      challengePackProducts: [
        { id: 'com.risewiththetribe.pack.21_day_reset' },
      ],
      challengePackTitle: () => '21 Day Reset',
      communityHighlightRoundupCount: 3,
      currentStreak: 5,
      daysActive: 14,
      goalStreak: 21,
      instagramWeeklyPrompt: {
        hook: 'Show the honest restart.',
      },
      instagramWeeklyPrompts: [
        { label: 'Reset', title: 'Start', hook: 'Open with the promise.' },
        { label: 'Proof', title: 'Log', hook: 'Show app proof.' },
        { label: 'Comeback', title: 'Return', hook: 'Normalize the restart.' },
        { label: 'Invite', title: 'Partner', hook: 'Bring one person.' },
        { label: 'Feature', title: 'Story', hook: 'Ask for consent.' },
        { label: 'Push', title: 'Finish', hook: 'Close the loop.' },
        { label: 'Recap', title: 'Review', hook: 'Share the lesson.' },
      ],
      monthlyRecap: {
        score: 82,
        status: 'steady',
      },
      paidLaunchDecisionStatus: 'HOLD FOR STORE TESTS',
      proActive: false,
      proValueFocus: 'deeper accountability',
      recommendedRevenuePath,
      referralJoins: 4,
      totalChallengePoints: 120,
      totalWinPoints: 260,
      weeklyCampaignPrompt,
      weeklyReport: {
        status: 'on track',
        weeklyScore: 76,
      },
      yesterdayRecovered: false,
    });

    expect(copy.valueProofStoryCopy).toContain('Value Proof Story Kit');
    expect(copy.valueProofStoryCopy).toContain('Do not auto-post');
    expect(copy.valueProofStoryCopy).toContain('add tracking pixels');
    expect(copy.storyPostingChecklistCopy).toContain('Story Posting Checklist Kit');
    expect(copy.storyPostingChecklistCopy).toContain('Repost only consent-cleared featured submissions');
    expect(copy.storyPostingChecklistCopy).toContain('Do not auto-post, schedule posts');
    expect(copy.streakRescuePromptCopy).toContain('Streak Rescue Prompt Kit');
    expect(copy.streakRescuePromptCopy).toContain('Pro-only recovery preview');
    expect(copy.streakRescuePromptCopy).toContain('Do not award points');
    expect(copy.streakRescuePromptCopy).toContain('spend recovery credits');
    expect(copy.comebackChallengeInviteCopy).toContain('Comeback Challenge Invite Kit');
    expect(copy.comebackChallengeInviteCopy).toContain('Do not auto-message users');
    expect(copy.challengePackObjectionReplyCopy).toContain('store credentials');
    expect(copy.challengePackObjectionReplyCopy).toContain('Do not claim challenge packs are live');
  });
});
