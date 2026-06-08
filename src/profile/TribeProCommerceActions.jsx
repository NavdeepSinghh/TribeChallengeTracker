import StoreAdminDecisionKits, { StoreRecoveryEvidenceDecisionKits } from './StoreAdminDecisionKits';
import StoreCheckoutButtons from './StoreCheckoutButtons';
import StoreMemberRecoveryActions from './StoreMemberRecoveryActions';
import { buildTribeProCommerceActionProps } from './tribeProCommerceActionSectionProps';

export default function TribeProCommerceActions(props) {
  const {
    adminDecisionKitProps,
    checkoutButtonProps,
    isAdmin,
    memberRecoveryActionProps,
    recoveryEvidenceDecisionKitProps,
  } = buildTribeProCommerceActionProps(props);

  return (
    <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
      <StoreCheckoutButtons {...checkoutButtonProps} />
      {isAdmin && (
        <StoreAdminDecisionKits {...adminDecisionKitProps} />
      )}
      <StoreMemberRecoveryActions {...memberRecoveryActionProps} />
      {isAdmin && (
        <StoreRecoveryEvidenceDecisionKits {...recoveryEvidenceDecisionKitProps} />
      )}
    </div>
  );
}
