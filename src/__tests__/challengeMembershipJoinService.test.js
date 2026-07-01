jest.mock('firebase/firestore', () => ({
  arrayUnion: jest.fn((...values) => ({ op: 'arrayUnion', values })),
  doc: jest.fn((_, ...segments) => segments.join('/')),
  increment: jest.fn((value) => ({ op: 'increment', value })),
  runTransaction: jest.fn(),
  serverTimestamp: jest.fn(() => ({ op: 'serverTimestamp' })),
}));

jest.mock('../firebase', () => ({
  db: { app: 'mock-db' },
}));

const {
  arrayUnion,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} = require('firebase/firestore');
const { joinChallenge } = require('../challengeMembershipJoinService');

describe('joinChallenge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    arrayUnion.mockImplementation((...values) => ({ op: 'arrayUnion', values }));
    doc.mockImplementation((_, ...segments) => segments.join('/'));
    increment.mockImplementation((value) => ({ op: 'increment', value }));
    serverTimestamp.mockImplementation(() => ({ op: 'serverTimestamp' }));
  });

  it('repairs joinedChallengeIds when membership exists but the user list is stale', async () => {
    const transaction = {
      get: jest.fn((ref) => Promise.resolve(
        ref.includes('/members/')
          ? { exists: () => true }
          : { data: () => ({ displayName: 'Nam', joinedChallengeIds: ['old-challenge'] }) }
      )),
      set: jest.fn(),
    };
    runTransaction.mockImplementation(async (_, callback) => callback(transaction));

    await joinChallenge('uid-1', 'challenge-1', 'ref-1');

    expect(transaction.set).toHaveBeenCalledTimes(1);
    expect(transaction.set).toHaveBeenCalledWith('users/uid-1', {
      joinedChallengeIds: { op: 'arrayUnion', values: ['challenge-1'] },
      stats: {
        challengesJoined: { op: 'increment', value: 1 },
      },
    }, { merge: true });
  });

  it('creates member, increments count, and lists the challenge for a new join', async () => {
    const transaction = {
      get: jest.fn((ref) => Promise.resolve(
        ref.includes('/members/')
          ? { exists: () => false }
          : { data: () => ({ displayName: 'Nam', joinedChallengeIds: [] }) }
      )),
      set: jest.fn(),
    };
    runTransaction.mockImplementation(async (_, callback) => callback(transaction));

    await joinChallenge('uid-1', 'challenge-1', 'ref-1');

    expect(transaction.set).toHaveBeenCalledWith(
      'challenges/challenge-1/members/uid-1',
      expect.objectContaining({ uid: 'uid-1', displayName: 'Nam', referredBy: 'ref-1' })
    );
    expect(transaction.set).toHaveBeenCalledWith(
      'challenges/challenge-1',
      { memberCount: { op: 'increment', value: 1 } },
      { merge: true }
    );
    expect(transaction.set).toHaveBeenCalledWith('users/uid-1', expect.objectContaining({
      joinedChallengeIds: { op: 'arrayUnion', values: ['challenge-1'] },
    }), { merge: true });
  });
});
