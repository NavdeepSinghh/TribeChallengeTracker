import AvatarPickerSheet from './AvatarPickerSheet';
import ChallengePointsBreakdownSheet from './ChallengePointsBreakdownSheet';

export default function ProfileScreenSheets({ model }) {
  const {
    avatarColor,
    avatarEmoji,
    challengePoints,
    fileInputRef,
    persistAppearance,
    profileImageSrc,
    setShowAvatarPicker,
    setShowBreakdown,
    showAvatarPicker,
    showBreakdown,
    totalChallengePoints,
  } = model;

  return (
    <>
      <AvatarPickerSheet
        open={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        fileInputId={fileInputRef.current}
        onPickAvatar={(emoji, color) => {
          persistAppearance({ profileImageData: null, avatarEmoji: emoji, avatarColor: color });
          setShowAvatarPicker(false);
        }}
        profileImageSrc={profileImageSrc}
        onRemovePhoto={() => {
          persistAppearance({ profileImageData: null, avatarEmoji, avatarColor });
          setShowAvatarPicker(false);
        }}
      />

      <ChallengePointsBreakdownSheet
        open={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        totalChallengePoints={totalChallengePoints}
        challengePoints={challengePoints}
      />
    </>
  );
}
