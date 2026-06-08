import { buildProfileBaseDerivedData } from './profileBaseDerivedData';
import { buildProfileBaseBundleInputs } from './profileScreenBundleInputs';

export function buildProfileBaseDataBundle({
  accountDeletionReviewQueue,
  profile,
  rank,
  selectedFrameId,
  supportCategory,
  supportReviewQueue,
  user,
}) {
  return buildProfileBaseDerivedData(buildProfileBaseBundleInputs({
    accountDeletionReviewQueue,
    profile,
    rank,
    selectedFrameId,
    supportCategory,
    supportReviewQueue,
    user,
  }));
}
