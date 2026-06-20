import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProfileScreen from '../ProfileScreen';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../userService', () => new Proxy({}, {
  get: (_target, prop) => {
    if (prop === '__esModule') return true;
    if (prop === 'getUserProfile') {
      return jest.fn(async uid => ({
        uid,
        displayName: 'Test User',
        joinedChallengeIds: [],
        stats: {},
      }));
    }
    return jest.fn(async () => []);
  },
}));

jest.mock('../challengeService', () => new Proxy({}, {
  get: (_target, prop) => {
    if (prop === '__esModule') return true;
    return jest.fn(async () => []);
  },
}));

describe('ProfileScreen settings render', () => {
  it('renders settings mode without throwing', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <ProfileScreen
          user={{ uid: 'user-1', displayName: 'Test User' }}
          earnedBadges={new Set()}
          myHistory={{}}
          challengeStats={{}}
          mode="settings"
          onClose={() => {}}
          onHistoryUpdated={() => {}}
          onProfileUpdated={() => {}}
        />
      );
    });

    expect(container.textContent).toContain('SETTINGS');
    expect(container.textContent).toContain('Sign Out');
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
