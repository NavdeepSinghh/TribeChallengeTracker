import TribeProCommerceActions from './TribeProCommerceActions';
import TribeProStoreStatusFooter from './TribeProStoreStatusFooter';
import TribeProValueDemandSection from './TribeProValueDemandSection';

export default function TribeProStoreSection({
  proActive,
  commerceActionProps,
  statusFooterProps,
  valueDemandProps,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: proActive ? 'rgba(255,215,0,0.07)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${proActive ? 'rgba(255,215,0,0.28)' : 'rgba(255,255,255,0.06)'}`,
    }}>
      <TribeProValueDemandSection
        {...valueDemandProps}
      />
      <TribeProCommerceActions
        {...commerceActionProps}
      />
      <TribeProStoreStatusFooter
        {...statusFooterProps}
      />
    </div>
  );
}
