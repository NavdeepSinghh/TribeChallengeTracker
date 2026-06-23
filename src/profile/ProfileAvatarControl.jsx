import { ACCENT } from './profileConstants';
import RankBadge from '../app/RankBadge';

export default function ProfileAvatarControl({
  activeFrame,
  avatarColor,
  avatarEmoji,
  fileInputId,
  frameGradient,
  onAvatarPickerOpen,
  profileImageSrc,
  rank,
}) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={onAvatarPickerOpen}
        title="Edit profile picture"
        style={{
          width: 68, height: 68, borderRadius: 20,
          background: `${avatarColor}22`, border: `2px solid transparent`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
          boxShadow: activeFrame.id === 'none' ? `0 0 24px ${avatarColor}22` : `0 0 28px ${activeFrame.colors[0]}33`,
          overflow: 'hidden', cursor: 'pointer', padding: 0,
          backgroundImage: `linear-gradient(#111,#111), ${frameGradient}`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {profileImageSrc ? (
          <img src={profileImageSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : avatarEmoji}
      </button>
      <RankBadge rank={rank} size={22} style={{ top: -6, bottom: 'auto', right: -6 }} />
      <label
        htmlFor={fileInputId}
        title="Upload photo"
        style={{
          position: 'absolute', right: -5, bottom: -5,
          width: 26, height: 26, borderRadius: 999,
          border: '1px solid rgba(0,0,0,0.25)', background: ACCENT,
          color: '#111', fontSize: 12, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        📷
      </label>
    </div>
  );
}
