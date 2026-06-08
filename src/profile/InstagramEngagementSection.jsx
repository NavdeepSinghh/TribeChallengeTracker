import InstagramHandleCard from './InstagramHandleCard';
import InstagramWeeklyPromptCard from './InstagramWeeklyPromptCard';

export default function InstagramEngagementSection({
  profile,
  instagramHandle,
  setInstagramHandle,
  handleSocialSave,
  isSavingSocial,
  socialMessage,
  instagramWeeklyPrompt,
  instagramPromptCopy,
}) {
  return (
    <>
      <InstagramHandleCard
        handleSocialSave={handleSocialSave}
        instagramHandle={instagramHandle}
        isSavingSocial={isSavingSocial}
        profile={profile}
        setInstagramHandle={setInstagramHandle}
        socialMessage={socialMessage}
      />
      <InstagramWeeklyPromptCard
        instagramPromptCopy={instagramPromptCopy}
        instagramWeeklyPrompt={instagramWeeklyPrompt}
      />
    </>
  );
}
