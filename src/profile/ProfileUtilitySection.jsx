import ProfileAccountCard from './ProfileAccountCard';
import ProfilePolicyLinksCard from './ProfilePolicyLinksCard';
import ProfileReminderCard from './ProfileReminderCard';

export default function ProfileUtilitySection({
  displayNameDraft,
  displayNameMessage,
  isSavingDisplayName,
  reminderLabel,
  reminderError,
  onDisplayNameSave,
  onReminder,
  onReminderOff,
  profile,
  setDisplayNameDraft,
  user,
  onSignOut,
  theme,
}) {
  return (
    <>
      <ProfileReminderCard
        onReminder={onReminder}
        onReminderOff={onReminderOff}
        reminderError={reminderError}
        reminderLabel={reminderLabel}
        theme={theme}
      />
      <ProfilePolicyLinksCard theme={theme} />
      <ProfileAccountCard
        displayNameDraft={displayNameDraft}
        displayNameMessage={displayNameMessage}
        isSavingDisplayName={isSavingDisplayName}
        onDisplayNameSave={onDisplayNameSave}
        onSignOut={onSignOut}
        profile={profile}
        setDisplayNameDraft={setDisplayNameDraft}
        theme={theme}
        user={user}
      />
    </>
  );
}
