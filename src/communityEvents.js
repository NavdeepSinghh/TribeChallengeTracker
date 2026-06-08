export const COMMUNITY_EVENT_INTEREST_OPTIONS = [
  {
    id: 'local_meetup',
    label: 'Local meetup',
    title: 'Challenge meetup',
    detail: 'In-person accountability session after a weekly challenge.',
  },
  {
    id: 'milestone_merch',
    label: 'Milestone merch',
    title: 'Finisher merch',
    detail: 'Recognition item for completed streaks or challenge finishers.',
  },
  {
    id: 'studio_popup',
    label: 'Studio pop-up',
    title: 'Studio partner session',
    detail: 'Small group class or recovery session with reviewed partners.',
  },
  {
    id: 'finisher_moment',
    label: 'Finisher moment',
    title: 'Seasonal finisher event',
    detail: 'Community celebration for seasonal challenge completion.',
  },
];

const ALLOWED_COMMUNITY_EVENT_INTEREST_IDS = new Set(COMMUNITY_EVENT_INTEREST_OPTIONS.map(option => option.id));

export function sanitizeCommunityEventInterestIds(selectedIds = []) {
  return [...new Set(selectedIds)].filter(id => ALLOWED_COMMUNITY_EVENT_INTEREST_IDS.has(id)).sort();
}

export function summarizeCommunityEventInterest(profiles = []) {
  return profiles.reduce((summary, profile) => {
    sanitizeCommunityEventInterestIds(profile?.communityEventInterest?.selectedIds || []).forEach(id => {
      summary[id] = (summary[id] || 0) + 1;
    });
    return summary;
  }, Object.fromEntries(COMMUNITY_EVENT_INTEREST_OPTIONS.map(option => [option.id, 0])));
}
