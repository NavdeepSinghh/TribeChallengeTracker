export function buildMonetizationCommunityPreLaunchCopyKits({
  campaignPerformanceSummary,
  communityAmbassadorCopy,
  communityEventInterestCopy,
  customerValueChecklistCopy,
  daysActive,
  monetizationSignalTotal,
  recommendedRevenuePath,
  referralJoins,
}) {
  return [
    {
      title: 'COMMUNITY AMBASSADOR KIT',
      subtitle: 'Recognition-led referral and challenge leadership',
      status: 'NO PAYOUTS',
      color: '#60A5FA',
      metrics: [
        { label: 'REFERRALS', value: referralJoins },
        { label: 'REACH', value: campaignPerformanceSummary.memberReach || 0 },
        { label: 'DEMAND', value: monetizationSignalTotal },
        { label: 'PATH', value: recommendedRevenuePath.label },
      ],
      body: 'Recruit ambassadors through recognition, challenge leadership, and copy prompts before any paid role, affiliate, or revenue-share model exists.',
      buttonLabel: 'COPY AMBASSADOR KIT',
      copyText: communityAmbassadorCopy,
    },
    {
      title: 'COMMUNITY EVENT INTEREST KIT',
      subtitle: 'Local meetup, merch, and finisher-moment validation',
      status: 'NO TICKETS',
      color: '#FB7185',
      metrics: [
        { label: 'ACTIVE DAYS', value: daysActive },
        { label: 'REACH', value: campaignPerformanceSummary.memberReach || 0 },
        { label: 'REFERRALS', value: referralJoins },
        { label: 'DEMAND', value: monetizationSignalTotal },
      ],
      body: 'Validate local challenge meetups, milestone merch, studio pop-ups, or finisher moments from first-party app signals before any tickets, orders, venues, or partner promises exist.',
      buttonLabel: 'COPY EVENT INTEREST KIT',
      copyText: communityEventInterestCopy,
    },
    {
      title: 'CUSTOMER VALUE CHECKLIST',
      subtitle: 'Charge only after value is visible',
      status: 'PRE-LAUNCH',
      color: '#2DD4BF',
      metrics: [
        { label: 'FREE LOOP', value: daysActive },
        { label: 'PAID SIGNAL', value: monetizationSignalTotal },
        { label: 'REACH', value: campaignPerformanceSummary.memberReach || 0 },
        { label: 'PATH', value: recommendedRevenuePath.label },
      ],
      body: 'Validate the free challenge loop, paid accountability value, community proof, and support readiness before charging users.',
      buttonLabel: 'COPY VALUE CHECKLIST',
      copyText: customerValueChecklistCopy,
    },
  ];
}
