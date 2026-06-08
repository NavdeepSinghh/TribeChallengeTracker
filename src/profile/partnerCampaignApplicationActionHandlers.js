import {
  getPartnerCampaignApplicationReviewQueue,
  submitPartnerCampaignApplication,
} from '../userService';

export function buildPartnerCampaignApplicationActionHandlers({
  applicationPartnerPerk,
  applicationPartnerSignalCount,
  campaignPerformanceSummary,
  isAdmin,
  isSubmittingPartnerCampaignApplication,
  partnerCampaignApplicationSignalTotal,
  referralJoins,
  setIsSubmittingPartnerCampaignApplication,
  setPartnerCampaignApplicationMessage,
  setPartnerCampaignApplicationReviewQueue,
  user,
}) {
  const handlePartnerCampaignApplication = async () => {
    if (isSubmittingPartnerCampaignApplication) return;
    setPartnerCampaignApplicationMessage('');
    const demand = applicationPartnerSignalCount;
    if (!applicationPartnerPerk || !demand) {
      setPartnerCampaignApplicationMessage('Save at least one partner perk signal before applying for a partner pilot review.');
      return;
    }
    setIsSubmittingPartnerCampaignApplication(true);
    try {
      await submitPartnerCampaignApplication(user.uid, {
        topPerkId: applicationPartnerPerk.id,
        topPerkLabel: applicationPartnerPerk.label,
        demandCount: demand,
        totalDemand: partnerCampaignApplicationSignalTotal,
        campaignReach: campaignPerformanceSummary.memberReach || 0,
        referralJoins,
      });
      setPartnerCampaignApplicationMessage('Partner campaign pilot application sent for manual review. This does not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, or paid-access claims.');
      if (isAdmin) {
        getPartnerCampaignApplicationReviewQueue().then(setPartnerCampaignApplicationReviewQueue).catch(() => setPartnerCampaignApplicationReviewQueue([]));
      }
    } catch (err) {
      setPartnerCampaignApplicationMessage(err?.message || 'Could not send partner campaign pilot application.');
    } finally {
      setIsSubmittingPartnerCampaignApplication(false);
    }
  };

  return { handlePartnerCampaignApplication };
}
