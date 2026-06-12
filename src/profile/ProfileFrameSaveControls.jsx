import { ACCENT } from './profileConstants';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function ProfileFrameSaveControls({
  cosmeticsMessage,
  isSavingCosmetics,
  onFrameSave,
  proActive,
}) {
  const enabled = !V1_PAID_FEATURES_ENABLED || proActive;
  return (
    <>
      <button
        onClick={onFrameSave}
        disabled={isSavingCosmetics}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: 'none',
          background: enabled ? ACCENT : 'rgba(255,255,255,0.08)',
          color: enabled ? '#111' : '#aaa',
          fontWeight: 900, cursor: isSavingCosmetics ? 'wait' : 'pointer',
        }}
      >
        {enabled ? (isSavingCosmetics ? 'Saving Frame' : 'Save Profile Frame') : 'Later Release'}
      </button>
      {cosmeticsMessage && (
        <p style={{ margin: '10px 0 0', color: enabled ? '#34D399' : '#FFD166', fontSize: 11, fontWeight: 800 }}>
          {cosmeticsMessage}
        </p>
      )}
    </>
  );
}
