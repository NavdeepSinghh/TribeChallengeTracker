export const PREMIUM_CHALLENGE_TEMPLATES = [
  {
    id: 'premium_21_reset',
    name: '21-Day Reset Pack',
    emoji: '💎',
    color: '#A78BFA',
    duration: 21,
    tagline: 'A structured premium reset with movement, recovery, and accountability',
    difficulty: 'Structured',
    isPremium: true,
    packId: '21_day_reset',
    packLabel: 'Premium Pack',
    rules: [
      'Complete one intentional movement session each day',
      'Hit your hydration target and log it',
      'Complete one recovery or mindset task daily',
      'Share a weekly proof update with the tribe',
      'Invite one accountability partner before Day 5',
    ],
    tasks: [
      { id: 'movement', label: 'Intentional movement completed', emoji: '🏃' },
      { id: 'hydration', label: 'Hydration target hit', emoji: '💧' },
      { id: 'recovery', label: 'Recovery or mindset task', emoji: '🧘' },
      { id: 'proof', label: 'Progress proof logged', emoji: '📸' },
    ],
    dailyPrompts: [
      'What is the smallest win you can protect today?',
      'Send one accountability check-in before the day gets busy.',
      'Choose recovery with the same discipline as training.',
    ],
    disclaimer: 'This premium challenge pack is for accountability and habit formation. It is not medical advice. Adjust intensity to your needs and consult a healthcare professional when appropriate.',
  },
];
