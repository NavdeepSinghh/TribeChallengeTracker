import ProfileCommunityProofSections from './ProfileCommunityProofSections';
import ProfileSocialEngagementSections from './ProfileSocialEngagementSections';

export default function ProfileCommunityStorySections({ model }) {
  return (
    <>
      <ProfileSocialEngagementSections model={model} />
      <ProfileCommunityProofSections model={model} />
    </>
  );
}
