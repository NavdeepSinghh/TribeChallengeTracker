export default function CreatorChallengeTemplateDraftCard({
  creatorEnabled,
  creatorTemplateDraftMessage,
  handleCreatorTemplateDraftSubmit,
  isSubmittingCreatorTemplateDraft,
  proActive,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: proActive ? 'rgba(16,185,129,0.075)' : 'rgba(0,0,0,0.18)',
      border: '1px solid rgba(16,185,129,0.20)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#10B981', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR TEMPLATE DRAFT RECORD</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Save reusable hosted challenge template for review
          </p>
        </div>
        <span style={{ color: proActive && creatorEnabled ? '#10B981' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          REVIEW ONLY
        </span>
      </div>
      <p style={{ margin: '9px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Writes creatorChallengeTemplateDrafts for manual admin review using creator profile and hosted challenge signals. This does not publish templates, create contracts, collect payments, create purchases, write entitlements, start revenue-share, or expose private member activity.
      </p>
      <button
        onClick={handleCreatorTemplateDraftSubmit}
        disabled={isSubmittingCreatorTemplateDraft || !proActive || !creatorEnabled}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(16,185,129,0.24)', background: proActive && creatorEnabled ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
          color: proActive && creatorEnabled ? '#10B981' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          cursor: proActive && creatorEnabled ? 'pointer' : 'not-allowed',
        }}
      >
        {isSubmittingCreatorTemplateDraft ? 'SAVING TEMPLATE DRAFT...' : 'SAVE TEMPLATE DRAFT FOR REVIEW'}
      </button>
      {creatorTemplateDraftMessage && (
        <p style={{ margin: '8px 0 0', color: creatorTemplateDraftMessage.includes('saved') ? '#10B981' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
          {creatorTemplateDraftMessage}
        </p>
      )}
    </div>
  );
}
