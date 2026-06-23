import ProfileAvatarCard from './ProfileAvatarCard';
import ProfileFramePickerCard from './ProfileFramePickerCard';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function ProfileIdentitySection({
  rank,
  statusRank,
  user,
  memberYear,
  fileInputId,
  onPhotoUpload,
  onAvatarPickerOpen,
  avatarColor,
  activeFrame,
  frameGradient,
  profileImageSrc,
  avatarEmoji,
  isSavingAppearance,
  appearanceError,
  proActive,
  selectedFrameId,
  onFrameSelect,
  onFrameSave,
  isSavingCosmetics,
  cosmeticsMessage,
  theme,
}) {
  return (
    <>
      <ProfileAvatarCard
        activeFrame={activeFrame}
        appearanceError={appearanceError}
        avatarColor={avatarColor}
        avatarEmoji={avatarEmoji}
        fileInputId={fileInputId}
        frameGradient={frameGradient}
        isSavingAppearance={isSavingAppearance}
        memberYear={memberYear}
        onAvatarPickerOpen={onAvatarPickerOpen}
        onPhotoUpload={onPhotoUpload}
        profileImageSrc={profileImageSrc}
        rank={rank}
        statusRank={statusRank}
        user={user}
        theme={theme}
      />
      {V1_PAID_FEATURES_ENABLED && (
        <ProfileFramePickerCard
          cosmeticsMessage={cosmeticsMessage}
          isSavingCosmetics={isSavingCosmetics}
          onFrameSave={onFrameSave}
          onFrameSelect={onFrameSelect}
          proActive={proActive}
          selectedFrameId={selectedFrameId}
          theme={theme}
        />
      )}
    </>
  );
}
