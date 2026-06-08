import ProfileFrameOptionGrid from './ProfileFrameOptionGrid';
import ProfileFrameSaveControls from './ProfileFrameSaveControls';

export default function ProfileFramePickerCard({
  cosmeticsMessage,
  isSavingCosmetics,
  onFrameSave,
  onFrameSelect,
  proActive,
  selectedFrameId,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Profile frame</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Premium identity cosmetic
          </p>
        </div>
        <span style={{ color: proActive ? '#34D399' : '#FFD166', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {proActive ? 'PRO ACTIVE' : 'PRO'}
        </span>
      </div>
      <ProfileFrameOptionGrid
        onFrameSelect={onFrameSelect}
        selectedFrameId={selectedFrameId}
      />
      <ProfileFrameSaveControls
        cosmeticsMessage={cosmeticsMessage}
        isSavingCosmetics={isSavingCosmetics}
        onFrameSave={onFrameSave}
        proActive={proActive}
      />
    </div>
  );
}
