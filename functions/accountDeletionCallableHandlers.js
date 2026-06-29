const crypto = require('crypto');
const { HttpsError } = require('firebase-functions/v2/https');

const PRIVATE_USER_SUBCOLLECTIONS = [
  'activityLog',
  'blockedUsers',
  'challengeCompletions',
  'deviceTokens',
  'earnedBadges',
  'trainingSessions',
];

const USER_OWNED_COLLECTIONS = [
  'communityEventReviews',
  'creatorBrandedPages',
  'creatorChallengeTemplateDrafts',
  'creatorHostingApplications',
  'creatorLeaderboardSnapshots',
  'creatorPaidHostingLaunchGateReviews',
  'creatorPayoutExceptionReviews',
  'creatorPrivateInviteLaunches',
  'customerValueReviews',
  'entitlementRecoveryRequests',
  'featureSubmissions',
  'launchExperimentReviews',
  'paidLaunchDecisionReviews',
  'partnerCampaignApplications',
  'partnerCampaignRetrospectiveReviews',
  'partnerPerkClaims',
  'partnerPerkHandoffAuditReviews',
  'proTrialReviews',
  'referralRewardClaims',
  'referralRewardHandoffAuditReviews',
  'storeReviewResponseReviews',
  'storeTestPurchaseEvidence',
  'supportRefundReadinessReviews',
  'supportRequests',
  'weeklyCampaignReviews',
];

const REFERRAL_COLLECTIONS = [
  'appReferralAttributions',
  'referralAttributions',
];

function hashForDeletion(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex');
}

function cleanUid(value) {
  const uid = String(value || '').trim();
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(uid)) {
    throw new HttpsError('invalid-argument', 'A valid targetUid is required.');
  }
  return uid;
}

function reviewerName(request) {
  return request.auth?.token?.email || request.auth?.uid || 'admin';
}

async function assertAdmin(db, actorUid) {
  if (!actorUid) {
    throw new HttpsError('unauthenticated', 'Sign in is required.');
  }
  const adminSnap = await db.collection('admins').doc(actorUid).get();
  if (!adminSnap.exists) {
    throw new HttpsError('permission-denied', 'Admin access is required.');
  }
}

async function deleteDocumentWithSubcollections(ref, counters) {
  const subcollections = await ref.listCollections();
  for (const collectionRef of subcollections) {
    await deleteCollectionRecursive(collectionRef, counters);
  }
  await ref.delete();
  counters.deletedDocuments += 1;
}

async function deleteCollectionRecursive(collectionRef, counters, batchSize = 120) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snap = await collectionRef.limit(batchSize).get();
    if (snap.empty) break;
    for (const docSnap of snap.docs) {
      await deleteDocumentWithSubcollections(docSnap.ref, counters);
    }
  }
}

async function deleteQueryDocuments(queryRef, counters, batchSize = 300) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snap = await queryRef.limit(batchSize).get();
    if (snap.empty) break;
    const batch = queryRef.firestore.batch();
    snap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    counters.deletedDocuments += snap.size;
  }
}

async function updateQueryDocuments(queryRef, data, counters, batchSize = 300) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snap = await queryRef.limit(batchSize).get();
    if (snap.empty) break;
    const batch = queryRef.firestore.batch();
    snap.docs.forEach((docSnap) => batch.set(docSnap.ref, data, { merge: true }));
    await batch.commit();
    counters.anonymizedDocuments += snap.size;
  }
}

async function deleteUserPrivateProfile(db, uid, counters) {
  const userRef = db.collection('users').doc(uid);
  for (const name of PRIVATE_USER_SUBCOLLECTIONS) {
    await deleteCollectionRecursive(userRef.collection(name), counters);
  }
  await userRef.delete();
  counters.deletedDocuments += 1;
}

async function removeChallengeMemberships(admin, db, uid, counters) {
  const memberSnap = await db.collectionGroup('members').where('uid', '==', uid).get();
  for (const memberDoc of memberSnap.docs) {
    const memberData = memberDoc.data() || {};
    const challengeRef = memberDoc.ref.parent.parent;
    if (!challengeRef) continue;

    if (memberData.role === 'admin') {
      const siblingSnap = await challengeRef.collection('members').where('status', '==', 'active').get();
      const candidates = siblingSnap.docs
        .filter((docSnap) => docSnap.id !== memberDoc.id)
        .map((docSnap) => ({ id: docSnap.id, ref: docSnap.ref, ...docSnap.data() }))
        .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      if (candidates[0]) {
        await candidates[0].ref.set({
          role: 'admin',
          promotedAfterDeletedAdminUidHash: hashForDeletion(uid),
          promotedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        counters.anonymizedDocuments += 1;
      }
    }

    await deleteDocumentWithSubcollections(memberDoc.ref, counters);
    const challengeSnap = await challengeRef.get();
    const challenge = challengeSnap.data() || {};
    const nextMemberCount = Math.max(0, Number(challenge.memberCount || 1) - 1);
    await challengeRef.set({
      memberCount: nextMemberCount,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(nextMemberCount === 0 ? {
        status: 'archived',
        archivedReason: 'account_deletion_no_members',
        archivedAt: admin.firestore.FieldValue.serverTimestamp(),
      } : {}),
    }, { merge: true });
    counters.anonymizedDocuments += 1;
  }
}

async function anonymizeCreatedChallenges(admin, db, uid, counters) {
  await updateQueryDocuments(
    db.collection('challenges').where('createdBy', '==', uid),
    {
      createdBy: 'deleted-user',
      creatorDeleted: true,
      creatorDeletedAt: admin.firestore.FieldValue.serverTimestamp(),
      creatorName: 'Deleted member',
      creatorEmail: admin.firestore.FieldValue.delete(),
      creatorBio: admin.firestore.FieldValue.delete(),
      creatorCtaUrl: admin.firestore.FieldValue.delete(),
      creatorSpecialty: admin.firestore.FieldValue.delete(),
    },
    counters,
  );
}

async function anonymizeChallengeMessages(admin, db, uid, counters) {
  await updateQueryDocuments(
    db.collectionGroup('messages').where('senderUid', '==', uid),
    {
      senderUid: 'deleted-user',
      senderDeleted: true,
      senderDeletedAt: admin.firestore.FieldValue.serverTimestamp(),
      senderName: 'Deleted member',
    },
    counters,
  );
}

async function deletePrivateTopLevelRecords(db, uid, counters) {
  for (const collectionName of USER_OWNED_COLLECTIONS) {
    await deleteQueryDocuments(db.collection(collectionName).where('uid', '==', uid), counters);
  }
}

async function deleteReferralRecords(db, uid, counters) {
  for (const collectionName of REFERRAL_COLLECTIONS) {
    await deleteQueryDocuments(db.collection(collectionName).where('referredUid', '==', uid), counters);
    await deleteQueryDocuments(db.collection(collectionName).where('referrerUid', '==', uid), counters);
  }
  await db.collection('appReferralAttributions').doc(uid).delete().catch(() => {});
}

async function deletePublicFeedRows(db, uid, counters) {
  await deleteQueryDocuments(db.collection('tribeFeed').where('uid', '==', uid), counters);
}

async function deleteBlockedReferences(db, uid, counters) {
  await deleteQueryDocuments(db.collectionGroup('blockedUsers').where('blockedUid', '==', uid), counters);
}

async function anonymizeContentReports(admin, db, uid, uidHash, counters) {
  await updateQueryDocuments(
    db.collection('contentReports').where('reporterUid', '==', uid),
    {
      reporterUid: 'deleted-user',
      reporterUidHash: uidHash,
      reporterDeletedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    counters,
  );
  await updateQueryDocuments(
    db.collection('contentReports').where('reportedUid', '==', uid),
    {
      reportedUid: 'deleted-user',
      reportedUidHash: uidHash,
      reportedUserDeletedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    counters,
  );
}

async function anonymizePurchaseRecords(admin, db, uid, uidHash, counters) {
  const data = {
    uid: 'deleted-user',
    uidHash,
    userDeletedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await updateQueryDocuments(db.collection('purchaseEntitlements').where('uid', '==', uid), data, counters);
  await updateQueryDocuments(db.collection('purchaseVerificationAttempts').where('uid', '==', uid), data, counters);
}

async function deleteAuthUser(admin, uid) {
  try {
    await admin.auth().deleteUser(uid);
    return true;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return false;
    }
    throw error;
  }
}

async function processAccountDeletion({ admin, request }) {
  const actorUid = request.auth?.uid || '';
  const targetUid = cleanUid(request.data?.targetUid);
  const confirm = request.data?.confirm === true;
  const reviewNote = String(request.data?.reviewNote || '').trim().slice(0, 500);
  const db = admin.firestore();

  if (!confirm) {
    throw new HttpsError('invalid-argument', 'Deletion confirmation is required.');
  }
  if (actorUid === targetUid) {
    throw new HttpsError('failed-precondition', 'Admins cannot process their own account deletion from this console.');
  }

  await assertAdmin(db, actorUid);

  const requestRef = db.collection('accountDeletionRequests').doc(targetUid);
  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) {
    throw new HttpsError('not-found', 'Account deletion request was not found.');
  }
  const requestData = requestSnap.data() || {};
  if (requestData.status === 'processed') {
    return {
      alreadyProcessed: true,
      deletedDocuments: 0,
      anonymizedDocuments: 0,
      status: 'processed',
    };
  }
  if (requestData.status !== 'verified') {
    throw new HttpsError('failed-precondition', 'Account deletion must be marked verified before processing.');
  }

  const uidHash = hashForDeletion(targetUid);
  const emailHash = requestData.email ? hashForDeletion(requestData.email) : '';
  const auditRef = db.collection('accountDeletionAudits').doc();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const counters = { anonymizedDocuments: 0, deletedDocuments: 0 };

  await auditRef.set({
    action: 'process_account_deletion',
    actorUid,
    actorLabel: reviewerName(request),
    appleSignInRevocation: requestData.appleSignInRevocation || null,
    authProviders: Array.isArray(requestData.authProviders) ? requestData.authProviders : [],
    targetUidHash: uidHash,
    targetEmailHash: emailHash,
    requestId: targetUid,
    status: 'processing',
    reviewNote,
    createdAt: now,
    updatedAt: now,
  });

  try {
    await requestRef.set({
      uid: targetUid,
      status: 'verified',
      processingStartedAt: admin.firestore.FieldValue.serverTimestamp(),
      processingStartedBy: actorUid,
      deletionAuditId: auditRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    await deletePrivateTopLevelRecords(db, targetUid, counters);
    await deleteReferralRecords(db, targetUid, counters);
    await deletePublicFeedRows(db, targetUid, counters);
    await deleteBlockedReferences(db, targetUid, counters);
    await anonymizeContentReports(admin, db, targetUid, uidHash, counters);
    await anonymizePurchaseRecords(admin, db, targetUid, uidHash, counters);
    await removeChallengeMemberships(admin, db, targetUid, counters);
    await anonymizeCreatedChallenges(admin, db, targetUid, counters);
    await anonymizeChallengeMessages(admin, db, targetUid, counters);
    await deleteUserPrivateProfile(db, targetUid, counters);
    const authDeleted = await deleteAuthUser(admin, targetUid);

    const processedRequest = {
      uid: targetUid,
      status: 'processed',
      source: 'admin_function',
      deletionAuditId: auditRef.id,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      processedBy: actorUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (Array.isArray(requestData.authProviders)) {
      processedRequest.authProviders = requestData.authProviders;
    }
    if (requestData.appleSignInRevocation) {
      processedRequest.appleSignInRevocation = requestData.appleSignInRevocation;
    }
    if (requestData.appleSignInRevoked === true) {
      processedRequest.appleSignInRevoked = true;
      processedRequest.appleSignInRevokedAt = requestData.appleSignInRevokedAt || null;
    }
    await requestRef.set(processedRequest);

    await auditRef.set({
      anonymizedDocuments: counters.anonymizedDocuments,
      authDeleted,
      deletedDocuments: counters.deletedDocuments,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return {
      anonymizedDocuments: counters.anonymizedDocuments,
      authDeleted,
      deletedDocuments: counters.deletedDocuments,
      status: 'processed',
    };
  } catch (error) {
    await requestRef.set({
      status: 'verified',
      processError: String(error.message || error).slice(0, 500),
      lastProcessAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).catch(() => {});
    await auditRef.set({
      errorMessage: String(error.message || error).slice(0, 500),
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).catch(() => {});
    throw error instanceof HttpsError
      ? error
      : new HttpsError('internal', 'Account deletion processing failed.');
  }
}

module.exports = {
  processAccountDeletion,
};
