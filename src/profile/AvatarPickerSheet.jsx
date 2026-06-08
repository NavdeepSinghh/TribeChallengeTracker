import AvatarOptionGrid from './AvatarOptionGrid';
import {
  AvatarRemovePhotoButton,
  AvatarUploadAction,
} from './AvatarPickerActions';

export default function AvatarPickerSheet({
  open,
  onClose,
  fileInputId,
  onPickAvatar,
  profileImageSrc,
  onRemovePhoto,
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 340,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430,
          background: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 24px calc(28px + env(safe-area-inset-bottom))',
          maxHeight: 'calc(100dvh - 20px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>CREATE AVATAR</p>
            <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
              Choose Your Look
            </h3>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
            color: '#777', cursor: 'pointer', fontSize: 18,
          }}>x</button>
        </div>

        <AvatarUploadAction fileInputId={fileInputId} />
        <AvatarOptionGrid onPickAvatar={onPickAvatar} />
        <AvatarRemovePhotoButton
          onRemovePhoto={onRemovePhoto}
          profileImageSrc={profileImageSrc}
        />
      </div>
    </div>
  );
}
