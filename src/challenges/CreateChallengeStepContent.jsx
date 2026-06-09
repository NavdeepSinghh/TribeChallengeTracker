import CreateChallengeCustomiseStep from './CreateChallengeCustomiseStep';
import CreateChallengeSuccessStep from './CreateChallengeSuccessStep';
import CreateChallengeTemplateStep from './CreateChallengeTemplateStep';

export default function CreateChallengeStepContent({
  canCreatePrivate,
  copied,
  created,
  createdCampaignShareText,
  customName,
  handleCopy,
  handleCreate,
  handleCreatedLaunchCardShare,
  handleTemplateSelect,
  isPublic,
  loading,
  onBack,
  publishedCreatorTemplateMessage,
  publishedCreatorTemplates,
  proMessage,
  profile,
  setCustomName,
  setIsPublic,
  setProMessage,
  setStartDate,
  shareLink,
  startDate,
  step,
  template,
}) {
  if (step === 1) {
    return (
      <CreateChallengeTemplateStep
        onTemplateSelect={handleTemplateSelect}
        publishedCreatorTemplateMessage={publishedCreatorTemplateMessage}
        publishedCreatorTemplates={publishedCreatorTemplates}
        proMessage={proMessage}
        profile={profile}
      />
    );
  }

  if (step === 2 && template) {
    return (
      <CreateChallengeCustomiseStep
        canCreatePrivate={canCreatePrivate}
        customName={customName}
        handleCreate={handleCreate}
        isPublic={isPublic}
        loading={loading}
        proMessage={proMessage}
        setCustomName={setCustomName}
        setIsPublic={setIsPublic}
        setProMessage={setProMessage}
        setStartDate={setStartDate}
        startDate={startDate}
        template={template}
      />
    );
  }

  if (step === 3 && created) {
    return (
      <CreateChallengeSuccessStep
        copied={copied}
        created={created}
        createdCampaignShareText={createdCampaignShareText}
        onBack={onBack}
        onCopy={handleCopy}
        onLaunchCardShare={handleCreatedLaunchCardShare}
        shareLink={shareLink}
      />
    );
  }

  return null;
}
