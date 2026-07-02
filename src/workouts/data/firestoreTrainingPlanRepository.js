import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  TRAINING_PLAN_ENROLLMENT_STATUS,
  mapTrainingPlanDocument,
  mapTrainingPlanEnrollmentDocument,
} from "../domain/trainingPlanModels";

export class FirestoreTrainingPlanRepository {
  constructor({ firestoreDb = db, firebaseAuth = auth } = {}) {
    this.db = firestoreDb;
    this.auth = firebaseAuth;
  }

  requireUid() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in to use training plans.");
    return uid;
  }

  async listPublishedTrainingPlans() {
    const snapshot = await getDocs(query(
      collection(this.db, "trainingPlans"),
      where("status", "==", "published"),
      where("visibility", "==", "public")
    ));
    return snapshot.docs
      .map(document => mapTrainingPlanDocument(document.id, document.data()))
      .sort((left, right) => {
        const leftUpdated = left.updatedAt || "";
        const rightUpdated = right.updatedAt || "";
        if (leftUpdated !== rightUpdated) return rightUpdated.localeCompare(leftUpdated);
        return left.name.localeCompare(right.name);
      });
  }

  async listTrainingPlanEnrollments() {
    const uid = this.requireUid();
    const snapshot = await getDocs(collection(this.db, "users", uid, "trainingPlanEnrollments"));
    return snapshot.docs
      .map(document => mapTrainingPlanEnrollmentDocument(document.id, document.data()))
      .filter(enrollment => enrollment.status !== TRAINING_PLAN_ENROLLMENT_STATUS.LEFT)
      .sort((left, right) => String(right.updatedAt || right.startDate).localeCompare(String(left.updatedAt || left.startDate)));
  }

  async saveTrainingPlanEnrollment(enrollment) {
    const uid = this.requireUid();
    const enrollmentId = enrollment.planId;
    const payload = {
      ...enrollment,
      id: enrollmentId,
      uid,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(this.db, "users", uid, "trainingPlanEnrollments", enrollmentId), {
      ...payload,
      createdAt: serverTimestamp(),
    }, { merge: true });
    return mapTrainingPlanEnrollmentDocument(enrollmentId, {
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async leaveTrainingPlan(planId) {
    const uid = this.requireUid();
    const enrollmentId = String(planId || "").trim();
    if (!enrollmentId) throw new Error("A training plan is required.");
    await setDoc(doc(this.db, "users", uid, "trainingPlanEnrollments", enrollmentId), {
      id: enrollmentId,
      planId: enrollmentId,
      uid,
      status: TRAINING_PLAN_ENROLLMENT_STATUS.LEFT,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return enrollmentId;
  }

  async saveTrainingPlanEnrollmentPatch(planId, patch = {}) {
    const uid = this.requireUid();
    const enrollmentId = String(planId || "").trim();
    if (!enrollmentId) throw new Error("A training plan is required.");
    const payload = {
      ...patch,
      id: enrollmentId,
      planId: enrollmentId,
      uid,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(this.db, "users", uid, "trainingPlanEnrollments", enrollmentId), payload, { merge: true });
    return mapTrainingPlanEnrollmentDocument(enrollmentId, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
  }
}

export function createDefaultTrainingPlanRepository() {
  return new FirestoreTrainingPlanRepository();
}
