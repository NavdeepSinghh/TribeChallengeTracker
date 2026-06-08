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
}) {
  return (
    <>
      <ProfileReminderCard
        onReminder={onReminder}
        onReminderOff={onReminderOff}
        reminderError={reminderError}
        reminderLabel={reminderLabel}
      />
      <ProfilePolicyLinksCard />
      <ProfileAccountCard onSignOut={onSignOut} user={user} />
    </>
  );
}
