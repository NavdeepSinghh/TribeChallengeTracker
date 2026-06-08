import {
  buildProfileBaseDataBundle,
  buildProfileCommunityReferralDataBundle,
  buildProfileMonetizationCampaignDataBundle,
} from './profileScreenDerivedDataBundleBuilders';
import {
  buildProfileBaseDataBundleArgs,
  buildProfileCommunityReferralDataBundleArgs,
  buildProfileMonetizationCampaignDataBundleArgs,
} from './profileScreenDerivedBundleArgs';

export function buildProfileScreenDerivedDataBundles(inputs) {
  const baseData = buildProfileBaseDataBundle(
    buildProfileBaseDataBundleArgs(inputs),
  );
  const {
    instagramWeeklyPrompt,
    weeklyCampaignPrompt,
  } = baseData;

  const communityReferralData = buildProfileCommunityReferralDataBundle(
    buildProfileCommunityReferralDataBundleArgs(inputs, {
      weeklyCampaignPrompt,
    }),
  );

  const monetizationCampaignData = buildProfileMonetizationCampaignDataBundle(
    buildProfileMonetizationCampaignDataBundleArgs(inputs, {
      communityReferralData,
      instagramWeeklyPrompt,
      weeklyCampaignPrompt,
    }),
  );

  return {
    baseData,
    communityReferralData,
    monetizationCampaignData,
  };
}
