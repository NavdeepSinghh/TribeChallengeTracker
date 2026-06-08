import { ACCENT } from './profileConstants';

export function AvatarUploadAction({ fileInputId }) {
  return (
    <label
      htmlFor={fileInputId}
      style={{
        width: '100%', minHeight: 46, marginBottom: 16,
        borderRadius: 14, border: `1px solid ${ACCENT}55`,
        background: `${ACCENT}18`, color: ACCENT,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer',
      }}
    >
      Upload Photo
    </label>
  );
}

export function AvatarRemovePhotoButton({ onRemovePhoto, profileImageSrc }) {
  if (!profileImageSrc) return null;

  return (
    <button
      onClick={onRemovePhoto}
      style={{
        width: '100%', marginTop: 16, padding: '12px',
        borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)', color: '#888',
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
      }}
    >
      Remove Uploaded Photo
    </button>
  );
}
