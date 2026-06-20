import ProfileAvatarControl from './ProfileAvatarControl';
import ProfileAvatarIdentity from './ProfileAvatarIdentity';
import { ProfileAppearanceError, ProfileAppearanceSavingSpinner } from './ProfileAppearanceStatus';

export default function ProfileAvatarCard({
  activeFrame,
  appearanceError,
  avatarColor,
  avatarEmoji,
  fileInputId,
  frameGradient,
  isSavingAppearance,
  memberYear,
  onAvatarPickerOpen,
  onPhotoUpload,
  profileImageSrc,
  rank,
  theme,
  user,
}) {
  const palette = theme || {
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.06)',
  };

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
        padding: '20px', borderRadius: 20,
        background: palette.cardBg,
        border: `1px solid ${palette.cardBorder}`,
      }}>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          onChange={onPhotoUpload}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
        />
        <ProfileAvatarControl
          activeFrame={activeFrame}
          avatarColor={avatarColor}
          avatarEmoji={avatarEmoji}
          fileInputId={fileInputId}
          frameGradient={frameGradient}
          onAvatarPickerOpen={onAvatarPickerOpen}
          profileImageSrc={profileImageSrc}
        />
        <ProfileAvatarIdentity memberYear={memberYear} rank={rank} theme={theme} user={user} />
        {isSavingAppearance && <ProfileAppearanceSavingSpinner />}
      </div>
      <ProfileAppearanceError appearanceError={appearanceError} />
    </>
  );
}
