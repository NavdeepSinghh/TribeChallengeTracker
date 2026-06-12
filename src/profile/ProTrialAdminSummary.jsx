import { PRO_TRIAL_REASONS } from './profileConstants';

export default function ProTrialAdminSummary({
  proTrialDemandTotal,
  proTrialObjectionReplyCopy,
  proTrialPitchCopy,
  proTrialSupportEscalationCopy,
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
  const proTrialReviewDecisionReplyCopy = [
    'Rise With The Tribe Pro Trial Review Decision Reply Kit:',
    '',
    `Open Pro trial reviews: ${proTrialReviewQueue.length}`,
    `Approved Pro trial reviews: ${approvedProTrialReviews.length}`,
    `First-party Pro trial signals: ${proTrialDemandTotal}`,
    `Top Pro trial interest: ${topProTrialReason?.label || 'Gathering demand'}`,
    '',
    'Manual Pro trial decision replies:',
    'APPROVED FOR MANUAL TRIAL READINESS: This Pro trial review is approved for manual readiness planning. Use the first-party interest signal to refine onboarding, value proof, support readiness, store QA, and entitlement recovery checks without starting a trial, creating a purchase, granting Pro, writing entitlements, or claiming paid access is live.',
    '',
    'WAITING ON STORE TRIAL READINESS: This Pro trial review is waiting on store setup, sandbox/license testing, pricing copy, support coverage, entitlement QA, and recovery evidence before any trial promise or launch message is used.',
    '',
    'NOT READY FOR TRIAL HANDOFF: This review is not ready for trial handoff. Keep collecting first-party Pro interest, challenge consistency proof, support notes, and store validation evidence before mentioning trial access, pricing, discounts, purchases, or paid benefits.',
    '',
    'DECLINED FOR TRIAL HANDOFF: We are not using this review for Pro trial launch planning right now because the interest, value proof, support readiness, or store validation evidence is not strong enough. Keep the member in the free challenge loop without pressure.',
    '',
    'This is a manual Pro Trial Review Decision Reply Kit only. Do not start trials, create purchases, grant Pro, write entitlements, unlock paid access, collect payment details, offer discounts, process refunds, bypass App Store or Google Play policy, claim store-backed trials are live, promise outcomes, imply medical results, auto-message users, scrape/store DMs, add tracking pixels, or pressure members.',
  ].join('\n');

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
        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL REVIEW DECISION REPLY KIT</p>
          <p style={{ margin: 0, color: proTrialReviewQueue.length ? '#FBBF24' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            COPY ONLY
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
          {[
            ['OPEN', proTrialReviewQueue.length],
            ['APPROVED', approvedProTrialReviews.length],
            ['SIGNALS', proTrialDemandTotal],
          ].map(([label, value]) => (
            <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ margin: 0, color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
              <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          Copy approved, waiting, not-ready, and declined Pro trial review replies without starting trials, purchases, Pro grants, entitlements, paid access, discounts, refunds, tracking, or pressure.
        </p>
        <button
          onClick={() => navigator.clipboard?.writeText(proTrialReviewDecisionReplyCopy)}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(251,191,36,0.22)', background: 'rgba(251,191,36,0.10)',
            color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          COPY PRO TRIAL DECISION REPLIES
        </button>
      </div>
      <div style={{
        marginTop: 10, borderRadius: 12, padding: 11,
        background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL SUPPORT ESCALATION KIT</p>
          <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>COPY ONLY</p>
        </div>
        <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          Route store setup, value proof, support coverage, entitlement QA, marketplace handoff, and refund confusion without starting trials, purchases, Pro grants, or paid-access changes.
        </p>
        <button
          onClick={() => navigator.clipboard?.writeText(proTrialSupportEscalationCopy)}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(56,189,248,0.22)', background: 'rgba(56,189,248,0.10)',
            color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          COPY PRO TRIAL SUPPORT KIT
        </button>
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
