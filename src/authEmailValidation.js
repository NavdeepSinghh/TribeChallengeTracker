const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeAuthEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function getAuthEmailError(email) {
  const normalized = normalizeAuthEmail(email);

  if (!normalized) {
    return 'Enter your email address.';
  }

  if (/\s/.test(normalized) || !EMAIL_PATTERN.test(normalized)) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function isValidAuthEmail(email) {
  return getAuthEmailError(email) === '';
}

export function requiresEmailVerification(user) {
  if (!user) return false;

  const providers = Array.isArray(user.providerData) ? user.providerData : [];
  const usesPasswordProvider = providers.some((provider) => provider?.providerId === 'password');

  return usesPasswordProvider && user.emailVerified !== true;
}
