export function getStreakMotivator(streak) {
  if (streak === 0) return "Start your streak today 💪";
  if (streak === 1) return "Great start — build on it 🔥";
  if (streak <= 3) return `${streak} days strong. Keep pushing 🔥`;
  if (streak <= 6) return `${streak}-day streak! You're on fire 🔥`;
  if (streak <= 13) return `${streak} days in. The habit is forming ⚡`;
  if (streak <= 20) return `${streak}-day streak. You're unstoppable ⚡`;
  if (streak <= 29) return `${streak} days! Elite consistency 💫`;
  return `${streak} days. Tribe God level dedication 👑`;
}
