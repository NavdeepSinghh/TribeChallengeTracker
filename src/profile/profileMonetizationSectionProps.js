import { buildCreatorCoachProps } from './buildCreatorCoachProps';
import { buildPartnerPerksProps } from './buildPartnerPerksProps';
import { buildPrelaunchProps } from './buildPrelaunchProps';
import { buildTribeProStoreProps } from './buildTribeProStoreProps';

export function buildMonetizationSectionProps(model) {
  return {
    creatorCoachProps: buildCreatorCoachProps(model),
    partnerPerksProps: buildPartnerPerksProps(model),
    prelaunchProps: buildPrelaunchProps(model),
    tribeProStoreProps: buildTribeProStoreProps(model),
  };
}
