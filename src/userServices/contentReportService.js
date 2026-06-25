import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { sortByCreatedAtDesc } from './firestoreServiceUtils';

export function contentReportLabel(contentType) {
  switch (contentType) {
    case 'tribe_feed':
      return 'Tribe Activity';
    case 'challenge_message':
      return 'Challenge Update';
    case 'challenge_member':
      return 'Challenge Member';
    case 'profile':
      return 'Profile';
    default:
      return 'Reported Content';
  }
}

export function canRemoveReportedContent(report) {
  return report?.contentType === 'tribe_feed' || report?.contentType === 'challenge_message';
}

export async function getContentReportQueue() {
  const statuses = ['open', 'reviewing'];
  const snapshots = await Promise.all(
    statuses.map(status => getDocs(query(collection(db, 'contentReports'), where('status', '==', status)))),
  );
  const reports = snapshots.flatMap(snap => snap.docs.map(reportDoc => ({
    id: reportDoc.id,
    ...reportDoc.data(),
  })));
  return sortByCreatedAtDesc(Array.from(new Map(reports.map(report => [report.id, report])).values()));
}

export async function reviewContentReport(reportId, {
  status = 'reviewing',
  reviewNote = '',
  reviewedBy = 'admin',
  removeContent = false,
} = {}) {
  const allowedStatuses = ['reviewing', 'resolved', 'dismissed'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid content report status.');
  }
  const reportRef = doc(db, 'contentReports', reportId);
  const snap = await getDoc(reportRef);
  if (!snap.exists()) {
    throw new Error('Report could not be found.');
  }
  const report = { id: snap.id, ...snap.data() };
  const removedContent = removeContent ? await removeReportedContent(report) : Boolean(report.removedContent);
  const moderationAction = removedContent
    ? 'content_removed'
    : status === 'dismissed'
      ? 'dismissed'
      : status === 'resolved'
        ? 'resolved_manual'
        : 'reviewing';

  await updateDoc(reportRef, {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    removedContent,
    moderationAction,
  });
}

async function removeReportedContent(report) {
  if (!report?.contentId || !canRemoveReportedContent(report)) return false;
  if (report.contentType === 'tribe_feed') {
    await deleteDoc(doc(db, 'tribeFeed', report.contentId));
    return true;
  }
  if (report.contentType === 'challenge_message') {
    if (!report.challengeId) return false;
    await deleteDoc(doc(db, 'challenges', report.challengeId, 'messages', report.contentId));
    return true;
  }
  return false;
}
