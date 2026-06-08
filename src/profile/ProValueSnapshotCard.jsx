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
    </div>
  );
}
