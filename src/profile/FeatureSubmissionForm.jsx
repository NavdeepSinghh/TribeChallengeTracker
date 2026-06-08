import FeatureSubmissionMediaField from './FeatureSubmissionMediaField';
import FeatureSubmissionSubmitStatus from './FeatureSubmissionSubmitStatus';
import { FEATURE_CATEGORIES } from './profileConstants';

export default function FeatureSubmissionForm({
  canSubmit,
  featureCategory,
  featureConsent,
  featureFileInputRef,
  featureMediaData,
  featureMessage,
  featureStory,
  handleFeatureMediaUpload,
  handleFeatureSubmit,
  isSubmittingFeature,
  setFeatureCategory,
  setFeatureConsent,
  setFeatureMediaData,
  setFeatureStory,
}) {
  return (
    <>
      <select
        value={featureCategory}
        onChange={e => setFeatureCategory(e.target.value)}
        style={{
          width: '100%', height: 42, marginBottom: 10, borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.22)',
          color: '#fff', padding: '0 12px', fontSize: 12, fontWeight: 800,
        }}
      >
        {FEATURE_CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      <textarea
        value={featureStory}
        onChange={e => setFeatureStory(e.target.value.slice(0, 900))}
        placeholder="What did you overcome, complete, or prove to yourself?"
        rows={4}
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'vertical', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.22)',
          color: '#fff', padding: 12, fontSize: 13, lineHeight: 1.45, outline: 'none',
        }}
      />
      <FeatureSubmissionMediaField
        featureFileInputRef={featureFileInputRef}
        featureMediaData={featureMediaData}
        handleFeatureMediaUpload={handleFeatureMediaUpload}
        setFeatureMediaData={setFeatureMediaData}
      />
      <FeatureSubmissionSubmitStatus
        canSubmit={canSubmit}
        featureConsent={featureConsent}
        featureMessage={featureMessage}
        featureStory={featureStory}
        handleFeatureSubmit={handleFeatureSubmit}
        isSubmittingFeature={isSubmittingFeature}
        setFeatureConsent={setFeatureConsent}
      />
    </>
  );
}
