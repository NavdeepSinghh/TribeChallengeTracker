import { ACCENT } from './profileConstants';

export default function FeatureSubmissionSubmitStatus({
  canSubmit,
  featureConsent,
  featureMessage,
  featureStory,
  handleFeatureSubmit,
  isSubmittingFeature,
  setFeatureConsent,
}) {
  return (
    <>
      <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10, color: '#777', fontSize: 11, lineHeight: 1.4 }}>
        <input type="checkbox" checked={featureConsent} onChange={e => setFeatureConsent(e.target.checked)} />
        I consent to Rise With The Tribe reviewing this submission and potentially featuring my story and Instagram handle.
      </label>
      <button
        onClick={handleFeatureSubmit}
        disabled={isSubmittingFeature || !featureConsent || featureStory.trim().length < 20}
        style={{
          marginTop: 12, width: '100%', border: 'none', borderRadius: 12, padding: '12px 10px',
          background: canSubmit ? ACCENT : 'rgba(255,255,255,0.07)',
          color: canSubmit ? '#111' : '#666',
          fontSize: 12, fontWeight: 900, cursor: canSubmit ? 'pointer' : 'default',
        }}
      >
        {isSubmittingFeature ? 'Submitting' : 'Submit for Review'}
      </button>
      {featureMessage && (
        <p style={{ margin: '8px 0 0', color: featureMessage.includes('Could not') || featureMessage.includes('Please') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
          {featureMessage}
        </p>
      )}
    </>
  );
}
