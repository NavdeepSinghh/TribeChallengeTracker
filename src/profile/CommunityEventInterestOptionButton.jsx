export default function CommunityEventInterestOptionButton({
  demandCount,
  isAdmin,
  isSavingCommunityEventInterest,
  onCommunityEventInterestToggle,
  option,
  selected,
}) {
  return (
    <button
      type="button"
      disabled={isSavingCommunityEventInterest}
      onClick={() => onCommunityEventInterestToggle(option.id)}
      style={{
        borderRadius: 12,
        padding: 11,
        background: selected ? 'rgba(251,113,133,0.16)' : 'rgba(251,113,133,0.08)',
        border: `1px solid ${selected ? '#FB7185' : 'rgba(251,113,133,0.28)'}`,
        textAlign: 'left',
        cursor: isSavingCommunityEventInterest ? 'default' : 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#FB7185', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{option.label.toUpperCase()}</p>
        <p style={{ margin: 0, color: selected ? '#FB7185' : '#666', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {selected ? 'INTERESTED' : 'TAP TO SAVE'}
        </p>
      </div>
      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{option.title}</p>
      <p style={{ margin: '4px 0 0', color: '#888', fontSize: 10, lineHeight: 1.4 }}>{option.detail}</p>
      {isAdmin && (
        <p style={{ margin: '6px 0 0', color: '#FB7185', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          DEMAND {demandCount || 0}
        </p>
      )}
    </button>
  );
}
