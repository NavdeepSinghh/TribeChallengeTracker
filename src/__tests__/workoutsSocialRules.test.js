/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');
const { ReadableStream, TransformStream, WritableStream } = require('stream/web');
const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} = require('@firebase/rules-unit-testing');

Object.assign(global, { ReadableStream, TransformStream, WritableStream });

const { fetch, Headers, Request, Response } = require('undici');

const repoRoot = path.resolve(__dirname, '../..');
const projectId = `tribelog-workouts-social-${Date.now()}`;

let testEnv;

jest.setTimeout(30000);

Object.assign(global, { fetch, Headers, Request, Response });

function authedDb(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

async function seedDocs(docs) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const writes = Object.entries(docs).map(([docPath, data]) => db.doc(docPath).set(data));
    await Promise.all(writes);
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe('workouts social Firestore rules', () => {
  it('allows owner and denies non-owner reads on private training sessions', async () => {
    await seedDocs({
      'users/owner/trainingSessions/session_1': {
        id: 'session_1',
        ownerUid: 'owner',
        status: 'completed',
        name: 'Private Session',
      },
    });

    await assertSucceeds(authedDb('owner').doc('users/owner/trainingSessions/session_1').get());
    await assertFails(authedDb('viewer').doc('users/owner/trainingSessions/session_1').get());
  });

  it('allows follower and denies non-follower reads for tribe-visible public workouts', async () => {
    await seedDocs({
      'users/owner/followers/follower': {
        uid: 'follower',
        followerUid: 'follower',
        targetUid: 'owner',
        status: 'following',
      },
      'publicWorkouts/tribe_workout': {
        ownerUid: 'owner',
        visibility: 'tribe',
        sourceSessionId: 'session_1',
        name: 'Follower Upper Body',
        publishedAt: '2026-07-01T00:00:00.000Z',
      },
    });

    await assertSucceeds(authedDb('follower').doc('publicWorkouts/tribe_workout').get());
    await assertFails(authedDb('stranger').doc('publicWorkouts/tribe_workout').get());
  });

  it('allows public workout reads unless either side has blocked the other', async () => {
    await seedDocs({
      'publicWorkouts/public_workout': {
        ownerUid: 'owner',
        visibility: 'public',
        sourceSessionId: 'session_1',
        name: 'Public Upper Body',
        publishedAt: '2026-07-01T00:00:00.000Z',
      },
    });

    await assertSucceeds(authedDb('viewer').doc('publicWorkouts/public_workout').get());

    await seedDocs({
      'users/viewer/blockedUsers/owner': {
        blockedUid: 'owner',
      },
    });
    await assertFails(authedDb('viewer').doc('publicWorkouts/public_workout').get());

    await testEnv.clearFirestore();
    await seedDocs({
      'publicWorkouts/public_workout': {
        ownerUid: 'owner',
        visibility: 'public',
        sourceSessionId: 'session_1',
        name: 'Public Upper Body',
        publishedAt: '2026-07-01T00:00:00.000Z',
      },
      'users/owner/blockedUsers/viewer': {
        blockedUid: 'viewer',
      },
    });
    await assertFails(authedDb('viewer').doc('publicWorkouts/public_workout').get());
  });

  it('requires an owned source training session for direct public workout writes', async () => {
    const db = authedDb('owner');
    const payload = {
      ownerUid: 'owner',
      visibility: 'public',
      sourceSessionId: 'session_1',
      name: 'Mirror From Session',
    };

    await assertFails(db.doc('publicWorkouts/direct_write').set(payload));

    await db.doc('users/owner/trainingSessions/session_1').set({
      id: 'session_1',
      status: 'completed',
      name: 'Real Session',
    });

    await assertSucceeds(db.doc('publicWorkouts/direct_write').set(payload));
  });

  it('denies non-admin writes to exercise catalog and PR docs', async () => {
    await assertFails(authedDb('member').doc('exerciseCatalog/new_exercise').set({
      id: 'new_exercise',
      status: 'published',
      name: 'New Exercise',
      primaryMuscles: ['chest'],
      equipment: ['bodyweight'],
      level: 'beginner',
      movementPattern: 'push',
    }));

    await assertFails(authedDb('member').doc('users/member/exercisePRs/bench_press').set({
      exerciseId: 'bench_press',
      bestWeightKg: 100,
    }));
  });

  it('allows admin writes to exercise catalog and PR docs', async () => {
    await seedDocs({
      'admins/admin': {
        uid: 'admin',
      },
    });

    await assertSucceeds(authedDb('admin').doc('exerciseCatalog/new_exercise').set({
      id: 'new_exercise',
      status: 'published',
      name: 'New Exercise',
      primaryMuscles: ['chest'],
      equipment: ['bodyweight'],
      level: 'beginner',
      movementPattern: 'push',
    }));

    await assertSucceeds(authedDb('admin').doc('users/member/exercisePRs/bench_press').set({
      exerciseId: 'bench_press',
      bestWeightKg: 100,
    }));
  });
});
