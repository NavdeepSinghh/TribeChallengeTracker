export default function buildLeaveDialogCopy({ challenge, memberData }) {
  const isAdmin = memberData?.role === 'admin';
  const isOnlyMember = (challenge.memberCount || 1) <= 1;

  if (isAdmin && isOnlyMember) {
    return {
      title: 'Delete this challenge?',
      body: 'You\'re the only member. Leaving will permanently delete this challenge and all its data. This cannot be undone.',
      confirmLabel: '🗑 Delete Challenge',
      confirmColor: '#ef4444',
    };
  }

  if (isAdmin) {
    return {
      title: 'Leave as admin?',
      body: 'You\'re the admin. The highest-scoring member will automatically be promoted to admin. Your points and streak in this challenge will be removed.',
      confirmLabel: '🚪 Leave & Promote',
      confirmColor: '#FF6B35',
    };
  }

  return {
    title: 'Leave this challenge?',
    body: 'Your points, streak, and progress in this challenge will be removed. You can rejoin later but will start from scratch.',
    confirmLabel: '🚪 Leave Challenge',
    confirmColor: '#FF6B35',
  };
}
