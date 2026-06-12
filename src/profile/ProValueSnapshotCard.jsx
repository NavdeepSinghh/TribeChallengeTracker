import { GOLD } from './profileConstants';
import ProValueCopyKitCard from './ProValueCopyKitCard';
import ProValueMetricsGrid from './ProValueMetricsGrid';

export default function ProValueSnapshotCard({
  proActive,
  weeklyReport,
  monthlyRecap,
  totalChallengePoints,
  proValueNextAction,
  valueProofStoryCopy,
  storyPostingChecklistCopy,
  challengePackLaunchCopy,
  challengePackLaunchQaCopy,
  challengePackObjectionReplyCopy,
  challengePackSupportTriageCopy,
  communityHighlightRoundupItems,
  copyText,
}) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 12, padding: 12,
      background: proActive ? 'rgba(255,215,0,0.10)' : 'rgba(96,165,250,0.08)',
      border: `1px solid ${proActive ? 'rgba(255,215,0,0.22)' : 'rgba(96,165,250,0.18)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 9 }}>
        <p style={{ margin: 0, color: proActive ? GOLD : '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO VALUE SNAPSHOT</p>
        <p style={{ margin: 0, color: proActive ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {proActive ? 'UNLOCKED' : 'PREVIEW'}
        </p>
      </div>
      <ProValueMetricsGrid
        monthlyRecap={monthlyRecap}
        proActive={proActive}
        totalChallengePoints={totalChallengePoints}
        weeklyReport={weeklyReport}
      />
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {proValueNextAction}
      </p>
      <ProValueCopyKitCard
        title="VALUE PROOF STORY KIT"
        subtitle="Copy a progress-proof Story"
        status={weeklyReport.status}
        body="Turn current points, streak, weekly score, and campaign prompt into a manual Instagram Story proof asset."
        buttonLabel="COPY VALUE PROOF STORY"
        accent="#14B8A6"
        softText="#CCFBF1"
        subtitleColor="#99F6E4"
        onCopy={() => copyText(valueProofStoryCopy, 'Value proof story copied')}
      />
      <ProValueCopyKitCard
        title="STORY POSTING CHECKLIST KIT"
        subtitle="Manual weekly Story sequence"
        status={`${communityHighlightRoundupItems.length} UGC`}
        body="Bundle the campaign CTA, app proof, comeback prompt, referral action, and consent-cleared highlights into a manual Story checklist."
        buttonLabel="COPY STORY POSTING CHECKLIST"
        accent="#60A5FA"
        softText="#DBEAFE"
        subtitleColor="#BFDBFE"
        onCopy={() => copyText(storyPostingChecklistCopy, 'Story posting checklist copied')}
      />
      <ProValueCopyKitCard
        title="CHALLENGE PACK LAUNCH KIT"
        subtitle="Paid-pack demand copy"
        status="PENDING STORE QA"
        body="Copy launch messaging for challenge pack demand while store credentials, test purchases, restore, and entitlement QA remain gated."
        buttonLabel="COPY PACK LAUNCH COPY"
        accent="#A78BFA"
        softText="#EDE9FE"
        subtitleColor="#DDD6FE"
        onCopy={() => copyText(challengePackLaunchCopy, 'Challenge pack launch copy copied')}
      />
      <ProValueCopyKitCard
        title="CHALLENGE PACK LAUNCH QA KIT"
        subtitle="Store and entitlement checks"
        status="COPY ONLY"
        body="Copy the store, entitlement, support, and launch-language checks that must pass before paid packs are promoted."
        buttonLabel="COPY PACK LAUNCH QA"
        accent="#22C55E"
        softText="#DCFCE7"
        subtitleColor="#BBF7D0"
        onCopy={() => copyText(challengePackLaunchQaCopy, 'Challenge pack launch QA copied')}
      />
      <ProValueCopyKitCard
        title="CHALLENGE PACK OBJECTION REPLY KIT"
        subtitle="Manual paid-pack replies"
        status="NO PAID CLAIMS"
        body="Copy replies for pack questions while pricing, purchases, marketplace validation, restore, and entitlement QA remain incomplete."
        buttonLabel="COPY PACK REPLIES"
        accent="#F59E0B"
        softText="#FEF3C7"
        subtitleColor="#FDE68A"
        onCopy={() => copyText(challengePackObjectionReplyCopy, 'Challenge pack replies copied')}
      />
      <ProValueCopyKitCard
        title="CHALLENGE PACK SUPPORT TRIAGE KIT"
        subtitle="Manual pack support handoff"
        status="SUPPORT FIRST"
        body="Copy support triage lanes for missing-pack, wrong-account, restore, refund, and launch-language questions before pack launch copy is used."
        buttonLabel="COPY PACK SUPPORT TRIAGE"
        accent="#38BDF8"
        softText="#E0F2FE"
        subtitleColor="#BAE6FD"
        onCopy={() => copyText(challengePackSupportTriageCopy, 'Challenge pack support triage copied')}
      />
    </div>
  );
}
