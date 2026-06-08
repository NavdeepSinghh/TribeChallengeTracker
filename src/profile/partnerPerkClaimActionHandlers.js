import {
  claimPartnerPerk,
  getPartnerPerkClaimReviewQueue,
  getPartnerPerkClaims,
  reviewPartnerPerkClaim,
} from '../userService';

export function buildPartnerPerkClaimActionHandlers({
  claimingPartnerPerkId,
  isAdmin,
  partnerPerkReviewNotes,
  profile,
  reviewingPartnerPerkClaimId,
  setClaimingPartnerPerkId,
  setPartnerPerkClaimMessage,
  setPartnerPerkClaimReviewQueue,
  setPartnerPerkClaims,
  setReviewingPartnerPerkClaimId,
  user,
}) {
  const handlePartnerPerkClaim = async (perk, progress) => {
    if (claimingPartnerPerkId) return;
    setPartnerPerkClaimMessage('');
    if (!progress?.eligible) {
      setPartnerPerkClaimMessage('This partner perk is not eligible yet.');
      return;
    }
    setClaimingPartnerPerkId(perk.id);
    try {
      await claimPartnerPerk(user.uid, {
        perkId: perk.id,
        perkLabel: perk.label,
        perkTitle: perk.title,
        current: progress.current,
        target: progress.target,
        requirement: perk.requirement,
      });
      setPartnerPerkClaimMessage('Partner perk claim sent for manual review. This does not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.');
      getPartnerPerkClaims(user.uid).then(setPartnerPerkClaims).catch(() => setPartnerPerkClaims([]));
      if (isAdmin) {
        getPartnerPerkClaimReviewQueue().then(setPartnerPerkClaimReviewQueue).catch(() => setPartnerPerkClaimReviewQueue([]));
      }
    } catch (err) {
      setPartnerPerkClaimMessage(err?.message || 'Could not request partner perk review.');
    } finally {
      setClaimingPartnerPerkId('');
    }
  };

  const handlePartnerPerkClaimReview = async (claimId, status) => {
    if (reviewingPartnerPerkClaimId) return;
    setReviewingPartnerPerkClaimId(claimId);
    try {
      await reviewPartnerPerkClaim(claimId, {
        status,
        reviewNote: partnerPerkReviewNotes[claimId] || '',
        reviewedBy: profile?.displayName || user?.email || user?.uid || 'admin',
      });
      setPartnerPerkClaimMessage(`Partner perk claim marked ${status}. Manual review note saved without creating coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.`);
      getPartnerPerkClaimReviewQueue().then(setPartnerPerkClaimReviewQueue).catch(() => setPartnerPerkClaimReviewQueue([]));
      if (user?.uid) {
        getPartnerPerkClaims(user.uid).then(setPartnerPerkClaims).catch(() => setPartnerPerkClaims([]));
      }
    } catch (err) {
      setPartnerPerkClaimMessage(err?.message || 'Could not update partner perk claim review.');
    } finally {
      setReviewingPartnerPerkClaimId('');
    }
  };

  return {
    handlePartnerPerkClaim,
    handlePartnerPerkClaimReview,
  };
}
