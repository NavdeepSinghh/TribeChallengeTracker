import CopyOnlyCard from './CopyOnlyCard';

export default function PartnerPerkCopyKits({
  hasClaims,
  partnerPerkClaimReviewQueue,
  partnerPerkDecisionReplyCopy,
  partnerPerkFulfillmentHandoffCopy,
  partnerPerkFulfillmentReadinessCopy,
  partnerPerkHandoffAuditCopy,
  partnerPerkHandoffAuditDecisionReplyCopy,
  partnerPerkSupportEscalationCopy,
}) {
  return (
    <>
      <CopyOnlyCard
        accent="#67E8F9"
        title="PARTNER PERK DECISION REPLY KIT"
        status={{ label: 'COPY ONLY', color: hasClaims ? '#67E8F9' : '#777' }}
        body="Copy approved, waiting, not-ready, and declined replies for manual claim decisions without creating coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims."
        buttonLabel="COPY PERK DECISION REPLIES"
        copyText={partnerPerkDecisionReplyCopy}
      />
      <CopyOnlyCard
        accent="#38BDF8"
        title="PARTNER PERK FULFILLMENT READINESS KIT"
        status={{ label: `${partnerPerkClaimReviewQueue.length} CLAIMS`, color: hasClaims ? '#38BDF8' : '#777' }}
        body="Copy manual claim-readiness checks before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist."
        buttonLabel="COPY PERK FULFILLMENT KIT"
        copyText={partnerPerkFulfillmentReadinessCopy}
      />
      <CopyOnlyCard
        accent="#7DD3FC"
        title="PARTNER PERK FULFILLMENT HANDOFF KIT"
        status={{ label: 'COPY ONLY', color: hasClaims ? '#7DD3FC' : '#777' }}
        body="Copy manual handoff notes for approved perk claims before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist."
        buttonLabel="COPY PERK HANDOFF KIT"
        copyText={partnerPerkFulfillmentHandoffCopy}
      />
      <CopyOnlyCard
        accent="#86EFAC"
        title="PARTNER PERK HANDOFF AUDIT KIT"
        status={{ label: 'COPY ONLY', color: hasClaims ? '#86EFAC' : '#777' }}
        body="Copy manual audit checks after perk handoff so support outcomes stay aggregate-only before coupons, partner links, payouts, discounts, purchases, entitlements, refunds, or fulfillment promises exist."
        buttonLabel="COPY PERK AUDIT KIT"
        copyText={partnerPerkHandoffAuditCopy}
      />
      <CopyOnlyCard
        accent="#BBF7D0"
        title="PARTNER PERK HANDOFF AUDIT DECISION REPLY KIT"
        status={{ label: 'COPY ONLY', color: hasClaims ? '#BBF7D0' : '#777' }}
        body="Copy approved, waiting, not-ready, and declined replies for manual audit handoff decisions without coupons, partner links, payouts, discounts, purchases, entitlements, tracking, refunds, or fulfillment promises."
        buttonLabel="COPY PERK AUDIT DECISION REPLIES"
        copyText={partnerPerkHandoffAuditDecisionReplyCopy}
      />
      <CopyOnlyCard
        accent="#F0ABFC"
        title="PARTNER PERK SUPPORT ESCALATION KIT"
        status={{ label: 'SUPPORT MAP', color: hasClaims ? '#F0ABFC' : '#777' }}
        body="Copy partner-perk support owner, severity, privacy, response-language, and routing checks before coupons, links, refunds, purchases, entitlements, or fulfillment exist."
        buttonLabel="COPY PERK SUPPORT KIT"
        copyText={partnerPerkSupportEscalationCopy}
      />
    </>
  );
}
