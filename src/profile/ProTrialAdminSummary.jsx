import { PRO_TRIAL_REASONS } from './profileConstants';

export default function ProTrialAdminSummary({
  proTrialDemandTotal,
  proTrialObjectionReplyCopy,
  proTrialPitchCopy,
  proTrialReviewMessage,
  proTrialReviewNotes = {},
  proTrialReviewQueue = [],
  proTrialSummary,
  approvedProTrialReviews = [],
  onProTrialReviewDecision,
  onProTrialReviewSubmit,
  isSubmittingProTrialReview,
  reviewingProTrialReviewId,
  setProTrialReviewNotes,
  topProTrialReason,
}) {
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ margin: '0 0 8px', color: '#fff', fontSize: 11, fontWeight: 900 }}>Pro trial demand summary</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {PRO_TRIAL_REASONS.map(reason => (
          <div key={reason.id} style={{
            borderRadius: 10, padding: 8,
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{reason.label.toUpperCase()}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{proTrialSummary[reason.id] || 0}</p>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 10, borderRadius: 12, padding: 11,
        background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>TRIAL LAUNCH KIT</p>
          <p style={{ margin: 0, color: topProTrialReason?.demand ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {topProTrialReason?.demand ? `${topProTrialReason.label.toUpperCase()} LEADS` : 'GATHERING'}
          </p>
        </div>
        <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          {proTrialPitchCopy}
        </p>
        <button
          onClick={() => navigator.clipboard?.writeText(proTrialPitchCopy)}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
            color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          COPY TRIAL LAUNCH COPY
        </button>
      </div>
      <div style={{
        marginTop: 10, borderRadius: 12, padding: 11,
        background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL REVIEW RECORD</p>
          <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>REVIEW ONLY</p>
        </div>
        <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          Save first-party Pro Trial Interest evidence into proTrialReviews for manual admin review with manualReviewOnly true, startsTrial false, createsPurchase false, writesEntitlements false, and isPaidAccessLive false.
        </p>
        <button
          onClick={onProTrialReviewSubmit}
          disabled={isSubmittingProTrialReview}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
            color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          {isSubmittingProTrialReview ? 'SAVING...' : 'SAVE PRO TRIAL REVIEW'}
        </button>
        {proTrialReviewMessage && (
          <p style={{ margin: '8px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
            {proTrialReviewMessage}
          </p>
        )}
        <p style={{ margin: '12px 0 0', color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL REVIEW QUEUE</p>
        {proTrialReviewQueue.length === 0 ? (
          <p style={{ margin: '7px 0 0', color: '#777', fontSize: 10 }}>No Pro trial review records waiting.</p>
        ) : proTrialReviewQueue.slice(0, 4).map(review => (
          <div key={review.id} style={{ marginTop: 8, padding: 9, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>{review.topReasonLabel || 'Pro trial'} · {review.reviewScore || 0}/100</p>
            <p style={{ margin: '4px 0 0', color: '#999', fontSize: 10 }}>
              {review.displayName || review.email || review.uid} · selected {review.selectedReasonCount || 0} · demand {review.demandTotal || 0}
            </p>
            <input
              value={proTrialReviewNotes[review.id] || ''}
              onChange={event => setProTrialReviewNotes?.(notes => ({
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
                  onClick={() => onProTrialReviewDecision?.(review, status)}
                  disabled={reviewingProTrialReviewId === review.id}
                  style={{ borderRadius: 8, padding: 7, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 9, fontWeight: 900 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p style={{ margin: '10px 0 0', color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>APPROVED PRO TRIAL REVIEWS</p>
        <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10 }}>
          {approvedProTrialReviews.length} approved manual records. Approved records still start no trials, create no purchases, write no entitlements, and make no paid-access changes.
        </p>
      </div>
      <div style={{
        marginTop: 10, borderRadius: 12, padding: 11,
        background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL OBJECTION REPLY KIT</p>
          <p style={{ margin: 0, color: proTrialDemandTotal ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {proTrialDemandTotal ? `${proTrialDemandTotal} SIGNALS` : 'GATHERING'}
          </p>
        </div>
        <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          Copy manual replies for Pro questions without claiming live trials, prices, purchases, discounts, or entitlements.
        </p>
        <button
          onClick={() => navigator.clipboard?.writeText(proTrialObjectionReplyCopy)}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
            color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          COPY PRO TRIAL REPLIES
        </button>
      </div>
    </div>
  );
}
