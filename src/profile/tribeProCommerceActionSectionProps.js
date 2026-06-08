export { buildStoreAdminDecisionKitProps } from './storeAdminDecisionKitProps';
export { buildStoreCheckoutButtonProps } from './storeCheckoutButtonProps';
export { buildStoreMemberRecoveryActionProps } from './storeMemberRecoveryActionProps';
export { buildStoreRecoveryEvidenceDecisionKitProps } from './storeRecoveryEvidenceDecisionKitProps';

import { buildStoreAdminDecisionKitProps } from './storeAdminDecisionKitProps';
import { buildStoreCheckoutButtonProps } from './storeCheckoutButtonProps';
import { buildStoreMemberRecoveryActionProps } from './storeMemberRecoveryActionProps';
import { buildStoreRecoveryEvidenceDecisionKitProps } from './storeRecoveryEvidenceDecisionKitProps';

export function buildTribeProCommerceActionProps(props) {
  return {
    adminDecisionKitProps: buildStoreAdminDecisionKitProps(props),
    checkoutButtonProps: buildStoreCheckoutButtonProps(props),
    isAdmin: props.isAdmin,
    memberRecoveryActionProps: buildStoreMemberRecoveryActionProps(props),
    recoveryEvidenceDecisionKitProps: buildStoreRecoveryEvidenceDecisionKitProps(props),
  };
}
