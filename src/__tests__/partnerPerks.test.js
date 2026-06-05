import { PARTNER_PERK_IDS, getPartnerPerkProgress, sanitizePartnerPerkIds, summarizePartnerPerkInterest, PARTNER_PERKS } from '../partnerPerks';

describe('partner perk contract', () => {
  it('keeps the first-party partner perk allowlist stable', () => {
    expect(PARTNER_PERK_IDS).toEqual(['gear', 'recovery', 'nutrition']);
    expect(sanitizePartnerPerkIds(['gear', 'unknown', 'gear', 'nutrition'])).toEqual(['gear', 'nutrition']);
  });

  it('summarizes saved interest without counting unsupported ids', () => {
    expect(
      summarizePartnerPerkInterest([
        { partnerPerkInterest: { selectedIds: ['gear', 'recovery'] } },
        { partnerPerkInterest: { selectedIds: ['gear', 'ads'] } },
        {},
      ])
    ).toEqual({ gear: 2, recovery: 1, nutrition: 0 });
  });

  it('derives member perk eligibility from first-party app stats', () => {
    const gear = PARTNER_PERKS.find(perk => perk.id === 'gear');
    const fuel = PARTNER_PERKS.find(perk => perk.id === 'nutrition');

    expect(getPartnerPerkProgress(gear, { activeDays: 7 })).toMatchObject({
      current: 7,
      target: 14,
      eligible: false,
      percent: 50,
    });
    expect(getPartnerPerkProgress(fuel, { referralJoins: 1 })).toMatchObject({
      eligible: true,
      percent: 100,
    });
  });
});
