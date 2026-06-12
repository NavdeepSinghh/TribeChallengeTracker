import { GOLD } from './profileConstants';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function CreatorProfileSaveStatus({
  creatorMessage,
  handleCreatorSave,
  isSavingCreator,
  proActive,
}) {
  const enabled = !V1_PAID_FEATURES_ENABLED || proActive;
  return (
    <>
      <button onClick={handleCreatorSave} disabled={isSavingCreator} style={{
        marginTop: 12, width: '100%', border: 'none', borderRadius: 12,
        background: enabled ? '#60A5FA' : 'rgba(255,255,255,0.08)',
        color: enabled ? '#06111f' : '#777', padding: '11px 12px',
        fontSize: 12, fontWeight: 900, cursor: isSavingCreator ? 'default' : 'pointer',
      }}>
        {enabled ? (isSavingCreator ? 'Saving Creator Profile' : 'Save Creator Profile') : 'Later Release'}
      </button>
      {creatorMessage && (
        <p style={{ margin: '8px 0 0', color: enabled ? '#60A5FA' : GOLD, fontSize: 10, fontFamily: 'monospace' }}>
          {creatorMessage}
        </p>
      )}
    </>
  );
}
