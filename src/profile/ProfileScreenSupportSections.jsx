import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { buildProfileScreenSupportSectionsProps } from './profileScreenSupportSectionProps';
import ProfileUtilitySection from './ProfileUtilitySection';
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
      <ProfileUtilitySection {...utilitySectionProps} />

      <SupportAccountSection {...supportAccountSectionProps} />
    </>
  );
}
