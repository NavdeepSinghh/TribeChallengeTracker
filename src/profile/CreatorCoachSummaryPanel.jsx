import CreatorCoachMetricGrid from './CreatorCoachMetricGrid';
import { GOLD } from './profileConstants';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function CreatorCoachSummaryPanel({
  creatorAnalytics,
  creatorEnabled,
  creatorRevenueShareInterest,
  proActive,
  setCreatorEnabled,
  setCreatorRevenueShareInterest,
}) {
  const enabled = !V1_PAID_FEATURES_ENABLED || proActive;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Creator / Coach Mode</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Public profile foundation for future hosted challenges
          </p>
        </div>
        <span style={{ color: creatorEnabled ? '#60A5FA' : (enabled ? GOLD : '#777'), fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {creatorEnabled ? 'LIVE' : (enabled ? 'V1' : 'LATER')}
        </span>
      </div>
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 10, color: '#ddd', fontSize: 12, fontWeight: 900,
      }}>
        Enable creator profile
        <input
          type="checkbox"
          checked={creatorEnabled}
          disabled={!enabled}
          onChange={e => setCreatorEnabled(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#60A5FA' }}
        />
      </label>
      <CreatorCoachMetricGrid
        color="#60A5FA"
        metrics={[
          ['HOSTED', creatorAnalytics.hosted],
          ['MEMBERS', creatorAnalytics.members],
          ['ACTIVE', creatorAnalytics.active],
          ['PRIVATE', creatorAnalytics.private],
        ]}
        proActive={enabled}
      />
      <CreatorCoachMetricGrid
        color="#34D399"
        metrics={[
          ['PAID PACKS', creatorAnalytics.paidPacks],
          ['READY', creatorAnalytics.revenueReady],
        ]}
        proActive={enabled}
      />
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 10, color: '#ddd', fontSize: 12, fontWeight: 900,
      }}>
        Opt into future revenue-share beta
        <input
          type="checkbox"
          checked={creatorRevenueShareInterest}
          disabled={!enabled}
          onChange={e => setCreatorRevenueShareInterest(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#34D399' }}
        />
      </label>
    </>
  );
}
