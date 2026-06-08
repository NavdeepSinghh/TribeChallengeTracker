export { buildCreatorCoachAdminSectionProps } from './creatorCoachAdminSectionProps';
export { buildCreatorCoachMemberSectionProps } from './creatorCoachMemberSectionProps';
export { buildCreatorCoachSectionStyle } from './creatorCoachSectionStyle';
export { buildCreatorCoachSummaryPanelProps } from './creatorCoachSummaryPanelProps';

import { buildCreatorCoachAdminSectionProps } from './creatorCoachAdminSectionProps';
import { buildCreatorCoachMemberSectionProps } from './creatorCoachMemberSectionProps';
import { buildCreatorCoachSectionStyle } from './creatorCoachSectionStyle';
import { buildCreatorCoachSummaryPanelProps } from './creatorCoachSummaryPanelProps';

export function buildCreatorCoachSectionProps(props) {
  return {
    adminSectionProps: buildCreatorCoachAdminSectionProps(props),
    isAdmin: props.isAdmin,
    memberSectionProps: buildCreatorCoachMemberSectionProps(props),
    sectionStyle: buildCreatorCoachSectionStyle(props.proActive),
    summaryPanelProps: buildCreatorCoachSummaryPanelProps(props),
  };
}
