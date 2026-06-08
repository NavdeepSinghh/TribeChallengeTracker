const paritySuites = [
  {
    "file": "crossPlatformParity.storeLaunch.test.js",
    "area": "store launch",
    "cases": [
      "keeps Store Launch Readiness admin-only on all platforms",
      "keeps purchase sync and restore hooks visible across platforms",
      "keeps Store Credential Setup Kit wired across profile surfaces",
      "keeps Paid Launch Decision Gate wired without payment or entitlement side effects",
      "keeps Paid Launch Decision Reply Kit copy-only across platforms",
      "keeps Sandbox Purchase Test Plan wired without live charge or entitlement side effects",
      "keeps Store Listing Copy Kit wired without paid-live or policy side effects",
      "keeps Store Review Submission Kit wired without reviewer or entitlement side effects",
      "keeps Store Review Evidence Pack copy-only across platforms"
    ]
  },
  {
    "file": "crossPlatformParity.storeReview.test.js",
    "area": "store review and evidence",
    "cases": [
      "keeps policy and support links hosted and visible across platforms",
      "keeps Data Safety Disclosure Kit wired without privacy-label side effects",
      "keeps Release QA Checklist wired across admin and creator profile surfaces",
      "keeps Store Test Purchase Evidence Log admin-only without entitlement side effects",
      "keeps Store Test Evidence Decision Reply Kit copy-only across platforms",
      "keeps Store Launch Dry-Run Kit copy-only across platforms",
      "keeps Store Demo Account Kit reviewer-safe across platforms",
      "keeps Store Review Pack prep-only across platforms"
    ]
  },
  {
    "file": "crossPlatformParity.creatorHosting.test.js",
    "area": "creator hosting",
    "cases": [
      "keeps creator-branded challenge fields on all platforms",
      "keeps creator revenue-share readiness wired on all platforms",
      "keeps Creator Launch Kit wired on all platforms",
      "keeps Creator Challenge Template Draft Kit wired on all platforms without template, tracking, or paid-hosting side effects",
      "keeps Creator Branded Page Preview Kit wired on all platforms without page, tracking, or paid-hosting side effects",
      "keeps Private Creator Invite Kit wired on all platforms without invite or paid-hosting side effects",
      "keeps Creator Hosting Offer Kit wired on all platforms without paid-hosting side effects",
      "keeps Creator Terms Readiness Kit wired on all platforms without payout or contract side effects",
      "keeps Creator Payout Readiness Kit wired on all platforms without payout side effects",
      "keeps Creator Hosting Objection Reply Kit wired on all platforms without paid-hosting side effects",
      "keeps Creator Hosting Decision Reply Kit copy-only across platforms",
      "keeps Creator Hosting Application review wired across platforms without paid-hosting side effects"
    ]
  },
  {
    "file": "crossPlatformParity.communityLaunch.test.js",
    "area": "community launch",
    "cases": [
      "keeps Referral Launch Kit wired on all platforms",
      "keeps Instagram Content Calendar wired on all platforms",
      "keeps Community Highlight and UGC Consent kits wired on all platforms",
      "keeps community highlights for featured submissions wired on all platforms",
      "keeps Instagram Weekly Prompt Kit wired on all platforms",
      "keeps Launch Experiment Kit wired across admin and creator profile surfaces",
      "keeps Launch Experiment Scorecard wired across admin and creator profile surfaces",
      "keeps Lapsed Member Winback Kit free-first across platforms",
      "keeps Launch Retrospective Kit wired across admin and creator profile surfaces"
    ]
  },
  {
    "file": "crossPlatformParity.challengePacks.test.js",
    "area": "challenge pack",
    "cases": [
      "keeps Challenge Pack Launch Kit wired on all platforms",
      "keeps paid pack product IDs in native store catalogs",
      "keeps premium pack accountability prompts wired on all platforms",
      "keeps paid pack value preview visible on challenge templates"
    ]
  },
  {
    "file": "crossPlatformParity.supportBilling.test.js",
    "area": "support and billing",
    "cases": [
      "keeps Support Refund Readiness Kit wired without refund or entitlement side effects",
      "keeps Entitlement Recovery Request wired across platforms without purchase side effects",
      "keeps Entitlement Recovery Decision Reply Kit copy-only across platforms",
      "keeps Feature Submission Review Notes wired across platforms without auto-posting",
      "keeps Subscription Management Guidance Kit marketplace-first across platforms",
      "keeps Billing Support Escalation Kit marketplace-first across platforms",
      "keeps Renewal Recovery Kit restore-first across platforms",
      "keeps Cancellation Feedback Kit learn-only across platforms"
    ]
  }
];

describe('cross-platform feature parity suite map', () => {
  it('keeps parity coverage split into focused suites', () => {
    expect(paritySuites).toHaveLength(6);
    expect(paritySuites.flatMap((suite) => suite.cases)).toHaveLength(50);
    expect(paritySuites.map((suite) => suite.area)).toEqual([
      'store launch',
      'store review and evidence',
      'creator hosting',
      'community launch',
      'challenge pack',
      'support and billing',
    ]);
  });
});
