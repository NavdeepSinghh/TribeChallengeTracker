import CreatorProfileFields from './CreatorProfileFields';
import CreatorProfileSaveStatus from './CreatorProfileSaveStatus';

export default function CreatorProfileForm({
  creatorBio,
  creatorCtaUrl,
  creatorMessage,
  creatorSpecialty,
  handleCreatorSave,
  isSavingCreator,
  proActive,
  setCreatorBio,
  setCreatorCtaUrl,
  setCreatorSpecialty,
}) {
  return (
    <>
      <CreatorProfileFields
        creatorBio={creatorBio}
        creatorCtaUrl={creatorCtaUrl}
        creatorSpecialty={creatorSpecialty}
        proActive={proActive}
        setCreatorBio={setCreatorBio}
        setCreatorCtaUrl={setCreatorCtaUrl}
        setCreatorSpecialty={setCreatorSpecialty}
      />
      <CreatorProfileSaveStatus
        creatorMessage={creatorMessage}
        handleCreatorSave={handleCreatorSave}
        isSavingCreator={isSavingCreator}
        proActive={proActive}
      />
    </>
  );
}
