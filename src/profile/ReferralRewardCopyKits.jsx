import { ReferralCopyCard } from './ReferralRewardCards';

export default function ReferralRewardCopyKits({
  copyText,
  referralJoins,
  referralLaunchCopy,
  referralRewardSocialProofCopy,
  referralState,
  referralStorySprintCopy,
  unlockedReferralRewardTier,
}) {
  return (
    <>
      <ReferralCopyCard
        title="REFERRAL LAUNCH KIT"
        subtitle="Next-tier invite launch plan"
        status={referralState.next ? `${referralState.remainingToNext} TO NEXT` : 'TIERS CLEAR'}
        color="#34D399"
        body={referralState.next
          ? `Push toward ${referralState.next.label} with launch copy, app-link guidance, and first-party join review.`
          : 'Keep inviting new members with launch copy and first-party join review after the current ladder is complete.'}
        buttonLabel="COPY REFERRAL LAUNCH COPY"
        onCopy={() => copyText(referralLaunchCopy, 'Referral launch copy copied')}
      />

      <ReferralCopyCard
        title="REFERRAL STORY SPRINT KIT"
        subtitle="Story/Reel invite around your next tier"
        status={referralState.next ? `${referralJoins}/${referralState.next.target}` : `${referralJoins} JOINS`}
        color="#14B8A6"
        metrics={[
          { label: 'NEXT', value: referralState.next?.label || 'LADDER CLEAR' },
          { label: 'LEFT', value: referralState.next ? referralState.remainingToNext : 0 },
          { label: 'STORY', value: '4 FRAMES' },
        ]}
        body="Copy a consent-safe Story/Reel sprint that invites one accountability partner back into the app challenge loop."
        buttonLabel="COPY REFERRAL STORY SPRINT"
        onCopy={() => copyText(referralStorySprintCopy, 'Referral story sprint copied')}
      />

      <ReferralCopyCard
        title="REFERRAL REWARD SOCIAL PROOF KIT"
        subtitle="Reward-tier celebration copy"
        status={unlockedReferralRewardTier ? unlockedReferralRewardTier.label.toUpperCase() : 'PREP'}
        color="#38BDF8"
        metrics={[
          { label: 'TIER', value: unlockedReferralRewardTier?.label || 'NEXT' },
          { label: 'JOINS', value: referralJoins },
          { label: 'FORMAT', value: 'STORY + CAROUSEL' },
        ]}
        body="Copy a reward-tier Story/carousel caption that turns first-party referral progress into Instagram social proof while keeping fulfillment manual."
        buttonLabel="COPY REFERRAL SOCIAL PROOF"
        onCopy={() => copyText(referralRewardSocialProofCopy, 'Referral reward social proof copied')}
      />
    </>
  );
}
