export const PARTNER_PERKS = [
  { id: 'gear', label: 'Gear', title: 'Challenge-ready kit', detail: 'Future member perks from aligned fitness apparel partners.', color: '#60A5FA', metric: 'activeDays', target: 14, requirement: '14 active days' },
  { id: 'recovery', label: 'Recovery', title: 'Recovery support', detail: 'Future offers for recovery tools, studios, and wellness partners.', color: '#34D399', metric: 'challengeDays', target: 7, requirement: '7 challenge days' },
  { id: 'nutrition', label: 'Fuel', title: 'Nutrition support', detail: 'Future meal prep or supplement perks for active challenge members.', color: '#FFD700', metric: 'referralJoins', target: 1, requirement: '1 referral join' },
];

export const PARTNER_PERK_IDS = PARTNER_PERKS.map(perk => perk.id);

export function sanitizePartnerPerkIds(selectedIds = []) {
  return [...new Set(selectedIds)].filter(id => PARTNER_PERK_IDS.includes(id));
}

export function summarizePartnerPerkInterest(profiles = []) {
  const counts = Object.fromEntries(PARTNER_PERK_IDS.map(id => [id, 0]));
  profiles.forEach(profile => {
    sanitizePartnerPerkIds(profile?.partnerPerkInterest?.selectedIds || []).forEach(id => {
      counts[id] += 1;
    });
  });
  return counts;
}

export function getPartnerPerkProgress(perk, stats = {}) {
  const current = Math.max(0, Number(stats[perk.metric]) || 0);
  const target = Math.max(1, Number(perk.target) || 1);
  return {
    current,
    target,
    eligible: current >= target,
    percent: Math.min(100, Math.round((current / target) * 100)),
  };
}
