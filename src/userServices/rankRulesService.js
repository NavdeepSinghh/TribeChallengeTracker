import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_TRIBE_RANK_RULES, normalizeRankRules } from "../rankRules";
import { cachedRead, invalidateCachedRead, setCachedRead } from "./readCache";

const RANK_RULES_REF = doc(db, "appConfig", "tribeRankRules");
const RANK_RULES_CACHE_KEY = "rankRules";
const RANK_RULES_TTL_MS = 15 * 60 * 1000;

export async function fetchRankRules() {
  return cachedRead(RANK_RULES_CACHE_KEY, async () => {
    try {
      const snap = await getDoc(RANK_RULES_REF);
      return normalizeRankRules(snap.exists() ? snap.data() : DEFAULT_TRIBE_RANK_RULES);
    } catch {
      return normalizeRankRules(DEFAULT_TRIBE_RANK_RULES);
    }
  }, RANK_RULES_TTL_MS);
}

export async function publishRankRules(rules, uid) {
  const normalized = normalizeRankRules(rules);
  await setDoc(RANK_RULES_REF, {
    ...normalized,
    status: "published",
    updatedAt: serverTimestamp(),
    updatedBy: uid || "",
  }, { merge: true });
  invalidateCachedRead(RANK_RULES_CACHE_KEY);
  setCachedRead(RANK_RULES_CACHE_KEY, normalized, RANK_RULES_TTL_MS);
  return normalized;
}
