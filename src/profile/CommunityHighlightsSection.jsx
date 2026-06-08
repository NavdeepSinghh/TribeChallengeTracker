import CommunityHighlightCopyKitCard from './CommunityHighlightCopyKitCard';
import FeaturedSubmissionList from './FeaturedSubmissionList';

export default function CommunityHighlightsSection({
  featuredSubmissions,
  communityHighlightRoundupItems,
  communityHighlightRoundupCopy,
  ugcConsentReminderCopy,
  featureReviewQueue,
  copyText,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Community highlights</p>
      <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
        Featured tribe wins ready for Instagram reposts.
      </p>
      <FeaturedSubmissionList featuredSubmissions={featuredSubmissions} />
      <CommunityHighlightCopyKitCard
        accent="#34D399"
        body="Copy a consent-safe weekly roundup using only submissions already marked featured."
        buttonLabel="COPY HIGHLIGHT ROUNDUP"
        copyText={communityHighlightRoundupCopy}
        copyTextAction={copyText}
        copyToast="Community highlight roundup copied"
        count={`${communityHighlightRoundupItems.length} READY`}
        subtitle="Weekly featured-win roundup copy"
        title="COMMUNITY HIGHLIGHT ROUNDUP KIT"
      />
      <CommunityHighlightCopyKitCard
        accent="#60A5FA"
        body="Copy a consent reminder before reposting member wins, with review status, attribution, and claim-safety checks."
        buttonLabel="COPY UGC CONSENT REMINDER"
        copyText={ugcConsentReminderCopy}
        copyTextAction={copyText}
        copyToast="UGC consent reminder copied"
        count={`${featureReviewQueue.length} REVIEW`}
        subtitle="Manual repost safety checklist"
        title="UGC CONSENT REMINDER KIT"
      />
    </div>
  );
}
