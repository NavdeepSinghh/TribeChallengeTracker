import CreateChallengeFormFields from './CreateChallengeFormFields';
import CreateChallengeSubmitButton from './CreateChallengeSubmitButton';
import CreateChallengeTemplatePreview from './CreateChallengeTemplatePreview';
import CreateChallengeVisibilitySelector from './CreateChallengeVisibilitySelector';

export default function CreateChallengeCustomiseStep({
  canCreatePrivate,
  customName,
  handleCreate,
  isPublic,
  loading,
  proMessage,
  setCustomName,
  setIsPublic,
  setProMessage,
  setStartDate,
  startDate,
  template,
}) {
  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
        Customise
      </h2>
      <p style={{ color: '#555', fontSize: 13, margin: '0 0 22px' }}>Name your challenge and set the start date</p>

      <CreateChallengeFormFields
        customName={customName}
        setCustomName={setCustomName}
        setStartDate={setStartDate}
        startDate={startDate}
      />

      <CreateChallengeVisibilitySelector
        canCreatePrivate={canCreatePrivate}
        isPublic={isPublic}
        proMessage={proMessage}
        setIsPublic={setIsPublic}
        setProMessage={setProMessage}
      />

      <CreateChallengeTemplatePreview template={template} />

      <CreateChallengeSubmitButton
        customName={customName}
        handleCreate={handleCreate}
        loading={loading}
        template={template}
      />
    </div>
  );
}
