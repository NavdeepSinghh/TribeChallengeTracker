import { COMMUNITY_EVENT_INTEREST_OPTIONS } from '../communityEvents';
import CommunityEventInterestFooter from './CommunityEventInterestFooter';
import CommunityEventInterestOptionButton from './CommunityEventInterestOptionButton';

export default function CommunityEventInterestSection({
  communityEventInterestMessage,
  communityEventInterestSummary,
  communityEventReviewMessage,
  communityEventReviewNotes = {},
  communityEventReviewQueue = [],
  communityEventReviewDecisionReplyCopy,
  communityEventSupportEscalationCopy,
  approvedCommunityEventReviews = [],
  isAdmin,
  isSubmittingCommunityEventReview,
  isSavingCommunityEventInterest,
  onCommunityEventReviewDecision,
  onCommunityEventReviewSubmit,
  onCommunityEventInterestToggle,
  reviewingCommunityEventReviewId,
  selectedCommunityEventInterestIds,
  setCommunityEventReviewNotes,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(251,113,133,0.05)',
      border: '1px solid rgba(251,113,133,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>COMMUNITY EVENT INTEREST</p>
          <p style={{ margin: '4px 0 0', color: '#FB7185', fontSize: 10, fontFamily: 'monospace' }}>
            First-party event demand, no commerce
          </p>
        </div>
        <span style={{ color: selectedCommunityEventInterestIds.length ? '#FB7185' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {selectedCommunityEventInterestIds.length ? `${selectedCommunityEventInterestIds.length} SAVED` : 'TAP TO SAVE'}
        </span>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {COMMUNITY_EVENT_INTEREST_OPTIONS.map(option => {
          const selected = selectedCommunityEventInterestIds.includes(option.id);
          return (
            <CommunityEventInterestOptionButton
              key={option.id}
              demandCount={communityEventInterestSummary[option.id]}
              isAdmin={isAdmin}
              isSavingCommunityEventInterest={isSavingCommunityEventInterest}
              onCommunityEventInterestToggle={onCommunityEventInterestToggle}
              option={option}
              selected={selected}
            />
          );
        })}
      </div>
      {isAdmin && (
        <div style={{ marginTop: 12, padding: 11, borderRadius: 12, background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
            <p style={{ margin: 0, color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>COMMUNITY EVENT REVIEW RECORD</p>
            <p style={{ margin: 0, color: '#FB7185', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>REVIEW ONLY</p>
          </div>
          <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
            Save first-party event demand into communityEventReviews with manualReviewOnly true, createsTickets false, createsOrders false, collectsPayments false, booksVenues false, promisesMerch false, createsPartnerLinks false, createsPayouts false, and writesEntitlements false.
          </p>
          <button
            onClick={onCommunityEventReviewSubmit}
            disabled={isSubmittingCommunityEventReview}
            style={{
              marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
              border: '1px solid rgba(251,113,133,0.22)', background: 'rgba(251,113,133,0.10)',
              color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            {isSubmittingCommunityEventReview ? 'SAVING...' : 'SAVE COMMUNITY EVENT REVIEW'}
          </button>
          {communityEventReviewMessage && (
            <p style={{ margin: '8px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
              {communityEventReviewMessage}
            </p>
          )}
          <p style={{ margin: '12px 0 0', color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>COMMUNITY EVENT REVIEW QUEUE</p>
          {communityEventReviewQueue.length === 0 ? (
            <p style={{ margin: '7px 0 0', color: '#777', fontSize: 10 }}>No community event review records waiting.</p>
          ) : communityEventReviewQueue.slice(0, 4).map(review => (
            <div key={review.id} style={{ marginTop: 8, padding: 9, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>{review.topEventLabel || 'Community event'} · {review.reviewScore || 0}/100</p>
              <p style={{ margin: '4px 0 0', color: '#999', fontSize: 10 }}>
                {review.displayName || review.email || review.uid} · selected {review.selectedEventCount || 0} · demand {review.demandTotal || 0}
              </p>
              <input
                value={communityEventReviewNotes[review.id] || ''}
                onChange={event => setCommunityEventReviewNotes?.(notes => ({
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
                    onClick={() => onCommunityEventReviewDecision?.(review, status)}
                    disabled={reviewingCommunityEventReviewId === review.id}
                    style={{ borderRadius: 8, padding: 7, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 9, fontWeight: 900 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p style={{ margin: '10px 0 0', color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>APPROVED COMMUNITY EVENT REVIEWS</p>
          <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10 }}>
            {approvedCommunityEventReviews.length} approved manual records. Approved records still create no tickets, orders, payments, venues, partner links, payouts, or entitlements.
          </p>
          <div style={{ marginTop: 10, padding: 10, borderRadius: 10, border: '1px solid rgba(251,113,133,0.20)', background: 'rgba(251,113,133,0.07)' }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>COMMUNITY EVENT REVIEW DECISION REPLY KIT</p>
            <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10, lineHeight: 1.45 }}>
              Copy approved, waiting, not-ready, and declined replies for manual event-review decisions without tickets, orders, payments, merch promises, venues, partner links, payouts, entitlements, tracking, or pressure.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(communityEventReviewDecisionReplyCopy || '')}
              style={{
                marginTop: 8, width: '100%', borderRadius: 10, padding: '8px 10px',
                border: '1px solid rgba(251,113,133,0.24)', background: 'rgba(251,113,133,0.10)',
                color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY EVENT REVIEW DECISION REPLIES
            </button>
          </div>
          <div style={{ marginTop: 10, padding: 10, borderRadius: 10, border: '1px solid rgba(244,63,94,0.22)', background: 'rgba(244,63,94,0.07)' }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>COMMUNITY EVENT SUPPORT ESCALATION KIT</p>
            <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10, lineHeight: 1.45 }}>
              Copy event support routing for safety, privacy, event ops, partner terms, marketplace, refund, and accessibility questions before tickets, venues, merch, payments, partner links, payouts, or entitlements exist.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(communityEventSupportEscalationCopy || '')}
              style={{
                marginTop: 8, width: '100%', borderRadius: 10, padding: '8px 10px',
                border: '1px solid rgba(244,63,94,0.24)', background: 'rgba(244,63,94,0.10)',
                color: '#F43F5E', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY EVENT SUPPORT ESCALATION
            </button>
          </div>
        </div>
      )}
      <CommunityEventInterestFooter communityEventInterestMessage={communityEventInterestMessage} />
    </div>
  );
}
