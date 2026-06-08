export function buildCommunityHighlightCopy({
  communityHighlightRoundupItems,
  featureReviewQueue,
  weeklyCampaignPrompt,
  featureCategoryLabels,
}) {
  const communityHighlightRoundupCopy = communityHighlightRoundupItems.length > 0
    ? `Rise With The Tribe Community Highlight Roundup Kit:\n\nFeatured wins this week:\n${communityHighlightRoundupItems.map((sub, index) => {
      const handle = (sub.instagramHandle || '').replace(/^@+/, '');
      const label = featureCategoryLabels[sub.category] || sub.category || 'Tribe win';
      const name = sub.displayName || (handle ? `@${handle}` : 'Tribe member');
      return `${index + 1}. ${label} - ${name}: ${sub.story}`;
    }).join('\n')}\n\nRoundup caption:\nThese wins are why the tribe works: real members, real challenge proof, and consistency worth celebrating. Tag @risewiththetribe, celebrate the featured members, and invite one person into the next challenge.\n\nThis is a manual community highlight roundup only. Use featured submissions with consent only. Do not auto-post, schedule posts, scrape DMs, export per-user activity, share unreviewed submissions, imply paid access is live, promise outcomes, or imply medical results.`
    : `Rise With The Tribe Community Highlight Roundup Kit:\n\nNo featured submissions are ready yet.\n\nRoundup prep:\n[ ] Review pending Feature Me submissions\n[ ] Confirm consent before featuring any member story\n[ ] Pick up to four wins for the weekly roundup\n[ ] Copy repost captions only after submissions are marked featured\n\nThis is a manual community highlight roundup only. Use featured submissions with consent only. Do not auto-post, schedule posts, scrape DMs, export per-user activity, share unreviewed submissions, imply paid access is live, promise outcomes, or imply medical results.`;
  const ugcConsentReminderCopy = `Rise With The Tribe UGC Consent Reminder Kit:\n\nFeatured submissions ready: ${communityHighlightRoundupItems.length}\nPending review submissions: ${featureReviewQueue.length}\nThis week's campaign: ${weeklyCampaignPrompt.name} \u00b7 ${weeklyCampaignPrompt.hashtag}\n\nBefore reposting:\n[ ] Confirm the submission is marked featured in the app review queue\n[ ] Confirm the member opted in through the Feature Me consent gate\n[ ] Use the submitted display name or Instagram handle only as provided\n[ ] Keep the repost caption truthful to the submitted story\n[ ] Avoid before/after, medical, weight-loss, or guaranteed outcome claims\n[ ] Remove any private details before copying the caption\n[ ] Credit @risewiththetribe and the member handle only when it was submitted\n\nThis is a manual UGC consent reminder only. Do not auto-post, schedule posts, scrape DMs, store inbound DMs, export private history, share unreviewed submissions, override consent, edit member claims into outcomes, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;

  return {
    communityHighlightRoundupCopy,
    ugcConsentReminderCopy,
  };
}
