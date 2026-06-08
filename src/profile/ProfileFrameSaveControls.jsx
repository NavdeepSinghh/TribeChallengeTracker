import { ACCENT } from './profileConstants';

export default function ProfileFrameSaveControls({
  cosmeticsMessage,
  isSavingCosmetics,
  onFrameSave,
  proActive,
}) {
  return (
    <>
      <button
        onClick={onFrameSave}
        disabled={isSavingCosmetics}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: 'none',
          background: proActive ? ACCENT : 'rgba(255,255,255,0.08)',
          color: proActive ? '#111' : '#aaa',
          fontWeight: 900, cursor: isSavingCosmetics ? 'wait' : 'pointer',
        }}
      >
        {proActive ? (isSavingCosmetics ? 'Saving Frame' : 'Save Profile Frame') : 'Unlock with Tribe Pro'}
      </button>
      {cosmeticsMessage && (
        <p style={{ margin: '10px 0 0', color: proActive ? '#34D399' : '#FFD166', fontSize: 11, fontWeight: 800 }}>
          {cosmeticsMessage}
        </p>
      )}
    </>
  );
}
