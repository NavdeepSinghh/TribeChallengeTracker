import CreateChallengeBackButton from './CreateChallengeBackButton';
import CreateChallengeProgress from './CreateChallengeProgress';
import CreateChallengeStepContent from './CreateChallengeStepContent';
import useCreateChallengeFlow from './useCreateChallengeFlow';

// ─── CREATE CHALLENGE FLOW ────────────────────────────────────────────────────
export default function CreateChallenge({ onBack, onCreate, profile }) {
  const flow = useCreateChallengeFlow({ onCreate, profile });
  const {
    canCreatePrivate,
    copied,
    created,
    createdCampaignShareText,
    customChallenge,
    customName,
    handleCopy,
    handleCreate,
    handleCreatedLaunchCardShare,
    handleTemplateSelect,
    isPublic,
    loading,
    publishedCreatorTemplateMessage,
    publishedCreatorTemplates,
    proMessage,
    setCustomName,
    setCustomChallenge,
    setIsPublic,
    setProMessage,
    setStartDate,
    setStep,
    shareLink,
    startDate,
    step,
    template,
  } = flow;

  return (
    <div>
      <CreateChallengeBackButton onBack={onBack} setStep={setStep} step={step} />
      <CreateChallengeProgress step={step} />

      <CreateChallengeStepContent
        canCreatePrivate={canCreatePrivate}
        copied={copied}
        created={created}
        createdCampaignShareText={createdCampaignShareText}
        customChallenge={customChallenge}
        customName={customName}
        handleCopy={handleCopy}
        handleCreate={handleCreate}
        handleCreatedLaunchCardShare={handleCreatedLaunchCardShare}
        handleTemplateSelect={handleTemplateSelect}
        isPublic={isPublic}
        loading={loading}
        onBack={onBack}
        publishedCreatorTemplateMessage={publishedCreatorTemplateMessage}
        publishedCreatorTemplates={publishedCreatorTemplates}
        proMessage={proMessage}
        profile={profile}
        setCustomName={setCustomName}
        setCustomChallenge={setCustomChallenge}
        setIsPublic={setIsPublic}
        setProMessage={setProMessage}
        setStartDate={setStartDate}
        shareLink={shareLink}
        startDate={startDate}
        step={step}
        template={template}
      />
    </div>
  );
}
