import PartnerCampaignApplicationCard from './PartnerCampaignApplicationCard';
import PartnerPerksMemberControls from './PartnerPerksMemberControls';
import PartnerPerksAdminSummary from './PartnerPerksAdminSummary';

export default function PartnerPerksSection({
  isAdmin,
  memberProps,
  adminProps,
  applicationProps,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <PartnerPerksMemberControls
        {...memberProps}
      />
      {isAdmin && (
        <PartnerPerksAdminSummary
          {...adminProps}
        />
      )}
      <PartnerCampaignApplicationCard
        {...applicationProps}
      />
    </div>
  );
}
