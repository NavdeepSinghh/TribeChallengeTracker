const DEFAULT_FIREBASE_STORAGE_BUCKET =
  process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tribechallengetracker.firebasestorage.app";

export function isRemoteWorkoutAssetUrl(path) {
  return /^(https?:)?\/\//i.test(String(path || ""));
}

export function resolveWorkoutAssetUrl(path, bucket = DEFAULT_FIREBASE_STORAGE_BUCKET) {
  const rawPath = String(path || "").trim();
  if (!rawPath) return "";
  if (isRemoteWorkoutAssetUrl(rawPath) || rawPath.startsWith("data:") || rawPath.startsWith("blob:")) {
    return rawPath;
  }
  if (rawPath.startsWith("/")) {
    return rawPath;
  }

  const gsMatch = rawPath.match(/^gs:\/\/([^/]+)\/(.+)$/i);
  const bucketName = gsMatch ? gsMatch[1] : bucket;
  const objectPath = gsMatch ? gsMatch[2] : rawPath.replace(/^\/+/, "");

  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectPath)}?alt=media`;
}
