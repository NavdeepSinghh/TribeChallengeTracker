import CreatorCoachAdminSection from './CreatorCoachAdminSection';
import CreatorCoachMemberSection from './CreatorCoachMemberSection';
import CreatorCoachSummaryPanel from './CreatorCoachSummaryPanel';
import { buildCreatorCoachSectionProps } from './creatorCoachSectionData';

export default function CreatorCoachSection(props) {
  const {
    adminSectionProps,
    isAdmin,
    memberSectionProps,
    sectionStyle,
    summaryPanelProps,
  } = buildCreatorCoachSectionProps(props);

  return (
    <div style={sectionStyle}>
      <CreatorCoachSummaryPanel {...summaryPanelProps} />
      {isAdmin && <CreatorCoachAdminSection {...adminSectionProps} />}
      <CreatorCoachMemberSection {...memberSectionProps} />
    </div>
  );
}
