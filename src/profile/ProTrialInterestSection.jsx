import ProTrialAdminSummary from './ProTrialAdminSummary';
import ProTrialReasonSelector from './ProTrialReasonSelector';

export default function ProTrialInterestSection({
  selectedProTrialReasonIds,
  onProTrialReasonToggle,
  isSavingProTrialInterest,
  proTrialMessage,
  isAdmin,
  proTrialSummary,
  topProTrialReason,
  proTrialPitchCopy,
  proTrialDemandTotal,
  proTrialObjectionReplyCopy,
}) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 12, padding: 12,
      background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
    }}>
      <ProTrialReasonSelector
        isSavingProTrialInterest={isSavingProTrialInterest}
        onProTrialReasonToggle={onProTrialReasonToggle}
        proTrialMessage={proTrialMessage}
        selectedProTrialReasonIds={selectedProTrialReasonIds}
      />
      {isAdmin && (
        <ProTrialAdminSummary
          proTrialDemandTotal={proTrialDemandTotal}
          proTrialObjectionReplyCopy={proTrialObjectionReplyCopy}
          proTrialPitchCopy={proTrialPitchCopy}
          proTrialSummary={proTrialSummary}
          topProTrialReason={topProTrialReason}
        />
      )}
    </div>
  );
}
