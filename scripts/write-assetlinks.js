const fs = require("fs");
const path = require("path");

const packageName = "com.risewiththetribe.challengetracker";
const rawFingerprints = process.env.ANDROID_APP_LINK_SHA256 || "";
const fingerprints = rawFingerprints
  .split(",")
  .map((value) => value.trim().toUpperCase())
  .filter(Boolean);

if (fingerprints.length === 0) {
  console.error(
    "Missing ANDROID_APP_LINK_SHA256. Use the Play App Signing SHA-256 fingerprint from Google Play Console."
  );
  process.exit(1);
}

const output = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: packageName,
      sha256_cert_fingerprints: fingerprints,
    },
  },
];

const outPath = path.join(
  __dirname,
  "..",
  "public",
  ".well-known",
  "assetlinks.json"
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${outPath}`);
