import ProfileIdentitySection from './ProfileIdentitySection';

export default function ProfileScreenIdentityPanel({ model }) {
  const {
    activeFrame,
    appearanceError,
    avatarColor,
    avatarEmoji,
    cosmeticsMessage,
    fileInputRef,
    frameGradient,
    handleFrameSave,
    handlePhotoUpload,
    isSavingAppearance,
    isSavingCosmetics,
    memberYear,
    proActive,
    profileImageSrc,
    rank,
    selectedFrameId,
    setSelectedFrameId,
    setShowAvatarPicker,
    theme,
    user,
  } = model;

  return (
    <ProfileIdentitySection
      rank={rank}
      user={user}
      memberYear={memberYear}
      fileInputId={fileInputRef.current}
      onPhotoUpload={handlePhotoUpload}
      onAvatarPickerOpen={() => setShowAvatarPicker(true)}
      avatarColor={avatarColor}
      activeFrame={activeFrame}
      frameGradient={frameGradient}
      profileImageSrc={profileImageSrc}
      avatarEmoji={avatarEmoji}
      isSavingAppearance={isSavingAppearance}
      appearanceError={appearanceError}
      proActive={proActive}
      selectedFrameId={selectedFrameId}
      onFrameSelect={setSelectedFrameId}
      onFrameSave={handleFrameSave}
      isSavingCosmetics={isSavingCosmetics}
      cosmeticsMessage={cosmeticsMessage}
      theme={theme}
    />
  );
}
