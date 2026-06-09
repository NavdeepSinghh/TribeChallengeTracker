export function buildStoreDecisionCopy({
  storeTestEvidenceSummary,
  storeTestEvidenceReady,
  paidLaunchDecisionStatus,
  paidLaunchReadyCount,
  paidLaunchDecisionItems,
  recommendedRevenuePath,
  monetizationSignalTotal,
  validationReadinessConfirmed,
}) {
  const storeTestEvidenceDecisionReplyCopy = `Rise With The Tribe Store Test Evidence Decision Reply Kit:

Evidence records: ${storeTestEvidenceSummary.total}
iOS evidence: ${storeTestEvidenceSummary.ios}
Android evidence: ${storeTestEvidenceSummary.android}
Needs review: ${storeTestEvidenceSummary.needs_review}
Failed: ${storeTestEvidenceSummary.failed}
Verified safe denial: ${storeTestEvidenceSummary.verified_safe_denial}
Launch gate: ${storeTestEvidenceReady ? 'minimum evidence matrix ready for review' : 'hold for complete iOS and Android proof'}

Manual decision replies:
VERIFIED FOR LAUNCH REVIEW: This store test evidence is verified for launch review. Keep the screenshot, tester account, product ID, receipt-validation log, restore result, platform, and entitlement outcome attached before any paid-access promotion.

VERIFIED SAFE DENIAL: This negative validation or wrong-account evidence is verified as a safe denial. Keep the entitlement-path check, tester account, product ID, platform, and no-unlock proof attached before counting it toward launch readiness.

NEEDS MORE EVIDENCE: This evidence still needs review. Add clearer sandbox/license-test proof, product ID, platform, tester account context, receipt-validation response, restore/sync result, and entitlement outcome before using it in launch readiness.

FAILED TEST CASE: This evidence is marked failed. Keep paid access on hold until the issue is reproduced, fixed, retested, and replaced with verified sandbox/license-test proof.

ARCHIVED FOR RECORDKEEPING: This evidence is archived for recordkeeping and should not count toward launch readiness unless a fresh verified record replaces it.

This is a manual Store Test Evidence Decision Reply Kit only. Do not write entitlements, create purchases, process refunds, bypass App Store or Google Play policy, mark paid access live, submit store review, claim sandbox/license-test purchases passed without evidence, collect payment details, expose private tester data, promise restored access, imply medical results, auto-message users, scrape/store DMs, or pressure members.`;

  const paidLaunchDecisionCopy = `Rise With The Tribe Paid Launch Decision Gate:\n\nDecision: ${paidLaunchDecisionStatus}\nReady checks: ${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}\nRecommended path: ${recommendedRevenuePath.label}\nFirst-party monetization signals: ${monetizationSignalTotal}\nStore test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.ios} iOS, ${storeTestEvidenceSummary.android} Android, ${storeTestEvidenceSummary.verified} verified, ${storeTestEvidenceSummary.verified_safe_denial} verified safe denial, ${storeTestEvidenceSummary.needs_review} needs review, ${storeTestEvidenceSummary.failed} failed, ${storeTestEvidenceSummary.safe_denial} safe denial, ${storeTestEvidenceSummary.unresolved_failed} unresolved failed)\nMinimum evidence matrix: ${storeTestEvidenceSummary.minimumEvidence.verifiedCaseCount}/${storeTestEvidenceSummary.minimumEvidence.requiredCaseCount} required proof items verified\nMissing required cases: ${storeTestEvidenceSummary.minimumEvidence.missingRequiredCases.length ? storeTestEvidenceSummary.minimumEvidence.missingRequiredCases.join(', ') : 'none'}\nMissing safe-denial platforms: ${storeTestEvidenceSummary.minimumEvidence.missingSafeDenialPlatforms.length ? storeTestEvidenceSummary.minimumEvidence.missingSafeDenialPlatforms.join(', ') : 'none'}\n\n${paidLaunchDecisionItems.map(item => `${item.ready ? '[x]' : '[ ]'} ${item.label}`).join('\n')}\n\nUse this gate before promoting paid access. Launch only after App Store and Play products exist, receipt-validation credentials are confirmed, the minimum evidence matrix is verified, entitlement writes are verified, and support/refund handoff is ready.\n\nThis is a decision-support brief only. Do not flip paid access live, write entitlements, process payments, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or announce launch readiness until all launch gate checks are complete.`;

  const paidLaunchDecisionReplyCopy = `Rise With The Tribe Paid Launch Decision Reply Kit:

Decision: ${paidLaunchDecisionStatus}
Ready checks: ${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}
Recommended path: ${recommendedRevenuePath.label}
Validation readiness: ${validationReadinessConfirmed ? 'provider credentials detected' : 'credentials or sandbox/license-test proof still pending'}
Store test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.ios} iOS, ${storeTestEvidenceSummary.android} Android, ${storeTestEvidenceSummary.failed} failed)

Manual decision replies:
READY FOR FINAL LAUNCH REVIEW: The paid launch gate is ready for final human review. Confirm App Store and Play products, backend receipt validation, sandbox/license-test evidence, restore flow, support/refund handoff, entitlement QA, policy links, and reviewer notes one last time before any paid-access promotion.

HOLD FOR STORE TESTS: Keep paid access on hold. Store products, receipt-validation credentials, sandbox/license-test evidence, restore QA, support/refund operations, or entitlement QA still need stronger proof before launch.

BLOCKED BY RELEASE RISK: Do not promote paid access yet. A launch blocker remains in product setup, receipt validation, store evidence, entitlement QA, support policy, privacy/data safety, or review readiness.

REVIEW NOTES ONLY: Use this decision as an internal release note or reviewer-prep note only. Do not announce paid access, publish launch claims, or treat it as store submission approval.

This is a manual Paid Launch Decision Reply Kit only. Do not flip paid access live, write entitlements, create purchases, process payments, process refunds, bypass App Store or Google Play policy, submit store review, mark validation complete without credentials, claim sandbox/license-test purchases passed without evidence, collect payment details, promise outcomes, imply medical results, auto-message users, scrape/store DMs, or announce launch readiness before all launch gate checks are complete.`;

  return {
    storeTestEvidenceDecisionReplyCopy,
    paidLaunchDecisionCopy,
    paidLaunchDecisionReplyCopy,
  };
}
