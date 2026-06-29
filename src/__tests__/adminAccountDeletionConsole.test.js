const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

describe('admin account deletion processing guardrails', () => {
  it('keeps permanent deletion behind verified admin confirmation', () => {
    const adminConsole = fs.readFileSync(path.resolve(repoRoot, 'src/app/AdminConsole.jsx'), 'utf8');
    const functionIndex = fs.readFileSync(path.resolve(repoRoot, 'functions/index.js'), 'utf8');
    const deletionHandler = fs.readFileSync(path.resolve(repoRoot, 'functions/accountDeletionCallableHandlers.js'), 'utf8');

    expect(adminConsole).toContain('processAccountDeletion');
    expect(adminConsole).toContain('Process deletion');
    expect(adminConsole).toContain('request.status === "verified"');
    expect(adminConsole).toContain('window.confirm');
    expect(adminConsole).toContain('Subscriptions and refunds still need to be handled outside this console');

    expect(functionIndex).toContain('exports.processAccountDeletion');
    expect(functionIndex).toContain('accountDeletionCallableHandlers');

    expect(deletionHandler).toContain("db.collection('admins').doc(actorUid).get()");
    expect(deletionHandler).toContain("requestData.status !== 'verified'");
    expect(deletionHandler).toContain('actorUid === targetUid');
    expect(deletionHandler).toContain("db.collection('accountDeletionAudits').doc()");
    expect(deletionHandler).toContain('deleteUserPrivateProfile');
    expect(deletionHandler).toContain('deleteAuthUser');
    expect(deletionHandler).toContain('anonymizePurchaseRecords');
  });
});
