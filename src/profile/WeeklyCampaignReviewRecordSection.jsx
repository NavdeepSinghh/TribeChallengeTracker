import { MetricCard } from './MonetizationKitCards';

export default function WeeklyCampaignReviewRecordSection({
  approvedWeeklyCampaignReviews = [],
  campaignPerformanceSummary = {},
  featureReviewQueue = [],
  isAdmin,
  isSubmittingWeeklyCampaignReview,
  onWeeklyCampaignReviewDecision,
  onWeeklyCampaignReviewSubmit,
  recommendedLaunchExperiment,
  referralJoins = 0,
  reviewingWeeklyCampaignReviewId,
  setWeeklyCampaignReviewNotes,
  supportReviewQueue = [],
  weeklyCampaignPrompt = {},
  weeklyCampaignReviewMessage,
  weeklyCampaignReviewNotes = {},
  weeklyCampaignReviewQueue = [],
}) {
  const campaignReach = campaignPerformanceSummary.memberReach || 0;
  const supportRiskCount = supportReviewQueue.length || 0;
  const featureSubmissionCount = featureReviewQueue.length || 0;

  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(251,191,36,0.05)',
      border: '1px solid rgba(251,191,36,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>WEEKLY CAMPAIGN REVIEW RECORD</p>
          <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: 10, lineHeight: 1.4 }}>
            Save post-campaign evidence from first-party app movement before repeating or retiring this weekly push.
          </p>
        </div>
        <span style={{ color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          REVIEW ONLY
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <MetricCard label="REACH" value={campaignReach} color="#FBBF24" />
        <MetricCard label="REFERRALS" value={referralJoins} color="#60A5FA" />
        <MetricCard label="FEATURES" value={featureSubmissionCount} color="#F472B6" />
        <MetricCard label="SUPPORT" value={supportRiskCount} color="#F87171" />
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45 }}>
        Campaign: <strong style={{ color: '#fff' }}>{weeklyCampaignPrompt.name || 'This week'}</strong> · {weeklyCampaignPrompt.hashtag || '#RiseWithTheTribe'} · recommended experiment {recommendedLaunchExperiment?.label || 'Pro Trial CTA'}. This record writes weeklyCampaignReviews with manualReviewOnly true, createsAttribution false, hasTrackingPixels false, and isPaidAccessLive false. It does not create attribution records, tracking pixels, auto-posting, scraped DMs, purchases, entitlements, or paid-access changes.
      </p>
      <button
        onClick={onWeeklyCampaignReviewSubmit}
        disabled={isSubmittingWeeklyCampaignReview}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(251,191,36,0.30)', background: isSubmittingWeeklyCampaignReview ? 'rgba(255,255,255,0.04)' : 'rgba(251,191,36,0.12)',
          color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        {isSubmittingWeeklyCampaignReview ? 'SAVING...' : 'SAVE WEEKLY REVIEW'}
      </button>
      {weeklyCampaignReviewMessage && (
        <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
          {weeklyCampaignReviewMessage}
        </p>
      )}
      {isAdmin && (
        <div style={{ marginTop: 12 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900 }}>WEEKLY CAMPAIGN REVIEW QUEUE</p>
          {weeklyCampaignReviewQueue.length === 0 ? (
            <p style={{ margin: '8px 0 0', color: '#777', fontSize: 10 }}>No weekly campaign review records waiting.</p>
          ) : weeklyCampaignReviewQueue.slice(0, 4).map(review => (
            <div key={review.id} style={{ marginTop: 10, padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>{review.campaignName} · {review.reviewScore || 0}/100</p>
              <p style={{ margin: '4px 0 0', color: '#999', fontSize: 10 }}>
                {review.displayName || review.email || review.uid} · reach {review.campaignReach || 0} · referrals {review.referralJoins || 0}
              </p>
              <input
                value={weeklyCampaignReviewNotes[review.id] || ''}
                onChange={event => setWeeklyCampaignReviewNotes?.(notes => ({
                  ...(notes || {}),
                  [review.id]: event.target.value,
                }))}
                placeholder="Manual weekly review note"
                style={{ marginTop: 8, width: '100%', boxSizing: 'border-box', borderRadius: 8, padding: 8, background: '#111', color: '#fff', border: '1px solid #333', fontSize: 10 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 8 }}>
                {[
                  ['approved', 'APPROVE'],
                  ['waiting', 'WAIT'],
                  ['not_ready', 'NOT READY'],
                  ['declined', 'DECLINE'],
                ].map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => onWeeklyCampaignReviewDecision?.(review, status)}
                    disabled={reviewingWeeklyCampaignReviewId === review.id}
                    style={{ borderRadius: 8, padding: 7, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 9, fontWeight: 900 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p style={{ margin: '12px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>APPROVED WEEKLY CAMPAIGN REVIEWS</p>
          <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10 }}>
            {approvedWeeklyCampaignReviews.length} approved manual records. Approved records still create no attribution records, tracking pixels, auto-posting, scraped DMs, purchases, entitlements, or paid-access changes.
          </p>
        </div>
      )}
    </div>
  );
}
