export function safeSessionGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Safari private browsing and embedded webviews can reject storage writes.
  }
}

export function safeSessionRemove(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Storage cleanup should never block invite or auth flows.
  }
}
