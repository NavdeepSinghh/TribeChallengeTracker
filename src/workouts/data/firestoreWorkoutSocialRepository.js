import { httpsCallable } from "firebase/functions";
import {
  collection,
  getDocs,
  limit as limitQuery,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, workoutsFunctions } from "../../firebase";
import {
  followUser,
  getFollowStatus,
  unfollowUser,
} from "../../userServices/followService";
import {
  mapPublicWorkoutDocument,
  sortPublicWorkouts,
} from "../domain/workoutSocialModels";

function ownerProfileFromWorkout(workout = {}) {
  return {
    uid: workout.ownerUid,
    id: workout.ownerUid,
    displayName: workout.ownerDisplayName,
    avatarEmoji: workout.ownerAvatarEmoji,
    avatarColor: workout.ownerAvatarColor,
  };
}

export class FirestoreWorkoutSocialRepository {
  constructor({
    auth,
    copyCallable = httpsCallable(workoutsFunctions, "copyPublicWorkout"),
  } = {}) {
    this.auth = auth;
    this.copyCallable = copyCallable;
  }

  currentUid() {
    return this.auth?.currentUser?.uid || null;
  }

  async fetchPublicWorkouts({ limit = 12 } = {}) {
    const uid = this.currentUid();
    if (!uid) throw new Error("Sign in to discover public workouts.");

    const snap = await getDocs(query(
      collection(db, "publicWorkouts"),
      where("visibility", "==", "public"),
      orderBy("publishedAt", "desc"),
      limitQuery(limit)
    ));

    const workouts = sortPublicWorkouts(
      snap.docs
        .map(doc => mapPublicWorkoutDocument(doc.id, doc.data()))
        .filter(workout => workout.ownerUid && workout.ownerUid !== uid)
    );

    const withFollowStatus = await Promise.all(workouts.map(async (workout) => {
      let followStatus = "none";
      try {
        followStatus = await getFollowStatus(uid, workout.ownerUid);
      } catch (_) {
        followStatus = "unavailable";
      }
      return { ...workout, followStatus };
    }));

    return withFollowStatus;
  }

  async copyPublicWorkout(publicWorkoutId) {
    const uid = this.currentUid();
    if (!uid) throw new Error("Sign in to copy workouts.");
    const result = await this.copyCallable({ publicWorkoutId });
    return result?.data || result;
  }

  async followCreator(ownerProfile) {
    const uid = this.currentUid();
    if (!uid) throw new Error("Sign in to follow creators.");
    return followUser(uid, ownerProfileFromWorkout(ownerProfile));
  }

  async unfollowCreator(ownerUid) {
    const uid = this.currentUid();
    if (!uid) throw new Error("Sign in to update follows.");
    await unfollowUser(uid, ownerUid);
    return "none";
  }
}
