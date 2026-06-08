import {
  buildTribeProCommerceActionProps,
  buildTribeProStatusFooterProps,
  buildTribeProValueDemandProps,
} from './tribeProStorePropGroups';

export function buildTribeProStoreProps(model) {
  const {
    proActive,
  } = model;

  return {
    proActive,
    commerceActionProps: buildTribeProCommerceActionProps(model),
    statusFooterProps: buildTribeProStatusFooterProps(model),
    valueDemandProps: buildTribeProValueDemandProps(model),
  };
}
