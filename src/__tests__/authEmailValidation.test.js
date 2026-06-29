const {
  getAuthEmailError,
  isValidAuthEmail,
  normalizeAuthEmail,
  requiresEmailVerification,
} = require('../authEmailValidation');

describe('auth email validation', () => {
  it('normalizes email before Firebase auth calls', () => {
    expect(normalizeAuthEmail('  NAV@Example.COM  ')).toBe('nav@example.com');
  });

  it('accepts normal email addresses and rejects malformed addresses', () => {
    expect(isValidAuthEmail('member@example.com')).toBe(true);
    expect(isValidAuthEmail('member.name+tag@example.co')).toBe(true);

    ['', 'member', 'member@', 'member@example', 'member example@test.com', 'member@@example.com'].forEach((email) => {
      expect(getAuthEmailError(email)).toBeTruthy();
    });
  });

  it('requires verification for unverified email/password users only', () => {
    expect(requiresEmailVerification({
      emailVerified: false,
      providerData: [{ providerId: 'password' }],
    })).toBe(true);

    expect(requiresEmailVerification({
      emailVerified: true,
      providerData: [{ providerId: 'password' }],
    })).toBe(false);

    expect(requiresEmailVerification({
      emailVerified: false,
      providerData: [{ providerId: 'google.com' }],
    })).toBe(false);
  });
});
