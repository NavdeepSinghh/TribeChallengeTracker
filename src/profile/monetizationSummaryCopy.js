export function buildMonetizationSummaryCopy({
  topProTrialReason,
  proTrialDemandTotal,
  weeklyCampaignPrompt,
  creatorRevenueShareTotal,
  creatorRevenueShareSummary,
  partnerDemandTotal,
  monetizationSignalTotal,
  storeCatalog,
  storeSubscriptionCount,
  storePackCount,
}) {
  const proTrialPitchCopy = topProTrialReason && proTrialDemandTotal
    ? `Rise With The Tribe Pro trial signal: ${proTrialDemandTotal} first-party Pro trial reasons captured so far. Top demand is ${topProTrialReason.label} with ${topProTrialReason.demand} interested member${topProTrialReason.demand === 1 ? '' : 's'}. Use this to prioritize store trial setup, onboarding copy, and launch messaging without granting entitlements early.`
    : 'Rise With The Tribe Pro trial signal: demand is being collected from first-party profile interest before store-backed trials go live.';
  const proTrialObjectionReplyCopy = `Rise With The Tribe Pro Trial Objection Reply Kit:\n\nDemand signals: ${proTrialDemandTotal} first-party Pro trial reasons captured\nTop interest: ${topProTrialReason?.label || 'gathering demand'}\nThis week's campaign: ${weeklyCampaignPrompt.name} \u00b7 ${weeklyCampaignPrompt.hashtag}\n\nManual replies:\nQ: Is Pro live yet?\nA: Tribe Pro is being shaped from first-party interest inside the app. Save your Pro Trial Interest so we know whether reports, challenge packs, or creator tools should launch first.\n\nQ: Why would I try Pro?\nA: The free challenge loop is staying useful. Pro is being explored for deeper accountability: clearer reports, structured packs, private challenge tools, and creator support. Tell us which of those would actually help you stay consistent.\n\nQ: What should I do now?\nA: Join this week's challenge, log one honest session, and save your Pro Trial Interest in profile. We are validating value before switching on paid access.\n\nThis is a manual objection reply kit only. Do not claim a store-backed trial is live, quote unconfigured prices, collect payments, create purchases, grant Pro, write entitlements, offer discounts, promise founder pricing, imply guaranteed outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure users.`;
  const proTrialSupportEscalationCopy = `Rise With The Tribe Pro Trial Support Escalation Kit:\n\nFirst-party Pro trial signals: ${proTrialDemandTotal}\nTop Pro trial interest: ${topProTrialReason?.label || 'gathering demand'}\nThis week's campaign: ${weeklyCampaignPrompt.name} \u00b7 ${weeklyCampaignPrompt.hashtag}\n\nSupport escalation checklist:\n- Store setup owner: confirm App Store and Google Play trial products, sandbox/license testing, pricing copy, and marketplace review status before any live-trial language is used.\n- Value proof owner: confirm the member reason, challenge consistency context, report/pack/creator-tool fit, and free-loop fallback before promising Pro value.\n- Support owner: prepare reply coverage for trial-readiness questions, cancellation/refund routing, duplicate-charge confusion, entitlement recovery, and marketplace support handoff.\n- QA owner: verify no purchase, Pro grant, entitlement write, paid-access unlock, discount, refund, tracking, auto-message, or scraped-DM action is tied to this support escalation.\n\nThis support escalation kit is not a trial start, not a purchase, not a Pro grant, not entitlement approval, not refund approval, and not paid-access launch approval. Do not start trials, create purchases, grant Pro, write entitlements, unlock paid access, collect payment details, offer discounts, process refunds, bypass App Store or Google Play policy, claim store-backed trials are live, promise outcomes, imply medical results, auto-message users, scrape/store DMs, add tracking pixels, or pressure members.`;
  const creatorRevenueSharePitchCopy = creatorRevenueShareTotal
    ? `Rise With The Tribe creator beta signal: ${creatorRevenueShareTotal} creator${creatorRevenueShareTotal === 1 ? '' : 's'} opted into future revenue-share. ${creatorRevenueShareSummary.enabled || 0} creator profiles are enabled and ${creatorRevenueShareSummary.branded || 0} have branding ready. Prioritize paid hosting policy, payout ops, and creator launch support before taking payments.`
    : 'Rise With The Tribe creator beta signal: creator revenue-share interest is being collected from first-party profile opt-ins before paid hosting or payout operations go live.';
  const monetizationLaunchCopy = monetizationSignalTotal
    ? `Rise With The Tribe launch board: ${monetizationSignalTotal} first-party monetization signals captured. Pro trial reasons: ${proTrialDemandTotal}. Creator beta opt-ins: ${creatorRevenueShareTotal}. Partner perk signals: ${partnerDemandTotal}. Next step is to validate store products, payout policy, and partner offer terms before activating paid access.`
    : 'Rise With The Tribe launch board: first-party monetization signals are being collected across Pro trials, creator beta, and partner perks before paid access goes live.';
  const storeReadinessCopy = `Rise With The Tribe store launch readiness: ${storeCatalog.length} shared product IDs are in code (${storeSubscriptionCount} subscriptions, ${storePackCount} challenge packs). Before paid access goes live: create matching App Store/Play products, configure server receipt-validation credentials, run sandbox/test purchases, and confirm entitlement writes for Pro plus packs.`;

  return {
    proTrialPitchCopy,
    proTrialObjectionReplyCopy,
    proTrialSupportEscalationCopy,
    creatorRevenueSharePitchCopy,
    monetizationLaunchCopy,
    storeReadinessCopy,
  };
}
