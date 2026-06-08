export function buildWeeklyCampaignCollabCopyCards({
  campaignPerformanceSummary,
  featureReviewQueue,
  recommendedLaunchExperiment,
  referralJoins,
  weeklyCampaignPrompt,
}) {
  const weeklyCampaignCollabInviteCopy = `Rise With The Tribe Weekly Campaign Collab Invite Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCTA: ${weeklyCampaignPrompt.cta}\n\nManual creator invite:\nHey, I am running this week's Rise With The Tribe challenge: ${weeklyCampaignPrompt.name}. The ask is simple: join in the app, log one honest session, and invite your audience to start with ${weeklyCampaignPrompt.hashtag}. Would you be open to a no-pressure collab post or Story mention this week?\n\nCollab post angle:\nTwo communities, one simple challenge: log the session, bring one accountability partner, and make consistency visible.\n\nStory mention angle:\nI am joining ${weeklyCampaignPrompt.name} with @risewiththetribe. Vote, start, and log your first session in the app.\n\nFollow-up note:\nIf they are interested in deeper creator hosting, route them to Creator / Coach Mode and the creator review flow in the app before discussing paid hosting, revenue-share, or branded challenges.\n\nThis is a manual collab invite kit only. Do not auto-message, scrape DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabFollowUpCopy = `Rise With The Tribe Weekly Campaign Collab Follow-Up Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCreator path: Creator / Coach Mode review before paid hosting\n\nIf they say yes:\nAmazing. Let us keep it simple for this week: join ${weeklyCampaignPrompt.name}, post the challenge prompt in your own voice, and invite people to log their first session in Rise With The Tribe with ${weeklyCampaignPrompt.hashtag}. After the post, we will review only first-party app movement like challenge joins, referrals, feature submissions, and saved creator interest.\n\nIf they ask what to post:\nUse the Caption Bank Kit for the Reel, Story, carousel, or pinned comment, then add your own accountability angle.\n\nIf they ask about paid hosting:\nPaid creator hosting is not live yet. Please enable Creator / Coach Mode and submit for review in the app so we can evaluate fit, moderation, support, payout readiness, and marketplace alignment before any paid terms are discussed.\n\nIf they are not ready:\nNo pressure. You can still join the weekly challenge as a member, log a session, and revisit creator hosting later.\n\nThis is a manual collab follow-up kit only. Do not auto-message, scrape DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabSafetyCopy = `Rise With The Tribe Weekly Campaign Collab Safety Checklist:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCreator path: Creator / Coach Mode review before paid hosting\n\nBefore posting:\n[ ] Creator understands this is a no-pressure community collab, not paid hosting.\n[ ] Creator can use their own voice and does not need to share private member data.\n[ ] Creator agrees to point people into the app challenge loop for first-party consent and tracking.\n[ ] Creator knows featured member stories require Feature Me consent before reposting.\n[ ] Creator will avoid medical, transformation, guaranteed outcome, or shame-based claims.\n\nIf deeper hosting comes up:\n[ ] Ask them to enable Creator / Coach Mode.\n[ ] Review fit, moderation readiness, audience safety, payout readiness, and marketplace alignment before any paid terms.\n[ ] Keep private replies, screenshots, Story voters, and member activity out of shared collab notes.\n\nThis is a manual collab safety checklist only. Do not auto-message, scrape DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabRecapCopy = `Rise With The Tribe Weekly Campaign Collab Recap Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual recap prompts:\n[ ] What did the creator post or mention?\n[ ] Which app signal moved after the post: challenge joins, referral joins, feature submissions, saved Pro interest, saved creator interest, or share-card usage?\n[ ] What lesson should become the next Story, Reel hook, carousel, or challenge CTA?\n[ ] Did any audience questions need the Comment Reply Kit, DM Keyword Kit, or Creator / Coach Mode review?\n[ ] Should this creator be invited to another no-pressure collab, or paused until fit is clearer?\n\nPublic thank-you copy:\nThank you for joining ${weeklyCampaignPrompt.name} with the tribe. The win is simple: more people chose one honest session and made consistency visible with ${weeklyCampaignPrompt.hashtag}.\n\nDecision note:\nUse only first-party app movement and consent-cleared submissions to decide the next step. Instagram reactions can guide content ideas, but they should not become attribution, payment, or private user records.\n\nThis is a manual collab recap kit only. Do not scrape posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabRenewalCopy = `Rise With The Tribe Weekly Campaign Collab Renewal Kit:\n\nCampaign reviewed: ${weeklyCampaignPrompt.name}\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCreator path: Creator / Coach Mode review before paid hosting\n\nRepeat this collab if:\n[ ] First-party app movement improved after the post.\n[ ] The creator used pressure-safe language and respected consent boundaries.\n[ ] Audience questions can be answered with existing Comment Reply, DM Keyword, Feature Me, or challenge flows.\n[ ] The next weekly prompt has a clear audience fit.\n\nPause this collab if:\n[ ] The creator needs paid terms before the creator review path exists.\n[ ] The post created medical, transformation, shame-based, or guaranteed outcome claims.\n[ ] The audience asks require support, moderation, or data sharing we cannot safely provide yet.\n\nManual renewal reply:\nThank you for helping people start ${weeklyCampaignPrompt.name}. We are keeping the next step simple: if the next weekly prompt fits your audience, we can do another no-pressure collab. If you want deeper hosting later, please use Creator / Coach Mode so we can review fit, moderation readiness, support needs, and payout readiness before paid terms.\n\nThis is a manual collab renewal kit only. Do not auto-message, scrape posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignRetentionFollowUpCopy = `Rise With The Tribe Weekly Campaign Retention Follow-Up Kit:\n\nCampaign reviewed: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\nPending feature submissions: ${featureReviewQueue.length}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual follow-up lanes:\n[ ] Active members: invite them to log the next honest session and bring one accountability partner into the next weekly prompt.\n[ ] Comeback members: use lapsed-member winback copy and point them to the free challenge loop before any paid value path.\n[ ] Feature-ready members: ask them to submit Feature Me in the app with consent before any public repost.\n[ ] Pro, creator, or partner-curious members: ask them to save first-party interest in the app before changing launch priority.\n[ ] Support-risk members: route billing, refund, cancellation, privacy, or complaint questions to support before follow-up copy is used.\n\nReview note:\nUse first-party app movement only: saved logs, challenge joins, referral joins, Feature Me submissions, saved Pro interest, saved creator interest, saved partner interest, and support notes. Keep Instagram reactions directional and un-stored.\n\nThis is a manual weekly campaign retention follow-up kit only. Do not auto-message users, scrape posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, offer discounts, collect payment details, create purchases, write entitlements, imply paid access is live, share private responses, promise outcomes, imply medical results, or pressure members.`;
  const weeklyCampaignReInviteCopy = `Rise With The Tribe Weekly Campaign Re-Invite Kit:\n\nCampaign reviewed: ${weeklyCampaignPrompt.name}\nNext prompt: Week ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nReferral joins: ${referralJoins}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual re-invite lanes:\n[ ] Active finishers: ask them to bring one accountability partner into the next weekly challenge.\n[ ] Comeback members: invite them to restart with a free challenge log before mentioning Pro, packs, creator hosting, or partner perks.\n[ ] Feature-ready members: ask them to submit Feature Me with consent, then invite one person who needs the same reset.\n[ ] Referral-curious members: remind them that meaningful challenge joins count, not link opens or screenshots.\n[ ] Support-risk members: route billing, refund, cancellation, privacy, or complaint questions to support before asking for another invite.\n\nManual public copy:\nFinished or restarted this week? Bring one person into the next Rise With The Tribe challenge. The win is simple: join, log one honest session, and make the comeback visible together with ${weeklyCampaignPrompt.hashtag}.\n\nReview note:\nUse first-party app movement only: challenge joins, referral joins, saved logs, Feature Me submissions, saved interest, and support notes. Keep Instagram reactions directional and un-stored.\n\nThis is a manual weekly campaign re-invite kit only. Do not auto-message users, count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, offer discounts, collect payment details, create purchases, scrape posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, imply paid access is live, share private responses, promise outcomes, imply medical results, or pressure members.`;
  const weeklyCampaignCollabCopyCards = [
    {
      title: 'Weekly Campaign Collab Invite Kit',
      subtitle: 'Manual outreach for collab posts and creator mentions',
      status: 'COLLAB',
      accent: '#A855F7',
      body: 'Copy pressure-safe creator outreach that points deeper hosting interest back to first-party review flows.',
      buttonLabel: 'COPY COLLAB INVITE',
      copyText: weeklyCampaignCollabInviteCopy,
    },
    {
      title: 'Weekly Campaign Collab Follow-Up Kit',
      subtitle: 'Manual replies after a creator responds',
      status: 'FOLLOW-UP',
      accent: '#C084FC',
      body: 'Copy creator follow-ups for yes, post guidance, paid hosting questions, and not-ready replies.',
      buttonLabel: 'COPY COLLAB FOLLOW-UP',
      copyText: weeklyCampaignCollabFollowUpCopy,
    },
    {
      title: 'Weekly Campaign Collab Safety Checklist',
      subtitle: 'Manual consent and claim review before creator escalation',
      status: 'SAFETY',
      accent: '#2DD4BF',
      body: 'Copy a pre-collab checklist for consent, claims, private replies, member data, and paid-hosting review.',
      buttonLabel: 'COPY COLLAB SAFETY',
      copyText: weeklyCampaignCollabSafetyCopy,
    },
    {
      title: 'Weekly Campaign Collab Recap Kit',
      subtitle: 'Manual post-collab review from first-party app movement',
      status: 'RECAP',
      accent: '#14B8A6',
      body: 'Copy a recap prompt for creator posts, app movement, content lessons, and next collab decisions.',
      buttonLabel: 'COPY COLLAB RECAP',
      copyText: weeklyCampaignCollabRecapCopy,
    },
    {
      title: 'Weekly Campaign Collab Renewal Kit',
      subtitle: 'Manual repeat-or-pause decision after the recap',
      status: 'RENEW',
      accent: '#0D9488',
      body: 'Copy renewal criteria for repeating, pausing, or routing a creator into deeper review.',
      buttonLabel: 'COPY COLLAB RENEWAL',
      copyText: weeklyCampaignCollabRenewalCopy,
    },
    {
      title: 'Weekly Campaign Retention Follow-Up Kit',
      subtitle: 'Manual post-campaign follow-up lanes',
      status: 'FOLLOW-UP',
      accent: '#38BDF8',
      body: 'Copy app-first follow-up lanes for active, comeback, feature-ready, interest-saved, and support-risk members without auto-messaging, scraping, attribution, discounts, purchases, or entitlement changes.',
      buttonLabel: 'COPY RETENTION FOLLOW-UP',
      copyText: weeklyCampaignRetentionFollowUpCopy,
    },
    {
      title: 'Weekly Campaign Re-Invite Kit',
      subtitle: 'Manual next-challenge referral prompts',
      status: 'RE-INVITE',
      accent: '#22C55E',
      body: 'Copy post-campaign prompts that ask active, comeback, feature-ready, referral-curious, and support-risk members to bring one accountability partner without counting link opens, granting rewards, or changing entitlements.',
      buttonLabel: 'COPY RE-INVITE KIT',
      copyText: weeklyCampaignReInviteCopy,
    },
  ];

  return weeklyCampaignCollabCopyCards;
}
