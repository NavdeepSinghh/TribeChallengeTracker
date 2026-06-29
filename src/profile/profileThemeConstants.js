export const ACCENT = '#FF6B35';
export const GOLD = '#FFD700';

export const POLICY_LINKS = [
  { id: 'privacy', label: 'Privacy Policy', url: 'https://tribechallengetracker.web.app/privacy.html' },
  { id: 'terms', label: 'Terms of Use', url: 'https://tribechallengetracker.web.app/terms.html' },
  { id: 'support', label: 'Support', url: 'https://tribechallengetracker.web.app/support.html' },
  { id: 'data_deletion', label: 'Data Deletion', url: 'https://tribechallengetracker.web.app/data-deletion.html' },
];

export const GOAL_LABELS = {
  lose_weight: 'Lose Weight 🔥', build_muscle: 'Build Muscle 💪',
  consistency: 'Build an Exercise Habit 🔥', strength: 'Get Stronger 💪',
  endurance: 'Endurance 🏃', stress: 'Reduce Stress 🧘', energy: 'Boost Energy ⚡',
  wellbeing: 'Feel Healthier 🌿',
};
export const LEVEL_LABELS = {
  beginner: 'Just Starting 🌱', moderate: 'Somewhat Active 🚶',
  fit: 'Pretty Fit 🏃', athlete: 'Very Athletic 🦅',
};
export const FREQ_LABELS = {
  '2_3': '2–3× / week', '4_5': '4–5× / week', daily: 'Every day 🔥', flexible: 'Flexible 🎯',
};
export const MOTIVATION_LABELS = {
  progress: 'Progress Tracking 📈',
  community: 'Moving With Others 🔥',
  accountability: 'Helpful Reminders 🔔',
  competition: 'Friendly Competition 🏆',
};
export const DATA_SOURCE_LABELS = {
  manual: 'Manual Logging',
  apple_watch: 'Apple Watch',
  health_connect: 'Health Connect',
  garmin: 'Garmin',
  oura: 'Oura',
  other_health: 'Other Health Source',
};
export const HEALTH_SYNC_LABELS = {
  workouts_steps: 'Workouts + Steps Sync',
  advanced_later: 'Advanced Sync Later',
  manual_first: 'Manual Logging First',
  connect_later: 'Connect Watch Later',
};

export const AVATAR_OPTIONS = [
  ['🔥', '#FF6B35'], ['⚡', '#FFD700'], ['💪', '#F59E0B'], ['🌱', '#34D399'],
  ['🏃', '#34D399'], ['🧘', '#A78BFA'], ['🚴', '#60A5FA'], ['🏊', '#38BDF8'],
  ['👑', '#C084FC'], ['💎', '#38BDF8'], ['🌈', '#C084FC'], ['✨', '#FFD700'],
];

export const PROFILE_FRAMES = [
  { id: 'none', label: 'Clean', colors: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)'] },
  { id: 'ember', label: 'Ember', colors: ['#FF6B35', '#FFD700'] },
  { id: 'gold', label: 'Gold', colors: ['#FFD700', '#F59E0B'] },
  { id: 'neon', label: 'Neon', colors: ['#34D399', '#60A5FA'] },
];

export const reminderButtonStyle = (background, color) => ({
  border: 'none',
  borderRadius: 12,
  background,
  color,
  fontSize: 12,
  fontWeight: 800,
  padding: '10px 8px',
  cursor: 'pointer',
});
