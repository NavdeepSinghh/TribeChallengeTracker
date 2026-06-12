const DOT = '\u00b7';
const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function buildEngagementCopy({
  totalWinPoints,
  currentStreak,
  daysActive,
  weeklyReport,
  monthlyRecap,
  totalChallengePoints,
  weeklyCampaignPrompt,
  proValueFocus,
  referralJoins,
  communityHighlightRoundupCount,
  instagramWeeklyPrompt,
  instagramWeeklyPrompts,
  challengePackProducts,
  challengePackTitle,
  activeChallengePackCount,
  paidLaunchDecisionStatus,
  recommendedRevenuePath,
  goalStreak,
  yesterdayRecovered,
  proActive,
}) {
  const valueProofStoryCopy = `Rise With The Tribe Value Proof Story Kit:\n\nVisible proof: ${totalWinPoints} pts ${DOT} ${currentStreak}d streak ${DOT} ${daysActive} days active\nWeekly report: ${weeklyReport.weeklyScore}% (${weeklyReport.status})\nMonthly report: ${monthlyRecap.score}% (${monthlyRecap.status})\nChallenge points: ${totalChallengePoints}\nThis week's campaign: ${weeklyCampaignPrompt.name} ${DOT} ${weeklyCampaignPrompt.hashtag}\nValue focus: ${proValueFocus}\n\nStory caption:\nThe app is helping me keep the promise visible: log the session, protect the streak, review the week, and come back faster when life gets messy. If you want accountability, join this week's Rise With The Tribe challenge and tag @risewiththetribe when you start.\n\nFrame plan:\n[ ] Frame 1: show points, streak, or weekly score from the app\n[ ] Frame 2: share one honest lesson from this week\n[ ] Frame 3: invite one accountability partner into the weekly challenge\n[ ] Frame 4: point people back to the app and ${weeklyCampaignPrompt.hashtag}\n\nThis is manual value proof copy only. Do not auto-post, scrape DMs, add tracking pixels, export private history, create purchases, grant Pro, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;

  const storyPostingChecklistCopy = `Rise With The Tribe Story Posting Checklist Kit:\n\nCampaign: ${weeklyCampaignPrompt.name} ${DOT} ${weeklyCampaignPrompt.hashtag}\nProof asset: ${totalWinPoints} pts ${DOT} ${currentStreak}d streak ${DOT} ${weeklyReport.weeklyScore}% weekly score\nComeback angle: ${currentStreak > 0 ? 'active streak proof' : 'honest restart prompt'}\nReferral progress: ${referralJoins} challenge join${referralJoins === 1 ? '' : 's'}\nFeatured submissions ready: ${communityHighlightRoundupCount}\n\nPosting checklist:\n[ ] Start with the weekly campaign CTA: ${weeklyCampaignPrompt.cta}\n[ ] Add one app proof frame from the Value Proof Story Kit\n[ ] Add one comeback or accountability prompt if the week needs a restart\n[ ] Repost only consent-cleared featured submissions\n[ ] End with one clear app action: join the challenge, log a session, or invite an accountability partner\n[ ] Review comments/DMs manually and use approved keyword replies only\n\nThis is a manual Story posting checklist only. Do not auto-post, schedule posts, scrape DMs, store inbound DMs, add tracking pixels, export private history, share unreviewed submissions, create challenge joins, write referral state, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;

  const instagramPromptCopy = `${instagramWeeklyPrompt.hook}\n\nToday inside Rise With The Tribe: ${totalWinPoints} pts ${DOT} ${currentStreak}d streak ${DOT} ${daysActive} days active.\n\nTag @risewiththetribe and use the app to keep the promise visible.`;

  const instagramContentCalendarCopy = `Rise With The Tribe Instagram Content Calendar:\n\n${instagramWeeklyPrompts.map((prompt, index) => `${WEEKDAY_LABELS[index]} ${DOT} ${prompt.label}\n${prompt.title}: ${prompt.hook}`).join('\n\n')}\n\nUse the weekly campaign, tag @risewiththetribe, and invite the audience back into the app challenge loop.`;

  const challengePackLaunchCopy = `Rise With The Tribe Challenge Pack Launch Kit:\n\n${challengePackProducts.map(product => `${challengePackTitle(product)}\nProduct ID: ${product.id}\nLaunch angle: structured accountability, daily prompts, and a finishable challenge outcome.`).join('\n\n')}\n\nStore credentials and test purchases must be completed before paid access is promoted as live. Until then, use this copy to tease demand, explain the pack value, and send members to the free challenge loop or Pro Trial Interest capture.`;

  const challengePackObjectionReplyCopy = `Rise With The Tribe Challenge Pack Objection Reply Kit:\n\nPack signals: ${challengePackProducts.length} planned challenge pack product IDs\nUnlocked packs on this account: ${activeChallengePackCount}/${challengePackProducts.length}\nCurrent launch gate: ${paidLaunchDecisionStatus}\nRecommended revenue path: ${recommendedRevenuePath.label}\n\nManual replies:\nQ: Are challenge packs live yet?\nA: Challenge packs are being prepared, but store credentials, receipt validation, and test purchases need to pass before paid pack access is promoted as live. For now, join the free challenge loop and save Pro Trial Interest so we know which packs deserve priority.\n\nQ: What makes a pack different from a normal challenge?\nA: Packs are designed as structured accountability programs with a clear outcome, daily prompts, and a finishable plan. The free challenges stay useful; packs are for members who want a tighter guided run.\n\nQ: Can I buy the 21-Day Reset, Summer Shred, Beginner Consistency Plan, 30-Day Discipline Challenge, 75-Day Tribe Mode, 14-Day Comeback Sprint, or 21-Day Event Prep Pack now?\nA: Not yet. The shared product IDs are ready in code, but we will only launch once App Store/Play setup, receipt validation, restore flow, support readiness, and entitlement QA are complete.\n\nThis is a manual challenge pack objection reply kit only. Do not claim challenge packs are live, quote unconfigured prices, collect payments, create purchases, unlock packs, grant Pro, write entitlements, offer discounts, bypass marketplace policy, promise outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure users.`;

  const challengePackLaunchQaCopy = `Rise With The Tribe Challenge Pack Launch QA Kit:\n\nPack products in code: ${challengePackProducts.map(product => product.id).join(', ') || 'pack products not loaded'}\nUnlocked packs on this account: ${activeChallengePackCount}/${challengePackProducts.length}\nCurrent launch gate: ${paidLaunchDecisionStatus}\nRecommended revenue path: ${recommendedRevenuePath.label}\nThis week's campaign: ${weeklyCampaignPrompt.name} ${DOT} ${weeklyCampaignPrompt.hashtag}\n\nLaunch QA checklist:\n- Store QA: confirm App Store and Google Play product setup, sandbox/license-test purchases, restore/sync, and negative validation evidence for each challenge pack before launch wording is used.\n- Entitlement QA: confirm pack unlocks only happen after verified marketplace purchase validation from backend code, never from profile copy, admin notes, or client-side UI state.\n- Support QA: confirm missing-pack, wrong-account, restore-failed, duplicate-charge, cancellation/refund, and entitlement recovery replies are ready before any pack launch push.\n- Copy QA: confirm app, Instagram, support, and store-review language says paid packs are not live until external store evidence and entitlement QA are complete.\n\nThis launch QA kit is not a pack unlock, not a purchase, not a Pro grant, not entitlement approval, not paid-access launch approval, and not store-review approval. Do not claim packs are live, quote unconfigured prices, collect payments, create purchases, unlock packs, grant Pro, write entitlements, offer discounts, process refunds, bypass App Store or Google Play policy, submit store review, promise outcomes, imply medical results, auto-message users, scrape/store DMs, add tracking pixels, or pressure users.`;

  const streakRescuePromptCopy = `Rise With The Tribe Streak Rescue Prompt Kit:\n\nCurrent streak: ${currentStreak} day${currentStreak === 1 ? '' : 's'}\nStreak goal: ${goalStreak} day${goalStreak === 1 ? '' : 's'}\nYesterday recovery: ${yesterdayRecovered ? 'already protected' : (proActive ? 'available as a zero-point Pro credit' : 'Pro-only recovery preview')}\nMomentum: ${totalWinPoints} pts ${DOT} ${daysActive} days active\n\nRescue prompt:\nMissed yesterday? Do not make it a lost week. Open Rise With The Tribe, log one honest session today, and use recovery only if it applies. The point is to return to the challenge loop, not fake the effort.\n\nStory caption:\nConsistency is not never missing. It is coming back before the gap becomes your identity. Tag @risewiththetribe when you restart today.\n\nThis is manual streak rescue copy only. Do not award points, create activity logs, spend recovery credits, write entitlements, unlock Pro, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.`;

  const comebackChallengeInviteCopy = `Rise With The Tribe Comeback Challenge Invite Kit:\n\nThis week's campaign: ${weeklyCampaignPrompt.name}\nCampaign CTA: ${weeklyCampaignPrompt.cta}\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCurrent streak: ${currentStreak} day${currentStreak === 1 ? '' : 's'}\nRecovery status: ${yesterdayRecovered ? 'yesterday protected' : 'restart with an honest log'}\n\nInvite copy:\nMissed a day? Come back with me. Pick this week's Rise With The Tribe challenge, log one honest session, and tag @risewiththetribe when you restart. We are not chasing perfect weeks. We are building return speed.\n\nDM version:\nYou in for a comeback check-in today? The prompt is ${weeklyCampaignPrompt.name}: ${weeklyCampaignPrompt.cta} Start in the app, use ${weeklyCampaignPrompt.hashtag}, and bring one accountability partner.\n\nThis is manual comeback challenge invite copy only. Do not auto-message users, scrape DMs, create challenge joins, create activity logs, spend recovery credits, write referral state, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.`;

  return {
    valueProofStoryCopy,
    storyPostingChecklistCopy,
    instagramPromptCopy,
    instagramContentCalendarCopy,
    challengePackLaunchCopy,
    challengePackLaunchQaCopy,
    challengePackObjectionReplyCopy,
    streakRescuePromptCopy,
    comebackChallengeInviteCopy,
  };
}
