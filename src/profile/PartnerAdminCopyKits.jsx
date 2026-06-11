import PartnerCopyCard from './PartnerCopyCard';
import PartnerMetrics from './PartnerMetrics';

export default function PartnerAdminCopyKits({
  campaignPerformanceSummary,
  copyText,
  partnerActivationCopy,
  partnerCampaignObjectionReplyCopy,
  partnerCampaignRetrospectiveCopy,
  partnerCampaignSupportEscalationCopy,
  partnerContractReadinessCopy,
  partnerDemandTotal,
  partnerPitchCopy,
  partnerTermsReadinessCopy,
  referralJoins,
  topPartnerPerk,
}) {
  return (
    <>
      <PartnerCopyCard
        accent="#60A5FA"
        title="PARTNER PITCH KIT"
        status={{ active: topPartnerPerk?.demand, label: topPartnerPerk?.demand ? `${topPartnerPerk.label.toUpperCase()} LEADS` : 'GATHERING' }}
        body={partnerPitchCopy}
        buttonLabel="COPY PARTNER PITCH"
        copy={partnerPitchCopy}
        copyText={copyText}
      />
      <PartnerCopyCard
        accent="#2DD4BF"
        title="PARTNER CAMPAIGN ACTIVATION KIT"
        status={{ active: partnerDemandTotal, label: 'PILOT BRIEF' }}
        body="Copy a sponsor-backed challenge pilot brief without partner links, ad tracking, purchases, or entitlement changes."
        buttonLabel="COPY ACTIVATION KIT"
        copy={partnerActivationCopy}
        copyText={copyText}
        metrics={<PartnerMetrics color="#2DD4BF" partnerDemandTotal={partnerDemandTotal} campaignPerformanceSummary={campaignPerformanceSummary} referralJoins={referralJoins} />}
      />
      <PartnerCopyCard
        accent="#38BDF8"
        title="PARTNER TERMS READINESS KIT"
        status={{ active: partnerDemandTotal, label: 'TERMS DRAFT' }}
        body="Copy partner fit, disclosure, data-boundary, destination-review, reporting, and support handoff guardrails before sponsor pilots are reviewed."
        buttonLabel="COPY PARTNER TERMS KIT"
        copy={partnerTermsReadinessCopy}
        copyText={copyText}
        metrics={<PartnerMetrics color="#38BDF8" partnerDemandTotal={partnerDemandTotal} campaignPerformanceSummary={campaignPerformanceSummary} referralJoins={referralJoins} />}
      />
      <PartnerCopyCard
        accent="#818CF8"
        title="PARTNER CONTRACT READINESS KIT"
        status={{ active: partnerDemandTotal, label: 'CONTRACT CHECK' }}
        body="Copy identity, support, disclosure, fulfillment, privacy, reporting, and destination checks before sponsor terms move forward."
        buttonLabel="COPY PARTNER CONTRACT KIT"
        copy={partnerContractReadinessCopy}
        copyText={copyText}
        metrics={<PartnerMetrics color="#818CF8" partnerDemandTotal={partnerDemandTotal} campaignPerformanceSummary={campaignPerformanceSummary} referralJoins={referralJoins} />}
      />
      <PartnerCopyCard
        accent="#818CF8"
        title="PARTNER CAMPAIGN OBJECTION REPLY KIT"
        status={{ active: partnerDemandTotal, label: 'COPY ONLY' }}
        body="Copy manual replies for sponsor-pilot questions without claiming partner links, tracking, payouts, purchases, or revenue-share are live."
        buttonLabel="COPY PARTNER REPLIES"
        copy={partnerCampaignObjectionReplyCopy}
        copyText={copyText}
      />
      <PartnerCopyCard
        accent="#F0ABFC"
        title="PARTNER CAMPAIGN SUPPORT ESCALATION KIT"
        status={{ active: partnerDemandTotal, label: 'SUPPORT MAP' }}
        body="Copy sponsor-pilot support owner, severity, privacy, response-language, and routing checks before links, tracking, payouts, purchases, or fulfillment exist."
        buttonLabel="COPY PARTNER SUPPORT KIT"
        copy={partnerCampaignSupportEscalationCopy}
        copyText={copyText}
        metrics={<PartnerMetrics color="#F0ABFC" partnerDemandTotal={partnerDemandTotal} campaignPerformanceSummary={campaignPerformanceSummary} referralJoins={referralJoins} />}
      />
      <PartnerCopyCard
        accent="#22C55E"
        title="PARTNER CAMPAIGN RETROSPECTIVE KIT"
        status={{ active: partnerDemandTotal, label: 'POST-PILOT' }}
        body="Copy aggregate-only post-pilot prompts for partner fit, app movement, support notes, and repeat-or-pause decisions without links, tracking, payouts, purchases, or entitlements."
        buttonLabel="COPY PARTNER RETROSPECTIVE"
        copy={partnerCampaignRetrospectiveCopy}
        copyText={copyText}
        metrics={<PartnerMetrics color="#22C55E" partnerDemandTotal={partnerDemandTotal} campaignPerformanceSummary={campaignPerformanceSummary} referralJoins={referralJoins} />}
      />
    </>
  );
}
