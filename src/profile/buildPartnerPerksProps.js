import { buildPartnerPerksAdminProps } from './partnerPerksAdminProps';
import { buildPartnerPerksApplicationProps } from './partnerPerksApplicationProps';
import { buildPartnerPerksMemberProps } from './partnerPerksMemberProps';

export function buildPartnerPerksProps(model) {
  const memberProps = buildPartnerPerksMemberProps(model);
  const adminProps = buildPartnerPerksAdminProps(model);
  const applicationProps = buildPartnerPerksApplicationProps(model);

  return {
    ...memberProps,
    ...adminProps,
    ...applicationProps,
    memberProps,
    adminProps,
    applicationProps,
  };
}
