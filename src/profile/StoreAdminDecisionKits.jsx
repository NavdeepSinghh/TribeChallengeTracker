import PaidLaunchDecisionReplyKit from './PaidLaunchDecisionReplyKit';
export { default as StoreRecoveryEvidenceDecisionKits } from './StoreRecoveryEvidenceDecisionKits';
import WeeklyCampaignCopyKitCard from './WeeklyCampaignCopyKitCard';

export default function StoreAdminDecisionKits({
  paidLaunchDecisionReplyCopy,
  paidLaunchDecisionStatus,
  storeSupportCopyCards,
}) {
  return (
    <>
      {storeSupportCopyCards.map(card => (
        <WeeklyCampaignCopyKitCard key={card.title} {...card} />
      ))}
      <PaidLaunchDecisionReplyKit
        paidLaunchDecisionReplyCopy={paidLaunchDecisionReplyCopy}
        paidLaunchDecisionStatus={paidLaunchDecisionStatus}
      />
    </>
  );
}
