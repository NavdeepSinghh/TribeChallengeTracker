import FeatureSubmissionForm from './FeatureSubmissionForm';
import FeatureSubmissionHistory from './FeatureSubmissionHistory';

export default function FeatureSubmissionSection({
  featureCategory,
  setFeatureCategory,
  featureStory,
  setFeatureStory,
  featureFileInputRef,
  handleFeatureMediaUpload,
  featureMediaData,
  setFeatureMediaData,
  featureConsent,
  setFeatureConsent,
  handleFeatureSubmit,
  isSubmittingFeature,
  featureMessage,
  featureSubmissions,
}) {
  const canSubmit = featureConsent && featureStory.trim().length >= 20;

  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Submit to be featured</p>
      <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
        Share a win for the @risewiththetribe channel review queue.
      </p>
      <FeatureSubmissionForm
        canSubmit={canSubmit}
        featureCategory={featureCategory}
        featureConsent={featureConsent}
        featureFileInputRef={featureFileInputRef}
        featureMediaData={featureMediaData}
        featureMessage={featureMessage}
        featureStory={featureStory}
        handleFeatureMediaUpload={handleFeatureMediaUpload}
        handleFeatureSubmit={handleFeatureSubmit}
        isSubmittingFeature={isSubmittingFeature}
        setFeatureCategory={setFeatureCategory}
        setFeatureConsent={setFeatureConsent}
        setFeatureMediaData={setFeatureMediaData}
        setFeatureStory={setFeatureStory}
      />
      <FeatureSubmissionHistory featureSubmissions={featureSubmissions} />
    </div>
  );
}
