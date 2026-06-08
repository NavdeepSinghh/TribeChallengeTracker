import { getPurchaseValidationReadiness } from '../purchaseService';

export function buildStoreValidationReadinessActionHandlers({
  setIsCheckingValidationReadiness,
  setValidationReadinessMessage,
}) {
  const handleValidationReadinessCheck = async () => {
    setIsCheckingValidationReadiness(true);
    setValidationReadinessMessage('');
    try {
      const readiness = await getPurchaseValidationReadiness();
      const platforms = readiness?.platforms || {};
      const summary = ['ios', 'android'].map(platform => {
        const platformReadiness = platforms[platform] || {};
        const missingCount = platformReadiness.missingConfigKeys?.length || 0;
        return `${platform.toUpperCase()}: ${platformReadiness.validationConfigured ? 'configured' : `${missingCount} missing`}`;
      }).join(' · ');
      setValidationReadinessMessage(`${summary}. No entitlements were changed.`);
    } catch (err) {
      setValidationReadinessMessage(err?.message || 'Could not check purchase validation readiness.');
    } finally {
      setIsCheckingValidationReadiness(false);
    }
  };

  return { handleValidationReadinessCheck };
}
