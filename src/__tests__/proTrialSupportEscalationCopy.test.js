import { readFileSync } from 'fs';
import { join } from 'path';

import { buildMonetizationSummaryCopy } from '../profile/monetizationSummaryCopy';

describe('web Pro trial support escalation copy', () => {
  it('builds a copy-only support escalation kit without paid-access side effects', () => {
    const copy = buildMonetizationSummaryCopy({
      topProTrialReason: { label: 'Reports', demand: 4 },
      proTrialDemandTotal: 7,
      weeklyCampaignPrompt: { name: 'Reset Week', hashtag: '#ResetWeek' },
      creatorRevenueShareTotal: 0,
      creatorRevenueShareSummary: {},
      partnerDemandTotal: 0,
      monetizationSignalTotal: 7,
      storeCatalog: [],
      storeSubscriptionCount: 0,
      storePackCount: 0,
    });

    expect(copy.proTrialSupportEscalationCopy).toContain('Pro Trial Support Escalation Kit');
    expect(copy.proTrialSupportEscalationCopy).toContain('First-party Pro trial signals: 7');
    expect(copy.proTrialSupportEscalationCopy).toContain('Top Pro trial interest: Reports');
    expect(copy.proTrialSupportEscalationCopy).toContain('Support escalation checklist');
    expect(copy.proTrialSupportEscalationCopy).toContain('Store setup owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('Value proof owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('Support owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('QA owner');
    expect(copy.proTrialSupportEscalationCopy).toContain('not a trial start');
    expect(copy.proTrialSupportEscalationCopy).toContain('not a purchase');
    expect(copy.proTrialSupportEscalationCopy).toContain('not a Pro grant');
    expect(copy.proTrialSupportEscalationCopy).toContain('not entitlement approval');
    expect(copy.proTrialSupportEscalationCopy).toContain('not refund approval');
    expect(copy.proTrialSupportEscalationCopy).toContain('not paid-access launch approval');
    expect(copy.proTrialSupportEscalationCopy).toContain('Do not start trials');
    expect(copy.proTrialSupportEscalationCopy).toContain('create purchases');
    expect(copy.proTrialSupportEscalationCopy).toContain('grant Pro');
    expect(copy.proTrialSupportEscalationCopy).toContain('write entitlements');
    expect(copy.proTrialSupportEscalationCopy).toContain('unlock paid access');
    expect(copy.proTrialSupportEscalationCopy).toContain('collect payment details');
    expect(copy.proTrialSupportEscalationCopy).toContain('offer discounts');
    expect(copy.proTrialSupportEscalationCopy).toContain('process refunds');
    expect(copy.proTrialSupportEscalationCopy).toContain('claim store-backed trials are live');
    expect(copy.proTrialSupportEscalationCopy).toContain('auto-message users');
    expect(copy.proTrialSupportEscalationCopy).toContain('scrape/store DMs');
    expect(copy.proTrialSupportEscalationCopy).toContain('add tracking pixels');
  });

  it('renders the web admin support card as copy-only', () => {
    const source = readFileSync(
      join(__dirname, '../profile/ProTrialAdminSummary.jsx'),
      'utf8',
    );

    expect(source).toContain('PRO TRIAL SUPPORT ESCALATION KIT');
    expect(source).toContain('COPY PRO TRIAL SUPPORT KIT');
    expect(source).toContain('proTrialSupportEscalationCopy');
    expect(source).toContain('Route store setup, value proof, support coverage');
    expect(source).toContain('without starting trials, purchases, Pro grants, or paid-access changes');
  });
});
