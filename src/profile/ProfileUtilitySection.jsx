import ProfileAccountCard from './ProfileAccountCard';
import ProfilePolicyLinksCard from './ProfilePolicyLinksCard';
import ProfileReminderCard from './ProfileReminderCard';

export default function ProfileUtilitySection({
  reminderLabel,
  reminderError,
  onReminder,
  onReminderOff,
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
      <ProfileAccountCard onSignOut={onSignOut} theme={theme} user={user} />
    </>
  );
}
