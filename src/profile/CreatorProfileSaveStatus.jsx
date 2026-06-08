import { GOLD } from './profileConstants';

export default function CreatorProfileSaveStatus({
  creatorMessage,
  handleCreatorSave,
  isSavingCreator,
  proActive,
}) {
  return (
    <>
      <button onClick={handleCreatorSave} disabled={isSavingCreator} style={{
        marginTop: 12, width: '100%', border: 'none', borderRadius: 12,
        background: proActive ? '#60A5FA' : 'rgba(255,255,255,0.08)',
        color: proActive ? '#06111f' : '#777', padding: '11px 12px',
        fontSize: 12, fontWeight: 900, cursor: isSavingCreator ? 'default' : 'pointer',
      }}>
        {proActive ? (isSavingCreator ? 'Saving Creator Profile' : 'Save Creator Profile') : 'Unlock with Tribe Pro'}
      </button>
      {creatorMessage && (
        <p style={{ margin: '8px 0 0', color: proActive ? '#60A5FA' : GOLD, fontSize: 10, fontFamily: 'monospace' }}>
          {creatorMessage}
        </p>
      )}
    </>
  );
}
