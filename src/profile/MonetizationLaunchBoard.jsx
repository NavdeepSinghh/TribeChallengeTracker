import { MetricCard } from './MonetizationKitCards';

export default function MonetizationLaunchBoard({
  approvedLaunchExperimentReviews = [],
  creatorRevenueShareTotal,
  experimentScore = 0,
  experimentScoreLabel = 'SEED',
  featureReviewQueue = [],
  isAdmin,
  isSubmittingLaunchExperimentReview,
  launchExperimentReviewMessage,
  launchExperimentReviewNotes = {},
  launchExperimentReviewQueue = [],
  monetizationLaunchCopy,
  monetizationSignalTotal,
  onLaunchExperimentReviewDecision,
  onLaunchExperimentReviewSubmit,
  partnerDemandTotal,
  proTrialDemandTotal,
  recommendedLaunchExperiment,
  referralJoins = 0,
  reviewingLaunchExperimentReviewId,
  setLaunchExperimentReviewNotes,
  supportReviewQueue = [],
}) {
  const pendingFeatureCount = featureReviewQueue.length || 0;
  const supportRiskCount = supportReviewQueue.length || 0;
  const launchExperimentReviewDecisionReplyCopy = `Rise With The Tribe Launch Experiment Review Decision Reply Kit:

Open launch experiment reviews: ${launchExperimentReviewQueue.length}
Approved launch experiment reviews: ${approvedLaunchExperimentReviews.length}
Recommended experiment: ${recommendedLaunchExperiment?.label || 'Pro Trial CTA'}
Experiment score: ${experimentScore}/100 (${experimentScoreLabel})

Manual decision replies:
APPROVED FOR MANUAL TESTING: This launch experiment review is approved for manual planning. Use first-party app signals to run the next safe test without creating attribution records, tracking pixels, purchases, entitlements, or paid-access changes.

WAITING ON CLEAN SIGNALS: This experiment has useful context, but it needs clearer first-party app movement before promotion. Add challenge joins, referral joins, Feature Me status, support risk, or share-card notes before treating it as launch evidence.

NOT READY YET: This launch experiment is not ready to guide a public push. Keep the idea internal until the app-first signal, consent, and support-risk checks are stronger.

DECLINED FOR NOW: This experiment should not shape the next launch push right now. Use a safer test or keep gathering first-party evidence before repeating this angle.

This is a manual Launch Experiment Review Decision Reply Kit only. Do not create attribution records, add tracking pixels, auto-post, scrape DMs, store inbound replies, create purchases, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure members.`;

  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Monetization Launch Board</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Admin-only first-party demand signals
          </p>
        </div>
        <span style={{ color: monetizationSignalTotal ? '#34D399' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {monetizationSignalTotal ? 'SIGNALS LIVE' : 'GATHERING'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'TOTAL', value: monetizationSignalTotal, color: '#FFD166' },
          { label: 'PRO TRIAL', value: proTrialDemandTotal, color: '#A78BFA' },
          { label: 'CREATOR', value: creatorRevenueShareTotal, color: '#34D399' },
          { label: 'PARTNER', value: partnerDemandTotal, color: '#60A5FA' },
        ].map(metric => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {monetizationLaunchCopy}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(monetizationLaunchCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
          color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY LAUNCH BOARD COPY
      </button>
      <div style={{
        marginTop: 12, padding: 12, borderRadius: 12,
        border: '1px solid rgba(52,211,153,0.24)', background: 'rgba(52,211,153,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900 }}>LAUNCH EXPERIMENT REVIEW RECORD</p>
            <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: 10, lineHeight: 1.4 }}>
              Save first-party experiment evidence for manual admin review before any monetization launch.
            </p>
          </div>
          <span style={{ color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            REVIEW ONLY
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
          <MetricCard label="SCORE" value={experimentScore} color="#FFD166" />
          <MetricCard label="REFERRALS" value={referralJoins} color="#60A5FA" />
          <MetricCard label="FEATURES" value={pendingFeatureCount} color="#F472B6" />
          <MetricCard label="SUPPORT" value={supportRiskCount} color="#F87171" />
        </div>
        <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45 }}>
          Recommended: <strong style={{ color: '#fff' }}>{recommendedLaunchExperiment?.label || 'Pro Trial CTA'}</strong> ({experimentScoreLabel}). This record writes launchExperimentReviews and does not create attribution records, tracking pixels, purchases, entitlements, or paid-access changes.
        </p>
        <button
          onClick={onLaunchExperimentReviewSubmit}
          disabled={isSubmittingLaunchExperimentReview}
          style={{
            marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(52,211,153,0.30)', background: isSubmittingLaunchExperimentReview ? 'rgba(255,255,255,0.04)' : 'rgba(52,211,153,0.12)',
            color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          {isSubmittingLaunchExperimentReview ? 'SAVING...' : 'SAVE EXPERIMENT REVIEW'}
        </button>
        {launchExperimentReviewMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
            {launchExperimentReviewMessage}
          </p>
        )}
      </div>
      {isAdmin && (
        <div style={{ marginTop: 12 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900 }}>LAUNCH EXPERIMENT REVIEW QUEUE</p>
          {launchExperimentReviewQueue.length === 0 ? (
            <p style={{ margin: '8px 0 0', color: '#777', fontSize: 10 }}>No launch experiment review records waiting.</p>
          ) : launchExperimentReviewQueue.slice(0, 4).map(review => (
            <div key={review.id} style={{ marginTop: 10, padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>{review.recommendedExperimentLabel} · {review.experimentScore}/100</p>
              <p style={{ margin: '4px 0 0', color: '#999', fontSize: 10 }}>
                {review.displayName || review.email || review.uid} · reach {review.campaignReach || 0} · referrals {review.referralJoins || 0}
              </p>
              <input
                value={launchExperimentReviewNotes[review.id] || ''}
                onChange={event => setLaunchExperimentReviewNotes?.(notes => ({
                  ...(notes || {}),
                  [review.id]: event.target.value,
                }))}
                placeholder="Manual review note"
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
                    onClick={() => onLaunchExperimentReviewDecision?.(review, status)}
                    disabled={reviewingLaunchExperimentReviewId === review.id}
                    style={{ borderRadius: 8, padding: 7, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 9, fontWeight: 900 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p style={{ margin: '12px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>APPROVED LAUNCH EXPERIMENT REVIEWS</p>
          <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10 }}>
            {approvedLaunchExperimentReviews.length} approved manual records. Approved records still create no attribution records, tracking pixels, purchases, entitlements, or paid-access changes.
          </p>
          <div style={{
            marginTop: 10, padding: 10, borderRadius: 10,
            border: '1px solid rgba(52,211,153,0.20)', background: 'rgba(52,211,153,0.05)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>
              LAUNCH EXPERIMENT REVIEW DECISION REPLY KIT
            </p>
            <p style={{ margin: '6px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy approved, waiting, not-ready, and declined replies for manual launch experiment decisions without attribution records, tracking pixels, purchases, entitlements, or paid-access claims.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(launchExperimentReviewDecisionReplyCopy)}
              style={{
                marginTop: 8, width: '100%', borderRadius: 8, padding: 8,
                border: '1px solid rgba(52,211,153,0.24)', background: 'rgba(52,211,153,0.10)',
                color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LAUNCH EXPERIMENT DECISION REPLIES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
