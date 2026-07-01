import { httpsCallable } from "firebase/functions";
import { workoutsFunctions } from "../../firebase";

const ACTIVE_SESSION_KEY = "tribeGuidedWorkoutActiveSession";
const PENDING_FINISH_KEY = "tribeGuidedWorkoutPendingFinish";

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

function readJson(key) {
  try {
    const raw = storage()?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function writeJson(key, value) {
  storage()?.setItem(key, JSON.stringify(value));
}

export class WebGuidedWorkoutRepository {
  constructor({ finishCallable = httpsCallable(workoutsFunctions, "finishWorkoutSession") } = {}) {
    this.finishCallable = finishCallable;
  }

  loadActiveSession() {
    return readJson(ACTIVE_SESSION_KEY);
  }

  saveActiveSession(session) {
    writeJson(ACTIVE_SESSION_KEY, session);
    return session;
  }

  clearActiveSession() {
    storage()?.removeItem(ACTIVE_SESSION_KEY);
  }

  loadPendingFinish() {
    return readJson(PENDING_FINISH_KEY);
  }

  savePendingFinish(payload) {
    writeJson(PENDING_FINISH_KEY, payload);
    return payload;
  }

  clearPendingFinish() {
    storage()?.removeItem(PENDING_FINISH_KEY);
  }

  async finishSession(payload) {
    const result = await this.finishCallable(payload);
    return result?.data || result;
  }
}

export function createDefaultGuidedWorkoutRepository() {
  return new WebGuidedWorkoutRepository();
}
