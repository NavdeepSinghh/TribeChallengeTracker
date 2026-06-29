import CreateCustomChallengeBuilder from './CreateCustomChallengeBuilder';
import CreateChallengeFormFields from './CreateChallengeFormFields';
import CreateChallengeSubmitButton from './CreateChallengeSubmitButton';
import CreateChallengeTemplatePreview from './CreateChallengeTemplatePreview';
import CreateChallengeVisibilitySelector from './CreateChallengeVisibilitySelector';

export default function CreateChallengeCustomiseStep({
  canCreatePrivate,
  customChallenge,
  customName,
  handleCreate,
  isPublic,
  loading,
  proMessage,
  setCustomName,
  setCustomChallenge,
  setIsPublic,
  setProMessage,
  setStartDate,
  startDate,
  template,
}) {
  const isCustom = template.id === 'custom';

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
        {isCustom ? 'Build your challenge' : 'Customise'}
      </h2>
      <p style={{ color: '#555', fontSize: 13, margin: '0 0 22px' }}>
        {isCustom
          ? 'Set the tasks, reminders, and community options members will join.'
          : 'Name your challenge and set the start date'}
      </p>

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

      {isCustom && (
        <CreateCustomChallengeBuilder
          customChallenge={customChallenge}
          setCustomChallenge={setCustomChallenge}
        />
      )}

      {!isCustom && <CreateChallengeTemplatePreview template={template} />}

      <CreateChallengeSubmitButton
        customChallenge={customChallenge}
        customName={customName}
        handleCreate={handleCreate}
        loading={loading}
        template={template}
      />
    </div>
  );
}
