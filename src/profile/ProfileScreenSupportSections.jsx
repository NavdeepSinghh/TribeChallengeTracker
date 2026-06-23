import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { buildProfileScreenSupportSectionsProps } from './profileScreenSupportSectionProps';
import ProfileUtilitySection from './ProfileUtilitySection';
import RankRulesAdminSection from './RankRulesAdminSection';
import SupportAccountSection from './SupportAccountSection';

export default function ProfileScreenSupportSections({ model }) {
  const {
    supportAccountSectionProps,
    utilitySectionProps,
  } = buildProfileScreenSupportSectionsProps(model, {
    onSignOut: () => signOut(auth),
  });

  return (
    <>
      <ProfileUtilitySection {...utilitySectionProps} theme={model.theme} />

      <RankRulesAdminSection isAdmin={model.isAdmin} theme={model.theme} user={model.user} />

      <SupportAccountSection {...supportAccountSectionProps} theme={model.theme} />
    </>
  );
}
