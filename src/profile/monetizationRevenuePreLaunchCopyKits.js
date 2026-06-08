export function buildMonetizationRevenuePreLaunchCopyKits({
  campaignPerformanceSummary,
  founderMemberOfferCopy,
  monetizationSignalTotal,
  pricingTestKitCopy,
  recommendedRevenuePath,
  referralJoins,
  storePackCount,
  storeSubscriptionCount,
}) {
  return [
    {
      title: 'PRICING TEST KIT',
      subtitle: 'Manual pricing language before store launch',
      status: `${storeSubscriptionCount + storePackCount} IDS`,
      color: '#F59E0B',
      metrics: [
        { label: 'SUBSCRIPTIONS', value: storeSubscriptionCount },
        { label: 'PACKS', value: storePackCount },
        { label: 'PATH', value: recommendedRevenuePath.label },
        { label: 'SIGNAL', value: recommendedRevenuePath.signal },
      ],
      body: 'Validate pricing language manually with your audience before store products, receipt validation, and entitlement QA are complete.',
      buttonLabel: 'COPY PRICING TEST KIT',
      copyText: pricingTestKitCopy,
    },
    {
      title: 'FOUNDER MEMBER OFFER KIT',
      subtitle: 'Early-member value validation before paid access',
      status: 'NO SALE',
      color: '#F472B6',
      metrics: [
        { label: 'DEMAND', value: monetizationSignalTotal },
        { label: 'REACH', value: campaignPerformanceSummary.memberReach || 0 },
        { label: 'REFERRALS', value: referralJoins },
        { label: 'PATH', value: recommendedRevenuePath.label },
      ],
      body: 'Invite early members into the free challenge loop and collect first-party interest before any founder pricing, purchase, or entitlement exists.',
      buttonLabel: 'COPY FOUNDER OFFER KIT',
      copyText: founderMemberOfferCopy,
    },
  ];
}
