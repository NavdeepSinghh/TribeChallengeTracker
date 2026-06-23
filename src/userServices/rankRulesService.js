import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_TRIBE_RANK_RULES, normalizeRankRules } from "../rankRules";

const RANK_RULES_REF = doc(db, "appConfig", "tribeRankRules");

export async function fetchRankRules() {
  try {
    const snap = await getDoc(RANK_RULES_REF);
    return normalizeRankRules(snap.exists() ? snap.data() : DEFAULT_TRIBE_RANK_RULES);
  } catch {
    return normalizeRankRules(DEFAULT_TRIBE_RANK_RULES);
  }
}

export async function publishRankRules(rules, uid) {
  const normalized = normalizeRankRules(rules);
  await setDoc(RANK_RULES_REF, {
    ...normalized,
    status: "published",
    updatedAt: serverTimestamp(),
    updatedBy: uid || "",
  }, { merge: true });
  return normalized;
}

