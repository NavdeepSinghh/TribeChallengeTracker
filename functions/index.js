const { onCall } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const {
  processAccountDeletion,
} = require('./accountDeletionCallableHandlers');
const {
  handleRunAiGatewaySmokeTest,
} = require('./aiGatewayCallableHandlers');
const {
  handlePurchaseValidationReadinessRequest,
  handleVerifyPurchaseRequest,
} = require('./purchaseCallableHandlers');
const {
  copyPublicWorkout,
  finishWorkoutSession,
} = require('./workoutSessionCallableHandlers');
const {
  syncTrainingPlanProgress,
} = require('./trainingPlanProgressCallableHandlers');
const {
  syncWorkoutInsightAggregates,
} = require('./workoutInsightAggregationHandlers');
const {
  syncWorkoutProgressionSuggestions,
} = require('./workoutProgressionSuggestionHandlers');

admin.initializeApp();

const deepseekApiKey = defineSecret('DEEPSEEK_API_KEY');

const storeLaunchCallableContract = {
  validationConfigured: 'validationConfigured',
  readinessMessage: 'No entitlements were changed',
};

exports.verifyPurchase = onCall({ region: 'us-central1' }, async (request) => {
  return handleVerifyPurchaseRequest({ admin, request });
});

exports.getPurchaseValidationReadiness = onCall({ region: 'us-central1' }, async (request) => {
  return handlePurchaseValidationReadinessRequest({ request });
});

exports.processAccountDeletion = onCall({ region: 'us-central1' }, async (request) => {
  return processAccountDeletion({ admin, request });
});

exports.finishWorkoutSession = onCall({ region: 'australia-southeast1' }, async (request) => {
  return finishWorkoutSession({ admin, request });
});

exports.copyPublicWorkout = onCall({ region: 'australia-southeast1' }, async (request) => {
  return copyPublicWorkout({ admin, request });
});

exports.syncTrainingPlanProgress = onCall({ region: 'australia-southeast1' }, async (request) => {
  return syncTrainingPlanProgress({ admin, request });
});

exports.syncWorkoutInsightAggregates = onCall({ region: 'australia-southeast1' }, async (request) => {
  return syncWorkoutInsightAggregates({ admin, request });
});

exports.syncWorkoutProgressionSuggestions = onCall({ region: 'australia-southeast1' }, async (request) => {
  return syncWorkoutProgressionSuggestions({ admin, request });
});

exports.runAiGatewaySmokeTest = onCall(
  {
    region: 'australia-southeast1',
    secrets: [deepseekApiKey],
  },
  async (request) => {
    return handleRunAiGatewaySmokeTest({ admin, request });
  },
);

exports.mirrorChallengeMembershipToUser = onDocumentCreated(
  {
    document: 'challenges/{challengeId}/members/{memberUid}',
    region: 'australia-southeast1',
  },
  async (event) => {
    const challengeId = event.params.challengeId;
    const memberUid = event.params.memberUid;
    const member = event.data?.data() || {};
    const status = String(member.status || 'active').toLowerCase();

    if (!challengeId || !memberUid || ['left', 'removed', 'deleted', 'inactive'].includes(status)) {
      return null;
    }

    await admin.firestore().collection('users').doc(memberUid).set({
      joinedChallengeIds: admin.firestore.FieldValue.arrayUnion(challengeId),
    }, { merge: true });

    return null;
  },
);

exports.recordChallengeReferralJoin = onDocumentCreated(
  {
    document: 'challenges/{challengeId}/members/{memberUid}',
    region: 'australia-southeast1',
  },
  async (event) => {
    const member = event.data?.data() || {};
    const challengeId = event.params.challengeId;
    const memberUid = event.params.memberUid;
    const referrerUid = typeof member.referredBy === 'string' ? member.referredBy.trim() : '';

    if (!referrerUid || referrerUid === memberUid) {
      return null;
    }

    const db = admin.firestore();
    const attributionRef = db.collection('referralAttributions').doc(`${challengeId}_${memberUid}`);
    const referrerRef = db.collection('users').doc(referrerUid);

    await db.runTransaction(async (transaction) => {
      const attributionSnap = await transaction.get(attributionRef);
      if (attributionSnap.exists) {
        return;
      }

      transaction.set(attributionRef, {
        challengeId,
        referredUid: memberUid,
        referrerUid,
        referralSource: member.referralSource || 'invite_link',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      transaction.set(referrerRef, {
        stats: {
          referralJoins: admin.firestore.FieldValue.increment(1),
        },
      }, { merge: true });
    });

    return null;
  },
);

exports.recordAppReferralSignup = onDocumentCreated(
  {
    document: 'users/{memberUid}',
    region: 'australia-southeast1',
  },
  async (event) => {
    const user = event.data?.data() || {};
    const memberUid = event.params.memberUid;
    const referrerUid = typeof user.appReferredBy === 'string' ? user.appReferredBy.trim() : '';

    if (!referrerUid || referrerUid === memberUid) {
      return null;
    }

    const db = admin.firestore();
    const attributionRef = db.collection('appReferralAttributions').doc(memberUid);
    const referrerRef = db.collection('users').doc(referrerUid);

    await db.runTransaction(async (transaction) => {
      const attributionSnap = await transaction.get(attributionRef);
      if (attributionSnap.exists) {
        return;
      }

      transaction.set(attributionRef, {
        referredUid: memberUid,
        referrerUid,
        referralSource: 'app_invite_link',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      transaction.set(referrerRef, {
        stats: {
          appReferralSignups: admin.firestore.FieldValue.increment(1),
        },
      }, { merge: true });
    });

    return null;
  },
);

function challengeMessageTitle(type, challengeName) {
  if (type === 'log_reminder') {
    return 'Time to log your progress';
  }
  return `${challengeName || 'Your challenge'} update`;
}

function challengeMessageBody(message, senderName) {
  const cleaned = String(message || '').replace(/\s+/g, ' ').trim();
  if (!senderName) {
    return cleaned || 'Open TribeLog to see the latest update.';
  }
  if (!cleaned) {
    return `${senderName} posted a challenge update.`;
  }
  return `${senderName}: ${cleaned}`;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function tokenDocsForMembers(db, challengeId, senderUid) {
  const membersSnap = await db.collection('challenges').doc(challengeId).collection('members')
    .get();
  const memberUids = membersSnap.docs
    .filter((doc) => {
      const status = String(doc.data().status || 'active').toLowerCase();
      return status === 'active';
    })
    .map((doc) => doc.id)
    .filter((uid) => uid && uid !== senderUid);

  const tokenDocs = [];
  await Promise.all(memberUids.map(async (uid) => {
    const snap = await db.collection('users').doc(uid).collection('deviceTokens')
      .where('enabled', '==', true)
      .get();
    snap.docs.forEach((doc) => {
      const token = String(doc.data().token || doc.id || '').trim();
      if (token) {
        tokenDocs.push({ uid, token, ref: doc.ref });
      }
    });
  }));

  const seen = new Set();
  return tokenDocs.filter((entry) => {
    if (seen.has(entry.token)) return false;
    seen.add(entry.token);
    return true;
  });
}

exports.sendChallengeMessageNotification = onDocumentCreated(
  {
    document: 'challenges/{challengeId}/messages/{messageId}',
    region: 'australia-southeast1',
  },
  async (event) => {
    const messageRef = event.data?.ref;
    const message = event.data?.data() || {};
    const challengeId = event.params.challengeId;
    const messageId = event.params.messageId;

    if (!messageRef || message.notificationRequested !== true || message.notificationSent === true) {
      console.info('Skipping challenge notification', {
        challengeId,
        messageId,
        hasMessageRef: Boolean(messageRef),
        notificationRequested: message.notificationRequested,
        notificationSent: message.notificationSent,
      });
      return null;
    }

    const db = admin.firestore();
    const tokenDocs = await tokenDocsForMembers(db, challengeId, message.senderUid);
    console.info('Preparing challenge notification', {
      challengeId,
      messageId,
      type: message.type || 'announcement',
      senderUid: message.senderUid || '',
      tokenCount: tokenDocs.length,
    });

    if (tokenDocs.length === 0) {
      await messageRef.set({
        notificationSent: true,
        notificationSentAt: admin.firestore.FieldValue.serverTimestamp(),
        notificationTokenCount: 0,
        notificationSuccessCount: 0,
        notificationFailureCount: 0,
      }, { merge: true });
      console.info('No device tokens found for challenge notification', {
        challengeId,
        messageId,
      });
      return null;
    }

    const title = challengeMessageTitle(message.type, message.challengeName);
    const body = challengeMessageBody(message.message, message.senderName);
    let successCount = 0;
    let failureCount = 0;
    const invalidTokenRefs = [];

    for (const batch of chunk(tokenDocs, 500)) {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch.map((entry) => entry.token),
        notification: { title, body },
        data: {
          kind: 'challenge_message',
          challengeId,
          messageId,
          type: String(message.type || 'announcement'),
          targetDate: String(message.targetDate || ''),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'challenge_updates',
            clickAction: 'OPEN_CHALLENGE',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });

      successCount += response.successCount;
      failureCount += response.failureCount;
      response.responses.forEach((result, index) => {
        const code = result.error?.code || '';
        if (code) {
          console.warn('Challenge notification token send failed', {
            challengeId,
            messageId,
            uid: batch[index].uid,
            code,
          });
        }
        if (
          code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token'
        ) {
          invalidTokenRefs.push(batch[index].ref);
        }
      });
    }

    if (invalidTokenRefs.length > 0) {
      await Promise.all(invalidTokenRefs.map((ref) => ref.set({
        enabled: false,
        disabledAt: admin.firestore.FieldValue.serverTimestamp(),
        disabledReason: 'invalid_fcm_token',
      }, { merge: true })));
    }

    await messageRef.set({
      notificationSent: true,
      notificationSentAt: admin.firestore.FieldValue.serverTimestamp(),
      notificationTokenCount: tokenDocs.length,
      notificationSuccessCount: successCount,
      notificationFailureCount: failureCount,
    }, { merge: true });
    console.info('Challenge notification send complete', {
      challengeId,
      messageId,
      tokenCount: tokenDocs.length,
      successCount,
      failureCount,
    });

    return null;
  },
);
