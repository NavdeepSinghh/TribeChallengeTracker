import ProfileAvatarCard from './ProfileAvatarCard';
import ProfileFramePickerCard from './ProfileFramePickerCard';

export default function ProfileIdentitySection({
  rank,
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
        user={user}
      />
      <ProfileFramePickerCard
        cosmeticsMessage={cosmeticsMessage}
        isSavingCosmetics={isSavingCosmetics}
        onFrameSave={onFrameSave}
        onFrameSelect={onFrameSelect}
        proActive={proActive}
        selectedFrameId={selectedFrameId}
      />
    </>
  );
}
