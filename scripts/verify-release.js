const fs = require("fs");
const path = require("path");

const TEAM_ID = "69JKTAE887";
const IOS_BUNDLE_ID = "com.risewiththetribe.challengetracker";
const ANDROID_PACKAGE = "com.risewiththetribe.challengetracker";
const DOMAIN = "risewiththetribe.app";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(filePath, expected, label = expected) {
  const content = read(filePath);
  assert(content.includes(expected), `${filePath} is missing ${label}`);
}

function parseJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    throw new Error(`${filePath} must contain valid JSON: ${error.message}`);
  }
}

function verifyRelease(options = {}) {
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  const iosRoot = options.iosRoot || path.resolve(repoRoot, "..", "TribeChallengeTrackerIOS");
  const androidRoot = options.androidRoot || path.resolve(repoRoot, "..", "TribeChallengeTrackerAndroid");
  const failures = [];

  function check(name, fn) {
    try {
      fn();
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
    }
  }

  check("feature documentation", () => {
    const docPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
    const storePath = path.join(repoRoot, "docs", "STORE_READINESS.md");
    assert(exists(docPath), "docs/FEATURE_CATALOG.md is required");
    assert(exists(storePath), "docs/STORE_READINESS.md is required");
    [
      "Authentication and Onboarding",
      "Home Dashboard",
      "Activity Logging",
      "Challenges",
      "Badges",
      "Leaderboard",
      "Profile Appearance",
      "Wearable Health Sync",
      "Progress Sharing",
      "Notifications",
      "Deep Links",
      "Release Safety",
    ].forEach((section) => assertIncludes(docPath, section));
    [
      "Android Google Play",
      "iOS App Store",
      "Web / Firebase Hosting",
      "Privacy and Data Safety",
      "Release Checklist",
    ].forEach((section) => assertIncludes(storePath, section));
  });

  check("shared parity ledger", () => {
    const parityPath = path.join(repoRoot, "FEATURE_PARITY.md");
    [
      "Daily log reminders",
      "Wearable health sync",
      "Progress sharing",
      "Challenge leaving",
      "Challenge invite flow",
      "Challenge invite deep links",
      "Challenge daily tracking",
      "Challenge badge stats",
    ].forEach((feature) => assertIncludes(parityPath, feature));
  });

  check("shared monetization and engagement contracts", () => {
    const parityPath = path.join(repoRoot, "FEATURE_PARITY.md");
    const catalogPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
    const roadmapPath = path.join(repoRoot, "docs", "MONETIZATION_ROADMAP.md");
    const webProfilePath = path.join(repoRoot, "src", "ProfileScreen.jsx");
    const iosProfilePath = path.join(iosRoot, "TribeChallenge", "Views", "ProfileView.swift");
    const androidProfilePath = path.join(androidRoot, "app", "src", "main", "java", "com", "risewiththetribe", "challengetracker", "ui", "TribeApp.kt");
    const firestoreRulesPath = path.join(repoRoot, "firestore.rules");
    const purchaseEntitlementsPath = path.join(repoRoot, "functions", "purchaseEntitlements.js");

    [
      "Feature Submission Review Notes",
      "Creator Payout Readiness Kit",
      "Partner Contract Readiness Kit",
      "Store Credential Setup Kit",
      "Subscription Management Guidance Kit",
      "Billing Support Escalation Kit",
      "Renewal Recovery Kit",
      "Cancellation Feedback Kit",
      "Lapsed Member Winback Kit",
      "Community Highlight Roundup Kit",
      "UGC Consent Reminder Kit",
    ].forEach((feature) => {
      assertIncludes(parityPath, feature);
      assertIncludes(catalogPath, feature);
      assertIncludes(roadmapPath, feature);
    });

    [
      "CREATOR PAYOUT READINESS KIT",
      "COPY CREATOR PAYOUT KIT",
      "creatorPayoutReadinessCopy",
      "Do not create payouts",
      "PARTNER CONTRACT READINESS KIT",
      "COPY PARTNER CONTRACT KIT",
      "partnerContractReadinessCopy",
      "Do not create partner links",
      "SUBSCRIPTION MANAGEMENT GUIDANCE KIT",
      "COPY SUBSCRIPTION GUIDANCE",
      "subscriptionManagementGuidanceCopy",
      "Do not cancel subscriptions in-app",
      "bypass App Store or Play policy",
      "BILLING SUPPORT ESCALATION KIT",
      "COPY BILLING ESCALATION",
      "billingSupportEscalationCopy",
      "Wrong-account, renewal, charge, and entitlement triage",
      "override marketplace decisions",
      "RENEWAL RECOVERY KIT",
      "COPY RENEWAL RECOVERY",
      "renewalRecoveryCopy",
      "Failed-renewal and lapsed-access support copy",
      "Do not retry charges in-app",
      "CANCELLATION FEEDBACK KIT",
      "COPY CANCELLATION FEEDBACK",
      "cancellationFeedbackCopy",
      "Marketplace-safe churn learning prompts",
      "Do not block cancellation",
      "LAPSED MEMBER WINBACK KIT",
      "COPY LAPSED WINBACK",
      "lapsedMemberWinbackCopy",
      "Free comeback challenge and app-first return copy",
      "Do not auto-message users",
      "COMMUNITY HIGHLIGHT ROUNDUP KIT",
      "COPY HIGHLIGHT ROUNDUP",
      "communityHighlightRoundupCopy",
      "Use featured submissions with consent only",
      "UGC CONSENT REMINDER KIT",
      "COPY UGC CONSENT REMINDER",
      "ugcConsentReminderCopy",
      "Confirm the member opted in through the Feature Me consent gate",
      "override consent",
    ].forEach((token) => {
      assertIncludes(webProfilePath, token);
      assertIncludes(iosProfilePath, token);
      assertIncludes(androidProfilePath, token);
    });

    [
      "match /featureSubmissions/{submissionId}",
      "consentToFeature == true",
      'resource.data.status == "featured"',
      '["pending", "approved", "featured", "declined"]',
    ].forEach((token) => assertIncludes(firestoreRulesPath, token));

    [
      "validation_configured",
      "ready to call the provider",
      "sandbox/license-test purchases",
      "unsupported_platform",
    ].forEach((token) => assertIncludes(purchaseEntitlementsPath, token));
  });

  check("store validation credential template", () => {
    const envExamplePath = path.join(repoRoot, "functions", ".env.example");
    const storeReadinessPath = path.join(repoRoot, "docs", "STORE_READINESS.md");
    const roadmapPath = path.join(repoRoot, "docs", "MONETIZATION_ROADMAP.md");
    assert(exists(envExamplePath), "functions/.env.example is required");
    [
      "APP_STORE_ISSUER_ID",
      "APP_STORE_KEY_ID",
      "APP_STORE_PRIVATE_KEY",
      "APP_STORE_BUNDLE_ID=com.risewiththetribe.challengetracker",
      "PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON",
      "PLAY_PACKAGE_NAME=com.risewiththetribe.challengetracker",
      "REPLACE_WITH_APP_STORE_CONNECT_PRIVATE_KEY",
      "REPLACE_WITH_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY",
      "Do not commit real secrets",
    ].forEach((token) => assertIncludes(envExamplePath, token));
    [
      "functions/.env.example",
      "Keep real service account JSON and private keys outside git",
      "Keep real App Store Connect private keys outside git",
    ].forEach((token) => assertIncludes(storeReadinessPath, token));
    assertIncludes(roadmapPath, "Store Validation Credential Template");
  });

  check("instagram campaign content contracts", () => {
    const parityPath = path.join(repoRoot, "FEATURE_PARITY.md");
    const catalogPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
    const roadmapPath = path.join(repoRoot, "docs", "MONETIZATION_ROADMAP.md");
    const webProfilePath = path.join(repoRoot, "src", "ProfileScreen.jsx");
    const iosProfilePath = path.join(iosRoot, "TribeChallenge", "Views", "ProfileView.swift");
    const androidProfilePath = path.join(androidRoot, "app", "src", "main", "java", "com", "risewiththetribe", "challengetracker", "ui", "TribeApp.kt");

    [
      "Weekly Campaign Weekend Push Story Kit",
      "Weekly Campaign Completion Recap Story Kit",
      "Weekly Campaign Next-Week Teaser Story Kit",
      "Weekly Campaign Partner Perk Teaser Story Kit",
      "Weekly Campaign Story Poll Kit",
      "Weekly Campaign Poll Review Kit",
      "Weekly Campaign Live Q&A Kit",
      "Weekly Campaign Live Recap Kit",
      "Weekly Campaign FAQ Carousel Kit",
      "Weekly Campaign Caption Bank Kit",
      "Weekly Campaign Collab Invite Kit",
      "Weekly Campaign Collab Follow-Up Kit",
      "Weekly Campaign Collab Safety Checklist",
      "Weekly Campaign Collab Recap Kit",
      "Weekly Campaign Collab Renewal Kit",
      "Instagram Content Calendar",
      "Community Highlight Roundup Kit",
      "UGC Consent Reminder Kit",
    ].forEach((feature) => {
      assertIncludes(parityPath, feature);
      assertIncludes(catalogPath, feature);
      assertIncludes(roadmapPath, feature);
    });

    [
      "Weekly Campaign Weekend Push Story Kit",
      "weeklyCampaignWeekendPushStoryCopy",
      "Weekly Campaign Completion Recap Story Kit",
      "weeklyCampaignCompletionRecapStoryCopy",
      "Weekly Campaign Next-Week Teaser Story Kit",
      "weeklyCampaignNextWeekTeaserStoryCopy",
      "Weekly Campaign Partner Perk Teaser Story Kit",
      "weeklyCampaignPartnerPerkTeaserStoryCopy",
      "Weekly Campaign Story Poll Kit",
      "weeklyCampaignStoryPollCopy",
      "Weekly Campaign Poll Review Kit",
      "weeklyCampaignPollReviewCopy",
      "Weekly Campaign Live Q&A Kit",
      "weeklyCampaignLiveQaCopy",
      "Weekly Campaign Live Recap Kit",
      "weeklyCampaignLiveRecapCopy",
      "Weekly Campaign FAQ Carousel Kit",
      "weeklyCampaignFaqCarouselCopy",
      "Weekly Campaign Caption Bank Kit",
      "weeklyCampaignCaptionBankCopy",
      "Weekly Campaign Collab Invite Kit",
      "weeklyCampaignCollabInviteCopy",
      "Weekly Campaign Collab Follow-Up Kit",
      "weeklyCampaignCollabFollowUpCopy",
      "Weekly Campaign Collab Safety Checklist",
      "weeklyCampaignCollabSafetyCopy",
      "Weekly Campaign Collab Recap Kit",
      "weeklyCampaignCollabRecapCopy",
      "Weekly Campaign Collab Renewal Kit",
      "weeklyCampaignCollabRenewalCopy",
      "Instagram Content Calendar",
      "instagramContentCalendarCopy",
      "Do not auto-post",
      "scrape DMs",
      "add tracking pixels",
      "export per-user activity",
      "imply paid access is live",
      "promise outcomes",
    ].forEach((token) => {
      assertIncludes(webProfilePath, token);
      assertIncludes(iosProfilePath, token);
      assertIncludes(androidProfilePath, token);
    });
  });

  check("firebase hosting config", () => {
    const firebase = parseJson(path.join(repoRoot, "firebase.json"));
    assert(firebase.hosting?.public === "build", "Firebase Hosting must deploy the React build directory");
    const headers = JSON.stringify(firebase.hosting?.headers || []);
    assert(headers.includes("/.well-known/apple-app-site-association"), "AASA header is required");
    assert(headers.includes("/.well-known/assetlinks.json"), "assetlinks.json header is required");
    assert(headers.includes("application/json"), "well-known files must be served as application/json");
  });

  check("iOS universal links artifact", () => {
    const aasaPath = path.join(repoRoot, "public", ".well-known", "apple-app-site-association");
    const aasa = parseJson(aasaPath);
    const details = aasa.applinks?.details || [];
    const appIds = details.flatMap((detail) => detail.appIDs || []);
    assert(appIds.includes(`${TEAM_ID}.${IOS_BUNDLE_ID}`), "AASA must include the iOS Team ID and bundle ID");
    assert(JSON.stringify(aasa).includes("join"), "AASA must allow challenge invite query links");
  });

  check("Android app links artifact", () => {
    const examplePath = path.join(repoRoot, "public", ".well-known", "assetlinks.json.example");
    const example = parseJson(examplePath);
    assert(example[0]?.target?.package_name === ANDROID_PACKAGE, "assetlinks example must use the Android package name");

    const productionPath = path.join(repoRoot, "public", ".well-known", "assetlinks.json");
    if (exists(productionPath)) {
      const assetLinks = parseJson(productionPath);
      const fingerprints = assetLinks[0]?.target?.sha256_cert_fingerprints || [];
      assert(assetLinks[0]?.target?.package_name === ANDROID_PACKAGE, "assetlinks.json package name mismatch");
      assert(fingerprints.length > 0, "assetlinks.json must include at least one SHA-256 fingerprint");
      fingerprints.forEach((fingerprint) => {
        assert(
          /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(fingerprint),
          `invalid SHA-256 fingerprint: ${fingerprint}`
        );
      });
    }
  });

  check("iOS deep-link hooks", () => {
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Info.plist"), "tribechallenge");
    assertIncludes(path.join(iosRoot, "TribeChallenge", "TribeChallenge.entitlements"), `applinks:${DOMAIN}`);
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Services", "DeepLinkRouter.swift"), DOMAIN);
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Services", "DeepLinkRouter.swift"), "pendingInviteCode");
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Views", "MainTabView.swift"), "selectedTab = 1");
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Views", "ChallengesView.swift"), "consumePendingInvite");
  });

  check("Android deep-link hooks", () => {
    const manifestPath = path.join(androidRoot, "app", "src", "main", "AndroidManifest.xml");
    assertIncludes(manifestPath, `android:host="${DOMAIN}"`);
    assertIncludes(manifestPath, 'android:scheme="tribechallenge"');
    assertIncludes(manifestPath, 'android:autoVerify="true"');
    assertIncludes(path.join(androidRoot, "app", "src", "main", "java", "com", "risewiththetribe", "challengetracker", "MainActivity.kt"), 'getQueryParameter("join")');
  });

  if (failures.length > 0) {
    throw new Error(`Release verification failed:\n- ${failures.join("\n- ")}`);
  }

  return true;
}

if (require.main === module) {
  try {
    verifyRelease();
    console.log("Release verification passed.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { verifyRelease };
