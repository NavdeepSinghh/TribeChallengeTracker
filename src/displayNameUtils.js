const PLACEHOLDER_NAMES = new Set([
  'member',
  'tribe member',
  'tribe member 💪',
  'tribe member 🔥',
]);

export function normalizeDisplayName(value) {
  return (value || '').replace(/\s+/g, ' ').trim().slice(0, 40);
}

export function isPlaceholderDisplayName(value) {
  const normalized = normalizeDisplayName(value).toLowerCase();
  return !normalized || PLACEHOLDER_NAMES.has(normalized);
}
