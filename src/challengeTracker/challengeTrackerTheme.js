export const ACCENT = '#FF6B35';
export const GOLD = '#FFD700';

const AVATARS = ['🧡', '💚', '💜', '💙', '🩷', '💛', '🤍', '🖤'];

export const fallbackAvatar = uid => AVATARS[(uid.charCodeAt(0) + (uid.charCodeAt(1) || 0)) % AVATARS.length];
