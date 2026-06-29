const {
  FOLLOW_PROFILE_VISIBILITY,
  ROUTINE_VISIBILITY,
  buildPublicProfilePayload,
  buildPublicRoutinePayload,
  normalizeBio,
  normalizePublicDisplayName,
  normalizeRoutineVisibility,
  normalizeVisibility,
  shouldShowRoutine,
  shouldShowDiscoverProfile,
} = require('../follow/followModel');

describe('follow profile model', () => {
  it('keeps profiles public and routines private by default for discovery testing', () => {
    expect(normalizeVisibility('unknown')).toBe(FOLLOW_PROFILE_VISIBILITY.PUBLIC);
    expect(normalizeRoutineVisibility('unknown')).toBe(ROUTINE_VISIBILITY.PRIVATE);

    const payload = buildPublicProfilePayload('uid-1', {
      displayName: 'Navdeep Singh',
      avatarEmoji: '⚡',
      avatarColor: '#FF6B35',
      stats: { currentStreak: 14, totalPoints: 1200, badgeXp: 610 },
    });

    expect(payload).toMatchObject({
      uid: 'uid-1',
      displayName: 'Navdeep Singh',
      avatarEmoji: '⚡',
      avatarColor: '#FF6B35',
      profileVisibility: FOLLOW_PROFILE_VISIBILITY.PUBLIC,
      routineDefaultVisibility: ROUTINE_VISIBILITY.PRIVATE,
      currentStreak: 14,
      totalPoints: 1200,
      badgeXp: 610,
    });
  });

  it('normalizes public profile copy for discovery cards', () => {
    expect(normalizePublicDisplayName({ email: 'member@example.com' })).toBe('member');
    expect(normalizeBio('  Training   for   consistency.  ')).toBe('Training for consistency.');
  });

  it('shows only public profiles that are not the signed-in user', () => {
    expect(shouldShowDiscoverProfile({ uid: 'other', profileVisibility: 'public' }, 'me')).toBe(true);
    expect(shouldShowDiscoverProfile({ uid: 'me', profileVisibility: 'public' }, 'me')).toBe(false);
    expect(shouldShowDiscoverProfile({ uid: 'other', profileVisibility: 'private' }, 'me')).toBe(false);
  });

  it('builds public routine payloads without leaking private notes', () => {
    const routine = buildPublicRoutinePayload('owner-1', {
      displayName: 'Suvi Si',
      avatarEmoji: '⚡',
      followProfile: { routineDefaultVisibility: ROUTINE_VISIBILITY.PUBLIC },
    }, {
      id: 'session-1',
      type: 'gym',
      planName: 'Pull Day',
      notes: 'Private recovery note',
      exercises: [
        { name: 'Lat Pulldown', sets: [{ reps: 10, weightKg: 35 }] },
      ],
      totalVolumeKg: 350,
    });

    expect(routine).toMatchObject({
      ownerUid: 'owner-1',
      ownerDisplayName: 'Suvi Si',
      sourceSessionId: 'session-1',
      visibility: ROUTINE_VISIBILITY.PUBLIC,
      planName: 'Pull Day',
      exerciseCount: 1,
      totalVolumeKg: 350,
    });
    expect(routine.notes).toBeUndefined();
    expect(shouldShowRoutine(routine, 'viewer-1')).toBe(true);
    expect(shouldShowRoutine(routine, 'owner-1')).toBe(false);
  });

  it('shows follower-only routines only to followers', () => {
    const routine = buildPublicRoutinePayload('owner-1', {
      displayName: 'Suvi Si',
    }, {
      id: 'session-2',
      type: 'gym',
      planName: 'Push Day',
    }, {
      visibility: ROUTINE_VISIBILITY.FOLLOWERS,
    });

    expect(routine.visibility).toBe(ROUTINE_VISIBILITY.FOLLOWERS);
    expect(shouldShowRoutine(routine, 'viewer-1')).toBe(false);
    expect(shouldShowRoutine(routine, 'viewer-1', { isFollowingOwner: true })).toBe(true);
    expect(shouldShowRoutine(routine, 'owner-1', { isFollowingOwner: true })).toBe(false);
  });
});
