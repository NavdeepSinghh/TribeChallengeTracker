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
    expect(copy.challengePackLaunchCopy).toContain('Challenge Pack Launch Kit');
    expect(copy.challengePackLaunchCopy).toContain('Store credentials and test purchases must be completed');
    expect(copy.challengePackLaunchQaCopy).toContain('Challenge Pack Launch QA Kit');
    expect(copy.challengePackLaunchQaCopy).toContain('Pack products in code: com.risewiththetribe.pack.21_day_reset');
    expect(copy.challengePackLaunchQaCopy).toContain('Launch QA checklist');
    expect(copy.challengePackLaunchQaCopy).toContain('Store QA');
    expect(copy.challengePackLaunchQaCopy).toContain('Entitlement QA');
    expect(copy.challengePackLaunchQaCopy).toContain('Support QA');
    expect(copy.challengePackLaunchQaCopy).toContain('Copy QA');
    expect(copy.challengePackLaunchQaCopy).toContain('not a pack unlock');
    expect(copy.challengePackLaunchQaCopy).toContain('not a purchase');
    expect(copy.challengePackLaunchQaCopy).toContain('not entitlement approval');
    expect(copy.challengePackLaunchQaCopy).toContain('not store-review approval');
    expect(copy.challengePackLaunchQaCopy).toContain('Do not claim packs are live');
    expect(copy.challengePackLaunchQaCopy).toContain('quote unconfigured prices');
    expect(copy.challengePackLaunchQaCopy).toContain('create purchases');
    expect(copy.challengePackLaunchQaCopy).toContain('write entitlements');
    expect(copy.challengePackLaunchQaCopy).toContain('submit store review');
    expect(copy.challengePackLaunchQaCopy).toContain('auto-message users');
    expect(copy.challengePackLaunchQaCopy).toContain('scrape/store DMs');
    expect(copy.challengePackLaunchQaCopy).toContain('add tracking pixels');
    expect(copy.challengePackObjectionReplyCopy).toContain('store credentials');
    expect(copy.challengePackObjectionReplyCopy).toContain('Do not claim challenge packs are live');
  });

  it('renders challenge pack launch kits in the web value snapshot card', () => {
    const source = require('fs').readFileSync(
      require('path').join(__dirname, '../profile/ProValueSnapshotCard.jsx'),
      'utf8',
    );

    expect(source).toContain('CHALLENGE PACK LAUNCH KIT');
    expect(source).toContain('COPY PACK LAUNCH COPY');
    expect(source).toContain('challengePackLaunchCopy');
    expect(source).toContain('CHALLENGE PACK LAUNCH QA KIT');
    expect(source).toContain('COPY PACK LAUNCH QA');
    expect(source).toContain('challengePackLaunchQaCopy');
    expect(source).toContain('CHALLENGE PACK OBJECTION REPLY KIT');
    expect(source).toContain('COPY PACK REPLIES');
    expect(source).toContain('challengePackObjectionReplyCopy');
  });
});
