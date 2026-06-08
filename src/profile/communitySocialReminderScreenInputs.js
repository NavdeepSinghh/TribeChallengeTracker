export function buildCommunitySocialReminderScreenInputs(screenState) {
  const {
    instagramHandle,
    setInstagramHandle,
    setIsSavingSocial,
    setReminderError,
    setReminderLabel,
    setSocialMessage,
  } = screenState;

  return {
    instagramHandle,
    setInstagramHandle,
    setIsSavingSocial,
    setReminderError,
    setReminderLabel,
    setSocialMessage,
  };
}
