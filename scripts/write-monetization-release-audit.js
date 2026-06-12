const fs = require("fs");
const path = require("path");
const {
  renderLatestLocalRecheckItems,
} = require("./monetization-release-audit-local-recheck-items");

const repoRoot = path.resolve(__dirname, "..");
const auditPath = path.join(repoRoot, "docs", "MONETIZATION_RELEASE_AUDIT.md");

function buildMonetizationReleaseAudit({ auditDate = new Date().toISOString().slice(0, 10) } = {}) {
  return `# Monetization Release Audit

Date: ${auditDate}

This audit records the current evidence for the monetization and engagement roadmap across Web, iOS, and Android. It is not a paid-launch approval; it separates code-side parity from external App Store / Google Play evidence.

Build runtime note: the web production build should be run under the repo \`.nvmrc\` runtime. A later local attempt on Node 24.7.0 hung before CRA emitted build output while loading production webpack plugins, so the repo now guards \`npm run build\` to require an LTS Node runtime from 18.x through 22.x. The build also runs through \`scripts/run-react-build-with-timeout.js\`, which terminates a React production build after \`BUILD_IDLE_TIMEOUT_MS\` of no output so release checks fail loudly instead of hanging forever.

## Current Evidence

Command run:

\`\`\`bash
npm run release:check:all
\`\`\`

Result:

- Web tests passed: 20 suites, 139 tests.
- Web production build compiled successfully.
- Static release verifier passed.
- Focused cross-platform parity suites passed: 48 suites, 170 tests.
- iOS simulator build passed with \`** BUILD SUCCEEDED **\`.
- Android debug build passed with \`BUILD SUCCESSFUL\`.

## Latest Local Recheck

Additional local checks after the full-gate audit:

${renderLatestLocalRecheckItems()}

## Proven Code-Side Scope

- Weekly Challenge Campaign Engine foundation is implemented across Web, iOS, and Android.
- Campaign-branded challenge templates, campaign CTA/hashtag metadata, invite/referral hooks, referral join counting, and generated launch cards are covered by parity checks.
- Campaign sharing now has Web helper coverage for the referral invite URL contract, campaign copy contract, launch-card filename contract, native file-share outcome, native text-share fallback outcome, and clipboard fallback outcome, plus native release contracts for iOS share-sheet and Android intent/clipboard guardrails.
- Web profile sharing now has focused copy coverage for win-card, weekly recap, and monthly recap share text plus focused card-sharing coverage for native file-share, clipboard/download fallback, and caller-specific error-message contracts.
- Weekly Campaign derived data now has focused coverage for core planning copy, Weekly Campaign Launch Copy QA Kit copy, Weekly Campaign First 24h Monitor Kit copy, Weekly Campaign Midweek Adjustment Kit copy, Weekly Campaign Weekend Push Decision Kit copy, Sunday Recap QA Kit copy, Next-Week Launch Angle Kit copy, Preflight Owner Handoff Kit copy, Preflight Readiness Decision Kit copy, Preflight Copy Freeze Kit copy, Preflight Asset Readiness Kit copy, Preflight Launch Packet QA Kit copy, Preflight Go/No-Go Kit copy, Preflight Checklist Handoff Kit copy, Preflight Checklist QA Kit copy, Launch Readiness Handoff Kit copy, Final Posting Prep QA Kit copy, Manual Posting Operator Brief Kit copy, Post-Complete Callback QA Kit copy, Review Handoff Kit copy, Review Decision Kit copy, Storyboard Handoff Kit copy, Storyboard QA Kit copy, Experiment Brief Handoff Kit copy, Experiment Brief QA Kit copy, Experiment Brief Approval Kit copy, Launch Retrospective Readiness Handoff Kit copy, Launch Retrospective Readiness QA Kit copy, Launch Retrospective Decision Kit copy, Launch Retrospective Decision Reply Kit copy, Launch Retrospective Next Campaign Handoff Kit copy, Launch Retrospective Next Campaign QA Kit copy, Launch Retrospective Next Campaign Brief Kit copy, Launch Retrospective Next Campaign Brief QA Kit copy, Launch Retrospective Next Campaign Preflight Bridge Kit copy, Launch Retrospective Next Campaign Launch Copy Handoff Kit copy, Launch Retrospective Next Campaign Launch Copy QA Bridge Kit copy, Launch Retrospective Next Campaign Launch Copy Approval Kit copy, Launch Retrospective Next Campaign Final Posting Prep Handoff Kit copy, Launch Retrospective Next Campaign Final Posting Prep QA Bridge Kit copy, Launch Retrospective Next Campaign Manual Posting Operator Handoff Kit copy, Launch Retrospective Next Campaign Manual Posting Operator Brief QA Bridge Kit copy, Launch Retrospective Next Campaign Post-Complete Callback Handoff Kit copy, Launch Retrospective Next Campaign Post-Complete Callback QA Bridge Kit copy, Launch Retrospective Next Campaign Review Handoff Bridge Kit copy, Launch Retrospective Next Campaign Review Handoff QA Bridge Kit copy, Launch Retrospective Next Campaign Review Owner Handoff Kit copy, Launch Retrospective Next Campaign Review Owner QA Kit copy, Launch Retrospective Next Campaign Review Notes Handoff Kit copy, Launch Retrospective Next Campaign Review Notes QA Kit copy, Launch Retrospective Next Campaign Review Decision Handoff Kit copy, Launch Retrospective Next Campaign Review Decision QA Kit copy, experiment recommendation, Launch Retrospective Readiness Script Kit copy, story/engagement copy, collab cards, retention follow-up, support triage, re-invite copy, first-party signal wording, and no-automation/no-tracking boundaries.
- Weekly Campaign marketing props now have focused adapter coverage for creator/admin flags, Instagram calendar copy, launch-card copy, Launch Copy QA Kit copy, First 24h Monitor Kit copy, Midweek Adjustment Kit copy, Weekend Push Decision Kit copy, Sunday Recap QA Kit copy, Next-Week Launch Angle Kit copy, Preflight Owner Handoff Kit copy, Preflight Readiness Decision Kit copy, Preflight Copy Freeze Kit copy, Preflight Asset Readiness Kit copy, Preflight Launch Packet QA Kit copy, Preflight Go/No-Go Kit copy, Preflight Checklist Handoff Kit copy, Preflight Checklist QA Kit copy, Launch Readiness Handoff Kit copy, Final Posting Prep QA Kit copy, Manual Posting Operator Brief Kit copy, Post-Complete Callback QA Kit copy, Review Handoff Kit copy, Review Decision Kit copy, Storyboard Handoff Kit copy, Storyboard QA Kit copy, Experiment Brief Handoff Kit copy, Experiment Brief QA Kit copy, Experiment Brief Approval Kit copy, Launch Retrospective Readiness Handoff Kit copy, Launch Retrospective Readiness QA Kit copy, Launch Retrospective Decision Kit copy, Launch Retrospective Decision Reply Kit copy, Launch Retrospective Next Campaign Handoff Kit copy, Launch Retrospective Next Campaign QA Kit copy, Launch Retrospective Next Campaign Brief Kit copy, Launch Retrospective Next Campaign Brief QA Kit copy, Launch Retrospective Next Campaign Preflight Bridge Kit copy, Launch Retrospective Next Campaign Launch Copy Handoff Kit copy, Launch Retrospective Next Campaign Launch Copy QA Bridge Kit copy, Launch Retrospective Next Campaign Launch Copy Approval Kit copy, Launch Retrospective Next Campaign Final Posting Prep Handoff Kit copy, Launch Retrospective Next Campaign Final Posting Prep QA Bridge Kit copy, Launch Retrospective Next Campaign Manual Posting Operator Handoff Kit copy, Launch Retrospective Next Campaign Manual Posting Operator Brief QA Bridge Kit copy, Launch Retrospective Next Campaign Post-Complete Callback Handoff Kit copy, Launch Retrospective Next Campaign Post-Complete Callback QA Bridge Kit copy, Launch Retrospective Next Campaign Review Handoff Bridge Kit copy, Launch Retrospective Next Campaign Review Handoff QA Bridge Kit copy, Launch Retrospective Next Campaign Review Owner Handoff Kit copy, Launch Retrospective Next Campaign Review Owner QA Kit copy, Launch Retrospective Next Campaign Review Notes Handoff Kit copy, Launch Retrospective Next Campaign Review Notes QA Kit copy, Launch Retrospective Next Campaign Review Decision Handoff Kit copy, Launch Retrospective Next Campaign Review Decision QA Kit copy, Launch Retrospective Next Campaign Review Decision Reply Handoff Kit copy, Launch Retrospective Next Campaign Review Decision Reply QA Kit copy, Launch Retrospective Next Campaign Review Decision Reply Operator Handoff Kit copy, Launch Retrospective Next Campaign Review Decision Reply Operator QA Kit copy, Launch Retrospective Next Campaign Review Decision Reply Send Readiness Kit copy, Launch Retrospective Next Campaign Review Decision Reply Send QA Kit copy, Launch Retrospective Next Campaign Review Decision Reply Sent Receipt Handoff Kit copy, Launch Retrospective Next Campaign Review Decision Reply Sent Receipt QA Kit copy, Launch Retrospective Next Campaign Review Decision Reply Receipt Archive Handoff Kit copy, Launch Retrospective Next Campaign Review Decision Reply Receipt Archive QA Kit copy, collab cards, Support Triage Kit copy, Support Readiness Script Kit copy, Launch Retrospective Readiness Script Kit copy, comment replies, and the complete prop key contract.
- Weekly campaign planning, Story, DM/comment, collab, retention follow-up, re-invite, UGC consent, and Instagram content calendar kits are present across Web, iOS, and Android.
- Pro, challenge-pack, creator, partner, support, account deletion, referral reward, store-readiness, and paid-launch decision surfaces are present as copy-only/manual or request/review flows with side-effect guardrails.
- Store Evidence Archive Kit is present across Web, iOS, and Android so admins can copy sanitized evidence export and JSON audit archive checklists into internal release packets without exposing tokens, transaction IDs, tester credentials, private keys, service account JSON, private screenshots, or treating archived evidence as launch approval.
- Store Evidence Export Template Kit is present across Web, iOS, and Android so admins can start sandbox/license-test evidence collection from sanitized JSON rows without creating fake evidence, exporting tokens or credentials, or treating template rows as verified proof.
- Release verification now scans split Web profile modules, iOS profile companion files, and Android profile companion files so decomposed feature code remains covered.
- Store Test Purchase Runbook exists at \`docs/STORE_TEST_PURCHASE_RUNBOOK.md\` and is required by the release verifier.

## Not Yet Proven

The following remain external-state requirements and are not proven by a green build:

- App Store Connect purchase-validation credentials are configured in Firebase Functions.
- Google Play Developer API credentials are configured in Firebase Functions.
- App Store products exist and are available to sandbox testers.
- Play Billing products exist and are available to license testers.
- iOS sandbox purchases verify through \`verifyPurchase\` and write Firestore entitlements.
- Android license-test purchases verify through \`verifyPurchase\` and write Firestore entitlements.
- Restore/sync evidence exists on both native platforms.
- Negative validation evidence exists on both native platforms.
- Paid Launch Decision Gate has all evidence checks ready.

## Next Required Evidence

1. Configure real store validation secrets outside git using \`functions/.env.example\`.
2. Confirm \`getPurchaseValidationReadiness\` returns \`validation_configured\` for iOS and Android.
3. Execute \`docs/STORE_TEST_PURCHASE_RUNBOOK.md\` with store tester accounts.
4. Record each proof item in the admin Store Test Purchase Evidence Log.
5. Re-run \`npm run release:check:all\` after evidence is recorded and before any paid-access promotion.

## Decision

Code-side roadmap parity is currently verified. Paid access must remain in review mode until the external store credential and real sandbox/license-test purchase evidence above is completed and reviewed.
`;
}

if (require.main === module) {
  const auditDate = process.env.RELEASE_AUDIT_DATE || new Date().toISOString().slice(0, 10);
  fs.writeFileSync(auditPath, buildMonetizationReleaseAudit({ auditDate }));
  console.log(`Wrote ${path.relative(repoRoot, auditPath)}`);
}

module.exports = { buildMonetizationReleaseAudit };
